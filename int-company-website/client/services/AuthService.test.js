import AuthService from './AuthService'
import ValidationError from './ValidationError'
import AuthGateway from '../gateways/AuthGateway'
import UserGateway from '../gateways/UserGateway'

jest.mock('../gateways/AuthGateway')
jest.mock('../gateways/UserGateway')

let authService, mockedAuthGateway, mockedUserGateway
beforeEach(() => {
  mockedAuthGateway = new AuthGateway({})
  mockedUserGateway = new UserGateway({})
  authService = new AuthService({
    userGateway: mockedUserGateway,
    authGateway: mockedAuthGateway
  })
})

afterEach(() => {
  AuthGateway.mockClear()
})

describe('loginWithEmail()', () => {
  it('should call AuthGateway to authenticate user', async () => {
    const email = 'test@gmail.com'
    const password = '123456'
    await authService.loginWithEmail({ email, password })
    expect(mockedAuthGateway.loginWithEmail).toHaveBeenCalled()
  })
})

describe('signupWithEmail()', () => {
  it('should throw error if username, email or password is invalid', async () => {
    const name = 'Valid name'
    const email = 'validEmail@gmail.com'
    const password = '123456789asdfghjkl'

    const invalidName = ''
    const invalidEmail = 'validEmailgmail.com'
    const invalidPassword = '1'

    // Invalid name
    let expectedError
    try {
      await authService.signupWithEmail({ name: invalidName, email, password })
    } catch (e) {
      expectedError = e
    }
    expect(expectedError).toEqual(
      new ValidationError(AuthService.ERR_INVALID_NAME)
    )

    // Invalid email
    try {
      await authService.signupWithEmail({ name, email: invalidEmail, password })
    } catch (e) {
      expectedError = e
    }
    expect(expectedError).toEqual(
      new ValidationError(AuthService.ERR_INVALID_EMAIL)
    )

    // Invalid password
    try {
      await authService.signupWithEmail({
        name,
        email,
        password: invalidPassword
      })
    } catch (e) {
      expectedError = e
    }
    expect(expectedError).toEqual(
      new ValidationError(AuthService.ERR_INVALID_PASSWORD)
    )
  })

  it('should create new user, then login that new user and return the user object', async () => {
    const name = 'Valid name'
    const email = 'validEmail@gmail.com'
    const password = '123456'
    const expectedResult = { name, email }
    AuthGateway.mockImplementationOnce(() => ({
      loginWithEmail: jest.fn().mockImplementation(async () => expectedResult)
    }))
    mockedAuthGateway = new AuthGateway({})
    const spyOnUserCreate = jest.spyOn(mockedUserGateway, 'create')
    authService = new AuthService({
      userGateway: mockedUserGateway,
      authGateway: mockedAuthGateway
    })
    const result = await authService.signupWithEmail({ name, email, password })
    expect(spyOnUserCreate).toHaveBeenCalled()
    expect(mockedAuthGateway.loginWithEmail).toHaveBeenCalled()
    expect(result).toEqual(expectedResult)
  })
})

describe('getLoginUser()', () => {
  it('should call AuthGateway to get and return logged in user', async () => {
    const expectedResult = {
      id: '5baa01d35f2f003ad54a5503',
      name: 'Hao Tang 2',
      preferredLanguage: 'en',
      email: 'haotang.io@gmail.com'
    }
    AuthGateway.mockImplementationOnce(() => ({
      getLoginUser: jest.fn().mockImplementation(async () => expectedResult)
    }))
    mockedAuthGateway = new AuthGateway({})
    authService = new AuthService({
      userGateway: mockedUserGateway,
      authGateway: mockedAuthGateway
    })
    const result = await authService.getLoginUser()
    expect(mockedAuthGateway.getLoginUser).toHaveBeenCalled()
    expect(result).toEqual(expectedResult)
  })
})

describe('logout()', () => {
  it('should call UserGateway to log out user', async () => {
    await authService.logout()
    expect(mockedAuthGateway.logout).toHaveBeenCalled()
  })
})

describe('sendResetPasswordEmail()', () => {
  it('should call UserGateway send reset password email', async () => {
    const email = 'test@gmail.com'
    await authService.sendResetPasswordEmail(email)
    expect(mockedAuthGateway.sendResetPasswordEmail).toHaveBeenCalledWith(email)
  })
})

describe('updateAccountInfo()', () => {
  it('should call UserGateway update user account info', async () => {
    const name = 'test user name'
    const email = 'test@gmail.com'
    const preferredLanguage = 'en'
    await authService.updateAccountInfo({ name, email, preferredLanguage })
    expect(mockedAuthGateway.updateAccountInfo).toHaveBeenCalledWith({
      name,
      email,
      preferredLanguage
    })
  })
})

describe('updatePassword()', () => {
  it('should call UserGateway to update user password', async () => {
    const oldPassword = 'test user name'
    const newPassword = 'test@gmail.com'
    await authService.updatePassword({ oldPassword, newPassword })
    expect(mockedAuthGateway.updatePassword).toHaveBeenCalledWith({
      oldPassword,
      newPassword
    })
  })

  it('should reject invalid password', async () => {
    const oldPassword = 'test user name'
    const invalidPassword = '1'
    try {
      await authService.updatePassword({
        oldPassword,
        newPassword: invalidPassword
      })
    } catch (e) {
      expect(e).toEqual(new ValidationError(AuthService.ERR_INVALID_PASSWORD))
    }
    expect(mockedAuthGateway.updatePassword).not.toHaveBeenCalled()
  })
})

describe('setNewPassword()', () => {
  it('should call UserGateway to set user password', async () => {
    const userId = 'test userId'
    const newPassword = 'test@gmail.com'
    const accessToken = 'test access token'
    await authService.setNewPassword({ userId, newPassword }, accessToken)
    expect(mockedAuthGateway.setNewPassword).toHaveBeenCalledWith(
      { userId, newPassword },
      accessToken
    )
  })

  it('should reject invalid password', async () => {
    const userId = 'test userId'
    const invalidPassword = '1'
    const accessToken = 'test access token'
    try {
      await authService.setNewPassword(
        { userId, newPassword: invalidPassword },
        accessToken
      )
    } catch (e) {
      expect(e).toEqual(new ValidationError(AuthService.ERR_INVALID_PASSWORD))
    }
    expect(mockedAuthGateway.setNewPassword).not.toHaveBeenCalled()
  })
})
