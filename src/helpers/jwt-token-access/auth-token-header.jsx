import { handleTokenRefresh } from '../api_helper'

const authHeader = async () => {
  const obj = JSON.parse(localStorage.getItem('authUser'))
  console.log('authHeader', obj)
  if (obj && obj.tokens.access.token) {
    const accessTokenExpiration = new Date(obj.tokens.access.expires).getTime()
    const currentTime = new Date().getTime()

    if (accessTokenExpiration && accessTokenExpiration < currentTime) {
      // Access token is expired, refresh it
      await handleTokenRefresh()
    }
    return { Authorization: obj.tokens.access.token }
  } else {
    return {}
  }
}

authHeader();
