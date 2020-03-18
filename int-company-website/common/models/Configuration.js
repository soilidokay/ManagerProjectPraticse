export const ConfigurationId = {
  MAIL_EMAIL_ADDRESS_VERIFICATION: 'MAIL_EMAIL_ADDRESS_VERIFICATION',
  MAIL_RESET_PASSWORD: 'MAIL_RESET_PASSWORD',
  MAIL_SMTP_SETTINGS: 'MAIL_SMTP_SETTINGS',
  SYSTEM_INITIALIZATION: 'SYSTEM_INITIALIZATION'
}

export const SystemInitializationStatus = {
  FINISHED: 'FINISHED'
}

export const DEFAULT_EMAIL_ADDRESS_VERIFICATION_MESSAGE = `
Hello %DISPLAY_NAME%,<br /><br />

Follow this link to verify your email address.<br /><br />

%LINK%<br /><br />

If you didn’t ask to verify this address, you can ignore this email.<br /><br />

Thanks,<br />
LoopNext team
`

export const DEFAULT_RESET_PASSWORD_MESSAGE = `
Hello,<br /><br />

Follow this link to reset password for your %EMAIL% account.<br /><br />

%LINK%<br /><br />

If you didn’t ask to reset your password, you can ignore this email.<br />

Thanks,<br />
LoopNext team
`
