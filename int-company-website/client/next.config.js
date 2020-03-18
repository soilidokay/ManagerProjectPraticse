const withSass = require('@zeit/next-sass')
const result = withSass()

result.publicRuntimeConfig = {
  BASE_URL: process.env.BASE_URL,
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET || null
}
module.exports = result
