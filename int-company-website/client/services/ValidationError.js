export default class ValidationError extends Error {
  constructor (details: Object | Array) {
    super()
    this.details = Array.isArray(details) ? details : [details]
  }
}
