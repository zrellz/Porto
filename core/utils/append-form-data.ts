/**
 * Convert an object to FormData
 * @param {object} obj - The object to convert
 * @param {FormData} [form] - The FormData instance (used for recursion)
 * @param {string} [namespace] - The current namespace (used for recursion)
 * @returns {FormData} - The resulting FormData instance
 */
export function objectToFormData(obj: Record<string, any>, form?: FormData, namespace?: string): FormData {
  const formData = form || new FormData()

  for (const property in obj) {
    console.log('property', property, obj[property])
    if (obj.hasOwnProperty(property)) {
      const formKey = namespace ? `${namespace}[${property}]` : property
      if (obj[property] instanceof Date) {
        formData.append(formKey, obj[property].toISOString())
      } else if (obj[property] instanceof Blob || obj[property] instanceof File) {
        formData.append(formKey, obj[property])
      } else if (
        typeof obj[property] === 'object' &&
        !(obj[property] instanceof Blob || obj[property] instanceof File)
      ) {
        objectToFormData(obj[property], formData, formKey)
      } else {
        formData.append(formKey, obj[property])
      }
    }
  }

  return formData
}
