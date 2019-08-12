import getAverageColor from "../Mosaic/getAverageColor.js";
import scaleImage from "../scaleImage.js";

const mapColor = (image, x, y, w, h) => {
  // Reference https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
  const canvas = new OffscreenCanvas(w, h); // TODO make async

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, x, y, w, h, 0, 0, w, h);

  const rgb = getAverageColor(canvas);
  const fragment = canvas.transferToImageBitmap();
  return {
    fragment,
    rgb,
    coords: { x, y }
  };
};
const fragment = (image, mapColor, cols, rows, scale) => {
  // Splits an image into canvas elements and returns an array of canvas elements
  const c = scale ** 2;
  const fragments = [];
  for (let row = 0; row < rows; row++) {
    let y = (row * rows) / c;
    for (let col = 0; col < cols; col++) {
      let x = (col * cols) / c;
      fragments.push(mapColor(image, x, y, cols / c, rows / c));
    }
  }
  return fragments;
};

const splitImage = (src, w, h, scale) => {
  // Takes an in image url, a width and a height and returns an object containing the fragmented images

  w = Math.floor(Math.sqrt(w)) ** 2;
  h = Math.floor(Math.sqrt(h)) ** 2;
  const cols = Math.sqrt(w) * scale;
  const rows = Math.sqrt(h) * scale;

  return new Promise(resolve => {
    const mosaic = {
      width: w,
      height: h,
      nCols: cols,
      nRows: rows,
      fragments: [],
      image: null
    };

    createImage(src).then(img => {
      mosaic.image = img;
      mosaic.fragments = fragment(img, mapColor, cols, rows, scale);
      resolve(mosaic);
    });
  });
};

const createImage = path =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);

    img.src = path;
  });

export default splitImage;
