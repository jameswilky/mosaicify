import createMosaic from "./helpers/Mosaic/createMosaic.js";
import gridTemplate from "./views/gridTemplate.js";
import formToJSON from "./helpers/formToJSON.js";
import getFileName from "./helpers/getFileName.js";
import toImage from "./helpers/toImage.js";
import Pixabay from "./helpers/pixabay.js";
import scaleImage from "../src/helpers/scaleImage.js";

import isUnique from "../src/helpers/isUnique.js";

const scale = 4;
const size = 2;
const h = 1024 * size;
const w = 1024 * size;
// TODO refactor createMosaic into a Factory
// Improve performance, use webworkers
const registerEvents = $ => {
  $.submit.addEventListener("click", async e => {
    const start = performance.now();
    e.preventDefault();

    const form = formToJSON($.form.elements);
    // TODO validate form

    const pixabay = Pixabay(20);
    console.log(form);
    const pathsPromise = pixabay.getImages(form.mosaicImages);
    console.log(pathsPromise);

    // Fetch Mosaic Images
    if ($.uploadedFile) {
      const { src, width, height } = $.uploadedFile;
      $.mosaic = await createMosaic(src, width, height, scale, pathsPromise);
    } else {
      const image = await pixabay.getImage(form.targetImage);
      const { src, width, height } = await scaleImage(image.src, w, h);

      $.mosaic = await createMosaic(src, width, height, scale, pathsPromise);
    }
    const MosaicCreated = performance.now();
    console.log(
      `Created Mosaic in : ${(MosaicCreated - start) / 1000} seconds`
    );

    const end = performance.now();

    const { width, height, nCols, nRows, fragments } = $.mosaic;

    const canvas = document.querySelector(".outputCanvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    fragments.forEach(({ mosaicImage, coords }) =>
      ctx.drawImage(mosaicImage, coords.x, coords.y)
    );

    console.log(`Created Grid in : ${(end - MosaicCreated) / 1000}`);
    console.log(`Finished. Total Time : ${(end - start) / 1000} seconds`);
    // TODO implement this to append grid https://github.com/tsayen/dom-to-image
  });

  $.fileInput.addEventListener("change", function() {
    // Set form input to file name
    const fileName = getFileName(this.value).split(".")[0];
    const target = $.form.querySelector("input[name=targetImage]");
    target.value = fileName;

    // Convert uploaded Image to a file

    const file = document.querySelector('input[type="file"]').files[0];

    toImage(file).then(img => {
      // TODO find perfect size
      scaleImage(img.src, w, h).then(({ src, width, height }) => {
        // const el = document.querySelector(".test");
        // el.src = src;
        $.uploadedFile = { src, width, height };
      });
    });
  });
};
const uploadFile = file => {
  new Promise(resolve => {
    toImage(file).then(img => {
      // TODO find perfect size
      scaleImage(img.src, 300, 300).then(({ src, width, height }) => {
        // const el = document.querySelector(".test");
        // el.src = src;
        $.uploadedFile = { src, width, height };
        resolve($.uploadedFile);
      });
    });
  });
};

window.onload = () => {
  const $ = {
    body: document.querySelector("body"),
    submit: document.querySelector(".submit"),
    form: document.forms["searchForm"],
    fileInput: document.querySelector("#fileUpload"),
    uploadedFile: null, // is assigned with uploading after an image is uploaded
    mosaic: null
  };
  registerEvents($);
};

const App = {
  events: {
    submit: e => {
      e.preventDefault();
    },
    clickHandlers: e => {
      if (e.target.classList.contains("submit")) {
        e.preventDefault();
      }
    }
  },
  $: {},
  cacheDOM: function() {
    this.$ = document.querySelector("body");
    return {
      submit: this.$.querySelector(".submit")
    };
  },
  createEvents: events => {
    const { clickHandlers } = events;
    document.addEventListener("click", clickHandlers);
  },
  deleteEvents: events => {
    const { clickHandlers } = events;
    document.removeEventListener("click", clickHandlers);
  },
  render: function() {
    this.deleteEvents(this.events);
    this.createEvents(this.events);
    Object.assign(this.$, this.cacheDOM());
  }
};
App.render();

/* Primitive modificatons*/
Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};

function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}
