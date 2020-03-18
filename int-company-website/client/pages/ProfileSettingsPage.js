import React, { Fragment } from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import toastr from 'toastr'
import _ from 'lodash'
import userOnly from '../hocs/userOnly'
import { authService } from '../services'
import authRedux from '../redux/authRedux'
import {
  ALLOW_FILE_TYPE,
  Error,
  MAX_FILE_SIZE
} from '../../common/models/Container'

const languages = [
  {
    id: 'en',
    label: 'English'
  },
  {
    id: 'vn',
    label: 'Vietnamese'
  }
]
class ProfileSettingsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: { ...props.currentUser },
      savingUserInfo: false,
      savingPassword: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentUser.avatar !== this.state.user.avatar) {
      this.setState({
        user: {
          ...this.state.user,
          avatar: nextProps.currentUser.avatar
        }
      })
    }
  }

  render () {
    const { user, savingUserInfo, savingPassword } = this.state
    const { t } = this.props
    const language = user.preferredLanguage || 'vn'
    return (
      <div className='content-wrapper'>
        <Head>
          <title>{t('common:mySettings')}</title>
        </Head>
        <section className='content'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-12'>
                <h1>{t('common:mySettings')}</h1>
              </div>
            </div>
            <Fragment>
              <div className='text-center'>
                <label
                  htmlFor='avatar'
                  className='avatar avatar__editor rounded-circle mb-4'
                >
                  <img
                    src={
                      user.avatar ||
                      'https://jetsport.com.au/assets/backend/images/default-avatar.png'
                    }
                    alt={user.name}
                  />
                  <i className='fas fa-camera text-white' />
                  <input
                    type='file'
                    className='d-none'
                    id='avatar'
                    accept={ALLOW_FILE_TYPE}
                    onChange={this._handleChangeAvatar}
                  />
                </label>
              </div>
              <div className='row'>
                <div className='col-6'>
                  <div className='card'>
                    <div className='card-header'>
                      <span className='card-title'>
                        {t('admin:accountInformation')}
                      </span>
                    </div>
                    <div className='card-body'>
                      <section className='content'>
                        <form
                          className='no-shadow'
                          role='form'
                          onSubmit={this._saveAccountInfo}
                        >
                          <div className='form-group'>
                            <label htmlFor='name'>{t('common:name')}</label>
                            <input
                              required
                              type='text'
                              className='form-control'
                              id='name'
                              placeholder={t('common:name')}
                              onChange={this._updateUserField('name')}
                              value={user.name}
                            />
                          </div>
                          <div className='form-group'>
                            <label htmlFor='email'>{t('common:email')}</label>
                            <input
                              required
                              type='email'
                              className='form-control'
                              id='email'
                              placeholder={t('common:email')}
                              onChange={this._updateUserField('email')}
                              value={user.email}
                            />
                          </div>
                          <div className='form-group'>
                            <label htmlFor='language'>
                              {t('admin:preferredLanguage')}
                            </label>
                            <select
                              id='language'
                              className='form-control'
                              value={language}
                              onChange={this._updateUserField(
                                'preferredLanguage'
                              )}
                            >
                              {languages.map(lang => (
                                <option key={lang.id} value={lang.id}>
                                  {lang.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            type='submit'
                            className='btn btn-primary'
                            disabled={savingUserInfo}
                          >
                            {t('common:save')}
                          </button>
                        </form>
                      </section>
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='card'>
                    <div className='card-header'>
                      <span className='card-title'>
                        {t('common:changePassword')}
                      </span>
                    </div>
                    <div className='card-body'>
                      <section className='content'>
                        <form
                          className='no-shadow'
                          role='form'
                          onSubmit={this._changePassword}
                        >
                          <div className='form-group'>
                            <label htmlFor='currentPassword'>
                              {t('common:currentPassword')}
                            </label>
                            <input
                              required
                              type='password'
                              id='currentPassword'
                              className='form-control'
                              placeholder={t('common:currentPassword')}
                              onChange={this._updateUserField('oldPassword')}
                              value={user.oldPassword}
                            />
                          </div>
                          <div className='form-group'>
                            <label htmlFor='newPassword'>
                              {t('common:newPassword')}
                            </label>
                            <input
                              required
                              type='password'
                              id='newPassword'
                              className='form-control'
                              placeholder={t('common:newPassword')}
                              onChange={this._updateUserField('newPassword')}
                              value={user.newPassword}
                            />
                          </div>
                          <div className='form-group'>
                            <label htmlFor='confirmPassword'>
                              {t('common:confirmPassword')}
                            </label>
                            <input
                              required
                              type='password'
                              id='confirmPassword'
                              className='form-control'
                              placeholder={t('common:confirmPassword')}
                              onChange={this._updateUserField(
                                'confirmPassword'
                              )}
                              value={user.confirmPassword}
                            />
                          </div>
                          <button
                            type='submit'
                            className='btn btn-primary'
                            disabled={savingPassword}
                          >
                            {t('common:save')}
                          </button>
                        </form>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          </div>
        </section>
      </div>
    )
  }

  _saveAccountInfo = async e => {
    e.preventDefault()

    const { t } = this.props

    this.setState({ savingUserInfo: true })

    try {
      await this.props.dispatch(authRedux.updateAccountInfo(this.state.user))
      this.props.i18n.changeLanguage(this.state.user.preferredLanguage)
      toastr.success(t('common:saved'))
    } catch (e) {
      if (e.details) {
        toastr.error(t(`common:${_.camelCase(e.details[0])}`))
      } else {
        toastr.error(t('common:errSaved'))
      }
    } finally {
      this.setState({ savingUserInfo: false })
    }
  }

  _changePassword = async e => {
    e.preventDefault()

    const { t } = this.props

    try {
      const { oldPassword, newPassword, confirmPassword } = this.state.user

      if (newPassword !== confirmPassword) {
        return toastr.error(t('common:errNewPasswordNotMatch'))
      }

      this.setState({ savingPassword: true })

      await authService.updatePassword({ oldPassword, newPassword })
      toastr.success(t('common:saved'))
    } catch (e) {
      if (e.details) {
        toastr.error(t(`common:${_.camelCase(e.details[0])}`))
      } else {
        toastr.error(t(`common:errInvalidPassword`))
      }
    } finally {
      this.setState({ savingPassword: false })
    }
  }

  _updateUserField = field => e =>
    this.setState({ user: { ...this.state.user, [field]: e.target.value } })

  _handleChangeAvatar = async e => {
    const { t } = this.props
    try {
      await this.props.dispatch(authRedux.updateAvatar(e.target.files[0]))
      toastr.success(t('common:saved'))
    } catch (e) {
      if (e.details) {
        switch (e.details[0]) {
          case Error.ERR_INVALID_FILE_SIZE:
            return toastr.error(
              t(`common:${_.camelCase(e.details[0])}`, {
                maxSize: MAX_FILE_SIZE / Math.pow(1024, 2)
              })
            )
          case Error.ERR_INVALID_FILE_TYPE:
            return toastr.error(
              t(`common:${_.camelCase(e.details[0])}`, {
                allowType: ALLOW_FILE_TYPE.join(', ').replace(
                  new RegExp('image/', 'g'),
                  ''
                )
              })
            )
          default:
            return toastr.error(t(`common:${_.camelCase(e.details[0])}`))
        }
      } else {
        toastr.error(t('common:errFailedToUploadFile'))
      }
    }
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
})

export default userOnly(connect(mapStateToProps)(ProfileSettingsPage))
