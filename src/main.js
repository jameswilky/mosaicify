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

const App = {
  events: {
    submit: e => {
      e.preventDefault();
    }
  },
  $: {},
  cacheDOM: function() {
    return {
      body: document.querySelector("body"),
      submit: document.querySelector(".submit")
    };
  },
  createEvents: events => {
    document.addEventListener("click", events.submit);
  },
  deleteEvents: () => {},
  render: function() {
    this.deleteEvents();
    this.createEvents(this.events);
    Object.assign(this.$, this.cacheDOM());
  }
};
App.render();
