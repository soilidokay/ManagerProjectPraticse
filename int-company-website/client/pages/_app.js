import React from 'react'
import { compose } from 'redux'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import withRedux from 'next-redux-wrapper'
import { I18n as I18nR } from 'react-i18next'
import { makeStore } from '../redux/store'
import i18n from '../../common/i18n'
import nprogress from '../hocs/nprogress'
import '../scss/common.scss'

class ComposedApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    return {
      pageProps: Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}
    }
  }

  render () {
    const { Component, pageProps, store } = this.props
    return (
      <Container>
        <Provider store={store}>
          <I18nR ns='common' i18n={(pageProps && pageProps.i18n) || i18n}>
            {t => <Component {...pageProps} />}
          </I18nR>
        </Provider>
      </Container>
    )
  }
}

export default compose(
  nprogress(300, { showSpinner: false }),
  withRedux(makeStore)
)(ComposedApp)
