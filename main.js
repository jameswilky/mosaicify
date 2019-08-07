const resizeImage = function(src, w, h) {
  const canvas = document.createElement("canvas");

  // let canvas = document.querySelector("#canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;

  const img = new Image();

  img.onload = () => {
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
  };
  img.src = src;
  return canvas;
};

const getClippedRegion = (img, x, y, width, height) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  return canvas;
};

const splitImage = (image, h, v, dest) => {
  const ctx = dest.getContext("2d");

  const canvi = [];
  for (let row = 0; row < v; row++) {
    let y = row * 32;
    for (let col = 0; col < h; col++) {
      let x = col * 32;
      const clip = getClippedRegion(image, x, y, 32, 32);
      ctx.drawImage(clip, x, y);
      canvi.push(clip);
    }
  }
};

const canvas = document.querySelector("#canvas");
const resizedImage = resizeImage("./images/a.jpg", 1024, 1024);

// This does not need to be seen, but needs to be physically added to DOM to be recognised as an image correctly
const temp = document.body.appendChild(resizedImage);
temp.style.visibility = "hidden";
temp.style.display = "none";
setTimeout(() => {
  splitImage(resizedImage, 32, 32, canvas);
}, 1000);
const toImages = canvi => {
  return canvi.map(canvas => canvas.toDataURL("image/jpg"));
};

// const images = toImages(canvi);
