import { post } from './api_helper'
import { LOGIN } from './url_helper'

// Function to get stored auth user data
export const getStoredAuthUser = () => {
  try {
    const authUser = localStorage.getItem('authUser')
    return authUser ? JSON.parse(authUser) : null
  } catch (error) {
    console.error('Error parsing auth user:', error)
    return null
  }
}

// Function to store auth user data
export const setStoredAuthUser = (userData) => {
  try {
    localStorage.setItem('authUser', JSON.stringify(userData))
    return true
  } catch (error) {
    console.error('Error storing auth user:', error)
    return false
  }
}

// Function to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('authUser')
}

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const authUser = getStoredAuthUser()
  if (!authUser?.tokens?.access?.token) return false

  const accessTokenExpiry = new Date(authUser.tokens.access.expires).getTime()
  return accessTokenExpiry > Date.now()
}

// Function to handle token refresh
export const handleTokenRefresh = async () => {
  const authUser = getStoredAuthUser()
  const refreshToken = authUser?.tokens?.refresh?.token

  if (!refreshToken) {
    clearAuthData()
    return false
  }

  try {
    const response = await post('/refresh-token', {
      refresh_token: refreshToken,
    })

    if (response?.data?.tokens) {
      // Update stored auth data with new tokens
      const updatedAuthUser = {
        ...authUser,
        tokens: response.data.tokens,
      }
      setStoredAuthUser(updatedAuthUser)
      return true
    }
    return false
  } catch (error) {
    console.error('Error refreshing token:', error)
    clearAuthData()
    return false
  }
}

// Function to handle login
export const handleLogin = async (email, password) => {
  try {
    const response = await post(LOGIN, {
      email,
      password,
    })

    console.log('Login API Response:', response);

    if (response?.tokens) {
      setStoredAuthUser(response)
      return { success: true, data: response }
    }
    return { success: false, error: 'Invalid credentials' }
  } catch (error) {
    console.error('Login API Error:', error.response || error);
    return {
      success: false,
      error: error?.response?.data?.message || 'Login failed',
    }
  }
}
