import React from 'react'
import Head from 'next/head'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { Link, Router } from '../../common/routes'
import { isAdmin } from '../../common/models/User'
import authRedux from '../redux/authRedux'
import { withI18next } from '../hocs/withI18next'
import { applyAccessToken, authService } from '../services'

const userOnly = Content => {
  const TranslatableContent = withI18next(['user', 'common'])(Content)

  class UserWrapper extends React.Component {
    static async getInitialProps ({
      req,
      res,
      pathname,
      query,
      asPath,
      store,
      isServer
    }) {
      const initialProps = Content.getInitialProps
        ? await Content.getInitialProps({
          req,
          res,
          pathname,
          query,
          asPath,
          store,
          isServer
        })
        : {}
      if (isServer) {
        applyAccessToken(req.signedCookies.access_token)
        const user = await authService.getLoginUser()

        if (!user || isAdmin(user)) {
          res.redirect('/login')
          res.end()
        }

        store.dispatch(authRedux.updateUser(user))
      } else {
        const user = store.getState().auth.user
        if (!user || isAdmin(user)) Router.push('/login')
      }
      return initialProps
    }

    constructor (props) {
      super(props)
      this.state = {
        holdTransition: true,
        showUserDropdown: false,
        showSideBar: true
      }
    }

    render () {
      const { currentUser } = this.props

      if (!currentUser) return null

      return (
        <div className='wrapper'>
          <Head>
            <title>{'common:home'}</title>
            <link
              href='https://unpkg.com/ionicons@4.4.2/dist/css/ionicons.min.css'
              rel='stylesheet'
            />
          </Head>
          {this._renderNavBar()}
          <main className='py-md-3'>
            <TranslatableContent />
          </main>
          <footer className='app-footer text-muted'>
            <div className='container-fluid p-3 p-md-5'>
              <ul className='bd-footer-links'>
                <li>
                  <a href='https://bitbucket.org/designveloper/freelancer-website'>
                    Bitbucket
                  </a>
                </li>
                <li>
                  <a href='https://designveloper.com'>About</a>
                </li>
              </ul>
              <p>
                Designed and built with all the love in the world by
                Designveloper
              </p>
            </div>
          </footer>
        </div>
      )
    }

    _renderNavBar = () => {
      const { currentUser } = this.props

      return (
        <header className='app-navbar navbar navbar-expand navbar-dark flex-column flex-md-row'>
          <div className='navbar-nav-scroll'>
            <ul className='navbar-nav bd-navbar-nav flex-row'>
              <li className='nav-item'>
                <Link route='/'>
                  <a className='nav-link active'>{'common:home'}</a>
                </Link>
              </li>
            </ul>
          </div>
          <ul className='navbar-nav flex-row ml-md-auto d-none d-md-flex'>
            <li className='nav-item dropdown'>
              <UncontrolledDropdown>
                <DropdownToggle id='btnUserDropdown' tag='span'>
                  <div className='u-clickable image rounded-circle avatar'>
                    <img
                      src={
                        currentUser.avatar ||
                        'https://jetsport.com.au/assets/backend/images/default-avatar.png'
                      }
                      className='small-avatar'
                      alt='Avatar'
                    />
                  </div>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem id='lbUserName' header>
                    {currentUser.name || currentUser.email}
                  </DropdownItem>
                  <DropdownItem divider />
                  <Link
                    route={
                      isAdmin(currentUser)
                        ? '/admin/my/settings'
                        : '/my/settings'
                    }
                  >
                    <a className='dropdown-item text-dark'>
                      {'common:settings'}
                    </a>
                  </Link>
                  <DropdownItem divider />
                  <DropdownItem
                    id='btnLogout'
                    onClick={this._logout}
                    className='u-clickable'
                  >
                    {'common:logout'}
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </li>
          </ul>
        </header>
      )
    }

    _logout = async () => {
      await this.props.dispatch(authRedux.logout())
      Router.replaceRoute('/login')
    }
  }

  const mapStateToProps = state => ({
    currentUser: state.auth.user
  })
  return compose(
    connect(mapStateToProps),
    withRouter,
    withI18next(['user', 'common'])
  )(UserWrapper)
}

export default userOnly
