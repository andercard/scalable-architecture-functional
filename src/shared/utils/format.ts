// Formatting utilities for the application

/**
 * Formats a date to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formats a number to punctuation format
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num)
}

/**
 * Truncates text to a specific length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Capitalizes the first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Formats duration in minutes to readable format
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

/**
 * Formats rating from 0-10 to stars
 */
export const formatRating = (rating: number): string => {
  const stars = '★'.repeat(Math.floor(rating / 2))
  const halfStar = rating % 2 >= 1 ? '☆' : ''
  return stars + halfStar
}

/**
 * Generates a color based on anime genre
 */
export const getGenreColor = (genreId: number): string => {
  const colors = {
    1: '#ff4757', // Action
    2: '#2ed573', // Adventure
    4: '#ffa502', // Comedy
    8: '#3742fa', // Drama
    10: '#a55eea', // Fantasy
    14: '#2f3542', // Horror
    7: '#ff6348', // Mystery
    22: '#ff6b6b', // Romance
    24: '#70a1ff', // Sci-Fi
    36: '#7bed9f', // Slice of Life
    30: '#ff9ff3', // Sports
    37: '#54a0ff', // Supernatural
    41: '#5f27cd'  // Thriller
  }
  
  return colors[genreId as keyof typeof colors] || '#747d8c'
} 