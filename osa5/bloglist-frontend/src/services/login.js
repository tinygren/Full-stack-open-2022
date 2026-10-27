import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  console.log('loginService: login called with credentials:', credentials)
  try {
    const response = await axios.post(baseUrl, credentials)
    console.log('loginService: response from login', response)
    return response.data
  } catch (error) {
    console.error('loginService: error during login', error)
    throw error
  }
}

export default { login }
