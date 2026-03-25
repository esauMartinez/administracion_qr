import axios from 'axios'

export const apiAdministracionQr = axios.create({
  baseURL: 'http://192.168.4.213:3000/api-timbres',
})
