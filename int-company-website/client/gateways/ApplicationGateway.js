import { ApplicationGatewayInterface } from '../services/ApplicationService'
import ReponseStatus from '../../common/application/ReponseStatus'

export default class ApplicationGateway implements ApplicationGatewayInterface {
  constructor ({ restAdapter }) {
    this.restAdapter = restAdapter
  }

  async getConfigurations (keys: [String]): Promise<[Object]> {
    try {
      const filter = { where: { id: { inq: keys } } }
      const resp = await this.restAdapter.get(
        `/configurations?filter=${JSON.stringify(filter)}`
      )
      return resp.data
    } catch (e) {
      return []
    }
  }

  async getConfiguration (key: String): Promise<Object> {
    try {
      const resp = await this.restAdapter.get(`/configurations/${key}`)
      return resp.data
    } catch (e) {
      return null
    }
  }

  async verifySmtpEmailSettings (settings: Object) {
    const resp = await this.restAdapter.post(
      '/configurations/validate-smtp-settings',
      settings
    )
    return resp.data.isValid
  }

  async saveConfiguration ({ id, data }) {
    await this.restAdapter.post(`/configurations/replaceOrCreate`, { id, data })
  }

  async validateInitSystemPassword (password) {
    const { data } = await this.restAdapter.post(
      '/configurations/validate-init-system-password',
      { password }
    )
    return data.isValid
  }

  async initializeSystem ({ password, admin }) {
    const { data } = await this.restAdapter.post(
      '/configurations/initialize-system',
      { password, admin }
    )
    return data.status === ReponseStatus.SUCCESS
  }
}
