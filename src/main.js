import createMosaic from "./helpers/Mosaic/createMosaic.js";
import gridTemplate from "./views/gridTemplate.js";
import formToJSON from "./helpers/formToJSON.js";
import getFileName from "./helpers/getFileName.js";
import toImage from "./helpers/toImage.js";
import Pixabay from "./helpers/pixabay.js";
import scaleImage from "../src/helpers/scaleImage.js";
const drawMosaic = (mosaic, canvas) => {
  const { width, height, fragments } = mosaic;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  fragments.forEach(({ mosaicImage, coords }) =>
    ctx.drawImage(mosaicImage, coords.x, coords.y)
  );
};
const uploadImage = (file, w, h) => {
  // Takes in a file and returns an image of that specified size
  return new Promise(resolve => {
    toImage(file).then(img => {
      scaleImage(img.src, w, h).then(({ src, width, height }) => {
        state.uploadedFile = { src, width, height };
        resolve(uploadedFile);
      });
    });
  });
};

window.onload = () => {
  const $ = {
    body: document.querySelector("body"),
    submit: document.querySelector(".submit"),
    form: document.forms["searchForm"],
    fileInput: document.querySelector("#fileUpload")
  };
  const state = {
    uploadedFile: null, // is assigned with uploading after an image is uploaded
    mosaic: null,
    settings: {
      scale: 1,
      h: 1024 * 1,
      w: 1024 * 1
    }
  };
  const registerEvents = () => {
    $.submit.addEventListener("click", async e => {
      const start = performance.now();
      e.preventDefault();

      const {
        settings: { scale, w, h },
        mosiac,
        uploadedFile
      } = state;
      const form = formToJSON($.form.elements);
      // TODO validate form

      const pixabay = Pixabay(20);
      const pathsPromise = pixabay.getImages(form.mosaicImages);

      const image = !uploadedFile
        ? await pixabay.getImage(form.targetImage)
        : null;

      const { src, width, height } = uploadedFile
        ? uploadedFile
        : await scaleImage(image.src, w, h);

      // Create Web Worker call here and listen toe response once mosaic is created
      state.mosaic = await createMosaic(
        src,
        width,
        height,
        scale,
        pathsPromise
      );

      const MosaicCreated = performance.now();
      console.log(
        `Created Mosaic in : ${(MosaicCreated - start) / 1000} seconds`
      );

      const end = performance.now();

      // const canvas = document.querySelector(".outputCanvas");
      // drawMosaic(state.mosaic, canvas);

      console.log(`Created Grid in : ${(end - MosaicCreated) / 1000}`);
      console.log(`Finished. Total Time : ${(end - start) / 1000} seconds`);
    });

    $.fileInput.addEventListener("change", function() {
      // Set form input to file name
      const fileName = getFileName(this.value).split(".")[0];
      const target = $.form.querySelector("input[name=targetImage]");
      target.value = fileName;

      // Convert uploaded Image to a file
      const file = document.querySelector('input[type="file"]').files[0];
      state.uploadedImage = uploadImage(file, 1024, 1024);
    });
  };
  registerEvents();
};

/* Primitive modificatons*/
Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};
