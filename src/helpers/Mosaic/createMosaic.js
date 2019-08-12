import splitImage from "./splitImage.js";
import getAverageColor from "./getAverageColor.js";
import getImagePalette from "./getImagePalette.js";
const toImages = canvi => {
  return canvi.map(canvas => canvas.toDataURL("image/jpg"));
};

const mapFragmentsByColor = mosaic => {
  // For each x,y position returned by fragmentTOCanvi, get the average color
  // let size = 32;
  // const { fragments, image, width, height } = mosaic;

  // let result = [];

  // for (let i = 0; i < fragments.length; i++) {
  //   const x = fragments[i].x;
  //   const y = fragments[i].y;

  //   const canvas = document.createElement("canvas");
  //   canvas.width = size;
  //   canvas.height = size;
  //   const ctx = canvas.getContext("2d");
  //   ctx.drawImage(image, x, y, size, size, 0, 0, 32, 32);
  //   const rgb = getAverageColor(canvas);
  //   result.push({ canvas, rgb });
  // }
  // return result;

  return {
    ...mosaic,
    fragments: mosaic.fragments.map(fragment => {
      return { fragment: fragment, rgb: getAverageColor(fragment) };
    })
  };
};
const getEuclideanDistance = (rgb1, rgb2) => {
  // Takes 2 in an arrays of rgb values and returns the euclidean difference
  // "Basically" this: √((r2-r1)2 + (g2-g1)2 + (b2-b1)2)
  const standard =
    Math.abs(rgb2[0] - rgb1[0]) +
    Math.abs(rgb2[1] - rgb1[1]) +
    Math.abs(rgb2[2] - rgb1[2]);

  // Reference: https://en.wikipedia.org/wiki/Color_difference
  const adjusted = Math.sqrt(
    2 * (rgb2[0] - rgb1[0]) ** 2 +
      4 * (rgb2[1] - rgb1[1]) ** 2 +
      3 * (rgb2[2] - rgb1[2]) ** 2
  );
  return adjusted;
};
let selections = [];
const findBestImages = (palette, fragmentMap) => {
  return {
    ...fragmentMap,
    fragments: fragmentMap.fragments.map((fragment, i) => {
      const distances = [];
      palette.forEach(image => {
        distances.push(getEuclideanDistance(image.rgb, fragment.rgb));
      });
      const bestFitIndex = distances.indexOf(Math.min.apply(null, distances));
      const bestFitImage = palette[bestFitIndex].image;
      selections.push({ i: bestFitIndex, img: bestFitImage });

      return { ...fragment, mosaicImage: bestFitImage };
    })
  };
};

export default async (src, width, height, paths, scale = 1) => {
  const start = performance.now();
  // TODO we dont need to wait for splitImage to run getImatePallete, join the promises
  // Split the input image into fragments
  const mosaicMappedByColor = await splitImage(src, width, height, scale);
  const splitedImage = performance.now();
  console.log(`Finished splitImage in ${(splitedImage - start) / 1000}`);

  const mappedMosaicByColor = performance.now();
  console.log(
    `Finished mapping Mosaic by color in : ${(mappedMosaicByColor -
      splitedImage) /
      1000} seconds `
  );

  const imagePalette = await getImagePalette(paths);
  console.log(imagePalette);
  // Return an average rgb value for each palette image
  const gotImagePalette = performance.now();
  console.log(
    `Finished getting image palette : ${(gotImagePalette -
      mappedMosaicByColor) /
      1000} seconds `
  );

  const colorMappedImagePallete = imagePalette
    .map(image => {
      const rgb = getAverageColor(image);
      // const isTransparent = rgb => rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0;
      // if (isTransparent(rgb)) {
      //   return null;
      // }

      return { image: image, rgb: rgb };
    })
    .filter(obj => obj !== null);
  // console.log(isUnique(colorMappedImagePallete, "image"));

  // Finally, find the mosaic images that best match each required fragment of the original image
  const startedFindBestImages = performance.now();
  console.log(
    `Finished mapping image palette in : ${(startedFindBestImages -
      gotImagePalette) /
      1000} seconds`
  );
  // Find best image appears to be significantly reducing the amount of images used
  const result = findBestImages(colorMappedImagePallete, mosaicMappedByColor);
  const end = performance.now();

  console.log(result);
  // console.log(isUnique(result.fragments, "mosaicImage"));
  console.log(
    `Found Best images in : ${(end - startedFindBestImages) / 1000} seconds`
  );

  return result;
};
