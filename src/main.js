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
    downloadLink: document.querySelector("a[type=download]"),
    hostImageInput: document.querySelector("input[name=hostImageInput]"),
    preview: document.querySelector(".preview"),
    previewError: document.querySelector(".previewError"),
    options: document.querySelector(".options")
  };

  const state = {
    uploadedFile: null, // is assigned with uploading after an image is uploaded
    mosaic: null,
    settings: {
      scale: 8,
      h: 1024 * 0.25,
      w: 1024 * 0.25
    }
  };

  const showError = error => {
    $.preview.src = "";
    $.preview.style.display = "none";
    $.previewError.style.display = "block";
    $.previewError.innerHTML = error;
  };
  const showPreviewImage = src => {
    $.preview.style.display = "inline";
    $.previewError.style.display = "none";
    $.preview.src = src;
    $.previewError.innerHTML = "";
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
          resolve({ src, width, height });
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

      const { mosaicImagesInput, hostImageInput } = formToJSON($.form.elements);
      const mosaicImages = await pixabay.getImages(mosaicImagesInput);

      showElement("loading");
      console.log(state.uploadedFile);
      const hostImage = !state.uploadedFile
        ? await pixabay.getImage(hostImageInput)
        : null;

      const { src, width, height } = state.uploadedFile
        ? state.uploadedFile
        : await scaleImage(hostImage.src, state.settings.w, state.settings.h);

      state.mosaic = await createMosaic(
        src,
        width,
        height,
        state.settings.scale,
        mosaicImages
      );

      drawMosaic(state.mosaic, $.canvas);
      createDownloadLink();
      showElement("canvas");
      const end = performance.now();

      console.log(`Finished. Total Time : ${(end - start) / 1000} seconds`);
    });
    $.fileInput.addEventListener("change", async function() {
      // Set form input to file name
      const fileName = getFileName(this.value).split(".")[0];
      const target = $.form.querySelector("input[name=hostImageInput]");
      target.value = fileName;

      // Convert uploaded Image to a file
      const file = document.querySelector('input[type="file"]').files[0];
      state.uploadedFile = await uploadImage(
        file,
        state.settings.w,
        state.settings.h
      );
      showPreviewImage(state.uploadedFile.src);
    });

    let timer;
    $.hostImageInput.addEventListener("keyup", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        pixabay.getImage($.hostImageInput.value).then(({ src, error }) => {
          error ? showError(error) : showPreviewImage(src);
        });
      }, 300);
    });

    $.hostImageInput.addEventListener("keydown", () => {
      clearTimeout(timer);
    });
  };
  const run = () => {
    bindEvents();
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
