import React from 'react'
import Head from 'next/head'
import _ from 'lodash'
import ReactTable from 'react-table'
import Modal from 'react-modal'
import toastr from 'toastr'
import adminOnly from '../../../hocs/adminOnly'
import { blogService } from '../../../services'

class TagModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      label: props.tag ? props.tag.label : ''
    }
  }

  render () {
    const { tag, onClose } = this.props
    const { label } = this.state
    return (
      <Modal
        ariaHideApp={false}
        isOpen
        className='modal-dialog modal-dialog-centered'
      >
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{tag ? 'Edit tag' : 'Create tag'}</h5>
            <button type='button' className='btn close' onClick={onClose}>
              x
            </button>
          </div>
          <div className='modal-body'>
            <input
              type='text'
              className='form-control'
              placeholder='Enter tag label here'
              onChange={this._updateLabel}
              value={label}
            />
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-outline-primary mr-2'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={this._onSubmit}
            >
              {tag ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }
  _updateLabel = e => {
    this.setState({
      label: e.target.value
    })
  }

  _onSubmit = async e => {
    try {
      const { label } = this.state
      await this.props.onSubmit(label)
      this.props.onClose()
    } catch (e) {
      let msg
      switch (e.code) {
        default: {
          msg = e.message
        }
      }
      toastr.error(msg)
    }
  }
}

class AdminListBlogTagPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      blogTags: [],
      total: 0,
      pages: 0,
      filtered: [],
      loading: false,
      tagBeingEdit: null,
      showCreateTag: false
    }
    this._debouncedFetchData = _.debounce(this._fetchData, 200)
  }

  render () {
    const { blogTags, pages, loading, tagBeingEdit, showCreateTag } = this.state
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - {'blogTagList'}</title>
        </Head>
        <section className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-6'>
                <h1>{'admin:blogTagList'}</h1>
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
                    <span className='card-title'>{'admin:blogTags'}</span>
                    <div className='card-tools'>
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={this._openCreateModal}
                      >
                        {'admin:create'}
                      </button>
                    </div>
                  </div>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-12'>
                        <div className='card'>
                          <ReactTable
                            data={blogTags}
                            columns={[
                              {
                                Header: 'ID',
                                accessor: 'id'
                              },
                              {
                                Header: 'Label',
                                accessor: 'label'
                              },
                              {
                                columns: [
                                  {
                                    Header: () => <span>Edit</span>,
                                    width: 80,
                                    accessor: 'id',
                                    sortable: false,
                                    filterable: false,
                                    Cell: props => (
                                      <div>
                                        <button
                                          type='button'
                                          onClick={() =>
                                            this.setState({
                                              tagBeingEdit: this.state.blogTags.find(
                                                tag => tag.id === props.value
                                              )
                                            })
                                          }
                                          className='btn btn-sm btn-primary form-control'
                                        >
                                          Edit
                                        </button>
                                      </div>
                                    )
                                  }
                                ]
                              },
                              {
                                columns: [
                                  {
                                    Header: () => <span>Delete</span>,
                                    width: 80,
                                    accessor: 'id',
                                    sortable: false,
                                    filterable: false,
                                    Cell: props => (
                                      <div>
                                        <button
                                          className='btn btn-sm btn-danger form-control'
                                          onClick={() =>
                                            this._deleteBlogTag(props.value)
                                          }
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )
                                  }
                                ]
                              }
                            ]}
                            filterable
                            filtered={this.state.filtered}
                            onFilteredChange={filtered =>
                              this.setState({ filtered })
                            }
                            manual
                            onFetchData={this._debouncedFetchData}
                            defaultPageSize={5}
                            loading={loading}
                            pages={pages}
                            className='-striped -highlight'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {tagBeingEdit && (
          <TagModal
            tag={tagBeingEdit}
            onClose={this._closeEditModal}
            onSubmit={this._editTag}
          />
        )}
        {showCreateTag && (
          <TagModal
            onClose={this._closeCreateModal}
            onSubmit={this._createTag}
          />
        )}
      </div>
    )
  }

  /**
   * Whenever the table model changes, or the blog sorts or changes pages, this method gets called and passed the current table model.
   * You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
   * @param state
   * @param instance
   * @return {Promise.<void>}
   * @private
   */
  _fetchData = async (state, instance) => {
    const { pageSize, page, sorted, filtered } = state

    this.setState({ loading: true })

    try {
      const where = filtered.reduce((acc, val) => {
        switch (val.id) {
          default: {
            acc[val.id] = { regexp: `/${val.value}/i` }
          }
        }
        return acc
      }, {})
      const order = `${_.get(sorted, '[0].id')} ${
        _.get(sorted, '[0].desc') ? 'desc' : 'asc'
      }`
      const { total, blogTags } = await blogService.getBlogTagsForAdmin({
        where,
        skip: pageSize * page,
        order,
        limit: pageSize
      })
      this.setState({
        pages: Math.ceil(total / pageSize),
        blogTags,
        total
      })
    } catch (e) {
      toastr.error(e.message)
    } finally {
      this.setState({ loading: false })
    }
  }

  _deleteBlogTag = async id => {
    if (confirm('Are you sure you wish to delete this tag?')) {
      try {
        await blogService.deleteBlogTagWithId(id)

        let blogTags = this.state.blogTags
        const index = blogTags.findIndex(e => e.id === id)
        index !== -1 && blogTags.splice(index, 1)
        this.setState({ blogTags })
      } catch (error) {
        toastr.error(error)
      }
    }
  }

  _closeEditModal = () => {
    this.setState({
      tagBeingEdit: null
    })
  }

  _openCreateModal = () => {
    this.setState({
      showCreateTag: true
    })
  }

  _closeCreateModal = () => {
    this.setState({
      showCreateTag: false
    })
  }

  _createTag = async label => {
    try {
      const newTag = await blogService.createBlogTag(label)
      this.setState({
        blogTags: [...this.state.blogTags, newTag],
        total: this.state.total + 1
      })
      toastr.success('Created')
    } catch (e) {
      let msg
      switch (e.code) {
        default: {
          msg = e.message
        }
      }
      toastr.error(msg)
    }
  }

  _editTag = async label => {
    try {
      const { tagBeingEdit, blogTags } = this.state
      const id = tagBeingEdit.id
      await blogService.updateBlogTag(id, label)
      const tag = blogTags.find(tag => tag.id === id)
      tag.label = label
      const newBlogTags = [...this.state.blogTags]
      this.setState({
        blogTags: newBlogTags
      })
      toastr.success('Updated')
    } catch (e) {
      let msg
      switch (e.code) {
        default: {
          msg = e.message
        }
      }
      toastr.error(msg)
    }
  }
}

export default adminOnly(AdminListBlogTagPage)
