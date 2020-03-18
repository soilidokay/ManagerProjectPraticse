import React from 'react'
import Head from 'next/head'
import { compose } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import classnames from 'classnames'
import toastr from 'toastr'
import { TabContent, TabPane } from 'reactstrap'
import adminOnly from '../../hocs/adminOnly'
import { Link } from '../../../common/routes'
import { applicationService } from '../../services'
import {
  ConfigurationId,
  DEFAULT_EMAIL_ADDRESS_VERIFICATION_MESSAGE,
  DEFAULT_RESET_PASSWORD_MESSAGE
} from '../../../common/models/Configuration'

class AdminEmailSettingsPage extends React.Component {
  static async getInitialProps ({
    req,
    res,
    pathname,
    query,
    asPath,
    store,
    isServer
  }) {
    const configs = await applicationService.getConfigurations([
      ConfigurationId.MAIL_EMAIL_ADDRESS_VERIFICATION,
      ConfigurationId.MAIL_RESET_PASSWORD,
      ConfigurationId.MAIL_SMTP_SETTINGS
    ])
    return {
      emailAddressVerification: _.find(configs, {
        id: ConfigurationId.MAIL_EMAIL_ADDRESS_VERIFICATION
      }),
      resetPassword: _.find(configs, {
        id: ConfigurationId.MAIL_RESET_PASSWORD
      }),
      smtpSettings: _.find(configs, { id: ConfigurationId.MAIL_SMTP_SETTINGS })
    }
  }

  constructor (props) {
    super(props)
    const { emailAddressVerification, resetPassword, smtpSettings } = props
    this.state = {
      activeTab: 0,
      emailAddressVerification: _.get(emailAddressVerification, 'data', {}),
      resetPassword: _.get(resetPassword, 'data', {}),
      smtpSettings: _.get(smtpSettings, 'data', {}),
      savingEmailAddressVerification: false,
      savingResetPassword: false,
      savingSmtpSettings: false,
      testingSmtpSettings: false
    }
  }

  render () {
    const {
      emailAddressVerification,
      resetPassword,
      smtpSettings,
      activeTab,
      savingEmailAddressVerification,
      savingResetPassword,
      savingSmtpSettings,
      testingSmtpSettings
    } = this.state
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - {'admin:emailSettings'}</title>
        </Head>
        <section className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-6'>
                <h1>{'admin:emailSettings'}</h1>
              </div>
              <div className='col-sm-6'>
                <ol className='breadcrumb float-sm-right'>
                  <li className='breadcrumb-item'>
                    <Link route='/admin'>
                      <a>{'common:home'}</a>
                    </Link>
                  </li>
                  <li className='breadcrumb-item active'>
                    {'admin:emailSettings'}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className='content'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header d-flex p-2'>
                    <ul className='nav nav-pills'>
                      <li className='nav-item'>
                        <a
                          className={classnames('nav-link', 'u-clickable', {
                            active: activeTab === 0
                          })}
                          data-toggle='tab'
                          onClick={() => this._setActiveTab(0)}
                        >
                          {'admin:emailAddressVerification'}
                        </a>
                      </li>
                      <li className='nav-item'>
                        <a
                          className={classnames('nav-link', 'u-clickable', {
                            active: activeTab === 1
                          })}
                          data-toggle='tab'
                          onClick={() => this._setActiveTab(1)}
                        >
                          {'admin:resetPassword'}
                        </a>
                      </li>
                      <li className='nav-item'>
                        <a
                          className={classnames('nav-link', 'u-clickable', {
                            active: activeTab === 2
                          })}
                          data-toggle='tab'
                          onClick={() => this._setActiveTab(2)}
                        >
                          {'admin:smtpSettings'}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className='card-body'>
                    <section className='content'>
                      <div className='row'>
                        <div className='col-12'>
                          <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId={0}>
                              <form
                                className='no-shadow'
                                role='form'
                                onSubmit={this._saveEmailAddressVerification}
                              >
                                <div className='form-group form-check'>
                                  <input
                                    type='checkbox'
                                    className='form-check-input'
                                    id='email-verification-enabled'
                                    onChange={this._updateEmailAddressVerificationField(
                                      'enabled'
                                    )}
                                    checked={emailAddressVerification.enabled}
                                  />
                                  <label
                                    className='form-check-label'
                                    htmlFor='email-verification-enabled'
                                  >
                                    {'admin:enabled'}
                                  </label>
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:senderName'}</label>
                                  <input
                                    required
                                    className='form-control'
                                    placeholder={'admin:senderName'}
                                    onChange={this._updateEmailAddressVerificationField(
                                      'senderName'
                                    )}
                                    value={emailAddressVerification.senderName}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:from'}</label>
                                  <input
                                    required
                                    type='email'
                                    className='form-control'
                                    placeholder={'admin:from'}
                                    onChange={this._updateEmailAddressVerificationField(
                                      'senderEmail'
                                    )}
                                    value={emailAddressVerification.senderEmail}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:subject'}</label>
                                  <input
                                    required
                                    className='form-control'
                                    placeholder={'admin:subject'}
                                    onChange={this._updateEmailAddressVerificationField(
                                      'subject'
                                    )}
                                    value={emailAddressVerification.subject}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:message'}</label>
                                  <textarea
                                    required
                                    rows='10'
                                    className='form-control'
                                    onChange={this._updateEmailAddressVerificationField(
                                      'message'
                                    )}
                                    placeholder={
                                      DEFAULT_EMAIL_ADDRESS_VERIFICATION_MESSAGE
                                    }
                                    value={emailAddressVerification.message}
                                  />
                                </div>
                                <button
                                  type='submit'
                                  className='btn btn-primary'
                                  disabled={savingEmailAddressVerification}
                                >
                                  {'common:save'}
                                </button>
                              </form>
                            </TabPane>
                            <TabPane tabId={1}>
                              <form
                                className='no-shadow'
                                role='form'
                                onSubmit={this._saveResetPassword}
                              >
                                <div className='form-group'>
                                  <label>{'admin:senderName'}</label>
                                  <input
                                    required
                                    className='form-control'
                                    placeholder={'admin:senderName'}
                                    onChange={this._updateResetPasswordField(
                                      'senderName'
                                    )}
                                    value={resetPassword.senderName}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:from'}</label>
                                  <input
                                    required
                                    type='email'
                                    className='form-control'
                                    placeholder={'admin:from'}
                                    onChange={this._updateResetPasswordField(
                                      'senderEmail'
                                    )}
                                    value={resetPassword.senderEmail}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:subject'}</label>
                                  <input
                                    required
                                    className='form-control'
                                    placeholder={'admin:subject'}
                                    onChange={this._updateResetPasswordField(
                                      'subject'
                                    )}
                                    value={resetPassword.subject}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:message'}</label>
                                  <textarea
                                    required
                                    rows='10'
                                    className='form-control'
                                    placeholder={DEFAULT_RESET_PASSWORD_MESSAGE}
                                    onChange={this._updateResetPasswordField(
                                      'message'
                                    )}
                                    value={resetPassword.message}
                                  />
                                </div>
                                <button
                                  type='submit'
                                  className='btn btn-primary'
                                  disabled={savingResetPassword}
                                >
                                  {'common:save'}
                                </button>
                              </form>
                            </TabPane>
                            <TabPane tabId={2}>
                              <form
                                className='no-shadow'
                                role='form'
                                onSubmit={this._saveSmtpSettings}
                              >
                                <div className='form-group'>
                                  <label>{'admin:senderAddress'}</label>
                                  <input
                                    required
                                    type='email'
                                    className='form-control'
                                    placeholder='support@yourdomain.com'
                                    onChange={this._updateSmtpSettingsField(
                                      'senderEmail'
                                    )}
                                    value={smtpSettings.senderEmail}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:smtpServerHost'}</label>
                                  <input
                                    required
                                    className='form-control'
                                    placeholder='smtp.host.com'
                                    onChange={this._updateSmtpSettingsField(
                                      'smtpHost'
                                    )}
                                    value={smtpSettings.smtpHost}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:smtpServerPort'}</label>
                                  <input
                                    required
                                    type='number'
                                    className='form-control'
                                    placeholder='587'
                                    onChange={this._updateSmtpSettingsField(
                                      'smtpPort'
                                    )}
                                    value={smtpSettings.smtpPort}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:smtpAccountUsername'}</label>
                                  <input
                                    required
                                    className='form-control'
                                    placeholder={'admin:username'}
                                    onChange={this._updateSmtpSettingsField(
                                      'username'
                                    )}
                                    value={smtpSettings.username}
                                  />
                                </div>
                                <div className='form-group'>
                                  <label>{'admin:password'}</label>
                                  <input
                                    required
                                    className='form-control'
                                    placeholder={'admin:password'}
                                    onChange={this._updateSmtpSettingsField(
                                      'password'
                                    )}
                                    value={smtpSettings.password}
                                  />
                                </div>
                                <div className='form-group'>
                                  <button
                                    type='submit'
                                    className='btn btn-primary mr-2'
                                    disabled={savingSmtpSettings}
                                  >
                                    {'common:save'}
                                  </button>
                                  <button
                                    className='btn btn-info'
                                    onClick={this._testSmtpSettings}
                                    disabled={testingSmtpSettings}
                                  >
                                    {'common:test'}
                                  </button>
                                </div>
                              </form>
                            </TabPane>
                          </TabContent>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  _saveEmailAddressVerification = async e => {
    e.preventDefault()

    this.setState({ savingEmailAddressVerification: true })

    try {
      await applicationService.saveEmailAddressVerification(
        this.state.emailAddressVerification
      )
      toastr.success('common:saved')
    } catch (e) {
      toastr.error(e.message)
    } finally {
      this.setState({ savingEmailAddressVerification: false })
    }
  }

  _saveResetPassword = async e => {
    e.preventDefault()

    this.setState({ savingResetPassword: true })

    try {
      await applicationService.saveResetPassword(this.state.resetPassword)
      toastr.success('common:saved')
    } catch (e) {
      toastr.error(e.message)
    } finally {
      this.setState({ savingResetPassword: false })
    }
  }

  _saveSmtpSettings = async e => {
    e.preventDefault()

    this.setState({ savingSmtpSettings: true })

    try {
      await applicationService.saveSmtpSettings(this.state.smtpSettings)
      toastr.success('common:saved')
    } catch (e) {
      toastr.error(e.message)
    } finally {
      this.setState({ savingSmtpSettings: false })
    }
  }

  _updateEmailAddressVerificationField = field => e =>
    this.setState({
      emailAddressVerification: {
        ...this.state.emailAddressVerification,
        [field]:
          e.target.type === 'checkbox' ? e.target.checked : e.target.value
      }
    })

  _updateResetPasswordField = field => e =>
    this.setState({
      resetPassword: {
        ...this.state.resetPassword,
        [field]:
          e.target.type === 'checkbox' ? e.target.checked : e.target.value
      }
    })

  _updateSmtpSettingsField = field => e =>
    this.setState({
      smtpSettings: {
        ...this.state.smtpSettings,
        [field]: e.target.value
      }
    })

  _setActiveTab = id => this.setState({ activeTab: id })

  _testSmtpSettings = async e => {
    e.preventDefault()

    this.setState({ testingSmtpSettings: true })
    try {
      const isValid = await applicationService.isValidSmtpEmailSettings({
        ...this.state.smtpSettings,
        smtpPort: parseInt(this.state.smtpSettings.smtpPort)
      })

      if (isValid) return toastr.success('admin:smtpSettingsAreValid')

      toastr.error('admin:smtpSettingsAreInvalid')
    } catch (e) {
      toastr.error(e.message)
    } finally {
      this.setState({ testingSmtpSettings: false })
    }
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
})

export default compose(
  adminOnly,
  connect(mapStateToProps)
)(AdminEmailSettingsPage)
