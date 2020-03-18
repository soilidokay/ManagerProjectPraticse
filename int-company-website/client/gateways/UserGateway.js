import _ from 'lodash'
import { UserGatewayInterface } from '../services/UserService'
import AuthService from '../services/AuthService'
import ValidationError from '../services/ValidationError'

export default class UserGateway implements UserGatewayInterface {
  constructor ({ restAdapter }) {
    this.restAdapter = restAdapter
  }

  async create (data: { name: string, email: string, password: string }) {
    try {
      const resp = await this.restAdapter.post(`/users`, data)
      return resp.data
    } catch (e) {
      const errResp = _.get(e, 'response.data.error', e)
      switch (errResp.name) {
        case 'ValidationError': {
          if (_.get(errResp, 'details.codes.email[0]') === 'uniqueness') {
            throw new ValidationError(AuthService.ERR_EMAIL_EXISTED)
          }
        }
      }
    }
  }

  async find ({ where, skip, limit, order, include }) {
    const filter = { where, skip, limit, order, include }
    const url = `/users?filter=${JSON.stringify(filter)}`
    const resp = await this.restAdapter.get(url)
    return resp.data
  }

  async findById (id) {
    const resp = await this.restAdapter.get(`/users/${id}`)
    return resp.data
  }

  async count (where = {}) {
    const resp = await this.restAdapter.get(
      `/users/count?where=${JSON.stringify(where)}`
    )
    return resp.data.count
  }

  async updateById (id, { name, email, emailVerified }) {
    const resp = await this.restAdapter.patch(`/users/${id}`, {
      name,
      email,
      emailVerified
    })
    return resp.data
  }

  async deleteById (id) {
    const resp = await this.restAdapter.delete(`/users/${id}`)
    return resp.data
  }
}
