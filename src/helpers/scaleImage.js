// The function that scales an images with canvas then runs a callback.
function scaleImage(url, maxWidth, maxHeight = false) {
  const img = new Image();

  // When the images is loaded, resize it in canvas.
  return new Promise(resolve => {
    img.onload = function() {
      let height, width;
      // Scale based on the highest dimension
      if (maxHeight === false) {
        // If no height specifed, make the width and height the same size
        height = maxWidth;
        width = maxWidth;
      } else if (img.width > img.height) {
        width = maxWidth;
        height = (maxWidth / img.width) * img.height;
      } else {
        height = maxHeight;
        width = (maxHeight / img.height) * img.width;
      }
      const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      // draw the img into canvas
      ctx.drawImage(this, 0, 0, width, height);

      // Run the callback on what to do with the canvas element.
      resolve({
        canvas: canvas,
        src: canvas.toDataURL("image/jpg"),
        width: width,
        height: height
      });
    };

    img.src = url;
  });
}

export default scaleImage;
