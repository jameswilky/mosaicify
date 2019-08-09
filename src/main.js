import createMosaic from "./helpers/Mosaic/createMosaic.js";
import gridTemplate from "./views/gridTemplate.js";
import formToJSON from "./helpers/formToJSON.js";
import getFileName from "./helpers/getFileName.js";
import toImage from "./helpers/toImage.js";
import Pixabay from "./helpers/pixabay.js";

const registerEvents = $ => {
  $.submit.addEventListener("click", async e => {
    e.preventDefault();

    const form = formToJSON($.form.elements);
    // TODO validate form

    //If Valid...
    const pixabay = Pixabay(); // Used for pixabay api
    const paths = await pixabay.getImages(form.mosaicImages);
    console.log(paths);
    // Create a list of files from pixabay
    // Given a mosaic Name, search for each color
    // return the previewImage of each color
    // then pass those file names to createMosaic
    // if ($.uploadedFile) {
    //   const { src, width, height } = $.uploadedFile;
    //   // Fetch Mosaic Images
    //   $.mosaic = await createMosaic(src, width, height, paths);
    // }
    //else {
    // const {src,width,height} = Fetch Host Image
    // const paths = Fetch Mosaic Images
    //$.mosaic = await createMosaic(src, width, height, paths);
    //}

    // const grid = document.createElement("div");
    // grid.innerHTML = gridTemplate($.mosaic);
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
  console.log($);
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
