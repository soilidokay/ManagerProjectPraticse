import validator from 'validator'
import _ from 'lodash'
import Role from './Role'

export const MIN_NAME_LENGTH = 1
export const MAX_NAME_LENGTH = 150
export const MIN_PASSWORD_LENGTH = 6
export const MAX_PASSWORD_LENGTH = 50

export const Error = {
  ERR_INVALID_NAME: 'ERR_INVALID_NAME',
  ERR_INVALID_EMAIL: 'ERR_INVALID_EMAIL',
  ERR_INVALID_PASSWORD: 'ERR_INVALID_PASSWORD',
  ERR_INVALID_CURRENT_PASSWORD: 'ERR_INVALID_CURRENT_PASSWORD',
  ERR_INVALID_NEW_PASSWORD: 'ERR_INVALID_NEW_PASSWORD'
}

export function isAdmin (user) {
  return !!user.roles && user.roles.some(role => role.name === Role.ADMIN)
}

export function isValidEmail (email) {
  return !!email && validator.isEmail(email)
}

export function isValidName (name) {
  return (
    !!name &&
    validator.isLength(name, { min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH })
  )
}

export function isValidPassword (password) {
  return (
    !!password &&
    validator.isLength(password, {
      min: MIN_PASSWORD_LENGTH,
      max: MAX_PASSWORD_LENGTH
    })
  )
}

export function validateLoginAccount ({ email, password }) {
  const errors = _({
    [Error.ERR_INVALID_EMAIL]: !isValidEmail(email),
    [Error.ERR_INVALID_PASSWORD]: !isValidPassword(password)
  })
    .pickBy(value => value)
    .value()
  return Object.keys(errors)
}

export function validateUserProperty (field, data) {
  switch (field) {
    case 'name':
      return isValidName(data) ? [] : [Error.ERR_INVALID_NAME]
    case 'email':
      return isValidEmail(data) ? [] : [Error.ERR_INVALID_EMAIL]
    case 'password':
      return isValidPassword(data) ? [] : [Error.ERR_INVALID_PASSWORD]
    case 'currentPassword':
      return isValidPassword(data) ? [] : [Error.ERR_INVALID_CURRENT_PASSWORD]
    case 'newPassword':
      return isValidPassword(data) ? [] : [Error.ERR_INVALID_NEW_PASSWORD]
    default:
      return []
  }
}
