import { getAccessToken } from '../authSession'

const authHeader = async () => {
  const accessToken = getAccessToken()
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}

export default authHeader
