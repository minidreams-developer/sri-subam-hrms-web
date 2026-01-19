async function getAccessToken() {
  const token = await sessionStorage.getItem('accessToken');
  return token ? `Bearer ${token}` : null
}

export default getAccessToken
