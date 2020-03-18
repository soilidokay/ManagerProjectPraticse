import React, { Component } from 'react'
// import moment from 'moment'
import { connect } from 'react-redux'
import { compose } from 'redux'
// import className from 'classnames'
import { Link } from '../../common/routes'
import { blogService } from '../services'
import everyone from '../hocs/everyone'
import { getCreatedDateStr, getShortDesc } from '../view-models/Blog'

// const ARRAY_MOCKUP_INTRO = [1, 2, 3]
// const ARRAY_MOCKUP_CONTENT = [1, 2, 3, 4, 5, 6, 7]
// const ARRAY_MOCKUP_POPULAR = [1, 2, 3, 4, 5]

class BlogHomePage extends Component {
  static async getInitialProps ({ query }) {
    const page = query.page ? parseInt(query.page) : 1
    const { blogs, nPage } = await blogService.getBlogsForPublic(page - 1)
    return { blogs, page, nPage }
  }

  constructor (props) {
    super(props)
    this.state = {
      navbarAnimation: false
    }
  }

  render () {
    // const page = this.props.page
    // const nPage = this.props.nPage
    const { blogs } = this.props

    return (
      <div className='blog-home-page' id='blog-home-page'>
        {/* <header className='container'> */}
        {/*  /!* Navbar *!/ */}
        {/*  <nav */}
        {/*    className='navbar navbar-expand-lg navbar-light m-auto' */}
        {/*    id='mainNav' */}
        {/*    style={{ maxWidth: '1200px' }} */}
        {/*  > */}
        {/*    <div className='container'> */}
        {/*      <a> */}
        {/*        <img */}
        {/*          src='/static/img/blog/logo.png' */}
        {/*          className='rounded float-left my-1' */}
        {/*          height='36' */}
        {/*        /> */}
        {/*      </a> */}
        {/*      <button */}
        {/*        className='navbar-toggler' */}
        {/*        // data-toggle='collapse' */}
        {/*        // data-target='#collapsibleNavId' */}
        {/*        onClick={() => */}
        {/*          this.setState({ */}
        {/*            navbarAnimation: !this.state.navbarAnimation */}
        {/*          }) */}
        {/*        } */}
        {/*        type='button' */}
        {/*      > */}
        {/*        <span className='navbar-toggler-icon' /> */}
        {/*      </button> */}
        {/*      <div */}
        {/*        className={` navbar-collapse  ${ */}
        {/*          this.state.navbarAnimation */}
        {/*            ? 'side-animation' */}
        {/*            : 'side-animation-off' */}
        {/*        }`} */}
        {/*        id='collapsibleNavId' */}
        {/*      > */}
        {/*        <ul */}
        {/*          className={`navbar-nav ml-auto navbar-nav--custom`} */}
        {/*          id='toogleByNavIcon' */}
        {/*        > */}
        {/*          <li className='nav-item ml-xl-5 ml-0 align-self-center'> */}
        {/*            <a */}
        {/*              href='#services' */}
        {/*              className='nav-link text-white js-scroll-trigger' */}
        {/*            > */}
        {/*              Home */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className='nav-item ml-xl-5 ml-0 align-self-center'> */}
        {/*            <a */}
        {/*              href='#technologies' */}
        {/*              className='nav-link text-white js-scroll-trigger' */}
        {/*            > */}
        {/*              Technology */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className='nav-item ml-xl-5 ml-0 align-self-center'> */}
        {/*            <a href='#' className='nav-link text-white'> */}
        {/*              Development */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className='nav-item ml-xl-5 ml-0 align-self-center mr-xl-4 mr-0'> */}
        {/*            <a href='#' className='nav-link text-white'> */}
        {/*              Tools & Tips */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li> */}
        {/*            <div className='input-group'> */}
        {/*              <div className='input-group-prepend'> */}
        {/*                <span */}
        {/*                  className='input-group-text blog_search' */}
        {/*                  id='basic-addon1' */}
        {/*                > */}
        {/*                  <i className='fa fa-search' aria-hidden='true' /> */}
        {/*                </span> */}
        {/*              </div> */}
        {/*              <input */}
        {/*                type='text' */}
        {/*                className='form-control' */}
        {/*                placeholder='Username' */}
        {/*                aria-label='Username' */}
        {/*                aria-describedby='basic-addon1' */}
        {/*              /> */}
        {/*            </div> */}
        {/*          </li> */}
        {/*        </ul> */}
        {/*      </div> */}
        {/*    </div> */}
        {/*  </nav> */}
        {/* </header> */}
        <div className='content-blog container pt-3'>
          {/* <div className='intro-blog mt-3 container'> */}
          {/*  <div className='row'> */}
          {/*    <div className='col-xl-6 col-12 pr-0 pl-0'> */}
          {/*      <img src='./../static/img/blog/hot-new.png' className='w-100' /> */}
          {/*      <div className='date-post'> */}
          {/*        Development <small className='text-muted'>Sep 5, 2019</small> */}
          {/*      </div> */}
          {/*      <div className='title'> */}
          {/*        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum */}
          {/*        vitae ut neque ornare tempus consequat morbi condimentum */}
          {/*        nullam. Massa. */}
          {/*      </div> */}
          {/*      <small className='text-muted'> */}
          {/*        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus */}
          {/*        condimentum nunc magna etiam pellentesque semper massa justo */}
          {/*        sapien.{' '} */}
          {/*      </small> */}
          {/*    </div> */}
          {/*    <div className='col-xl-6 col-12 pl-0'> */}
          {/*      {ARRAY_MOCKUP_INTRO.map((item, index) => ( */}
          {/*        <div className='col-12 mb-4' key={index}> */}
          {/*          <div className='row'> */}
          {/*            <div className='col-xl-4 col-12'> */}
          {/*              <img src='./../static/img/blog/hot-sub.png' /> */}
          {/*            </div> */}
          {/*            <div className='col-xl-8 col-12 pl-xl-0 pl-3'> */}
          {/*              <div className='title'> */}
          {/*                Risus et tincidunt nec ac dolor. */}
          {/*              </div> */}
          {/*              <div className='date-post'> */}
          {/*                Development{' '} */}
          {/*                <small className='text-muted'>Sep 5, 2019</small> */}
          {/*              </div> */}
          {/*              <small className='text-muted'> */}
          {/*                Lorem ipsum dolor sit amet, consectetur adipiscing */}
          {/*                elit. Purus condimentum nunc magna etiam pellentesque */}
          {/*                semper massa justo sapien. */}
          {/*              </small> */}
          {/*            </div> */}
          {/*          </div> */}
          {/*        </div> */}
          {/*      ))} */}
          {/*    </div> */}
          {/*  </div> */}
          {/* </div> */}
          {/* <hr /> */}
          <div className='main-stream'>
            <div className='row'>
              <div className='col-12'>
                {blogs.map((blog, index) => (
                  <div className='blog-item row' key={index}>
                    <div className='col-8 my-3 d-flex flex-column'>
                      <Link route={`/blog/${blog.name}`}>
                        <div className='u__cursor--pointer flex-grow-1'>
                          <h4 className='title-blog'>{blog.title}</h4>
                          <small className='text-muted'>
                            {getShortDesc(blog.content)}
                          </small>
                        </div>
                      </Link>
                      <div className='text-right'>
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
                    <div className='col-4 my-3'>
                      <Link route={`/blog/${blog.name}`}>
                        <img
                          src={blog.featuredImageUrl}
                          className='u__cursor--pointer img-fluid'
                        />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className='col-xl-4 col-12'> */}
              {/*  <h2 style={{ color: '#003866' }}>Popupar</h2> */}
              {/*  <hr /> */}
              {/*  {ARRAY_MOCKUP_POPULAR.map((item, index) => ( */}
              {/*    <div key={index} className='mt-2'> */}
              {/*      <div className='text-center'> */}
              {/*        <img */}
              {/*          src='./../static/img/blog/popular-mockup.png' */}
              {/*          className='text-center' */}
              {/*        /> */}
              {/*      </div> */}
              {/*      <div className='title-blog'> */}
              {/*        Risus et tincidunt nec ac dolor. */}
              {/*      </div> */}
              {/*      <div className='date-post-blog'> */}
              {/*        Development{' '} */}
              {/*        <small className='text-muted'>Sep 5, 2019</small> */}
              {/*      </div> */}
              {/*      <small className='text-muted'> */}
              {/*        Lorem ipsum dolor sit amet, consectetur adipiscing elit. */}
              {/*      </small> */}
              {/*    </div> */}
              {/*  ))} */}
              {/* </div> */}
            </div>
          </div>
        </div>
        {/* <div className='nav-scroller py-1 mb-2'>
          <nav className='nav d-flex justify-content-between'>
            <a className='p-3 text-muted'>Technical</a>
          </nav>
        </div> */}

        {/* <div className='row mb-2'>
          {this.props.blogs.map(blog => (
            <div key={blog.id} className='col-md-6 mb-3'>
              <Link route={`/blog/${blog.name}`}>
                <a className='blog-card row no-gutters border rounded flex-md-row h-100 shadow-sm'>
                  <div className='col p-4 d-flex flex-column position-static'>
                    <strong className='d-inline-block mb-2 text-primary'>
                    </strong>
                    <h4>{blog.title} </h4>
                    <div className='mb-1 text-muted'>
                      {moment(blog.createdAt).format('MMM Do')}
                    </div>
                    <p className='mb-auto'>
                    </p>
                  </div>
                  {blog.featuredImageUrl && (
                    <div className='col-auto d-none d-md-block'>
                      <div className='h-100 d-flex flex-row align-items-center'>
                        <img
                          src={blog.featuredImageUrl}
                          style={{ width: '200px' }}
                        />
                      </div>
                    </div>
                  )}
                </a>
              </Link>
            </div>
          ))}
        </div> */}
        {/*  <div className='text-right'>
          <Link route={page >= 3 ? `/blog?page=${page - 1}` : '/blog'}>
            <a
              className={className('btn btn-outline-primary mr-2', {
                'd-none': page === 1
              })}
            >
              <i className='fa fa-arrow-left' />
              &nbsp;Previous
            </a>
          </Link>
          <Link route={`/blog?page=${page + 1}`}>
            <a
              className={className('btn btn-outline-primary mr-2', {
                'd-none': page === nPage
              })}
            >
              Next&nbsp;
              <i className='fa fa-arrow-right' />
            </a>
          </Link>
        </div> */}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
})

export default compose(
  everyone,
  connect(mapStateToProps)
)(BlogHomePage)
