import React, { Component } from 'react'
import Head from 'next/head'
import { compose } from 'redux'
import { connect } from 'react-redux'
import toastr from 'toastr'
import _ from 'lodash'
import { Router, Link } from '../../common/routes'
import authRedux from '../redux/authRedux'
import { isAdmin } from '../../common/models/User'
import guestOnly from '../hocs/guestOnly'
import AuthService from '../services/AuthService'

class LoginPage extends Component {
  constructor (props) {
    super(props)
    this.state = { email: '', password: '', loading: false }
  }

  render () {
    const { email, password, loading } = this.state
    const { t } = this.props
    return (
      <div>
        <Head>
          <title>{t('common:login')}</title>
        </Head>
        <div className='login-form form__standalone'>
          <div className='card'>
            <div className='card-body'>
              <h4 className='text-center mb-3 font-weight-normal'>
                {t('common:login')}
              </h4>
              <form onSubmit={this._onSubmit}>
                <div className='input-group mb-3'>
                  <input
                    onChange={this._updateFormField('email')}
                    type='email'
                    id='inputEmail'
                    className='form-control'
                    placeholder={t('common:email')}
                    required
                    value={email}
                    autoFocus
                  />
                  <div className='input-group-append'>
                    <i className='fa fa-envelope input-group-text' />
                  </div>
                </div>
                <div className='input-group mb-3'>
                  <input
                    type='password'
                    id='inputPassword'
                    className='form-control'
                    onChange={this._updateFormField('password')}
                    placeholder={t('common:password')}
                    value={password}
                    required
                  />
                  <div className='input-group-append'>
                    <i className='fa fa-lock input-group-text' />
                  </div>
                </div>
                <button
                  className='btn btn-primary btn-block'
                  type='submit'
                  disabled={loading}
                >
                  {t('login')}
                </button>
                <p className='mb-1 mt-3'>
                  <Link route='/reset-password'>
                    <a>{t('forgotYourPassword')}</a>
                  </Link>
                </p>
                <p className='mb-0'>
                  <Link route='/signup'>
                    <a className='text-center'>{t('createNewAccount')}</a>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _updateFormField = field => e => this.setState({ [field]: e.target.value })

  _onSubmit = async e => {
    e.preventDefault()

    const { dispatch, t, i18n } = this.props
    const { email, password } = this.state

    try {
      this.setState({ loading: true })
      const user = await dispatch(authRedux.loginWithEmail({ email, password }))

      if (!user) return toastr.error(t('common:errUnknown'))

      i18n.changeLanguage(user.preferredLanguage || 'en')
      const nextPage = isAdmin(user) ? '/admin' : '/'
      Router.replaceRoute(nextPage)
    } catch (e) {
      this.setState({ loading: false })
      switch (e.details[0]) {
        case AuthService.ERR_LOGIN_FAILED:
          return toastr.error(t('common:errInvalidEmailOrPassword'))
        default:
          return toastr.error(t(`common:${_.camelCase(e.details[0])}`))
      }
    }
  }
}

export default compose(
  guestOnly,
  connect()
)(LoginPage)
