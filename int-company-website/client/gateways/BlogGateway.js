import _ from 'lodash'
import { BlogGatewayInterface } from '../services/BlogService'
import AuthService from '../services/AuthService'
import ValidationError from '../services/ValidationError'

export default class BlogGateway implements BlogGatewayInterface {
  constructor ({ restAdapter }) {
    this.restAdapter = restAdapter
  }

  async create (data: {
    title: string,
    content: string,
    status: string,
    featuredImageUrl: string,
    tags: []
  }) {
    try {
      const resp = await this.restAdapter.post(`/blogs`, data)
      return resp.data
    } catch (e) {
      const errResp = _.get(e, 'response.data.error', e)
      switch (errResp.title) {
        case 'ValidationError': {
          if (_.get(errResp, 'details.codes.content[0]') === 'uniqueness') {
            throw new ValidationError(AuthService.ERR_content_EXISTED)
          }
        }
      }
    }
  }

  async find ({ where, skip, limit, order, include }) {
    const filter = { where, skip, limit, order, include }
    const url = `/blogs?filter=${JSON.stringify(filter)}`
    const resp = await this.restAdapter.get(url)
    return resp.data
  }

  async findById (id) {
    const resp = await this.restAdapter.get(`/blogs/${id}`)
    return resp.data
  }

  async count (where = {}) {
    const resp = await this.restAdapter.get(
      `/blogs/count?where=${JSON.stringify(where)}`
    )
    return resp.data.count
  }

  async updateById (id, data) {
    const resp = await this.restAdapter.patch(`/blogs/${id}`, data)
    return resp.data
  }

  async deleteById (id) {
    const resp = await this.restAdapter.delete(`/blogs/${id}`)
    return resp.data
  }

  async findByName (name) {
    try {
      const resp = await this.restAdapter.get(
        `/blogs/findOne?filter={"where":{"name":"${name}"}}`
      )
      return resp.data
    } catch (e) {
      return null
    }
  }
}
