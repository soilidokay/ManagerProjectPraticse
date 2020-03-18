export default class ContactGateway {
  constructor ({ restAdapter }) {
    this.restAdapter = restAdapter
  }

  async submitContactForm ({ name, email, phone, message }) {
    const resp = await this.restAdapter.post('/contacts', {
      name,
      email,
      phone,
      message
    })
    return resp.data
  }
}
