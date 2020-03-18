import { ErrorCode as ValidationErrorCode } from '../errors/ValidationError'
import { validate } from './BaseValidator'

const Spec = {
  email: {
    presence: {
      message: `^${ValidationErrorCode.REQUIRED}`,
      allowEmpty: false
    },
    email: { message: `^${ValidationErrorCode.INVALID_EMAIL}` }
  },
  message: {
    presence: {
      message: `^${ValidationErrorCode.REQUIRED}`,
      allowEmpty: false
    }
  }
}

export function validateContact (contactData) {
  validate(contactData, Spec)
}
