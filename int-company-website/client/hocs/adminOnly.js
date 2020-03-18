import React from 'react'
import Head from 'next/head'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { Router, Link } from '../../common/routes'
import { isAdmin } from '../../common/models/User'
import authRedux from '../redux/authRedux'
import { withI18next } from '../hocs/withI18next'
import { authService, applyAccessToken } from '../services'
import '../../client/scss/admin.scss'

const adminOnly = Content => {
  const TranslatableContent = withI18next(['admin', 'common'])(Content)

  class AdminWrapper extends React.Component {
    static async getInitialProps (ctx) {
      const { req, res, store, isServer } = ctx
      const composedProps = Content.getInitialProps
        ? await Content.getInitialProps(ctx)
        : {}

      if (isServer) {
        applyAccessToken(req.signedCookies.access_token)
        const user = await authService.getLoginUser()

        if (!user || !isAdmin(user)) {
          res.redirect('/admin/login')
          res.end()
        }

        store.dispatch(authRedux.updateUser(user))
      } else {
        const user = store.getState().auth.user
        if (!user || !isAdmin(user)) Router.push('/admin/login')
      }

      return composedProps
    }

    constructor (props) {
      super(props)
      this.state = {
        holdTransition: true,
        showUserDropdown: false,
        showSideBar: true
      }
    }

    async componentDidMount () {
      setTimeout(() => this.setState({ holdTransition: false }), 100)
    }

    render () {
      const { currentUser } = this.props

      if (!currentUser) return null

      const { holdTransition, showSideBar } = this.state

      const sideBarClass =
        (holdTransition ? 'hold-transition ' : '') +
        'sidebar-mini ' +
        `${showSideBar ? 'sidebar-open' : 'sidebar-collapse'}`

      return (
        <div className={sideBarClass}>
          <Head>
            <title>Admin - Home</title>
            <link
              rel='stylesheet'
              href='/static/css/vendor/admin-lte3.min.css'
            />
            <link
              rel='stylesheet'
              href='https://unpkg.com/react-table@6.8.6/react-table.css'
            />
            <link
              href='https://unpkg.com/ionicons@4.4.2/dist/css/ionicons.min.css'
              rel='stylesheet'
            />
            <script
              src='https://code.jquery.com/jquery-3.3.1.min.js'
              integrity='sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8='
              crossOrigin='anonymous'
            />
            <script src='https://cloud.tinymce.com/5/tinymce.min.js' />
          </Head>
          <div className='wrapper'>
            {this._renderNavBar()}
            {this._renderSideBar()}
            <TranslatableContent {...this.props} />
            <footer className='main-footer'>
              <strong>
                {'copyRight'} © 2018{' '}
                <a href='http://www.dayoneteams.com'>DayOne Teams</a>.
              </strong>
              &nbsp;{'allRightsReserved'}.
            </footer>
            <div id='sidebar-overlay' />
          </div>
        </div>
      )
    }

    _renderNavBar = () => {
      const { currentUser } = this.props

      return (
        <nav className='main-header navbar navbar-expand bg-white navbar-light border-bottom'>
          {/* Left navbar links */}
          <ul className='navbar-nav'>
            <li className='nav-item' onClick={this._toggleSideBar}>
              <a className='u-clickable nav-link' data-widget='pushmenu'>
                <i className='fa fa-bars' />
              </a>
            </li>
          </ul>
          {/* Right navbar links */}
          <ul className='navbar-nav ml-auto'>
            {/* User dropdown menu */}
            <li className='nav-item dropdown'>
              <UncontrolledDropdown>
                <DropdownToggle id='btnUserDropdown' tag='span'>
                  <span className='u__cursor--pointer'>
                    {currentUser.name || currentUser.email}
                  </span>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem divider />
                  <Link route='/admin/my/settings'>
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
        </nav>
      )
    }

    _renderSideBar = () => {
      return (
        <aside className='main-sidebar sidebar-dark-primary elevation-4'>
          {/* Brand Logo */}
          <Link route='/admin'>
            <a className='brand-link'>
              <img
                src='https://adminlte.io/themes/dev/AdminLTE/dist/img/AdminLTELogo.png'
                alt='AdminLTE Logo'
                className='brand-image img-circle elevation-3'
                style={{ opacity: '.8' }}
              />
              <span className='brand-text font-weight-light'>
                Administration
              </span>
            </a>
          </Link>
          {/* Sidebar */}
          <div className='sidebar'>
            {/* Sidebar Menu */}
            <nav className='mt-2'>
              <ul
                className='nav nav-pills nav-sidebar flex-column'
                data-widget='treeview'
                role='menu'
                data-accordion='false'
              >
                {/* Add icons to the links using the .nav-icon class with font-awesome or any other icon font library */}
                <li className='nav-header'>{'admin:management'}</li>
                <li className='nav-item'>
                  <Link route='/admin'>
                    <a
                      className={`nav-link ${this._sideBarStatusClass(
                        '/admin'
                      )}`}
                    >
                      <i className='nav-icon fa fa-th' />
                      <p>{'admin:dashboard'}</p>
                    </a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link route='/admin/users'>
                    <a
                      id='linkUserManagement'
                      className={`nav-link ${this._sideBarStatusClass(
                        '/admin/users'
                      )}`}
                    >
                      <i className='nav-icon fa fa-users' />
                      <p>{'admin:userManagement'}</p>
                    </a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link route='/admin/roles'>
                    <a
                      className={`nav-link ${this._sideBarStatusClass(
                        '/admin/roles'
                      )}`}
                    >
                      <i className='nav-icon fa fa-hand-paper' />
                      <p>{'admin:roleManagement'} (todo)</p>
                    </a>
                  </Link>
                </li>
                <li className='nav-header'>{'admin:blog'}</li>
                <li className='nav-item'>
                  <Link route='/admin/blogs'>
                    <a
                      className={`nav-link ${this._sideBarStatusClass(
                        '/admin/blogs'
                      )}`}
                    >
                      <i className='nav-icon fa fa-blog' />
                      <p>Blogs</p>
                    </a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link route='/admin/blogtags'>
                    <a
                      className={`nav-link ${this._sideBarStatusClass(
                        '/admin/blogtags'
                      )}`}
                    >
                      <i className='nav-icon fas fa-tags' />
                      <p>Blog Tags</p>
                    </a>
                  </Link>
                </li>
                <li className='nav-header'>{'admin:configuration'}</li>
                <li className='nav-item'>
                  <Link route='/admin/configurations/email'>
                    <a
                      className={`nav-link ${this._sideBarStatusClass(
                        '/admin/configurations/email'
                      )}`}
                    >
                      <i className='nav-icon fa fa-envelope' />
                      <p>{'admin:emailSettings'}</p>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* /.sidebar-menu */}
          </div>
          {/* /.sidebar */}
        </aside>
      )
    }

    _toggleSideBar = () =>
      this.setState({ showSideBar: !this.state.showSideBar })

    _sideBarStatusClass = path =>
      this.props.router.asPath === path ? 'active' : ''

    _logout = async () => {
      await this.props.dispatch(authRedux.logout())
      Router.replaceRoute('/admin/login')
    }
  }

  const mapStateToProps = state => ({
    currentUser: state.auth.user
  })
  return compose(
    connect(mapStateToProps),
    withRouter,
    withI18next(['admin', 'common'])
  )(AdminWrapper)
}

export default adminOnly
