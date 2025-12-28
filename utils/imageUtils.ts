import * as ImageManipulator from 'expo-image-manipulator'
import * as FileSystem from 'expo-file-system'

const MAX_SIZE_KB = 100

export async function compressImage(uri: string) {
  let quality = 0.7
  let width = 1024
  let resultUri = uri

  while (true) {
    const result = await ImageManipulator.manipulateAsync(
      resultUri,
      [{ resize: { width } }],
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG
      }
    )

    const info = await FileSystem.getInfoAsync(result.uri)
    const sizeKB = info.size ? info.size / 1024 : 0

    if (sizeKB <= MAX_SIZE_KB) {
      return result.uri
    }

    // Reduce further
    quality -= 0.1
    width -= 200

    if (quality <= 0.1 || width <= 400) {
      // Safety exit (don’t destroy image)
      return result.uri
    }

    resultUri = result.uri
  }
}
