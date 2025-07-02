import { ref, computed, onMounted, watch } from 'vue'
import { useAnimeStore } from '../stores/anime.store'
import { useDebounceFn } from '@vueuse/core'

export const useAnimeList = () => {
  const animeStore = useAnimeStore()

  const searchQuery = ref('')
  const activeFilter = ref<'top' | 'seasonal' | 'all'>('top')

  const animes = computed(() => animeStore.animes)
  const isLoading = computed(() => animeStore.isLoading)
  const error = computed(() => animeStore.error)
  const currentPage = computed(() => animeStore.currentPage)
  const totalItems = computed(() => animeStore.totalAnimes)

  const debouncedSearch = useDebounceFn((query: string) => {
    animeStore.searchAnimes(query)
  }, 500)

  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      activeFilter.value = 'all'
      animeStore.currentPage = 1
      debouncedSearch(searchQuery.value)
    } else {
      loadTopAnime()
    }
  }

  const clearSearch = () => {
    searchQuery.value = ''
    animeStore.currentPage = 1
    loadTopAnime()
  }

  const loadTopAnime = async () => {
    activeFilter.value = 'top'
    animeStore.currentPage = 1
    await animeStore.loadTopAnime()
  }

  const loadSeasonalAnime = async () => {
    activeFilter.value = 'seasonal'
    animeStore.currentPage = 1
    await animeStore.loadSeasonalAnime()
  }

  const loadAllAnime = async () => {
    activeFilter.value = 'all'
    animeStore.currentPage = 1
    await animeStore.loadAnimeList()
  }

  const retry = () => {
    if (searchQuery.value.trim()) {
      animeStore.searchAnimes(searchQuery.value)
    } else {
      loadTopAnime()
    }
  }

  const handlePageChange = (page: number) => {
    animeStore.changePage(page)
  }

  onMounted(() => {
    loadTopAnime()
  })

  watch(searchQuery, (newQuery) => {
    if (!newQuery.trim()) {
      loadTopAnime()
    }
  })

  return {
    searchQuery,
    activeFilter,
    animes,
    isLoading,
    error,
    currentPage,
    totalItems,
    handleSearch,
    clearSearch,
    loadTopAnime,
    loadSeasonalAnime,
    loadAllAnime,
    retry,
    handlePageChange
  }
} 