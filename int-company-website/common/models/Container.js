import _ from 'lodash'

export const ALLOW_FILE_TYPE = ['image/jpg', 'image/jpeg', 'image/png']
export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 megabytes

// You can add more key-value for more containers if you want, but if the system already initialized, then you need to
// call POST /api/containers API to create new container by yourself.
// We let you control this instead of auto-create those new containers.
//
// Notice that:
//   - For AWS S3, because S3 buckets are global object, you need to create global unique bucket (container) name, like "youruniqueapp-avatar"
//   - For Mongo GridFS: no container is created in reality but it just mark metadata.container for the file object stored in Mongo
export const Containers = {
  AVATAR: 'dayoneweb-avatar',
  UPLOAD: 'dayoneweb-upload',
  BLOG_IMAGE: 'dayoneweb-blog-image'
}

export const Error = {
  ERR_INVALID_FILE_TYPE: 'ERR_INVALID_FILE_TYPE',
  ERR_INVALID_FILE_SIZE: 'ERR_INVALID_FILE_SIZE'
}

export function isValidFileType (file) {
  return ALLOW_FILE_TYPE.indexOf(file.type) > -1
}

export function isValidFileSize (file) {
  return file.size <= MAX_FILE_SIZE
}

export function validateUpload (file) {
  return _([
    !isValidFileType(file) && Error.ERR_INVALID_FILE_TYPE,
    !isValidFileSize(file) && Error.ERR_INVALID_FILE_SIZE
  ])
    .compact()
    .value()
}

export function getPublicFileLink (file) {
  if (file.providerResponse) {
    // AWS S3
    if (file.providerResponse.location) {
      return file.providerResponse.location
    }

    // Google Cloud Storage
    if (file.providerResponse.mediaLink) {
      return file.providerResponse.mediaLink
    }
  }

  // Mongo GridFs
  if (file._id) {
    return `/api/containers/${file.metadata.container}/download/${file._id}`
  }

  // File system
  return `/api/containers/${file.container}/download/${file.name}`
}
