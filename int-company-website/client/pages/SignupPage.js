import React, { Component } from 'react'
import Head from 'next/head'
import { compose } from 'redux'
import { connect } from 'react-redux'
import toastr from 'toastr'
import _ from 'lodash'
import { Router, Link } from '../../common/routes'
import authRedux from '../redux/authRedux'
import guestOnly from '../hocs/guestOnly'
import { isAdmin } from '../../common/models/User'
import AuthService from '../services/AuthService'

class SignupPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false
    }
  }

  render () {
    const { name, email, password, confirmPassword, loading } = this.state
    const { t } = this.props
    return (
      <div>
        <Head>
          <title>{t('common:signUp')}</title>
        </Head>
        <div className='sign-up-form form__standalone'>
          <div className='card'>
            <div className='card-body'>
              <h1 className='h4 mb-3 font-weight-normal text-center'>
                {t('common:signUp')}
              </h1>
              <form onSubmit={this._onSubmit}>
                <div className='input-group mb-3'>
                  <input
                    id='inputName'
                    className='form-control'
                    placeholder={t('common:name')}
                    onChange={this._updateFormField('name')}
                    value={name}
                    required
                    autoFocus
                  />
                  <div className='input-group-append'>
                    <i className='fa fa-user input-group-text' />
                  </div>
                </div>
                <div className='input-group mb-3'>
                  <input
                    id='inputEmail'
                    type='email'
                    className='form-control'
                    placeholder={t('common:email')}
                    onChange={this._updateFormField('email')}
                    value={email}
                    required
                  />
                  <div className='input-group-append'>
                    <i className='fa fa-envelope input-group-text' />
                  </div>
                </div>
                <div className='input-group mb-3'>
                  <input
                    id='inputPassword'
                    type='password'
                    className='form-control'
                    placeholder={t('common:password')}
                    onChange={this._updateFormField('password')}
                    value={password}
                    required
                  />
                  <div className='input-group-append'>
                    <i className='fa fa-lock input-group-text' />
                  </div>
                </div>
                <div className='input-group mb-3'>
                  <input
                    id='inputConfirmPassword'
                    type='password'
                    className='form-control'
                    placeholder={t('common:confirmPassword')}
                    onChange={this._updateFormField('confirmPassword')}
                    value={confirmPassword}
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
                  {t('common:signUp')}
                </button>
                <p className='mb-1 mt-3'>
                  Already have an account?&nbsp;
                  <Link route='/login'>
                    <a>Go to Login</a>
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

    const { t, dispatch } = this.props
    const { name, email, password, confirmPassword } = this.state

    if (password !== confirmPassword) {
      return toastr.error(t('common:errPasswordNotMatch'))
    }

    try {
      this.setState({ loading: true })
      const user = await dispatch(
        authRedux.signupWithEmail({ name, email, password })
      )
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
)(SignupPage)
