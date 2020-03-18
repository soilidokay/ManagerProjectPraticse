import _ from 'lodash'
import {
  validateLoginAccount,
  validateUserProperty
} from '../../common/models/User'
import { UserGatewayInterface } from './UserService'
import BaseService from './BaseService'
import ValidationError from './ValidationError'
import { StorageGatewayInterface } from './GatewayInterface'
import {
  Containers,
  validateUpload,
  getPublicFileLink
} from '../../common/models/Container'

export interface AuthGatewayInterface {
  loginWithEmail({ email: string, password: string }): Promise<Object>;

  getLoginUser(): Promise<Object>;

  logout(): Promise<void>;

  sendResetPasswordEmail(email: string): Promise<void>;

  updateAccountInfo({
    name: string,
    email: string,
    preferredLanguage: string
  }): Promise<void>;

  updatePassword({ oldPassword: string, newPassword: string }): Promise<void>;

  setNewPassword(
    { userId: string, newPassword: string },
    accessToken: string
  ): Promise<void>;
}

export default class AuthService extends BaseService {
  static ERR_EMAIL_EXISTED = 'ERR_EMAIL_EXISTED'
  static ERR_LOGIN_FAILED = 'ERR_LOGIN_FAILED'
  static ERR_USER_NOT_FOUND = 'ERR_USER_NOT_FOUND'
  static ERR_INVALID_CURRENT_PASSWORD = 'ERR_INVALID_CURRENT_PASSWORD'
  static ERR_INVALID_EMAIL = 'ERR_INVALID_EMAIL'
  static ERR_INVALID_NAME = 'ERR_INVALID_NAME'
  static ERR_INVALID_PASSWORD = 'ERR_INVALID_PASSWORD'

  constructor (options: {
    userGateway: UserGatewayInterface,
    roleGateway: Object,
    authGateway: AuthGatewayInterface,
    storageGateway: StorageGatewayInterface
  }) {
    super()
    const { userGateway, roleGateway, authGateway, storageGateway } = options
    this.userGateway = userGateway
    this.roleGateway = roleGateway
    this.authGateway = authGateway
    this.storageGateway = storageGateway
  }

  async loginWithEmail ({ email, password }) {
    const errors = validateLoginAccount({ email, password })
    if (errors.length) {
      throw new ValidationError(errors)
    }

    return this.authGateway.loginWithEmail({ email, password })
  }

  async getLoginUser () {
    return this.authGateway.getLoginUser()
  }

  async signupWithEmail ({ name, email, password }) {
    const errors = _.concat(
      validateUserProperty('name', name),
      validateLoginAccount({ email, password })
    )
    if (errors.length) {
      throw new ValidationError(errors)
    }

    await this.userGateway.create({ name, email, password })
    return this.loginWithEmail({ email, password })
  }

  async logout () {
    await this.authGateway.logout()
  }

  async sendResetPasswordEmail (email) {
    const errors = validateUserProperty('email', email)
    if (errors.length) {
      throw new ValidationError(errors)
    }

    return this.authGateway.sendResetPasswordEmail(email)
  }

  async updateAccountInfo ({ name, email, preferredLanguage }) {
    const errors = _.concat(
      validateUserProperty('name', name),
      validateUserProperty('email', email)
    )
    if (errors.length) {
      throw new ValidationError(errors)
    }
    await this.authGateway.updateAccountInfo({ name, email, preferredLanguage })
  }

  async updatePassword ({ oldPassword, newPassword }) {
    const errors = _.concat(
      validateUserProperty('currentPassword', oldPassword),
      validateUserProperty('newPassword', newPassword)
    )
    if (errors.length) {
      throw new ValidationError(errors)
    }

    await this.authGateway.updatePassword({ oldPassword, newPassword })
  }

  async setNewPassword ({ userId, newPassword }, accessToken) {
    const errors = validateUserProperty('password', newPassword)
    if (errors.length) {
      throw new ValidationError(errors)
    }

    await this.authGateway.setNewPassword({ userId, newPassword }, accessToken)
  }

  async uploadAvatar (file) {
    const errors = validateUpload(file)

    if (errors.length) {
      throw new ValidationError(errors)
    }

    const uploadedFile = await this.storageGateway.upload(
      Containers.AVATAR,
      file
    )
    return getPublicFileLink(uploadedFile)
  }

  async updateAvatar (avatar) {
    await this.authGateway.updateAvatar(avatar)
  }
}
