export const responseInterceptor = (response: any): any => {
  // Aquí puedes transformar la respuesta si lo necesitas
  return response
}

export const responseErrorInterceptor = (error: any) => {
  // Aquí puedes loggear o transformar el error
  return Promise.reject(error)
} 