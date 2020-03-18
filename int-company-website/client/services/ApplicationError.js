export default class ApplicationError extends Error {
  static ERR_NETWORK_ERROR = 'ERR_NETWORK_ERROR'

  constructor (code: string, msg: string) {
    super(msg)
    this.code = code
  }
}
