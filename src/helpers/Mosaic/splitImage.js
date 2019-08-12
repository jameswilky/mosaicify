import getAverageColor from "../Mosaic/getAverageColor.js";
import scaleImage from "../scaleImage.js";

const getClippedRegion = (img, x, y, width, height) => {
  // Takes in an image and crops a specified chunk and returns a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  return canvas;
};

// const getCoords = (image, w, h, canvas, scale) => {
//   // Splits an image into canvas elements of width w and height h and returns an array of canvas elements
//   const c = scale ** 2;
//   const ctx = canvas.getContext("2d");

//   // const coords = [];
//   const canvi = [];
//   for (let row = 0; row < h; row++) {
//     let y = (row * h) / c;
//     for (let col = 0; col < w; col++) {
//       let x = (col * w) / c;
//       const clip = getClippedRegion(image, x, y, c, c);
//       ctx.drawImage(clip, x, y);
//       canvi.push(clip);
//       coords.push({ x, y });
//     }
//   }
//   return canvi;
// };
const mapColor = (image, x, y, w, h) => {
  console.log(w, h);
  // Reference https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
  const canvas = new OffscreenCanvas(w, h);
  let testCanvas = document
    .createElement("canvas")
    .getContext("bitmaprenderer");

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, x, y, w, h, 0, 0, w, h);

  const rgb = getAverageColor(canvas);
  const fragment = canvas.transferToImageBitmap();
  testCanvas.transferFromImageBitmap(fragment);
  return {
    fragment,
    rgb,
    coords: { x, y },
    testCanvas: testCanvas.canvas.toDataURL("image/jpg")
  };
};
const fragment = (image, mapColor, w, h, scale) => {
  // Splits an image into canvas elements of width w and height h and returns an array of canvas elements
  const c = scale ** 2;
  const fragments = [];
  console.log(c);
  for (let row = 0; row < h; row++) {
    let y = (row * h) / c;
    for (let col = 0; col < w; col++) {
      let x = (col * w) / c;
      fragments.push(mapColor(image, x, y, w, h));
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
  console.log(w, h, scale, cols, rows);

  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const mosaic = {
      width: w,
      height: h,
      nCols: cols,
      nRows: rows,
      fragments: [],
      image: null
    };

    createImage(src).then(img => {
      const temp = document.body.appendChild(img);
      temp.style.visibility = "hidden";
      temp.style.display = "none";
      mosaic.image = img;
      mosaic.fragments = fragment(img, mapColor, cols, rows, scale);
      console.log(mosaic);
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
