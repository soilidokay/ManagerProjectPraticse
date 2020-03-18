import ApplicationService from './ApplicationService'
import ApplicationGateway from '../gateways/ApplicationGateway'
import { ConfigurationId } from '../../common/models/Configuration'

jest.mock('../gateways/ApplicationGateway')

let applicationService, mockedApplicationGateway
beforeEach(() => {
  mockedApplicationGateway = new ApplicationGateway({})
  applicationService = new ApplicationService({
    applicationGateway: mockedApplicationGateway
  })
})

afterEach(() => {
  ApplicationGateway.mockClear()
})

describe('saveEmailAddressVerification()', () => {
  it('should call save data with correct id', async () => {
    await applicationService.saveEmailAddressVerification({})
    expect(mockedApplicationGateway.saveConfiguration).toHaveBeenCalledWith({
      id: ConfigurationId.MAIL_EMAIL_ADDRESS_VERIFICATION,
      data: {}
    })
  })
})

describe('saveResetPassword()', () => {
  it('should call save data with correct id', async () => {
    await applicationService.saveResetPassword({})
    expect(mockedApplicationGateway.saveConfiguration).toHaveBeenCalledWith({
      id: ConfigurationId.MAIL_RESET_PASSWORD,
      data: {}
    })
  })
})

describe('saveSmtpSettings()', () => {
  it('should call save data with correct id', async () => {
    await applicationService.saveSmtpSettings({})
    expect(mockedApplicationGateway.saveConfiguration).toHaveBeenCalledWith({
      id: ConfigurationId.MAIL_SMTP_SETTINGS,
      data: {}
    })
  })
})

describe('getConfigurations()', () => {
  it('should get configuration data based on provided IDs', async () => {
    await applicationService.getConfigurations([
      ConfigurationId.MAIL_RESET_PASSWORD,
      ConfigurationId.MAIL_SMTP_SETTINGS,
      ConfigurationId.MAIL_EMAIL_ADDRESS_VERIFICATION
    ])
    expect(mockedApplicationGateway.getConfigurations).toHaveBeenCalledWith([
      ConfigurationId.MAIL_RESET_PASSWORD,
      ConfigurationId.MAIL_SMTP_SETTINGS,
      ConfigurationId.MAIL_EMAIL_ADDRESS_VERIFICATION
    ])
  })
})

describe('isValidSmtpEmailSettings()', () => {
  it('should call gateway method to validate smtp settings invalid', async () => {
    const invalidSmtpEmailSettings = {}
    await applicationService.isValidSmtpEmailSettings(invalidSmtpEmailSettings)
    expect(mockedApplicationGateway.verifySmtpEmailSettings).toHaveBeenCalled()
  })
})
