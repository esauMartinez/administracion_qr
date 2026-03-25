import { apiAdministracionQr } from '@/api'
import type { Guia } from '@/interfaces/guia'

export const getQrs = async (term: string): Promise<Guia[]> => {
  await timer()
  const { data } = await apiAdministracionQr.get('/timbres', {
    params: {
      term,
    },
  })

  return data
}

const timer = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}
