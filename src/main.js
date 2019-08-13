import createMosaic from "./createMosaic.js";
import Pixabay from "./pixabay.js";
import { formToJSON, scaleImage, getFileName, toImage } from "./utilities.js";

const App = pixabay => {
  const $ = {
    // Selectors
    body: document.querySelector("body"),
    submit: document.querySelector(".submit"),
    form: document.forms["searchForm"],
    fileInput: document.querySelector("#fileUpload"),
    canvas: document.querySelector(".mosaicCanvas"),
    canvasContainer: document.querySelector(".mosaicContainer"),
    loading: document.querySelector(".loading"),
    backButton: document.querySelector("button[type=back]"),
    downloadButton: document.querySelector("button[type=download]"),
    downloadLink: document.querySelector("a[type=download]")
  };

  const state = {
    uploadedFile: null, // is assigned with uploading after an image is uploaded
    mosaic: null,
    settings: {
      scale: 2,
      h: 1024 * 0.25,
      w: 1024 * 0.25
    },
    views: {
      searchForm: null
    }
  };

  const cacheHomepage = () => {
    return document.forms["searchForm"].cloneNode(true);
  };

  const showElement = element => {
    if (element === "form") {
      $.form.style.display = "grid";
      $.canvasContainer.style.display = "none";
      $.loading.style.display = "none";
    } else if (element === "canvas") {
      $.form.style.display = "none";
      $.canvasContainer.style.display = "grid";
      $.loading.style.display = "none";
    } else if (element === "loading") {
      $.form.style.display = "none";
      $.canvasContainer.style.display = "none";
      $.loading.style.display = "grid";
    }
  };

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
  const createDownloadLink = () => {
    const image = $.canvas.toDataURL("image/jpg");
    $.downloadLink.href = image;
    $.downloadLink.download = `mosaic_${state.settings.w}x${state.settings.h}`;
  };

  const bindEvents = () => {
    $.submit.addEventListener("click", async e => {
      const start = performance.now();
      e.preventDefault();

      // TODO validate form

      const { mosaicImages, hostImage } = formToJSON($.form.elements);
      const pathsPromise = pixabay.getImages(mosaicImages);

      showElement("loading");

      const image = !state.uploadedFile
        ? await pixabay.getImage(hostImage)
        : null;

      const { src, width, height } = state.uploadedFile
        ? state.uploadedFile
        : await scaleImage(image.src, state.settings.w, state.settings.h);

      state.mosaic = await createMosaic(
        src,
        width,
        height,
        state.settings.scale,
        pathsPromise
      );

      drawMosaic(state.mosaic, $.canvas);
      createDownloadLink();
      showElement("canvas");
      const end = performance.now();

      console.log(`Finished. Total Time : ${(end - start) / 1000} seconds`);
    });
    $.fileInput.addEventListener("change", function() {
      // Set form input to file name
      const fileName = getFileName(this.value).split(".")[0];
      const target = $.form.querySelector("input[name=targetImage]");
      target.value = fileName;

      // Convert uploaded Image to a file
      const file = document.querySelector('input[type="file"]').files[0];
      state.uploadedImage = uploadImage(file, state.width, state.height);
    });
  };
  const run = () => {
    bindEvents();
    state.views.searchForm = cacheHomepage();
  };
  return {
    run
  };
};

/* Primitive modificatons*/
Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};

window.onload = () => {
  const pixabay = Pixabay(20);
  App(pixabay).run();
};
