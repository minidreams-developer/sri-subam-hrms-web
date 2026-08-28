import { getRoles, login } from '../services/apiServices'
import {
  clearAuthSession,
  getAccessToken,
  getStoredSession,
  refreshAuthSession,
  storeAuthTokens,
} from './authSession'

// Function to get stored auth user data
export const getStoredAuthUser = () => {
  return getStoredSession()
}

// Function to store auth user data
export const setStoredAuthUser = (userData) => {
  try {
    return Boolean(storeAuthTokens(userData, getStoredSession()))
  } catch (error) {
    console.error('Error storing auth user:', error)
    return false
  }
}

// Function to clear auth data
export const clearAuthData = () => {
  clearAuthSession()
}

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const authUser = getStoredAuthUser()
  if (!getAccessToken()) return false

  const accessTokenExpiry = new Date(authUser.tokens.access.expires).getTime()
  return !Number.isFinite(accessTokenExpiry) || accessTokenExpiry > Date.now()
}

// Function to handle token refresh
export const handleTokenRefresh = async () => {
  try {
    return Boolean(await refreshAuthSession())
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error refreshing token:', error)
    clearAuthData()
    return false
  }
}

// Function to fetch all roles and find user's role permissions
export const fetchAndStoreUserPermissions = async (userRole) => {
  try {
    if (!userRole) {
      console.warn('No user role provided for permission fetch')
      return null
    }

    // Fetch all roles from API
    const response = await getRoles()
    console.log('Roles API Response:', response)

    let rolesList = []

    // Handle different response formats
    if (response && Array.isArray(response)) {
      rolesList = response
    } else if (response?.results && Array.isArray(response.results)) {
      rolesList = response.results
    } else if (response?.data && Array.isArray(response.data)) {
      rolesList = response.data
    }

    console.log('Roles list:', rolesList)

    // Find the role matching user's role name
    const matchedRole = rolesList.find((role) => role.name === userRole)

    if (matchedRole) {
      console.log('Matched role:', matchedRole)
      
      // Store user permissions in localStorage
      if (matchedRole.permissions) {
        localStorage.setItem('userPermissions', JSON.stringify(matchedRole.permissions))
        console.log('User permissions stored successfully')
        return matchedRole.permissions
      }
    } else {
      console.warn(`Role "${userRole}" not found in roles list`)
    }

    return null
  } catch (error) {
    console.error('Error fetching/matching roles:', error)
    return null
  }
}

// Function to handle login
export const handleLogin = async (email, password) => {
  try {
    const response = await login({
      email,
      password,
    })

    console.log('Login API Response:', response)

    if (response?.tokens) {
      // Store initial login data
      setStoredAuthUser(response)

      // Fetch all roles and find user's role permissions
      if (response?.user?.role) {
        const permissions = await fetchAndStoreUserPermissions(response.user.role)
        
        if (permissions) {
          console.log('Permissions successfully fetched and stored')
        } else {
          console.warn('No permissions found for user role')
        }
      } else {
        console.warn('No user role in login response')
      }

      return { success: true, data: response }
    }
    return { success: false, error: 'Invalid credentials' }
  } catch (error) {
    console.error('Login API Error:', error.response || error)
    return {
      success: false,
      error: error?.response?.data?.message || 'Login failed',
    }
  }
}
