import createMosaic from "./createMosaic.js";
import gridTemplate from "./components/gridTemplate.js";

const main = async () => {
  const input = document.querySelector(".inputImage");

  const mosaic = await createMosaic(input.src, input.width, input.height);

  const grid = document.createElement("div");
  grid.innerHTML = gridTemplate(mosaic);
  document.body.appendChild(grid);
};
main();
