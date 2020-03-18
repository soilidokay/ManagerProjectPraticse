import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Router } from '../../common/routes'
import { isAdmin } from '../../common/models/User'
import authRedux from '../redux/authRedux'
import { withI18next } from '../hocs/withI18next'
import { authService, applyAccessToken } from '../services'
import '../scss/landing/index.scss'

const guestOnly = Content => {
  const mapStateToProps = state => ({
    currentUser: state.auth.user
  })
  const TranslatableContent = withI18next(['common'])(Content)

  class GuestWrapper extends React.Component {
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
        if (!req.signedCookies.access_token) return initialProps

        applyAccessToken(req.signedCookies.access_token)
        const user = await authService.getLoginUser()

        if (user) {
          res.redirect(isAdmin(user) ? '/admin' : '/')
          res.end()
        }

        store.dispatch(authRedux.updateUser(user))
      } else {
        const user = store.getState().auth.user
        if (user) Router.push(isAdmin(user) ? '/admin' : '/')
      }

      return initialProps
    }

    render () {
      return <TranslatableContent />
    }
  }

  return compose(
    connect(mapStateToProps),
    withI18next(['common'])
  )(GuestWrapper)
}

export default guestOnly
