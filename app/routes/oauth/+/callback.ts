import { getSessionValue } from '~/.server/auth/cookie'

export async function getCallbackParams(request: Request, pkce = false) {
  let url = new URL(request.url)
  let code = url.searchParams.get('code')
  let state = url.searchParams.get('state')

  let oauth_state = await getSessionValue(request, 'oauth_state')
  let oauth_verifier = pkce
    ? await getSessionValue(request, 'oauth_verifier')
    : undefined
  let redirect_to = await getSessionValue(request, 'redirect_to')

  if (!code || state !== oauth_state || (pkce && !oauth_verifier)) {
    throw new Error('Invalid OAuth callback')
  }

  return { code, oauth_verifier, redirect_to }
}
