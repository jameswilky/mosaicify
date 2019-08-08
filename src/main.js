import createMosaic from "./createMosaic.js";
import gridTemplate from "./components/gridTemplate.js";

const main = async () => {
  const input = document.querySelector(".inputImage");

  const prefix = "../images/mosaic/";
  // This should only contain data urls, not http images blocked by Cors
  const paths = [
    `${prefix}black.jpg`,
    `${prefix}white.jpg`,
    `${prefix}yellow.jpg`
  ];
  const mosaic = await createMosaic(
    input.src,
    input.width,
    input.height,
    paths
  );

  const grid = document.createElement("div");
  grid.innerHTML = gridTemplate(mosaic);
  document.body.appendChild(grid);
};
