import type { Guia } from '@/interfaces/guia'
import { getQrs } from '@/services/guias'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useQrs = () => {
  const isLoading = ref<boolean>(false)
  const { params } = useRoute()
  const guias = ref<Guia[]>([])

  const getQrsFunction = async () => {
    isLoading.value = true
    const guiaParam = Array.isArray(params.guia) ? params.guia[0] : params.guia

    if (!guiaParam) {
      guias.value = []
      return
    }

    await getQrs(guiaParam)
      .then((data) => {
        guias.value = data
      })
      .catch((error) => console.log(error))
      .finally(() => {
        isLoading.value = false
      })
  }

  onMounted(() => {
    getQrsFunction()
  })

  return {
    guias,

    isLoading,
  }
}
