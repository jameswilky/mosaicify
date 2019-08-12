import createMosaic from "./helpers/Mosaic/createMosaic.js";
import gridTemplate from "./views/gridTemplate.js";
import formToJSON from "./helpers/formToJSON.js";
import getFileName from "./helpers/getFileName.js";
import toImage from "./helpers/toImage.js";
import Pixabay from "./helpers/pixabay.js";
import getBase64Image from "./helpers/getBase64Image.js";
import splitImage from "./helpers/Mosaic/splitImage.js";
import getAverageColor from "../src/helpers/Mosaic/getAverageColor.js";
import scaleImage from "../src/helpers/scaleImage.js";

const mapFragmentsByColor = mosaic => {
  return {
    ...mosaic,
    fragments: mosaic.fragments.map(fragment => {
      return { fragment: fragment, rgb: getAverageColor(fragment) };
    })
  };
};
// TODO convert final dom element to an image element
// TODO refactor createMosaic into a Factory
// Improve performance, use webworkers
const registerEvents = $ => {
  $.submit.addEventListener("click", async e => {
    const start = performance.now();
    e.preventDefault();

    const form = formToJSON($.form.elements);
    // TODO validate form
    const pixabay = Pixabay(20);

    const imagePath = "../images/mosaic/avatars.png";

    const image = await splitImage(imagePath, 2160, 2160, 1);
    const canviToImages = canvi => {
      return canvi.map(canvas => canvas.toDataURL("image/jpg"));
    };

    // const mappedResult = mapFragmentsByColor(result);
    // const paths = canviToImages(image.fragments);
    let paths = await pixabay.getImages(form.mosaicImages);
    paths = paths.concat(canviToImages(image.fragments));

    const gotImages = performance.now();
    console.log(
      `Finished getImages() in : ${(gotImages - start) / 1000} seconds`
    );

    // Fetch Mosaic Images
    if ($.uploadedFile) {
      const { src, width, height } = $.uploadedFile;
      $.mosaic = await createMosaic(src, width, height, paths, 2);
    } else {
      const { src, width, height } = await pixabay.getImage(form.targetImage);
      $.mosaic = await createMosaic(src, width, height, paths, 2);
    }
    const MosaicCreated = performance.now();
    console.log(
      `Created Mosaic in : ${(MosaicCreated - gotImages) / 1000} seconds`
    );

    const grid = document.createElement("div");
    grid.innerHTML = gridTemplate($.mosaic);
    const end = performance.now();
    console.log(`Created Grid in : ${(end - MosaicCreated) / 1000}`);
    console.log(`Finished. Total Time : ${(end - start) / 1000} seconds`);
    // TODO implement this to append grid https://github.com/tsayen/dom-to-image
    document.body.appendChild(grid);
  });

  $.fileInput.addEventListener("change", function() {
    // Set form input to file name
    const fileName = getFileName(this.value).split(".")[0];
    const target = $.form.querySelector("input[name=targetImage]");
    target.value = fileName;

    // Convert uploaded Image to a file

    const file = document.querySelector('input[type="file"]').files[0];
    console.log(file);

    toImage(file).then(
      ({ src, width, height }) => ($.uploadedFile = { src, width, height })
    );
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
let img = document.getElementById("imageThing");
scaleImage("../images/mosaic/blue.jpg", 600).then(img => {
  console.log(img);
});
