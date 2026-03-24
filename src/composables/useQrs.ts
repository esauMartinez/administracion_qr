import type { Guia } from '@/interfaces/guia'
import { getQrs } from '@/services/guias'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useQrs = () => {
  const { params } = useRoute()
  const guias = ref<Guia[]>([])

  const getQrsFunction = async () => {
    const guiaParam = Array.isArray(params.guia) ? params.guia[0] : params.guia

    if (!guiaParam) {
      guias.value = []
      return
    }

    guias.value = await getQrs(guiaParam)
  }

  onMounted(() => {
    getQrsFunction()
  })

  return {
    guias,
  }
}
