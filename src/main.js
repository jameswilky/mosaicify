import createMosaic from "./helpers/Mosaic/createMosaic.js";
import gridTemplate from "./views/gridTemplate.js";
import formToJSON from "./helpers/formToJSON.js";
import getFileName from "./helpers/getFileName.js";
import toImage from "./helpers/toImage.js";
import Pixabay from "./helpers/pixabay.js";
import getBase64Image from "./helpers/getBase64Image.js";

// TODO convert final dom element to an image element
// TODO refactor createMosaic into a Factory
// Improve performance, use webworkers
const registerEvents = $ => {
  $.submit.addEventListener("click", async e => {
    e.preventDefault();

    const form = formToJSON($.form.elements);
    // TODO validate form

    //If Valid...
    const pixabay = Pixabay(20); // Used for pixabay api
    const paths = await pixabay.getImages(form.mosaicImages);
    const uniquePaths = paths.unique();

    // const prefix = "../images/mosaic/";
    // const uniquePaths = [
    //   `${prefix}black.jpg`,
    //   `${prefix}beige.jpg`,
    //   `${prefix}blue.jpg`,
    //   `${prefix}gray.jpg`,
    //   `${prefix}green.jpg`,
    //   `${prefix}orange.jpg`,
    //   `${prefix}purple.jpg`,
    //   `${prefix}orange.jpg`,
    //   `${prefix}purple.jpg`,
    //   `${prefix}red.jpg`,
    //   `${prefix}white.jpg`,
    //   `${prefix}yellow.jpg`
    // ];

    // Fetch Mosaic Images
    if ($.uploadedFile) {
      const { src, width, height } = $.uploadedFile;
      $.mosaic = await createMosaic(src, width, height, uniquePaths, 2);
    } else {
      const { src, width, height } = await pixabay.getImage(form.targetImage);
      $.mosaic = await createMosaic(src, width, height, uniquePaths, 1);
    }

    // //}
    // //else {
    // // const {src,width,height} = Fetch Host Image
    // // const paths = Fetch Mosaic Images
    // //$.mosaic = await createMosaic(src, width, height, paths);
    // //}

    const grid = document.createElement("div");
    grid.innerHTML = gridTemplate($.mosaic);
    console.log("finished");
    // TODO implement this to append grid https://github.com/tsayen/dom-to-image
    // document.body.appendChild(grid);
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

// const App = {
//   events: {
//     submit: e => {
//       e.preventDefault();
//     },
//     clickHandlers: e => {
//       if (e.target.classList.contains("submit")) {
//         e.preventDefault();
//       }
//     }
//   },
//   $: {},
//   cacheDOM: function() {
//     this.$ = document.querySelector("body");
//     return {
//       submit: this.$.querySelector(".submit")
//     };
//   },
//   createEvents: events => {
//     const { clickHandlers } = events;
//     document.addEventListener("click", clickHandlers);
//   },
//   deleteEvents: events => {
//     const { clickHandlers } = events;
//     document.removeEventListener("click", clickHandlers);
//   },
//   render: function() {
//     this.deleteEvents(this.events);
//     this.createEvents(this.events);
//     Object.assign(this.$, this.cacheDOM());
//   }
// };
// App.render();

/* Primitive modificatons*/
Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};
