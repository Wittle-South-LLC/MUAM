import { defaultVerbs } from 'redux-immutable-model'

export function applyHeaders(verb, headers) {
  if (typeof document !== 'undefined' && document.cookie && verb !== defaultVerbs.LOGIN) {
    let token = (verb === defaultVerbs.HYDRATE || verb === defaultVerbs.LOGOUT) ? getCookie('csrf_refresh_token') : getCookie('csrf_access_token')
    if (verb === defaultVerbs.HYDRATE || verb === defaultVerbs.LOGOUT) {
      console.log('Picking csrf_refresh_token based on verb', getCookie('csrf_refresh_token'))
    } else {
      console.log('Picking csrf_access_token based on verb', getCookie('csrf_access_token'))
    }
    headers['headers']['X-CSRF-TOKEN'] = token
  }
  return headers
}

/* This function came from one of the answers to a StackOverflow question:
 * https://stackoverflow.com/questions/10730362/get-cookie-by-name
 * Credit to John S.
 * TODO: Test to see if the warnings about unnecessary escapes in
 *       the regex are correct.
 */
function getCookie (name) {
  function escape (s) {
    return s.replace(/([.*+?^${}()|[\]/\\])/g, '\\$1')
  }
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'))
  return match ? match[1] : null
}
