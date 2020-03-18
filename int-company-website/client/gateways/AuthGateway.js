import _ from 'lodash'
import ValidationError from '../services/ValidationError'
import AuthService, { AuthGatewayInterface } from '../services/AuthService'

export default class AuthGateway implements AuthGatewayInterface {
  constructor ({ restAdapter }) {
    this.restAdapter = restAdapter
  }

  async loginWithEmail ({ email, password }) {
    try {
      await this.restAdapter.post('/users/login', { email, password })
      return this.getLoginUser()
    } catch (e) {
      const errResp = _.get(e, 'response.data.error', e)
      switch (errResp.code) {
        case 'LOGIN_FAILED':
          throw new ValidationError(AuthService.ERR_LOGIN_FAILED)
        default:
          throw e
      }
    }
  }

  async getLoginUser () {
    try {
      const resp = await this.restAdapter.get(
        '/users/me?filter={"include":"roles"}'
      )
      return resp.data
    } catch (e) {
      return null
    }
  }

  async logout () {
    try {
      await this.restAdapter.post('/users/logout', {})
    } catch (e) {
      console.warn(
        'Failed to call logout api, but cookie in browser will be cleared so user is still logged out',
        e
      )
    }
    this.restAdapter.removeAccessToken()
  }

  async sendResetPasswordEmail (email) {
    try {
      await this.restAdapter.post('/users/reset', { email })
    } catch (e) {
      throw new ValidationError(AuthService.ERR_INVALID_EMAIL)
    }
  }

  async updateAccountInfo ({ name, email, preferredLanguage }) {
    await this.restAdapter.patch(`/users/me`, {
      name,
      email,
      preferredLanguage
    })
  }

  async updatePassword ({ oldPassword, newPassword }) {
    try {
      await this.restAdapter.post('/users/change-password', {
        oldPassword,
        newPassword
      })
    } catch (e) {
      const err = _.get(e, 'response.data.error', e)

      if (err.code === 'INVALID_PASSWORD') {
        throw new ValidationError(AuthService.ERR_INVALID_CURRENT_PASSWORD)
      }

      throw err
    }
  }

  async setNewPassword ({ userId, newPassword }, accessToken) {
    try {
      await this.restAdapter.post(
        `/users/reset-password?access_token=${accessToken}`,
        { id: userId, newPassword }
      )
    } catch (e) {
      const err = _.get(e, 'response.data.error', e)

      switch (err.code) {
        case 'INVALID_PASSWORD':
          throw new ValidationError(AuthService.ERR_INVALID_CURRENT_PASSWORD)
        default:
          throw err
      }
    }
  }

  async updateAvatar (avatar) {
    try {
      await this.restAdapter.patch(`/users/me`, { avatar })
    } catch (e) {
      throw e
    }
  }
}
