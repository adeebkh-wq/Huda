import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const TILE_IMAGE_DIRECTORY = `${FileSystem.documentDirectory}tile-images/`;

function extensionFor(uri: string, mimeType?: string | null) {
  const mimeExtension = mimeType?.split('/')[1]?.replace('jpeg', 'jpg');
  if (mimeExtension && /^[a-z0-9]+$/i.test(mimeExtension)) return mimeExtension;

  const uriExtension = uri.split('?')[0]?.match(/\.([a-z0-9]+)$/i)?.[1];
  return uriExtension && /^[a-z0-9]+$/i.test(uriExtension) ? uriExtension : 'jpg';
}

export async function persistTileImage(uri: string, mimeType?: string | null) {
  if (Platform.OS === 'web' || !FileSystem.documentDirectory || uri.startsWith(TILE_IMAGE_DIRECTORY)) {
    return uri;
  }

  await FileSystem.makeDirectoryAsync(TILE_IMAGE_DIRECTORY, { intermediates: true });
  const destination = `${TILE_IMAGE_DIRECTORY}tile-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${extensionFor(uri, mimeType)}`;

  await FileSystem.copyAsync({ from: uri, to: destination });
  return destination;
}