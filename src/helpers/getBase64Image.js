const getBase64Image = imgUrl => {
  return new Promise(resolve => {
    const img = new Image();

    // onload fires when the image is fully loaded, and has width and height
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      // dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
      resolve(dataURL); // the base64 string
    };

    // set attributes and src
    img.setAttribute("crossOrigin", "anonymous"); //
    img.src = imgUrl;
  });
};

export default getBase64Image;
