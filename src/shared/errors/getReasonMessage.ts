/**
 * Mapea el reason de un error a un mensaje de usuario usando un errorMap.
 * @param error - Error recibido del endpoint (puede ser de Axios o estructura propia)
 * @param errorMap - Objeto con los reasons y sus mensajes
 * @returns Mensaje mapeado o undefined si no hay reason mapeado
 */
export function getReasonMessage<T extends Record<string, string>>(
  error: any,
  errorMap: T
): string | undefined {
  const reason = error?.response?.data?.reason;
  if (reason && errorMap[reason as keyof T]) {
    return errorMap[reason as keyof T];
  }
  return undefined;
} 