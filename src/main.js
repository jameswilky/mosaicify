import splitImage from "./splitImage.js";
import getAverageColor from "./getAverageColor.js";
import getMosaicImages from "./getMosaicImages.js";

const toImages = canvi => {
  return canvi.map(canvas => canvas.toDataURL("image/jpg"));
};

const input = document.querySelector("#image");
const main = async () => {
  // TODO adjust width and height to have an interger square root

  // Split the input image into fragments
  const images = await splitImage(input.src, 625, 400);

  // Return a color value for each canvas item
  const mappedImages = {
    ...images,
    items: images.items.map(item => {
      return { item: item, rgb: getAverageColor(item) };
    })
  };

  // Get the mosaic Images
  const mosaicImages = await getMosaicImages();

  // Retrurn a color value for each mosaicImage
  const mappedMosaicImages = mosaicImages.map(image => {
    return { image: image, rgb: getAverageColor(image) };
  });
  console.log(mappedMosaicImages);

  // Display Image
  document.body.appendChild(images.fullCanvas);
};
main();
