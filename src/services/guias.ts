import { apiAdministracionQr } from '@/api'
import type { Guia } from '@/interfaces/guia'

export const getQrs = async (term: string): Promise<Guia[]> => {
  const { data } = await apiAdministracionQr.get('/timbres', {
    params: {
      term,
    },
  })

  return data
}
