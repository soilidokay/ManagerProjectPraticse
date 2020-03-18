import React, { Component } from 'react'
import Head from 'next/head'
import toastr from 'toastr'
import _ from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { Router } from '../../common/routes'
import { authService } from '../services'
import guestOnly from '../hocs/guestOnly'

class ResetNewPasswordPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      submitting: false
    }
  }

  render () {
    const { password, confirmPassword, submitting } = this.state
    const { t } = this.props
    return (
      <div>
        <Head>
          <title>{t('common:resetNewPassword')}</title>
        </Head>
        <div className='reset-new-password-form form__standalone'>
          <div className='card'>
            <div className='card-body'>
              <h1 className='h4 text-center mb-3 font-weight-normal'>
                {t('common:resetNewPassword')}
              </h1>
              <form onSubmit={this._onSubmit}>
                <div className='input-group mb-3'>
                  <input
                    type='password'
                    className='form-control'
                    placeholder={t('common:newPassword')}
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
                    type='password'
                    className='form-control'
                    placeholder={t('common:confirmPassword')}
                    onChange={this._updateFormField('confirmPassword')}
                    value={confirmPassword}
                    required
                  />
                  <div className='input-group-append'>
                    <span className='fa fa-lock input-group-text' />
                  </div>
                </div>
                <button
                  className='btn btn-primary btn-block'
                  type='submit'
                  disabled={submitting}
                >
                  {t('common:save')}
                </button>
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

    const { t } = this.props
    const { password, confirmPassword } = this.state

    if (password !== confirmPassword) {
      return toastr.error(t('errNewPasswordNotMatch'))
    }

    try {
      this.setState({ submitting: true })
      const {
        access_token: accessToken,
        user_id: userId
      } = this.props.router.query
      await authService.setNewPassword(
        { newPassword: password, userId },
        accessToken
      )
      Router.replaceRoute('/login')
    } catch (e) {
      this.setState({ submitting: false })
      if (e.details) {
        toastr.error(t(`common:${_.camelCase(e.details[0])}`))
      } else {
        toastr.error(t(`common:errInvalidPassword`))
      }
    }
  }
}

export default compose(
  guestOnly,
  connect(),
  withRouter
)(ResetNewPasswordPage)
