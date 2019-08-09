import createMosaic from "./createMosaic.js";
import gridTemplate from "./components/gridTemplate.js";

const main = async () => {
  const input = document.querySelector(".inputImage");

  const prefix = "../images/mosaic/";
  // This should only contain data urls, not http images blocked by Cors
  const paths = [
    `${prefix}black.jpg`,
    `${prefix}white.jpg`,
    `${prefix}yellow.jpg`
  ];
  const mosaic = await createMosaic(
    input.src,
    input.width,
    input.height,
    paths
  );

  const grid = document.createElement("div");
  grid.innerHTML = gridTemplate(mosaic);
  document.body.appendChild(grid);
};
//main();

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

const $ = {
  body: document.querySelector("body"),
  submit: document.querySelector(".submit"),
  form: document.querySelector("form")
};

const registerEvents = $ => {
  $.submit.addEventListener("click", e => {
    e.preventDefault();
    console.log($.form);
  });
};

registerEvents($);
