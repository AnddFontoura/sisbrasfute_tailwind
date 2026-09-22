// Lightweight client-side SEO helper for the SPA.
// Updates <title> and the main meta/OG/Twitter tags for the current view.
// Note: this runs after JS loads. For social-media link previews and
// guaranteed crawling of public pages, prerendering/SSR is still recommended
// (the static tags in index.html cover the home as a baseline).

const SITE_NAME = 'SisBrasFute'
const BASE_URL = 'https://www.sbfa.com.br'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

function setMetaByName(name, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setMetaByProperty(property, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

/**
 * Applies SEO tags for a page.
 *
 * @param {Object} options
 * @param {string} options.title      Page title (without site suffix)
 * @param {string} options.description Meta description
 * @param {string} [options.path]     Path for canonical/OG url (e.g. "/times")
 * @param {string} [options.image]    Absolute image URL for social previews
 * @param {boolean} [options.noindex] When true, asks crawlers not to index
 */
export function useSeo({ title, description, path = '', image = DEFAULT_IMAGE, noindex = false } = {}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME
  const url = `${BASE_URL}${path}`

  document.title = fullTitle

  setMetaByName('description', description)
  setMetaByName('robots', noindex ? 'noindex, nofollow' : 'index, follow')

  setMetaByProperty('og:title', fullTitle)
  setMetaByProperty('og:description', description)
  setMetaByProperty('og:url', url)
  setMetaByProperty('og:image', image)
  setMetaByProperty('og:type', 'website')
  setMetaByProperty('og:site_name', SITE_NAME)

  setMetaByName('twitter:title', fullTitle)
  setMetaByName('twitter:description', description)
  setMetaByName('twitter:image', image)
  setMetaByName('twitter:card', 'summary_large_image')

  setCanonical(url)
}
