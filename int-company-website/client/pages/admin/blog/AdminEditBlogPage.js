import React from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { Popover, PopoverBody } from 'reactstrap'
import Head from 'next/head'
import Router from 'next/router'
import toastr from 'toastr'
import getConfig from 'next/config'
import { Editor } from '@tinymce/tinymce-react'
import adminOnly from '../../../hocs/adminOnly'
import { blogService } from '../../../services'
import { ALLOW_FILE_TYPE } from '../../../../common/models/Container'
import { Status } from '../../../../common/models/Blog'

const { publicRuntimeConfig } = getConfig()
const BASE_URL = `${publicRuntimeConfig.BASE_URL}`
const Tags = makeAnimated()

class AdminEditBlogPage extends React.Component {
  static async getInitialProps ({ asPath, query }) {
    const tags = await blogService.getBlogTags()
    if (asPath === '/admin/blogs/create') {
      return { tags }
    }
    const editBlog = await blogService.getBlogById(query.id)
    return { editBlog, tags }
  }

  constructor (props) {
    super(props)
    const blog = props.editBlog || {
      title: '',
      content: '',
      status: Status.DRAFT,
      name: '',
      featuredImageUrl: null,
      tags: null
    }
    this.state = {
      blog,
      saving: false,
      showSetLinkPopover: false,
      setLinkUrl: ''
    }
  }

  render () {
    const { blog, saving, setLinkUrl } = this.state
    const options = this.props.tags.map(tag => ({
      value: tag.id,
      label: tag.label
    }))
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - {'admin:createBlog'}</title>
        </Head>
        <section className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-6'>
                <h1>{this.props.editBlog ? 'Edit blog' : 'Add new blog'}</h1>
              </div>
            </div>
          </div>
        </section>
        <section className='content'>
          <form className='container-fluid'>
            <div className='row'>
              <div className='col-8'>
                <div className='card'>
                  <div className='card-body'>
                    <div className='form-group'>
                      <input
                        type='text'
                        className='form-control form-control-lg'
                        id='title'
                        name='blog-title'
                        placeholder='Enter title here'
                        onChange={this._updateBlogField('title')}
                        value={blog.title}
                      />
                    </div>
                    {this.props.editBlog && (
                      <div className='form-group'>
                        <span>
                          <label>Permalink: </label>
                          &nbsp;{BASE_URL}/blog/
                          <input
                            type='text'
                            id='name'
                            name='blog-name'
                            onChange={this._updateBlogField('name')}
                            value={blog.name}
                          />
                        </span>
                      </div>
                    )}

                    {/* <div className='form-group'>
                      <span>
                        <label>Permalink: </label>
                        &nbsp;http://www.dayoneteams.com/blogs/{data}
                      </span>
                      <div className='form-group'>
                        <input
                          type='text'
                          className='form-control d-none'
                          id='edit-link'
                          placeholder='Edit link here'
                          onChange={this._updateBlogField('edit-link')}
                          value={data}
                        />
                      </div>
                      <button
                        onClick={this._edit}
                        className='btn btn-outline-secondary'
                        type='button'
                      >
                        Edit
                      </button>
                      &nbsp;
                      <a className='btn btn-outline-secondary' href='#'>View post</a>
                    </div> */}
                    {/* <div className='form-group'> */}
                    {/*  <button */}
                    {/*    className='btn btn-outline-secondary fa fa-camera' */}
                    {/*    type='button' */}
                    {/*  > */}
                    {/*    &ensp;Add photo */}
                    {/*  </button> */}
                    {/* </div> */}
                    <div className='form-group'>
                      {
                        <Editor
                          initialValue={this.state.blog.content}
                          init={{
                            selector: 'textarea',
                            plugins: 'link code autoresize codesample image',
                            codesample_languages: [
                              { text: 'HTML/XML', value: 'markup' },
                              { text: 'JavaScript', value: 'javascript' },
                              { text: 'CSS', value: 'css' },
                              { text: 'PHP', value: 'php' },
                              { text: 'Ruby', value: 'ruby' },
                              { text: 'Python', value: 'python' },
                              { text: 'Java', value: 'java' },
                              { text: 'C', value: 'c' },
                              { text: 'C#', value: 'csharp' },
                              { text: 'C++', value: 'cpp' },
                              { text: 'Bash', value: 'bash' }
                            ],
                            toolbar:
                              'undo redo | bold italic underline | forecolor backcolor | fontselect | fontsizeselect | alignleft aligncenter alignright | codesample | image'
                          }}
                          id='content'
                          onChange={this._updateBlogContent}
                        />
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-4'>
                <div className='card bg-light'>
                  <div className='card-header'>Publish</div>
                  <div className='card-body'>
                    <div className='form-group form-inline'>
                      <label>Status:</label>&nbsp;
                      <select
                        className='form-control'
                        id='status'
                        onChange={this._updateBlogField('status')}
                        value={blog.status}
                      >
                        <option value={Status.DRAFT}>Draft</option>
                        <option value={Status.PUBLISHED}>Published</option>
                      </select>
                    </div>
                  </div>
                  <div className='card-footer'>
                    <button className='btn btn-outline-primary' type='button'>
                      Preview
                    </button>
                    &nbsp;
                    <button
                      onClick={this._save}
                      className='btn btn-primary'
                      disabled={saving}
                      type='button'
                    >
                      {saving && (
                        <span className='spinner-border spinner-border-sm' />
                      )}
                      {saving ? ' Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
                <div className='card bg-light'>
                  <div className='card-header'>Tags</div>
                  <div className='card-body'>
                    <Select
                      closeMenuOnSelect={false}
                      components={Tags}
                      isMulti
                      options={options}
                      onChange={this._updateBlogTags}
                      value={blog.tags}
                    />
                  </div>
                </div>
                <div className='card bg-light'>
                  <div className='card-header'>Featured image</div>
                  <div className='card-body'>
                    <input
                      className='d-none'
                      type='file'
                      name='image'
                      id='image'
                      ref={ref => (this._featuredImageUploadInputRef = ref)}
                      accept={ALLOW_FILE_TYPE}
                      onChange={this._updateBlogImage}
                    />
                    {blog.featuredImageUrl && (
                      <img className='w-100 mb-3' src={blog.featuredImageUrl} />
                    )}
                    <button
                      className='btn btn-primary'
                      type='button'
                      onClick={() => {
                        this._featuredImageUploadInputRef.click()
                      }}
                    >
                      Upload
                    </button>
                    &nbsp;
                    <span>
                      <button
                        type='button'
                        className='btn btn-primary'
                        id='set-link-btn'
                      >
                        Set link
                      </button>
                      <Popover
                        placement='top'
                        target='set-link-btn'
                        isOpen={this.state.showSetLinkPopover}
                        trigger='legacy'
                        toggle={() =>
                          this.setState({
                            showSetLinkPopover: !this.state.showSetLinkPopover
                          })
                        }
                      >
                        <PopoverBody>
                          <div className='input-group'>
                            <input
                              className='form-control'
                              onChange={e => {
                                this.setState({
                                  setLinkUrl: e.target.value
                                })
                              }}
                              value={setLinkUrl}
                            />
                            <div className='input-group-append'>
                              <button
                                className='btn btn-primary'
                                type='button'
                                onClick={this._setLink}
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        </PopoverBody>
                      </Popover>
                    </span>
                    &nbsp;
                    {blog.featuredImageUrl && (
                      <button
                        className='btn btn-danger'
                        type='button'
                        onClick={() =>
                          this.setState({
                            blog: {
                              ...this.state.blog,
                              featuredImageUrl: null
                            }
                          })
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    )
  }

  _save = async e => {
    e.preventDefault()

    this.setState({ saving: true })

    try {
      const {
        blog: { title, content, status, name, featuredImageUrl, tags }
      } = this.state

      if (this.props.editBlog) {
        const id = this.props.editBlog.id
        await blogService.updateBlog(id, {
          title,
          content,
          status,
          name,
          featuredImageUrl,
          tags
        })
        this.setState({ saving: false })
        toastr.success('Saved')
      } else {
        const blog = await blogService.createBlog({
          title,
          content,
          status,
          featuredImageUrl,
          tags
        })
        this.setState({ saving: false })
        toastr.success('Created')
        Router.push(`/admin/blogs/${blog.id}/edit`)
      }
    } catch (e) {
      let msg
      switch (e.code) {
        default: {
          msg = e.message
        }
      }
      this.setState({ saving: false })
      toastr.error(msg)
    }
  }

  _updateBlogField = field => e =>
    this.setState({ blog: { ...this.state.blog, [field]: e.target.value } })

  _updateBlogContent = e =>
    this.setState({
      blog: {
        ...this.state.blog,
        content: e.target.getContent()
      }
    })

  _updateBlogTags = tags => {
    this.setState({
      blog: {
        ...this.state.blog,
        tags
      }
    })
  }

  _updateBlogImage = async e => {
    const file = e.target.files[0]
    const featuredImageUrl = await blogService.uploadFeaturedImage(file)
    this.setState({
      blog: {
        ...this.state.blog,
        featuredImageUrl
      }
    })
  }

  _setLink = () => {
    this.setState({
      blog: {
        ...this.state.blog,
        featuredImageUrl: this.state.setLinkUrl
      },
      showSetLinkPopover: false
    })
  }
}

export default adminOnly(AdminEditBlogPage)
