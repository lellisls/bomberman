export default function imageGenerator(imagePath) {
  return new Promise((resolve, reject) => {
    const image = new Image(64, 64);
    image.onload = () => {
      resolve(image);
    };
    image.src = imagePath;
  });
}
