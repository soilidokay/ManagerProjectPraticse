import _ from 'lodash'
import { StorageGatewayInterface } from '../services/GatewayInterface'

export default class StorageGateway implements StorageGatewayInterface {
  constructor ({ restAdapter }) {
    this.restAdapter = restAdapter
  }

  async upload (containerName, file) {
    let formData = new FormData()
    formData.append('file', file)
    const { data } = await this.restAdapter.post(
      `/containers/${containerName}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return _.get(data, 'result.files.file[0]') || data
  }
}
