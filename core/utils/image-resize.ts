export const resizeImage = ({ file, maxWidth, maxHeight }: { file: File; maxWidth: number; maxHeight: number }) => {
  return new Promise<File>((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = function () {
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }
      width *= 1.5
      height *= 1.5
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], `${file.name.split('.')[0]}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          })
          resolve(resizedFile)
        } else {
          reject(new Error('Failed to create file.'))
        }
      }, 'image/webp')
    }

    img.onerror = reject
  })
}
