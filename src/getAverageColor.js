import ColorThief from "../node_modules/colorthief/dist/color-thief.mjs";
import FastAverageColor from "../node_modules/fast-average-color/dist/index.es6.js";

const colorThief = new ColorThief();
const fac = new FastAverageColor();

const getAverageColor = image => {
  // TODO this is messy, refactor later. Neccassary for images that have not been sized correctly
  let rgb;
  try {
    // rgb = colorThief.getColor(image);

    // Much more accurate
    rgb = fac
      .getColor(image)
      .rgb.match(/\d+/g)
      .map(color => parseInt(color));
  } catch (e) {
    // If error retreiving color, give it a white value
    rgb = [255, 255, 255];
  }

  return rgb;
};

export default getAverageColor;
