import { validateContact } from '../validators/ContactValidator'

export default class ClientService {
  constructor (options) {
    this.contactGateway = options.contactGateway
  }

  async submitContactForm ({ name, email, phone, message }) {
    validateContact({ name, email, phone, message })
    await this.contactGateway.submitContactForm({ name, email, phone, message })
  }
}
