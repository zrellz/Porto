export const colors = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#FF33A6',
  '#33FFF6',
  '#FF8F33',
  '#C70039',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#581845',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#581845',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#581845',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#581845',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#581845',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#581845',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#581845',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
  '#FF5733',
  '#C70039',
  '#581845',
  '#900C3F',
  '#DAF7A6',
  '#FFC300',
]

export function colorIndex(index: number) {
  return colors[index % colors.length]
}
export function numberToBrightHexColor(num: number): string {
  // Fungsi untuk membatasi nilai agar tetap cerah
  function limitToBrightRange(value: number): number {
    const min = 150 // Batas minimum untuk membuat warna lebih cerah
    const max = 255 // Batas maksimum untuk nilai RGB
    return Math.floor((value % (max - min)) + min)
  }

  // Pastikan nomor berada dalam rentang 0 hingga 16777215 (FFFFFF dalam hex)
  const maxHexValue = 0xffffff
  const safeNum = num % maxHexValue

  // Pisahkan nomor menjadi komponen R, G, dan B
  const r = limitToBrightRange((safeNum >> 16) & 0xff)
  const g = limitToBrightRange((safeNum >> 8) & 0xff)
  const b = limitToBrightRange(safeNum & 0xff)

  // Gabungkan komponen R, G, dan B menjadi string hex
  const hexString = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')

  // Tambahkan '#' di depan string hex
  return `#${hexString}`
}

export function colorOpacity(hexColor: string, opacity: number) {
  // Convert hex color to RGB
  if (typeof hexColor !== 'string' || !/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hexColor)) return hexColor

  // Ensure the hex is 6 characters long
  if (hexColor.length === 4) {
    hexColor = `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`
  }

  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // Convert opacity to a hex value
  const a = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()

  return `#${r.toString(16).padStart(2, '0').toUpperCase()}${g.toString(16).padStart(2, '0').toUpperCase()}${b.toString(16).padStart(2, '0').toUpperCase()}${a}`
}
