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
    options: document.querySelector(".options"),
    optionsForm: document.forms[1],
    applySettings: document.querySelector("button[type=apply]"),
    progressBar: document.querySelector(".progressBar"),
    progressText: document.querySelector(".progressBar p")
  };

  const state = {
    uploadedFile: null, // is assigned with uploading after an image is uploaded
    mosaic: null,
    settings: {
      scale: 4,
      height: 256,
      width: 256
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
    document.body.style.minHeight = `calc(100vh + ${state.settings.height}px)`;
  };

  const showElement = element => {
    if (element === "form") {
      $.form.style.display = "grid";
      $.canvasContainer.style.display = "none";
      $.loading.style.display = "none";
      $.options.style.display = "none";
      document.body.style.minHeight = `100vh`;
    } else if (element === "canvas") {
      $.form.style.display = "none";
      $.canvasContainer.style.display = "grid";
      $.loading.style.display = "none";
      $.options.style.display = "none";
    } else if (element === "loading") {
      $.form.style.display = "none";
      $.canvasContainer.style.display = "none";
      $.loading.style.display = "grid";
      $.options.style.display = "none";
      document.body.style.minHeight = `100vh`;
    } else if (element === "options") {
      $.form.style.display = "none";
      $.canvasContainer.style.display = "none";
      $.loading.style.display = "none";
      $.options.style.display = "block";
      document.body.style.minHeight = `100vh`;
    }
  };

  const psuedoLoadProgress = async () => {
    // This doesnt actually correctly show the progress of the
    // mosaic being created as i didnt get around to
    // implementing web workers, but it still looks cool!

    const paintProgress = i => {
      return new Promise(resolve => {
        setTimeout(() => {
          $.progressBar.style.width = `${i}%`;
          $.progressText.style.width = `${i}%`;
          if (i === 95) {
            $.progressBar.style.borderTopRightRadius = `15px`;
            $.progressBar.style.borderBottomRightRadius = `15px`;
          }
          if (i === 96) {
            $.progressBar.style.borderTopRightRadius = `30px`;
            $.progressBar.style.borderBottomRightRadius = `30px`;
          }
          if (i === 97) {
            $.progressBar.style.borderTopRightRadius = `45px`;
            $.progressBar.style.borderBottomRightRadius = `45px`;
          }
          if (i === 98) {
            $.progressBar.style.borderTopRightRadius = `60px`;
            $.progressBar.style.borderBottomRightRadius = `60px`;
          }
          if (i === 99) {
            $.progressBar.style.borderTopRightRadius = `75px`;
            $.progressBar.style.borderBottomRightRadius = `75px`;
          }
          if (i === 100) {
            $.progressBar.style.borderTopRightRadius = `90px`;
            $.progressBar.style.borderBottomRightRadius = `90px`;
          }
          resolve();
        }, 20);
      });
    };
    return new Promise(async resolve => {
      for (let i = 0; i < 101; i++) {
        await paintProgress(i);
      }
      resolve();
    });
  };

  const drawMosaic = (mosaic, canvas) => {
    const { width, height, fragments } = mosaic;
    $.canvasContainer.style.width = width;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
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
    $.downloadLink.download = `mosaic_${state.settings.width}x${
      state.settings.height
    }`;
  };

  const bindEvents = () => {
    $.submit.addEventListener("click", async e => {
      e.preventDefault();
      const { mosaicImagesInput, hostImageInput } = formToJSON($.form.elements);

      // Validate Form
      if (!mosaicImagesInput && !hostImageInput) {
        showError("Please enter some images");
        return;
      }
      if (!mosaicImagesInput) {
        showError("Please enter some mosaic images");
        return;
      }
      if (!hostImageInput) {
        showError("Please enter a host image");
        return;
      }

      const mosaicImages = await pixabay.getImages(mosaicImagesInput);

      // Return error if no images found
      if (mosaicImages.length === 0) {
        showError(
          `No mosaic images found for "${mosaicImagesInput}", try something else.`
        );
        return;
      }
      state.mosaicImages = mosaicImages;
      state.hostImageInput = hostImageInput;

      showElement("options");
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
        state.settings.width,
        state.settings.height
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

    document.addEventListener("keypress", e => {
      // Prevent form from submitting on enter press, can be buggy
      if (e.which === 13) {
        e.preventDefault();
      }
    });
    $.hostImageInput.addEventListener("keydown", () => {
      clearTimeout(timer);
    });

    $.applySettings.addEventListener("click", async e => {
      e.preventDefault();
      const settings = formToJSON($.optionsForm);

      //Round width to nearest base 8 number
      state.settings.width = Math.pow(
        2,
        Math.ceil(Math.log(settings.width) / Math.log(2))
      );
      state.settings.height = state.settings.width;
      state.settings.scale = 2 ** Number(settings.scale);

      showElement("loading");

      const hostImage = !state.uploadedFile
        ? await pixabay.getImage(state.hostImageInput)
        : null;

      const { src, width, height } = state.uploadedFile
        ? await scaleImage(
            state.uploadedFile.src,
            state.settings.width,
            state.settings.height
          )
        : await scaleImage(
            hostImage.src,
            state.settings.width,
            state.settings.height
          );
      state.mosaic = await createMosaic(
        src,
        width,
        height,
        state.settings.scale,
        state.mosaicImages
      );

      await psuedoLoadProgress();
      drawMosaic(state.mosaic, $.canvas);
      createDownloadLink();
      showElement("canvas");
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
