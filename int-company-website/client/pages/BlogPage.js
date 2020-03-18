import React, { Component } from 'react'
import Error from 'next/error'
import Head from 'next/head'
import { connect } from 'react-redux'
import { compose } from 'redux'
import getConfig from 'next/config'
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton
} from 'react-share'
import { blogService } from '../services'
import everyone from '../hocs/everyone'
import { getCreatedDateStr, getShortDesc } from '../view-models/Blog'

const { publicRuntimeConfig } = getConfig()
const BASE_URL = `${publicRuntimeConfig.BASE_URL}`

class BlogPage extends Component {
  static async getInitialProps ({ query }) {
    const blogTarget = await blogService.getBlogByName(query.name)

    return { blogTarget }
  }

  constructor (props) {
    super(props)
    this.state = {
      scrolled: 0,
      intervalId: 0
    }
  }

  render () {
    const blog = this.props.blogTarget

    if (!blog) {
      return <Error statusCode={404} />
    }

    const shortDesc = getShortDesc(blog.content)

    return (
      <div className='blog-page' id='blog-page'>
        <Head>
          <title>{blog.title}</title>
          <meta
            key='og:url'
            property='og:url'
            content={`${BASE_URL}/blog/${blog.name}`}
          />
          <meta key='og:title' property='og:title' content={blog.title} />
          <meta key='og:type' property='og:type' content='article' />
          <meta
            key='og:description'
            property='og:description'
            content={shortDesc}
          />
          <meta
            key='og:image'
            property='og:image'
            content={
              blog.featuredImageUrl || `${BASE_URL}/static/img/og-image.jpg`
            }
          />
          <link rel='stylesheet' href='/static/css/vendor/prism.css' />
        </Head>
        <div className='progress-container'>
          <div
            className='progress-bar'
            style={{ width: this.state.scrolled }}
          />
        </div>
        <button
          onClick={this._backToTop}
          className='btn back-to-top'
          type='button'
          id='backTop'
        >
          <i className='fas fa-arrow-alt-circle-up fa-3x' />
        </button>
        <div className='container blog-container'>
          <div className='text-center pt-5'>
            <h1 className='text-uppercase'>{blog.title}</h1>
            {blog.featuredImageUrl && (
              <img
                className='blog-feature-image mb-3 w-100'
                src={blog.featuredImageUrl}
              />
            )}
          </div>
          <div className='blog-content'>
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            <div className='text-right mt-5'>
              {blog.tags.map(tag => (
                <span key={tag.value} className='text-primary ml-2'>
                  {tag.label}
                </span>
              ))}
              <small className='text-muted px-3'>&bull;</small>
              <small className='text-muted'>
                {getCreatedDateStr(blog.createdAt)}
              </small>
            </div>
          </div>
          <div className='text-center mt-3'>
            <ul className='list-inline social-buttons'>
              <li className='list-inline-item twitter'>
                <TwitterShareButton
                  url={`${BASE_URL}/blog/${blog.name}`}
                  title={blog.title}
                  className='share-button'
                >
                  <TwitterIcon size={45} round />
                </TwitterShareButton>
              </li>
              <li className='list-inline-item'>
                <FacebookShareButton
                  url={`${BASE_URL}/blog/${blog.name}`}
                  quote={blog.title}
                  className='share-button'
                >
                  <FacebookIcon size={45} round />
                </FacebookShareButton>
              </li>
              <li className='list-inline-item'>
                <LinkedinShareButton
                  url={`${BASE_URL}/blog/${blog.name}`}
                  className='share-button'
                >
                  <LinkedinIcon size={45} round />
                </LinkedinShareButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount () {
    window.addEventListener('scroll', this._scrollProgress)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this._scrollProgress)
  }

  _scrollProgress = () => {
    const scrollPx = document.documentElement.scrollTop
    const winHeightPx =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const scrolled = `${(scrollPx / winHeightPx) * 100}%`
    this.setState({ scrolled })
  }

  _scrollStep = () => {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId)
    }
    window.scroll(0, window.scrollY - '50')
  }

  _backToTop = () => {
    const intervalId = setInterval(this._scrollStep, '19.09')
    this.setState({ intervalId })
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
})

export default compose(
  everyone,
  connect(mapStateToProps)
)(BlogPage)
