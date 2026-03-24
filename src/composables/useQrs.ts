import type { Guia } from '@/interfaces/guia'
import { getQrs } from '@/services/guias'
import { onMounted, ref } from 'vue'

export const useQrs = () => {
  const guias = ref<Guia[]>([])

  const getQrsFunction = async () => {
    guias.value = await getQrs('413590')
  }

  onMounted(() => {
    getQrsFunction()
  })

  return {
    guias,
  }
}
