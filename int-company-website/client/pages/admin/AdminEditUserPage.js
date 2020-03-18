import React from 'react'
import Head from 'next/head'
import toastr from 'toastr'
import adminOnly from '../../hocs/adminOnly'
import { userService } from '../../services'
import { Router, Link } from '../../../common/routes'

class AdminEditUserPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: { name: '', email: '', emailVerified: false },
      saving: false
    }
  }

  async componentDidMount () {
    try {
      const id = Router.query.id
      const user = await userService.getUserFromId(id)
      this.setState({ user: user })
    } catch (error) {
      Router.pushRoute('/admin/users/')
    }
  }

  render () {
    const { user, saving } = this.state
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - {'admin:editUser'}</title>
        </Head>
        <section className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-6'>
                <h1>{'admin:editUser'}</h1>
              </div>
              <div className='col-sm-6'>
                <ol className='breadcrumb float-sm-right'>
                  <li className='breadcrumb-item'>
                    <Link route='/admin'>
                      <a>{'common:home'}</a>
                    </Link>
                  </li>
                  <li className='breadcrumb-item active'>{'admin:editUser'}</li>
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
                  <div className='card-header'>
                    <span className='card-title'>{'admin:editUserForm'}</span>
                  </div>
                  <div className='card-body'>
                    <section className='content'>
                      <div className='row'>
                        <div className='col-12'>
                          <form role='form' onSubmit={this._submit}>
                            <div className='form-group'>
                              <label htmlFor='name'>{'common:name'}</label>
                              <input
                                type='text'
                                className='form-control'
                                id='inputName'
                                placeholder={'common:name'}
                                onChange={this._updateUserField('name')}
                                value={user.name}
                              />
                            </div>
                            <div className='form-group'>
                              <label htmlFor='email'>{'common:email'}</label>
                              <input
                                type='email'
                                className='form-control'
                                id='inputEmail'
                                placeholder={'common:email'}
                                onChange={this._updateUserField('email')}
                                value={user.email}
                              />
                            </div>
                            <div className='form-group'>
                              <div className='form-check'>
                                <input
                                  id='checkbox'
                                  type='checkbox'
                                  className='form-check-input'
                                  checked={!!user.emailVerified}
                                  onChange={this._updateUserField(
                                    'emailVerified'
                                  )}
                                />
                                <label
                                  className='form-check-label'
                                  htmlFor='checkbox'
                                >
                                  {'admin:emailVerified'}
                                </label>
                              </div>
                            </div>
                            <button
                              className='btn btn-primary'
                              disabled={saving}
                            >
                              {'common:save'}
                            </button>
                          </form>
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

  _submit = async e => {
    e.preventDefault()

    this.setState({ saving: true })
    try {
      await userService.updateUser(this.state.user)
      toastr.success('common:saved')
    } catch (e) {
      toastr.error(e.message)
    } finally {
      this.setState({ saving: false })
    }
  }

  _updateUserField = field => e => {
    switch (e.target.type) {
      case 'checkbox': {
        this.setState({
          user: { ...this.state.user, [field]: e.target.checked }
        })
        break
      }
      default: {
        this.setState({ user: { ...this.state.user, [field]: e.target.value } })
      }
    }
  }
}

export default adminOnly(AdminEditUserPage)
