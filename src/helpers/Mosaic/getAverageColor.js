import FastAverageColor from "../../../node_modules/fast-average-color/dist/index.es6.js";
const fac = new FastAverageColor();
// TODO
const getAverageColor = image => {
  let rgb;
  rgb = fac
    .getColor(image, { mode: "precision" })
    .rgb.match(/\d+/g)
    .map(color => parseInt(color));

  return rgb;
};

export default getAverageColor;
