export const baseResponse = <T = any>({ message, result }: { message: string; result?: T }) => {
  const data = {
    message,
    result,
  }
  return data
}
export const jsonResponse = ({ message, result }: { message: string; result?: any }) => {
  const data = {
    message,
    result,
  }
  return JSON.stringify(data)
}
