import React from 'react'
import Head from 'next/head'
import toastr from 'toastr'
import adminOnly from '../../hocs/adminOnly'
import { userService } from '../../services'
import { Router, Link } from '../../../common/routes'
import AuthService from '../../services/AuthService'

class AdminCreateUserPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: { name: '', email: '', password: '' },
      saving: false
    }
  }

  render () {
    const { user, saving } = this.state
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - {'admin:createUser'}</title>
        </Head>
        <section className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-6'>
                <h1>{'admin:createUser'}</h1>
              </div>
              <div className='col-sm-6'>
                <ol className='breadcrumb float-sm-right'>
                  <li className='breadcrumb-item'>
                    <Link route='/admin'>
                      <a>{'common:home'}</a>
                    </Link>
                  </li>
                  <li className='breadcrumb-item active'>
                    {'admin:createUser'}
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
                  <div className='card-header'>
                    <span className='card-title'>{'admin:createUserForm'}</span>
                  </div>
                  <div className='card-body'>
                    <section className='content'>
                      <div className='row'>
                        <div className='col-12'>
                          <form role='form' onSubmit={this._submit}>
                            <div className='form-group'>
                              <label htmlFor='name'>{'admin:name'}</label>
                              <input
                                type='text'
                                className='form-control'
                                id='name'
                                placeholder={'admin:name'}
                                onChange={this._updateUserField('name')}
                                value={user.name}
                              />
                            </div>
                            <div className='form-group'>
                              <label htmlFor='email'>{'common:email'}</label>
                              <input
                                type='email'
                                className='form-control'
                                id='email'
                                placeholder={'common:email'}
                                onChange={this._updateUserField('email')}
                                value={user.email}
                              />
                            </div>
                            <div className='form-group'>
                              <label htmlFor='password'>
                                {'common:password'}
                              </label>
                              <input
                                type='password'
                                className='form-control'
                                id='password'
                                placeholder={'common:password'}
                                onChange={this._updateUserField('password')}
                                value={user.password}
                              />
                            </div>
                            <button
                              type='submit'
                              className='btn btn-primary'
                              disabled={saving}
                            >
                              {'common:create'}
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
      const {
        user: { name, email, password }
      } = this.state
      const user = await userService.createUser({ name, email, password })
      Router.pushRoute(`/admin/users/${user.id}/edit`)
    } catch (e) {
      let msg
      switch (e.code) {
        case AuthService.ERR_EMAIL_EXISTED: {
          msg = 'common:errEmailExisted'
          break
        }
        default: {
          msg = e.message
        }
      }
      this.setState({ saving: false })
      toastr.error(msg)
    }
  }

  _updateUserField = field => e =>
    this.setState({ user: { ...this.state.user, [field]: e.target.value } })
}

export default adminOnly(AdminCreateUserPage)
