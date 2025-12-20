import * as ImageManipulator from 'expo-image-manipulator'

export async function compressImage(uri: string) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [],
    {
      compress: 0.4, // 👈 usually gives ~150–250 KB
      format: ImageManipulator.SaveFormat.JPEG
    }
  )

  return result.uri
}
