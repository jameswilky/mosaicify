import splitImage from "./splitImage.js";
import getAverageColor from "./getAverageColor.js";
import getImagePalette from "./getImagePalette.js";

const toImages = canvi => {
  return canvi.map(canvas => canvas.toDataURL("image/jpg"));
};

const mapFragmentsByColor = mosaic => {
  return {
    ...mosaic,
    fragments: mosaic.fragments.map(fragment => {
      return { fragment: fragment, rgb: getAverageColor(fragment) };
    })
  };
};
const getEuclideanDistance = (rgb1, rgb2) => {
  // Takes 2 in an arrays of rgb values and returns the euclidean differendce
  // "Basically" this: √((r2-r1)2 + (g2-g1)2 + (b2-b1)2)
  return (
    Math.abs(rgb2[0] - rgb1[0]) +
    Math.abs(rgb2[1] - rgb1[1]) +
    Math.abs(rgb2[2] - rgb1[2])
  );
};

const createMosaic = (palette, fragmentMap) => {
  return fragmentMap.fragments.map(fragment => {
    const distances = [];
    palette.forEach(image => {
      distances.push(getEuclideanDistance(image.rgb, fragment.rgb));
    });
    const bestFitIndex = distances.indexOf(Math.min.apply(null, distances));
    const bestFitImage = palette[bestFitIndex].image;

    return { ...fragment, mosaicImage: bestFitImage };
  });
};

const input = document.querySelector("#image");
const width = 625;
const height = 400;
const main = async () => {
  // TODO adjust width and height to have an interger square root

  // Split the input image into fragments
  const mosaic = await splitImage(input.src, width, height);
  // Return an average rgb value for each canvas item
  const mosaicMappedByColor = mapFragmentsByColor(mosaic);

  const imagePalette = await getImagePalette();
  // Retrurn an average rgb value for each mosaicImage
  const colorMappedImagePallete = imagePalette.map(image => {
    return { image: image, rgb: getAverageColor(image) };
  });

  const finalMosaic = createMosaic(
    colorMappedImagePallete,
    mosaicMappedByColor
  );
  console.log(finalMosaic);
};
main();
