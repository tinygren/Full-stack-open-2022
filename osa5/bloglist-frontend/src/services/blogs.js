import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
  console.log('token set in setToken: ', token)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updatedObject) => {
  // 5. update-funktio, joka ottaa parametrina blogin id:n ja päivitetyt tiedot (updatedObject).
  // Se lähettää PUT-pyynnön backendiin, ja palauttaa päivitetyn blogin datan.
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject)
  return response.data
}

const remove = async (removeBlogId) => {
  // 6. remove-funktio, joka ottaa parametrina blogin id:n, ja lähettää DELETE-pyynnön backendiin.
  // Jos poisto onnistuu, funktio palauttaa back-endin vastauksen datan.
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${removeBlogId}`, config)
  console.log('response from remove: ', response)
  return response.data
}

export default { getAll, setToken, create, update, remove }
