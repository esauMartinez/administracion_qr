import axios from 'axios'

export const apiAdministracionQr = axios.create({
  baseURL: 'http://192.168.4.18:5000/api-timbres',
})
