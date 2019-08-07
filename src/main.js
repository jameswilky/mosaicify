import splitImage from "./splitImage.js";
import getAverageColor from "./getAverageColor.js";

const toImages = canvi => {
  return canvi.map(canvas => canvas.toDataURL("image/jpg"));
};

const input = document.querySelector("#image");
const main = async () => {
  // TODO adjust width and height to have an interger square root
  const images = await splitImage(input.src, 1024, 1024);

  // document.body.appendChild(images.fullCanvas);

  // Return a color value for each canvas item
  const mappedImages = {
    ...images,
    items: images.items.map(item => {
      return { item: item, rgb: getAverageColor(item) };
    })
  };

  mappedImages.items.forEach(item => console.log(item.rgb));
};
main();
