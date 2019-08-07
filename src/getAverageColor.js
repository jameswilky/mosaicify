import ColorThief from "../node_modules/colorthief/dist/color-thief.mjs";
const colorThief = new ColorThief();

const getAverageColor = input => {
  // TODO this is messy, refactor later. Neccassary for images that have not been sized correctly
  let rgb;
  try {
    rgb = colorThief.getColor(input);
  } catch (e) {
    // If error retreiving color, give it a white value
    rgb = [255, 255, 255];
  }

  return rgb;
};

export default getAverageColor;
