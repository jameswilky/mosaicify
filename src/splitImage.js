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

const fragmentToCanvi = (image, w, h, dest) => {
  // Splits an image into canvas elements of width w and height h and returns an array of canvas elements
  const ctx = dest.getContext("2d");

  const canvi = [];
  for (let row = 0; row < h; row++) {
    let y = row * h;
    for (let col = 0; col < w; col++) {
      let x = col * w;
      const clip = getClippedRegion(image, x, y, w, h);
      ctx.drawImage(clip, x, y);
      canvi.push(clip);
    }
  }
  return canvi;
};

const toImages = canvi => {
  return canvi.map(canvas => canvas.toDataURL("image/jpg"));
};

const splitImage = (src, w, h) => {
  // Takes an in image url, a width and a height and returns an object containing the fragmented images

  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    // const ctx = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;

    const images = {
      width: w,
      height: h,
      nCols: Math.sqrt(w),
      nRows: Math.sqrt(h),
      items: [],
      fullCanvas: canvas
    };
    resizeImage(src, w, h).then(img => {
      // This does not need to be seen, but needs to be physically added to DOM to be recognised as an image correctly
      const temp = document.body.appendChild(img);
      temp.style.visibility = "hidden";
      temp.style.display = "none";

      images.items = fragmentToCanvi(img, Math.sqrt(w), Math.sqrt(h), canvas);
      resolve(images);
    });
  });
};

export default splitImage;
