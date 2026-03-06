import { login } from '~/.server/auth/cookie'
import { User } from '~/models/.server/user'
import { getCallbackParams } from './+/callback'
import { auth } from './+/google'

export async function loader({ request }) {
  let { code, oauth_verifier, redirect_to } = await getCallbackParams(
    request,
    true,
  )

  let tokens = await auth.validateAuthorizationCode(code, oauth_verifier!)

  let response = await fetch(
    'https://openidconnect.googleapis.com/v1/userinfo',
    { headers: { Authorization: `Bearer ${tokens.accessToken()}` } },
  )

  let profile = await response.json()
  let email = profile?.email
  let name = profile?.name || profile?.given_name || profile?.email
  let google = {
    id: profile.sub,
    image_url: profile.picture,
  }

  if (!email) throw new Error('Unable to get email from Google')

  let user = await User.findByEmail(email)
  if (!user) {
    user = await User.create({
      email,
      name,
      verified_at: new Date(),
      meta: { auth: { google } },
    })
  } else {
    if (!user.verified_at) {
      user = await User.update(user.id, { verified_at: new Date() })
    }
    await User.updateJson(user, 'meta.auth.google', google)
  }

  return await login(request, user, {
    redirect_to,
    toast: 'Successfully logged in',
  })
}
