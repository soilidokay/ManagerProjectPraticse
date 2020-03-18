import _ from 'lodash'
import he from 'he'
import moment from 'moment'

export function getShortDesc (content) {
  if (!content) {
    return ''
  }

  const stripedHtml = _.chain(content)
    .replace(/<[^>]+>/g, '')
    .truncate({ length: 200, separator: ' ' })
    .value()

  return he.decode(stripedHtml)
}

export function getCreatedDateStr (createdDate) {
  return moment(createdDate).format('MMM D, YYYY')
}
