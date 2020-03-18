export default class RoleGateway {
  constructor ({ restAdapter }) {
    this.restAdapter = restAdapter
  }

  async find ({ where }) {
    const url = `/roles?filter=${JSON.stringify({ where })}`
    const resp = await this.restAdapter.get(url)

    return resp.data
  }
}
