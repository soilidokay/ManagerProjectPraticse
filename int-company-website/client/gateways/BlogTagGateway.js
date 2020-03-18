import _ from 'lodash'
import AuthService from '../services/AuthService'
import ValidationError from '../services/ValidationError'

export default class BlogTagGateway {
  constructor ({ restAdapter }) {
    this.restAdapter = restAdapter
  }

  async create (data: { label: string }) {
    try {
      const resp = await this.restAdapter.post(`/blogtags`, data)
      return resp.data
    } catch (e) {
      const errResp = _.get(e, 'response.data.error', e)
      switch (errResp.label) {
        case 'ValidationError': {
          if (_.get(errResp, 'details.codes.content[0]') === 'uniqueness') {
            throw new ValidationError(AuthService.ERR_content_EXISTED)
          }
        }
      }
    }
  }

  async updateById (id, data: { label: string }) {
    const resp = await this.restAdapter.patch(`/blogtags/${id}`, data)
    return resp.data
  }

  async findAll () {
    const resp = await this.restAdapter.get(`/blogtags?`)
    return resp.data
  }

  async findById (id) {
    const resp = await this.restAdapter.get(`/blogtags/${id}`)
    return resp.data
  }

  async find ({ where, skip, limit, order, include }) {
    const filter = { where, skip, limit, order, include }
    const url = `/blogtags?filter=${JSON.stringify(filter)}`
    const resp = await this.restAdapter.get(url)
    return resp.data
  }

  async count (where = {}) {
    const resp = await this.restAdapter.get(
      `/blogtags/count?where=${JSON.stringify(where)}`
    )
    return resp.data.count
  }

  async deleteById (id) {
    const resp = await this.restAdapter.delete(`/blogtags/${id}`)
    return resp.data
  }
}
