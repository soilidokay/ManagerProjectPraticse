import React, { Component } from 'react'
import Head from 'next/head'
import toastr from 'toastr'
import _ from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { authService } from '../services'
import guestOnly from '../hocs/guestOnly'

class ResetPasswordPage extends Component {
  constructor (props) {
    super(props)
    this.state = { email: '', submitting: false }
  }

  render () {
    const { email, submitting } = this.state
    const { t } = this.props

    return (
      <div>
        <Head>
          <title>{t('common:resetPassword')}</title>
        </Head>
        <div className='forgot-password-form form__standalone'>
          <div className='card'>
            <div className='card-body'>
              <h1 className='h4 mb-3 font-weight-normal text-center'>
                {t('common:resetPassword')}
              </h1>
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
                    <i className='fa fa-user input-group-text' />
                  </div>
                </div>
                <button
                  className='btn btn-primary btn-block'
                  type='submit'
                  disabled={submitting}
                >
                  {t('common:resetPassword')}
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
    this.setState({ submitting: true })
    const { email } = this.state

    try {
      await authService.sendResetPasswordEmail(email)
      toastr.success(t('common:checkResetPasswordEmail'))
      this.setState({ submitting: false })
    } catch (e) {
      this.setState({ submitting: false })
      toastr.error(t(`common:${_.camelCase(e.details[0])}`))
    }
  }
}

export default compose(
  guestOnly,
  connect()
)(ResetPasswordPage)
