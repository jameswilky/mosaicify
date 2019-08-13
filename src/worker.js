const mapColor = (image, x, y, w, h) => {
  // Reference https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
  const canvas = new OffscreenCanvas(w, h); // TODO make async

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, x, y, w, h, 0, 0, w, h);

  // const rgb = getAverageColor(canvas);
  const rgb = [00, 00, 00];
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

self.onmessage = msg => {
  const { imgData, cols, rows, scale } = msg.data;
  console.log(imgData.data.length);
  console.log(imgData.data);
  // const fragments = fragment(imgData, mapColor, cols, rows, scale);
  postMessage(fragments);
};
