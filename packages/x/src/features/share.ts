import { assert, assertIsDefined } from '../utils/assert.js'
import { qsAll } from '../utils/document.js'

export const ShareService = {
  facebook: 'facebook',
  twitter: 'twitter',
  line: 'line',
  mail: 'mail',
  hatebu: 'hatebu',
  linkedin: 'linkedin',
  pinterest: 'pinterest',
}

export type ShareServiceType = (typeof ShareService)[keyof typeof ShareService]

export interface ShareServiceFacebookOptions {
  url: string
  text: string
  hashtags: string
  via: string
  related: string
}
export interface ShareServiceMailOptions {
  address: string
  subject: string
  body: string
}

export type ShareServiceOptions = Partial<
  {
    title: string
  } & ShareServiceFacebookOptions
  & ShareServiceMailOptions
>

function getFacebookHref(options: ShareServiceOptions): string {
  const { url } = options
  assertIsDefined(url)
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

function getTwitterHref(options: ShareServiceOptions): string {
  const { text, url, hashtags, via, related } = options

  assertIsDefined(text)

  let href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`

  if (url) {
    href += `&url=${encodeURIComponent(url)}`
  }
  if (hashtags) {
    href += `&hashtags=${encodeURIComponent(hashtags)}`
  }
  if (via) {
    href += `&via=${encodeURIComponent(via)}`
  }
  if (related) {
    href += `&related=${encodeURIComponent(related)}`
  }

  return href
}

function getLineHref(options: ShareServiceOptions): string {
  const { url, text } = options

  assert(url !== undefined || text !== undefined)

  let href = ''
  if (url) {
    href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`
  }
  else if (text) {
    href = `http://line.me/R/msg/text/?${encodeURIComponent(text)}`
  }

  return href
}

function getMailHref(options: ShareServiceOptions): string {
  const { address, subject, body } = options

  assertIsDefined(address)

  let href = `mailto:${escape(address)}`

  const connectors = ['?', '&']
  if (subject) {
    href += `${connectors.shift()}subject=${encodeURIComponent(subject)}`
  }
  if (body) {
    href += `${connectors.shift()}body=${encodeURIComponent(body)}`
  }

  return href
}

function getHatebuHref(options: ShareServiceOptions): string {
  const { url } = options
  assertIsDefined(url)
  return `http://b.hatena.ne.jp/add&url=${encodeURIComponent(url)}`
}

function getLinkedinHref(options: ShareServiceOptions): string {
  const { url, title } = options
  assertIsDefined(url)
  let href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`
  if (title) {
    href += `&title=${encodeURIComponent(title)}`
  }
  return href
}

function getPinterestHref(options: ShareServiceOptions): string {
  const { url, title } = options
  assertIsDefined(url)
  let href = `https://www.pinterest.jp/pin/create/button/?url=${url}`
  if (title) {
    href += `&description=${title}`
  }
  return href
}

export function setupShareLink(serviceType: ShareServiceType, targetQuery: string, options: ShareServiceOptions) {
  let href = ''
  switch (serviceType) {
    case 'facebook':
      href = getFacebookHref(options)
      break
    case 'twitter':
      href = getTwitterHref(options)
      break
    case 'line':
      href = getLineHref(options)
      break
    case 'mail':
      href = getMailHref(options)
      break
    case 'hatebu':
      href = getHatebuHref(options)
      break
    case 'linkedin':
      href = getLinkedinHref(options)
      break
    case 'pinterest':
      href = getPinterestHref(options)
      break
    default:
      console.warn(`no matching share service: ${serviceType}`)
  }

  for (const element of Array.from(qsAll(targetQuery))) {
    element.setAttribute('href', href)
  }
}
