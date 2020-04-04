export default function imageGenerator(imagePath) {
  const cache = new Map();
  return new Promise((resolve, reject) => {
    if (cache.has(imagePath)) {
      return cache.get(imagePath);
    }
    const image = new Image(64, 64);
    image.onload = () => {
      cache.set(imagePath, image);
      resolve(image);
    };
    image.src = imagePath;
  });
}
