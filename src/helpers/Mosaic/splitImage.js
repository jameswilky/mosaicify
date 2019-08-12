const resizeImage = function(src, w, h) {
  const canvas = document.createElement("canvas");

  // let canvas = document.querySelector("#canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  return new Promise(resolve => {
    const img = new Image();
    img.addEventListener("load", () => {
      // https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
      canvas.height = canvas.width * (img.height / img.width);

      // resize to 50%
      const oc = document.createElement("canvas");
      const octx = oc.getContext("2d");

      oc.width = img.width * 0.5;
      oc.height = img.height * 0.5;
      octx.drawImage(img, 0, 0, oc.width, oc.height);

      // step 2
      octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

      // step 3 resize to final
      ctx.drawImage(
        oc,
        0,
        0,
        oc.width * 0.5,
        oc.height * 0.5,
        0,
        0,
        canvas.width,
        canvas.height
      );
      resolve(canvas);
    });
    img.src = src;
  });
};

const getClippedRegion = (img, x, y, width, height) => {
  // Takes in an image and crops a specified chunk and returns a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  return canvas;
};

const getCoords = (image, w, h, scale) => {
  // Splits an image into canvas elements of width w and height h and returns an array of canvas elements
  const coefficient = scale ** 2;

  console.log(image);
  const coords = [];
  for (let row = 0; row < h; row++) {
    let y = (row * h) / coefficient;
    for (let col = 0; col < w; col++) {
      let x = (col * w) / coefficient;
      // TODO improve this
      // const clip = getClippedRegion(image, x, y, w, h);
      // ctx.drawImage(clip, x, y);
      // canvi.push(clip);
      coords.push({ x, y });
    }
  }
  return coords;
};

const splitImage = (src, w, h, scale) => {
  // TODO improve performance
  // Takes an in image url, a width and a height and returns an object containing the fragmented images

  w = Math.floor(Math.sqrt(w)) ** 2;
  h = Math.floor(Math.sqrt(h)) ** 2;
  const cols = Math.sqrt(w) * scale;
  const rows = Math.sqrt(h) * scale;

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
    // mosaic.fragments = fragmentToCanvi(src, cols, rows, canvas, scale);

    // resizeImage(src, w, h).then(img => {
    // This does not need to be seen, but needs to be physically added to DOM to be recognised as an image correctly
    // const temp = document.body.appendChild(img);
    // temp.style.visibility = "hidden";
    // temp.style.display = "none";
    // console.log(img);
    // console.log(src);
    // mosaic.fragments = fragmentToCanvi(img, cols, rows, canvas, scale);

    createImage(src).then(img => {
      mosaic.image = img;
      mosaic.fragments = getCoords(img, cols, rows, scale);
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
