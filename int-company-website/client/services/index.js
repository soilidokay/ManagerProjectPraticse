import restAdapter from '../adapters/restAdapter'
import AuthService from './AuthService'
import UserService from './UserService'
import ApplicationService from './ApplicationService'
import UserGateway from '../gateways/UserGateway'
import AuthGateway from '../gateways/AuthGateway'
import RoleGateway from '../gateways/RoleGateway'
import ApplicationGateway from '../gateways/ApplicationGateway'
import StorageGateway from '../gateways/StorageGateway'
import ContactGateway from '../gateways/ContactGateway'
import ClientService from './ClientService'
import BlogService from './BlogService'
import BlogGateway from '../gateways/BlogGateway'
import BlogTagGateway from '../gateways/BlogTagGateway'

const authGateway = new AuthGateway({ restAdapter })
const userGateway = new UserGateway({ restAdapter })
const roleGateway = new RoleGateway({ restAdapter })
const storageGateway = new StorageGateway({ restAdapter })
const applicationGateway = new ApplicationGateway({ restAdapter })
const contactGateway = new ContactGateway({ restAdapter })
const blogGateway = new BlogGateway({ restAdapter })
const blogTagGateway = new BlogTagGateway({ restAdapter })

export const authService = new AuthService({
  authGateway,
  userGateway,
  roleGateway,
  storageGateway,
  blogGateway,
  blogTagGateway
})
export const userService = new UserService({ userGateway, roleGateway })
export const applicationService = new ApplicationService({ applicationGateway })
export const clientService = new ClientService({ contactGateway })
export const blogService = new BlogService({
  blogGateway,
  storageGateway,
  blogTagGateway
})

export function applyAccessToken (token) {
  restAdapter.setAccessToken(token)
}
