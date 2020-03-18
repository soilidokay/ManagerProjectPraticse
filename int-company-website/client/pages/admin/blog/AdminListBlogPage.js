import React from 'react'
import Head from 'next/head'
import _ from 'lodash'
import moment from 'moment'
import ReactTable from 'react-table'
import toastr from 'toastr'
import adminOnly from '../../../hocs/adminOnly'
import { blogService } from '../../../services'
import { Link } from '../../../../common/routes'

class AdminListBlogPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      total: 0,
      pages: 0,
      blogs: [],
      filtered: [],
      loading: false
    }
    this._debouncedFetchData = _.debounce(this._fetchData, 200)
  }

  render () {
    const { blogs, pages, loading } = this.state
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - {'blogList'}</title>
        </Head>
        <section className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-6'>
                <h1>{'admin:blogList'}</h1>
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
                    <span className='card-title'>{'admin:blogs'}</span>
                    <div className='card-tools'>
                      <button
                        type='button'
                        className='btn btn-secondary mr-2'
                        onClick={() => this.setState({ filtered: [] })}
                      >
                        {'admin:clearSearch'}
                      </button>
                      <Link route='/admin/blogs/create'>
                        <a id='newBlog' className='btn btn-primary'>
                          {'admin:create'}
                        </a>
                      </Link>
                    </div>
                  </div>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-12'>
                        <div className='card'>
                          <ReactTable
                            data={blogs}
                            columns={[
                              {
                                Header: 'ID',
                                accessor: 'id'
                              },
                              {
                                Header: 'Title',
                                accessor: 'title'
                              },
                              {
                                Header: 'Status',
                                accessor: 'status',
                                Filter: ({ filter, onChange }) => (
                                  <select
                                    onChange={event =>
                                      onChange(event.target.value)
                                    }
                                    className='form-control form-control-sm'
                                    value={filter ? filter.value : 'all'}
                                  >
                                    <option value='all'>Show all</option>
                                    <option value='draft'>Draft</option>
                                    <option value='published'>Published</option>
                                  </select>
                                )
                              },
                              {
                                Header: 'Created At',
                                accessor: 'createdAt',
                                filterable: false,
                                Cell: row =>
                                  moment(row.value).format('YYYY-MM-DD HH:mm')
                              },
                              {
                                columns: [
                                  {
                                    Header: () => <span>Actions</span>,
                                    width: 100,
                                    accessor: 'id',
                                    sortable: false,
                                    filterable: false,
                                    Cell: props => (
                                      <div>
                                        <Link
                                          route={
                                            '/admin/blogs/' +
                                            props.value +
                                            '/edit'
                                          }
                                        >
                                          <a>
                                            <i className='fa fa-edit text-primary' />
                                          </a>
                                        </Link>
                                        <a
                                          className='u__cursor--pointer ml-1'
                                          onClick={() =>
                                            this._deleteBlog(props.value)
                                          }
                                        >
                                          <i className='fa fa-trash text-danger' />
                                        </a>
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
                            defaultSorted={[
                              {
                                id: 'createdAt',
                                desc: true
                              }
                            ]}
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
          case 'status': {
            if (val.value === 'draft') {
              acc[val.id] = 'draft'
            } else if (val.value === 'published') {
              acc[val.id] = 'published'
            }
            break
          }
          case 'id': {
            acc[val.id] = val.value
            break
          }
          default: {
            acc[val.id] = { regexp: `/${val.value}/i` }
          }
        }
        return acc
      }, {})
      const order = `${_.get(sorted, '[0].id', 'createdAt')} ${
        _.get(sorted, '[0].desc') ? 'desc' : 'asc'
      }`
      const { total, blogs } = await blogService.getBlogsForAdmin({
        where,
        skip: pageSize * page,
        order,
        limit: pageSize
      })
      this.setState({
        pages: Math.ceil(total / pageSize),
        blogs,
        total
      })
    } catch (e) {
      toastr.error(e.message)
    } finally {
      this.setState({ loading: false })
    }
  }

  _deleteBlog = async id => {
    if (confirm('Are you sure you wish to delete this blog?')) {
      try {
        await blogService.deleteBlogWithId(id)

        let blogs = this.state.blogs
        const index = blogs.findIndex(e => e.id === id)
        index !== -1 && blogs.splice(index, 1)
        this.setState({ blogs: blogs })
      } catch (error) {
        toastr.error(error)
      }
    }
  }
}

export default adminOnly(AdminListBlogPage)
