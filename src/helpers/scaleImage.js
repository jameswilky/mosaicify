import toImage from "../helpers/toImage.js";

// The function that scales an images with canvas then runs a callback.
function scaleImage(url, width) {
  const img = new Image();

  // When the images is loaded, resize it in canvas.
  return new Promise(resolve => {
    img.onload = function() {
      const height = (width / img.width) * img.height;
      const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      // draw the img into canvas
      ctx.drawImage(this, 0, 0, width, height);

      // Run the callback on what to do with the canvas element.
      resolve({
        src: canvas.toDataURL("image/jpg"),
        width: width,
        height: height
      });
    };

    img.src = url;
  });
}

export default scaleImage;
