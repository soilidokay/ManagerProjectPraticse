import React from 'react'
import Head from 'next/head'
import adminOnly from '../../hocs/adminOnly'
import { userService } from '../../services'
import { Link } from '../../../common/routes'

class AdminIndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userCount: null
    }
  }

  async componentDidMount () {
    this.setState({
      userCount: await userService.count()
    })
  }

  render () {
    const { userCount } = this.state
    return (
      <div className='content-wrapper'>
        <Head>
          <title>Admin - Dashboard</title>
        </Head>
        <section className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-sm-6'>
                <h1>{'common:home'}</h1>
              </div>
              <div className='col-sm-6'>
                <ol className='breadcrumb float-sm-right'>
                  <li className='breadcrumb-item'>
                    <Link route='/admin'>
                      <a>{'common:home'}</a>
                    </Link>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className='content'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-3 col-6'>
                <div className='small-box bg-info-gradient'>
                  <div className='inner'>
                    <h3>{userCount}</h3>
                    <p>{'admin:users'}</p>
                  </div>
                  <div className='icon'>
                    <i className='fa fa-user-plus' />
                  </div>
                  <Link route='/admin/users'>
                    <a className='small-box-footer'>
                      {'admin:moreInfo'}{' '}
                      <i className='fa fa-arrow-circle-right' />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default adminOnly(AdminIndexPage)
