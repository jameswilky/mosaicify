const toImage = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = function() {
      const image = new Image();
      image.addEventListener("load", () => {
        resolve(image);
      });
      image.src = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
    }
  });
};

export default toImage;
