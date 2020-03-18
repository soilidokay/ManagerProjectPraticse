import React, { Fragment } from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import toastr from 'toastr'
import _ from 'lodash'
import adminOnly from '../../hocs/adminOnly'
import { Link } from '../../../common/routes'
import { authService } from '../../services'
import authRedux from '../../redux/authRedux'
import {
  Error,
  ALLOW_FILE_TYPE,
  MAX_FILE_SIZE
} from '../../../common/models/Container'

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
class AdminProfileSettingsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {
        ...props.currentUser,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar:
          props.currentUser.avatar ||
          'https://jetsport.com.au/assets/backend/images/default-avatar.png'
      },
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
    const language = user.preferredLanguage || 'vn'
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - {'admin:mySettings'}</title>
        </Head>
        <section className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-6'>
                <h1>{'admin:mySettings'}</h1>
              </div>
              <div className='col-sm-6'>
                <ol className='breadcrumb float-sm-right'>
                  <li className='breadcrumb-item'>
                    <Link route='/admin'>
                      <a>{'common:home'}</a>
                    </Link>
                  </li>
                  <li className='breadcrumb-item active'>
                    {'admin:mySettings'}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className='content'>
          <div className='container-fluid'>
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
                        {'admin:accountInformation'}
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
                            <label htmlFor='name'>{'common:name'}</label>
                            <input
                              required
                              type='text'
                              className='form-control'
                              id='name'
                              placeholder={'common:name'}
                              onChange={this._updateUserField('name')}
                              value={user.name}
                            />
                          </div>
                          <div className='form-group'>
                            <label htmlFor='email'>{'common:email'}</label>
                            <input
                              required
                              type='email'
                              className='form-control'
                              id='email'
                              placeholder={'common:email'}
                              onChange={this._updateUserField('email')}
                              value={user.email}
                            />
                          </div>
                          <div className='form-group'>
                            <label htmlFor='language'>
                              {'admin:preferredLanguage'}
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
                            {'common:save'}
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
                        {'common:changePassword'}
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
                              {'common:currentPassword'}
                            </label>
                            <input
                              required
                              type='password'
                              id='currentPassword'
                              className='form-control'
                              placeholder={'common:currentPassword'}
                              onChange={this._updateUserField('oldPassword')}
                              value={user.oldPassword}
                            />
                          </div>
                          <div className='form-group'>
                            <label htmlFor='newPassword'>
                              {'common:newPassword'}
                            </label>
                            <input
                              required
                              type='password'
                              id='newPassword'
                              className='form-control'
                              placeholder={'common:newPassword'}
                              onChange={this._updateUserField('newPassword')}
                              value={user.newPassword}
                            />
                          </div>
                          <div className='form-group'>
                            <label htmlFor='confirmPassword'>
                              {'common:confirmPassword'}
                            </label>
                            <input
                              required
                              type='password'
                              id='confirmPassword'
                              className='form-control'
                              placeholder={'common:confirmPassword'}
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
                            {'common:save'}
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
    this.setState({ savingUserInfo: true })
    try {
      await this.props.dispatch(authRedux.updateAccountInfo(this.state.user))
      this.props.i18n.changeLanguage(this.state.user.preferredLanguage)
      toastr.success('common:saved')
    } catch (e) {
      if (e.details) {
        toastr.error(`common:${_.camelCase(e.details[0])}`)
      } else {
        toastr.error('common:errSaved')
      }
    } finally {
      this.setState({ savingUserInfo: false })
    }
  }

  _changePassword = async e => {
    e.preventDefault()
    try {
      const { oldPassword, newPassword, confirmPassword } = this.state.user
      if (newPassword !== confirmPassword) {
        return toastr.error('common:errNewPasswordNotMatch')
      }
      this.setState({ savingPassword: true })
      await authService.updatePassword({ oldPassword, newPassword })
      toastr.success('common:saved')
    } catch (e) {
      if (e.details) {
        toastr.error(`common:${_.camelCase(e.details[0])}`)
      } else {
        toastr.error(`common:errInvalidPassword`)
      }
    } finally {
      this.setState({ savingPassword: false })
    }
  }

  _updateUserField = field => e =>
    this.setState({ user: { ...this.state.user, [field]: e.target.value } })

  _handleChangeAvatar = async e => {
    try {
      await this.props.dispatch(authRedux.updateAvatar(e.target.files[0]))
      toastr.success('common:saved')
    } catch (e) {
      if (e.details) {
        switch (e.details[0]) {
          case Error.ERR_INVALID_FILE_SIZE:
            return toastr.error(`common:${_.camelCase(e.details[0])}`, {
              maxSize: MAX_FILE_SIZE / Math.pow(1024, 2)
            })
          case Error.ERR_INVALID_FILE_TYPE:
            return toastr.error(`common:${_.camelCase(e.details[0])}`, {
              allowType: ALLOW_FILE_TYPE.join(', ').replace(
                new RegExp('image/', 'g'),
                ''
              )
            })
          default:
            return toastr.error(`common:${_.camelCase(e.details[0])}`)
        }
      } else {
        toastr.error('common:errFailedToUploadFile')
      }
    }
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
})

export default adminOnly(connect(mapStateToProps)(AdminProfileSettingsPage))
