export const requestInterceptor = (config: any): any => {
  // Ejemplo: agregar token si está presente
  // if (refreshToken) {
  //   config.headers['Authorization'] = `Bearer ${refreshToken}`
  // }
  return config
}

export const requestErrorInterceptor = (error: any) => {
  // Aquí puedes loggear o transformar el error
  return Promise.reject(error)
} 