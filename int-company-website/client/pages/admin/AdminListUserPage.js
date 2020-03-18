import React from 'react'
import Head from 'next/head'
import _ from 'lodash'
import moment from 'moment'
import ReactTable from 'react-table'
import toastr from 'toastr'
import adminOnly from '../../hocs/adminOnly'
import { userService } from '../../services'
import { Link } from '../../../common/routes'
import Role from '../../../common/models/Role'

class AdminListUserPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      total: 0,
      pages: 0,
      users: [],
      filtered: [],
      loading: false
    }
    this._debouncedFetchData = _.debounce(this._fetchData, 200)
  }

  render () {
    const { users, pages, loading } = this.state
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - {'userList'}</title>
        </Head>
        <section className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-6'>
                <h1>{'admin:userList'}</h1>
              </div>
              <div className='col-sm-6'>
                <ol className='breadcrumb float-sm-right'>
                  <li className='breadcrumb-item'>
                    <Link route='/admin'>
                      <a>{'common:home'}</a>
                    </Link>
                  </li>
                  <li className='breadcrumb-item active'>{'admin:userList'}</li>
                </ol>
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
                    <span className='card-title'>{'admin:users'}</span>
                    <div className='card-tools'>
                      <button
                        type='button'
                        className='btn btn-secondary mr-2'
                        onClick={() => this.setState({ filtered: [] })}
                      >
                        {'admin:clearSearch'}
                      </button>
                      <Link route='/admin/users/create'>
                        <a id='newUser' className='btn btn-primary'>
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
                            data={users}
                            columns={[
                              {
                                Header: 'ID',
                                accessor: 'id'
                              },
                              {
                                Header: 'name',
                                accessor: 'name'
                              },
                              {
                                Header: 'Roles',
                                accessor: 'roles',
                                sortable: false,
                                Cell: row =>
                                  row.value.map((role, index) => {
                                    switch (role.name) {
                                      case Role.ADMIN:
                                        return (
                                          <span
                                            className='badge badge-danger'
                                            key={index}
                                          >
                                            {role.name}
                                          </span>
                                        )
                                      case Role.USER:
                                        return (
                                          <span
                                            className='badge badge-success'
                                            key={index}
                                          >
                                            {role.name}
                                          </span>
                                        )
                                    }
                                  }),
                                filterable: false
                              },
                              {
                                Header: 'Email',
                                accessor: 'email'
                              },
                              {
                                Header: 'Email verified',
                                accessor: 'emailVerified',
                                sortable: false,
                                Cell: row =>
                                  row.value ? (
                                    <span className='badge badge-success'>
                                      Verified
                                    </span>
                                  ) : (
                                    <span className='badge badge-secondary'>
                                      Not verified
                                    </span>
                                  ),
                                Filter: ({ filter, onChange }) => (
                                  <select
                                    onChange={event =>
                                      onChange(event.target.value)
                                    }
                                    className='form-control form-control-sm'
                                    value={filter ? filter.value : 'all'}
                                  >
                                    <option value='all'>All</option>
                                    <option value='true'>Verified</option>
                                    <option value='false'>Not verified</option>
                                  </select>
                                )
                              },
                              {
                                Header: 'createdAt',
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
                                            '/admin/users/' +
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
                                            this._deleteUser(props.value)
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
   * Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
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
          case 'emailVerified': {
            if (val.value === 'true') {
              acc[val.id] = true
            } else if (val.value === 'false') {
              acc[val.id] = { neq: true }
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
      const { total, users } = await userService.getUsersForAdmin({
        where,
        skip: pageSize * page,
        order,
        limit: pageSize
      })
      this.setState({
        pages: Math.ceil(total / pageSize),
        users,
        total
      })
    } catch (e) {
      toastr.error(e.message)
    } finally {
      this.setState({ loading: false })
    }
  }

  _deleteUser = async id => {
    if (confirm('Are you sure you wish to delete this user?')) {
      try {
        await userService.deleteUserWithId(id)

        let users = this.state.users
        const index = users.findIndex(e => e.id === id)
        index !== -1 && users.splice(index, 1)
        this.setState({ users: users })
      } catch (error) {
        toastr.error(error)
      }
    }
  }
}

export default adminOnly(AdminListUserPage)
