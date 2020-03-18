import { isAdmin, isValidPassword } from './User'
import Role from './Role'

describe('isAdmin()', () => {
  it('should return false when user role is empty', () => {
    expect(isAdmin({})).toBe(false)
    expect(isAdmin({ roles: null })).toBe(false)
    expect(isAdmin({ roles: [] })).toBe(false)
  })

  it('should return true when user role is admin', () => {
    expect(isAdmin({ roles: [{ name: Role.ADMIN }] })).toBe(true)
  })
})

describe('isValidPassword()', () => {
  it('should return false if password is too short, or too long', () => {
    expect(isValidPassword(null)).toBe(false)
    expect(isValidPassword('12345')).toBe(false)
    expect(
      isValidPassword('123451234512345123451234512345123451234512345123451')
    ).toBe(false)
  })

  it('should return true if password length is acceptable', () => {
    expect(isValidPassword('123456')).toBe(true)
    expect(
      isValidPassword('12345123451234512345123451234512345123451234512345')
    ).toBe(true)
  })
})
