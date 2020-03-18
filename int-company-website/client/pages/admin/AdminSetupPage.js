import React, { Component } from 'react'
import Head from 'next/head'
import { compose } from 'redux'
import { connect } from 'react-redux'
import toastr from 'toastr'
// import _ from 'lodash'
import authRedux from '../../redux/authRedux'
import { Router } from '../../../common/routes'
import guestOnly from '../../hocs/guestOnly'
import { applicationService } from '../../services'

const Display = {
  INPUT_PASSWORD: 'INPUT_PASSWORD',
  CREATE_FIRST_ADMIN: 'CREATE_FIRST_ADMIN'
}

class InputInitSystemPasswordView extends Component {
  state = {
    password: '',
    submitting: false
  }

  render () {
    const { password, submitting } = this.state
    return (
      <div className='row justify-content-center mt-5'>
        <div className='col-md-4 col-sm-12'>
          <div className='card'>
            <div className='card-body'>
              <h1 className='h4 text-center mb-3 font-weight-normal'>
                {'admin:unlockTheSystem'}
              </h1>
              <div className='text-center mb-3'>
                You can find the password as SYSTEM_ADMIN_PASSWORD environment
                variable of your system.
              </div>
              <form onSubmit={this._onSubmit}>
                <div className='input-group mb-3'>
                  <input
                    type='password'
                    id='inputPassword'
                    className='form-control'
                    onChange={e => this.setState({ password: e.target.value })}
                    placeholder={'common:initialAdminPassword'}
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
                  disabled={submitting}
                >
                  {'common:continue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _onSubmit = async e => {
    e.preventDefault()
    this.setState({ submitting: true })
    await this.props.onSubmit(this.state.password)
    this.setState({ submitting: false })
  }
}

class CreateFirstAdminView extends Component {
  state = {
    admin: {
      email: '',
      name: '',
      password: '',
      confirmPassword: ''
    },
    submitting: false
  }

  render () {
    const { submitting } = this.props
    const {
      admin: { name, email, password, confirmPassword }
    } = this.state
    return (
      <div className='admin-first-account-form form__standalone'>
        <div className='card'>
          <div className='card-body'>
            <h1 className='h4 text-center mb-3 font-weight-normal'>
              {'admin:unlockTheSystem'}
            </h1>
            <div className='text-center mb-3'>
              Create your first admin account.
            </div>
            <form onSubmit={this._onSubmit}>
              <div className='input-group mb-3'>
                <input
                  id='inputName'
                  className='form-control'
                  placeholder={'common:name'}
                  onChange={this._updateAdminField('name')}
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
                  placeholder={'common:email'}
                  onChange={this._updateAdminField('email')}
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
                  placeholder={'common:password'}
                  onChange={this._updateAdminField('password')}
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
                  placeholder={'common:confirmPassword'}
                  onChange={this._updateAdminField('confirmPassword')}
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
                disabled={submitting}
              >
                {'common:continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  _updateAdminField = field => e =>
    this.setState({ admin: { ...this.state.admin, [field]: e.target.value } })

  _onSubmit = e => {
    e.preventDefault()
    const { password, confirmPassword } = this.state.admin
    if (password !== confirmPassword) {
      return toastr.error('common:errPasswordNotMatch')
    }
    this.setState({ submitting: true })
    this.props.onSubmit(this.state.admin)
    this.setState({ submitting: false })
  }
}

class AdminSetupPage extends Component {
  static async getInitialProps ({
    req,
    res,
    pathname,
    query,
    asPath,
    store,
    isServer
  }) {
    const appHasBeenSetup = await applicationService.checkAppHasBeenSetup()

    if (appHasBeenSetup) {
      if (isServer) {
        res.redirect('/admin/login')
        res.end()
      } else {
        Router.replace('/admin/login')
      }

      return {}
    }

    return {}
  }

  constructor (props) {
    super(props)
    this.state = {
      display: Display.INPUT_PASSWORD
    }
    this._validInitSystemPassword = null
  }

  render () {
    return (
      <div>
        <Head>
          <title>{'admin:setupWizard'}</title>
        </Head>
        {this._renderContent()}
      </div>
    )
  }

  _renderContent = () => {
    const { display } = this.state

    switch (display) {
      case Display.INPUT_PASSWORD: {
        return (
          <InputInitSystemPasswordView
            onSubmit={this._onSubmitInputSystemPassword}
          />
        )
      }
      case Display.CREATE_FIRST_ADMIN: {
        return <CreateFirstAdminView onSubmit={this._onSubmitAdmin} />
      }
    }
  }

  _updateAdminField = field => e =>
    this.setState({
      admin: {
        ...this.state.admin,
        [field]: e.target.value
      }
    })

  _onSubmitInputSystemPassword = async password => {
    try {
      const isValidSystemInitPassword = await applicationService.validateInitSystemPassword(
        password
      )

      if (!isValidSystemInitPassword) {
        toastr.error('common:errInvalidPassword')
        return
      }

      this._validInitSystemPassword = password
      this.setState({ display: Display.CREATE_FIRST_ADMIN })
    } catch (e) {
      const msg = (function () {
        switch (e.code) {
          default:
            return e.message
        }
      })()
      toastr.error(msg)
    }
  }

  _onSubmitAdmin = async admin => {
    const { dispatch } = this.props

    try {
      const systemInitialized = await applicationService.initializeSystem({
        password: this._validInitSystemPassword,
        admin
      })
      if (!systemInitialized) {
        toastr.error('admin:errFailedToInitializeSystem')
      }

      await dispatch(
        authRedux.loginWithEmail({
          email: admin.email,
          password: admin.password
        })
      )

      Router.replaceRoute('/admin')
    } catch (e) {
      // toastr.error(`common:${_.camelCase(e.details[0]}`))
    }
  }
}

export default compose(
  guestOnly,
  connect()
)(AdminSetupPage)
