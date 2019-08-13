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

    createImage(src, w, h).then(imgData => {
      // mosaic.image = img;
      // const myWorker = new Worker("../../../src/worker.js");
      // myWorker.postMessage(
      //   JSON.parse(JSON.stringify({ imgData, cols, rows, scale }))
      // );
      // myWorker.onmessage = msg => {
      //   console.log(msg);
      //   // mosaic.fragments = msg.data
      //   // mosaic.image = msg.img
      //   resolve(mosaic);
      // };
    });
  });
};

const createImage = (path, w, h) =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      // const canvas = document.createElement("canvas"); // TODO make async
      // canvas.width = w;
      // canvas.height = h;
      // const ctx = canvas.getContext("2d");
      // ctx.drawImage(img, 0, 0);
      // const imageData = ctx.getImageData(0, 0, w, h);
      // resolve(imageData);
      resolve(img);
    };

    img.src = path;
  });

export default splitImage;
