import splitImage from "./splitImage.js";
import getAverageColor from "./getAverageColor.js";

const input = document.querySelector("#image");
const main = async () => {
  const images = await splitImage(input.src, 1024, 1024);
  document.body.appendChild(images.fullCanvas);
  console.log(images.items);
};
main();
