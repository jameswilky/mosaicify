import FastAverageColor from "../../../node_modules/fast-average-color/dist/index.es6.js";
const fac = new FastAverageColor();

const getAverageColor = image => {
  // TODO this is messy, refactor later. Neccassary for images that have not been sized correctly
  let rgb;
  try {
    rgb = fac
      .getColor(image)
      .rgb.match(/\d+/g)
      .map(color => parseInt(color));
  } catch (e) {
    // If error retreiving color, give it a white value
    rgb = [0, 0, 0];
  }

  return rgb;
};

export default getAverageColor;
