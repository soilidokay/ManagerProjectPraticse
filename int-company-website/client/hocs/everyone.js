import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import Head from 'next/head'
import CookieConsent from 'react-cookie-consent'
import classnames from 'classnames'
import getConfig from 'next/config'
import { Link } from '../../common/routes'
import authRedux from '../redux/authRedux'
import { withI18next } from '../hocs/withI18next'
import { applyAccessToken, authService } from '../services'
import '../scss/landing/index.scss'

const { publicRuntimeConfig } = getConfig()
const BASE_URL = `${publicRuntimeConfig.BASE_URL}`

const everyone = (Content, options = { useDefaultNavBar: true }) => {
  const TranslatableContent = withI18next(['common'])(Content)

  class Wrapper extends React.Component {
    state = {
      showMobileSideBar: false
    }

    static async getInitialProps (ctx) {
      const { req, store, isServer } = ctx

      if (isServer) {
        applyAccessToken(req.signedCookies.access_token)
        const user = await authService.getLoginUser()
        store.dispatch(authRedux.updateUser(user))
      }

      return Content.getInitialProps ? Content.getInitialProps(ctx) : {}
    }

    render () {
      return (
        <div>
          <Head>
            <title>
              DayOne Teams - Outstanding modern web and mobile application
              development
            </title>
            <meta key='og:url' property='og:url' content={BASE_URL} />
            <meta
              key='og:title'
              property='og:title'
              content='DayOne Teams - Outstanding modern web and mobile application development'
            />
            <meta
              key='og:description'
              property='og:description'
              content='DayOne Teams is a professional software development and
                technology consultancy that help you at all stage of product
                development – from idea to implementation, support, scale &
                maintenance.'
            />
            <meta key='og:type' property='og:type' content='website' />
            <meta
              key='og:image'
              property='og:image'
              content={`${BASE_URL}/static/img/og-image.jpg`}
            />
            <meta
              key='twitter:card'
              name='twitter:card'
              content='summary_large_image'
            />
            <meta key='author' name='author' content='DayOne Teams' />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          </Head>
          {options.useDefaultNavBar && this._renderDefaultNavBar()}
          {this._renderMobileSideBar()}
          <TranslatableContent
            {...this.props}
            toggleMobileSideBar={this._toggleMobileSideBar}
          />
        {this._renderFooter()}
        </div>
      )
    }

    _renderDefaultNavBar = () => (
      <nav className='app-navbar navbar navbar-expand-md navbar-light bg-white sticky-top'>
        <div className='container'>
          <Link route='/'>
            <a className='navbar-brand'>
              <img src='/static/img/logos/dayone-logo.png' height='36' />
            </a>
          </Link>
          <button
            className='navbar-toggler'
            onClick={this._toggleMobileSideBar}
            type='button'
          >
            <span className='navbar-toggler-icon' />
          </button>
          <div className='collapse navbar-collapse'>
            <ul className='navbar-nav ml-auto'>
              <li className='nav-item align-self-center'>
                <Link route='/#services'>
                  <a href='/#services' className='nav-link px-3'>
                    SERVICES
                  </a>
                </Link>
              </li>
              <li className='nav-item align-self-center'>
                <Link route='/#technologies'>
                  <a href='/#technologies' className='nav-link px-3'>
                    TECHNOLOGY
                  </a>
                </Link>
              </li>
              <li className='nav-item align-self-center'>
                <Link route='/portfolio'>
                  <a className='nav-link px-3'>PORTFOLIO</a>
                </Link>
              </li>
              <li className='nav-item align-self-center'>
                <Link route='/#contact'>
                  <a href='/#contact' className='nav-link pl-3'>
                    <span className='btn nav-item-contact '>LET'S TALK</span>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )

    _renderMobileSideBar = () => (
      <div
        className={classnames('mobile-sidebar', {
          'side-animation': this.state.showMobileSideBar,
          'side-animation-off': !this.state.showMobileSideBar
        })}
      >
        <div className='mobile-sidebar__close-btn-wrapper'>
          <img className='' src='/static/img/logos/dayone-logo.png' height='36'/>
          <button
            className='navbar-toggler mobile-sidebar__close-btn'
            onClick={this._toggleMobileSideBar}
          >
            <i className='fa fa-times' />
          </button>
        </div>
        <ul className={`navbar-nav ml-auto navbar-nav--custom`}>
          <li
            className='nav-item ml-xl-5 ml-0 '
            onClick={this._toggleMobileSideBar}
          >
            <Link route='/#services'>
              <a href='/#services' className='nav-link text-white'>
                SERVICES
              </a>
            </Link>
          </li>
          <li
            className='nav-item ml-xl-5 ml-0'
            onClick={this._toggleMobileSideBar}
          >
            <Link route='/#technologies'>
              <a href='#technologies' className='nav-link text-white'>
                TECHNOLOGY
              </a>
            </Link>
          </li>
          <li
            className='nav-item ml-xl-5 ml-0 '
            onClick={this._toggleMobileSideBar}
          >
            <Link route='/portfolio'>
              <a className='nav-link text-white'>PORTFOLIO</a>
            </Link>
          </li>
          <li
            className='nav-item ml-xl-5 ml-0 '
            onClick={this._toggleMobileSideBar}
          >
            <Link route='/carrer'>
              <a className='nav-link text-white'>CARRER</a>
            </Link>
          </li>
          <li
            className='nav-item ml-xl-5 ml-0 '
            onClick={this._toggleMobileSideBar}
          >
            <Link route='/#contact'>
              <a href='#contact' className='nav-link text-white'>
                <span className='btn nav-item-contact '>LET'S TALK</span>
              </a>
            </Link>
          </li>
        </ul>
      </div>
    )

    _renderFooter = () => {
      return (
        <footer id='footer'>
          <div className='footer-navigation'>
            <div className='footer-content'>
              <div className='footer-item'>
              <h5>Use Cases</h5>
                      <ul className='list-unstyled'>
                        <Link route=''>
                          <a className='text-white'>
                            <li className='py-2'>Data Mapping</li>
                          </a>
                        </Link>
                        <Link route='/#technologies'>
                          <a className='text-white'>
                            <li className='py-2'>Subject Requests</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'>Consent Management</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'>Access Control</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'>Impact Assessments</li>
                          </a>
                        </Link>
                      </ul>
              </div>
              <div className='footer-item'>
              <h5>Developers</h5>
                      <ul className='list-unstyled'>
                        <Link route=''>
                          <a className='text-white'>
                            <li className='py-2'>Documentation</li>
                          </a>
                        </Link>
                        <Link route='/#technologies'>
                          <a className='text-white'>
                            <li className='py-2'>API Reference</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'>Regulations</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'>CCPA</li>
                          </a>
                        </Link>
                      </ul>
              </div>
              <div className='footer-item'>
                <h5>About Us</h5>
                      <ul className='list-unstyled'>
                        <Link route=''>
                          <a className='text-white'>
                            <li className='py-2'>Who We Are</li>
                          </a>
                        </Link>
                        <Link route='/#technologies'>
                          <a className='text-white'>
                            <li className='py-2'>Jobs</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'>Partner Program</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'> News 	&amp; Blog</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'>Privacy.dev</li>
                          </a>
                        </Link>
                      </ul>
              </div>
              <div className='footer-item'>
              <h5>Resources</h5>
                      <ul className='list-unstyled'>
                        <Link route=''>
                          <a className='text-white'>
                            <li className='py-2'>Pricing</li>
                          </a>
                        </Link>
                        <Link route='/#technologies'>
                          <a className='text-white'>
                            <li className='py-2'>Support</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'>Contact Us</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='py-2'>Privacy Policy</li>
                          </a>
                        </Link>
                      </ul>
              </div>
            </div>
           </div>
          <div className='contact-info'>
                <div className='container'>
                  <div className='row'>
                    <div className='col-md-6 col-12 '>
                    <span className='copyright'>
                          {`Copyright © ${new Date().getFullYear()}. All rights reserved. DayoneTeams.com`}
                  </span>
                    </div>
                    <div className='col-md-6 col-12 text-md-right text-center'>
                    <ul className='list-unstyled contact-info--list'>
                        <li className='pr-3'>
                          <a href=''>
                            <i class="fab fa-linkedin contact-linkedin" aria-hidden="true"></i> 
                          </a>
                        </li>
                        <li className='pr-3'>
                          <a href=''>
                            <i class="fab fa-facebook-square contact-facebook"></i>
                          </a>
                        </li>
                        <li className='pr-3'>
                          <a href=''>
                            <i class="fab fa-twitter contact-twitter"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  </div>
                </div>
           {/* <CookieConsent
            disableStyles
            buttonClasses='btn btn-sm btn-primary'
            containerClasses='alert alert-info mb-0 col-lg-12'
            contentStyle={{ flex: '1 1 auto', maxWidth: '100%' }}
            style={{
              zIndex: 999,
              display: 'flex',
              flexWrap: 'wrap',
              textAlign: 'left'
            }}
          >
            We use cookies to enable website functionality and understand the
            performance of our site.
          </CookieConsent>  */}
           {/* <div className='col-6 pr-3'>
                  <h4>DayOne - Let's Go!</h4>
                  <div className='mb-5'>
                    DayOne is a full-service technology agency designing and
                    building state-of-the-art digital products from strategy,
                    design, and development
                  </div>
                  <span className='copyright'>
                    {`DayOne, LLC © ${new Date().getFullYear()} All rights reserved.`}
                  </span>
                </div> */}
                {/* <div className='col-6'>
                  <div className='row no-gutters'>
                    <div className='col-6'>
                      <h5>Portfolio</h5>
                      <ul className='list-unstyled'>
                        <Link route='/#services'>
                          <a className='text-white'>
                            <li className='p-2'>Our Services</li>
                          </a>
                        </Link>
                        <Link route='/#technologies'>
                          <a className='text-white'>
                            <li className='p-2'>Technology</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='p-2'>Blog</li>
                          </a>
                        </Link>
                      </ul>
                    </div> */}

                    
                    {/* <div className='col-6'>
                      <h5>Company</h5>
                      <ul className='list-unstyled'>
                        <Link route='/#about'>
                          <a className='text-white'>
                            <li className='p-2'>About Us</li>
                          </a>
                        </Link>
                        <Link route='/privacy-policy'>
                          <a className='text-white'>
                            <li className='p-2'>Privacy Policy</li>
                          </a>
                        </Link>
                      </ul>
                    </div>
                  </div>
                </div> */}
        </footer>
      )
    }

    _toggleMobileSideBar = () =>
      this.setState({
        showMobileSideBar: !this.state.showMobileSideBar
      })
  }

  const mapStateToProps = state => ({
    currentUser: state.auth.user
  })
  return compose(
    connect(mapStateToProps),
    withRouter,
    withI18next(['common'])
  )(Wrapper)
}

export default everyone
