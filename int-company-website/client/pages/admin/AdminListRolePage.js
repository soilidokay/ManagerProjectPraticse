import React from 'react'
import Head from 'next/head'
import _ from 'lodash'
import ReactTable from 'react-table'
import toastr from 'toastr'
import adminOnly from '../../hocs/adminOnly'
import { userService } from '../../services'
import { Link } from '../../../common/routes'

class AdminListRolePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      roles: [],
      loading: false
    }
    this._debouncedFetchData = _.debounce(this._fetchData, 200)
  }

  render () {
    const { roles, loading } = this.state
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - {'roleList'}</title>
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
                  <li className='breadcrumb-item active'>{'admin:roleList'}</li>
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
                  <div className='card-header d-flex p-0'>
                    <h3 className='card-title p-3'>{'admin:roleList'}</h3>
                    <ul className='nav nav-pills ml-auto p-2'>
                      <li className='nav-item'>
                        <Link route='/admin/users/create'>
                          <button type='button' className='btn btn-primary'>
                            {'admin:create'}
                          </button>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className='card-body'>
                    <section className='content'>
                      <div className='row'>
                        <div className='col-12'>
                          <div className='card'>
                            <ReactTable
                              showPagination={false}
                              data={roles}
                              columns={[
                                {
                                  Header: 'ID',
                                  accessor: 'id',
                                  filterable: false
                                },
                                {
                                  Header: 'name',
                                  accessor: 'name'
                                },
                                {
                                  columns: [
                                    {
                                      Header: () => <span>{'actions'}</span>,
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
                                            className='u-clickable ml-1'
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
                              manual
                              onFetchData={this._debouncedFetchData}
                              defaultPageSize={10}
                              defaultSorted={[
                                {
                                  id: 'createdAt',
                                  desc: true
                                }
                              ]}
                              loading={loading}
                              className='-striped -highlight'
                            />
                          </div>
                        </div>
                      </div>
                    </section>
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
        acc[val.id] = { regexp: `/${val.value}/i` }
        return acc
      }, {})
      const order = `${_.get(sorted, '[0].id', 'createdAt')} ${
        _.get(sorted, '[0].desc') ? 'desc' : 'asc'
      }`
      const roles = await userService.getRolesForAdmin({
        where,
        skip: pageSize * page,
        order,
        limit: pageSize
      })
      this.setState({
        pages: Math.ceil(roles.length / pageSize),
        roles
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
        toastr.error(error.message)
      }
    }
  }
}

export default adminOnly(AdminListRolePage)
