import splitImage from "./splitImage.js";
import getAverageColor from "./getAverageColor.js";
import getImagePalette from "./getImagePalette.js";

const toImages = canvi => {
  return canvi.map(canvas => canvas.toDataURL("image/jpg"));
};

const mapFragmentsByColor = mosaic => {
  // Improve performance, this is heaviest operation TODO
  // This should be easy to send to a Web Worker as it does not access DOM
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
const test = (palette, fragmentMap) => {
  fragmentMap.fragments.forEach((fragment, i) => {
    const distances = [];
    palette.forEach(image => {
      distances.push(getEuclideanDistance(image.rgb, fragment.rgb));
      if (i == 0) {
        // console.log(image.rgb, image.image.src);
      }
    });
    const bestFitIndex = distances.indexOf(Math.min.apply(null, distances));
    const bestFitImage = palette[bestFitIndex].image;
  });
};

export default async (src, width, height, paths, scale = 1) => {
  const start = performance.now();
  // TODO adjust width and height to have an interger square root

  // Split the input image into fragments
  const mosaic = await splitImage(src, width, height, scale);
  const splitedImage = performance.now();
  console.log(`Finished splitImage in ${(splitedImage - start) / 1000}`);
  // Return an average rgb value for each canvas item
  const mosaicMappedByColor = mapFragmentsByColor(mosaic);
  const mappedMosaicByColor = performance.now();
  console.log(
    `Finished mapping Mosaic by color in : ${(mappedMosaicByColor -
      splitedImage) /
      1000} seconds `
  );

  const imagePalette = await getImagePalette(paths);
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
      const isTransparent = rgb => rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0;
      if (isTransparent(rgb)) {
        return null;
      }

      return { image: image, rgb: rgb };
    })
    .filter(obj => obj !== null);
  console.log(isUnique(colorMappedImagePallete, "image"));

  // test(colorMappedImagePallete, mosaicMappedByColor);
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

  console.log(isUnique(result.fragments, "mosaicImage"));
  console.log(
    `Found Best images in : ${(end - startedFindBestImages) / 1000} seconds`
  );
  console.log(selections);
  console.log(isUnique(selections, "i"));
  return result;
};

function isUnique(arr, prop) {
  var tmpArr = [];
  for (var obj in arr) {
    if (tmpArr.indexOf(arr[obj][prop]) < 0) {
      tmpArr.push(arr[obj][prop]);
    }
  }
  return tmpArr;
}
