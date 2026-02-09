import { environment } from "../../../environments/environment";

type ImageSize =  'card' | 'detail' | 'thumb';

const IMAGE_SIZES: Record<ImageSize, number> = {
  thumb: 10,  
  card: 125,
  detail: 235,
};

export function getCloudinaryUrl(
  publicId: string,
  size: ImageSize = 'card',
): string {
  if(!publicId) {
    return '';
  }

  const width = IMAGE_SIZES[size];

  return `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/q_auto,f_auto,w_${width}/v1770121610/feedthekids/${publicId}`;

}
