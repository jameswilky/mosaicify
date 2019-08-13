import splitImage from "./splitImage.js";
import getAverageColor from "./getAverageColor.js";
import createImages from "./createImages.js";
import scaleImage from "../scaleImage.js";

// export default async (src, width, height, scale = 1, pathsPromise) => {
//   // Specify size of each mosaic images
//   const imagesWidth = (Math.sqrt(width) * scale) / scale ** 2;
//   const imagesHeight = (Math.sqrt(height) * scale) / scale ** 2;

//   const getPaths = async () => {
//     // Takes in a Promise that returns images from API
//     const paths = await pathsPromise;
//     const compressedPaths = await Promise.all(
//       // Signlificantly reduces size of images
//       // Stretch images into a square shape
//       paths.map(src => scaleImage(src, imagesWidth))
//     );
//     return compressedPaths.map(obj => obj.src);
//   };

//   const getEuclideanDistance = (rgb1, rgb2) => {
//     // Takes 2 in an arrays of rgb values and returns the euclidean difference
//     // "Basically" this: √((r2-r1)2 + (g2-g1)2 + (b2-b1)2)
//     const standard =
//       Math.abs(rgb2[0] - rgb1[0]) +
//       Math.abs(rgb2[1] - rgb1[1]) +
//       Math.abs(rgb2[2] - rgb1[2]);

//     // Reference: https://en.wikipedia.org/wiki/Color_difference
//     const adjusted = Math.sqrt(
//       2 * (rgb2[0] - rgb1[0]) ** 2 +
//         4 * (rgb2[1] - rgb1[1]) ** 2 +
//         3 * (rgb2[2] - rgb1[2]) ** 2
//     );
//     return adjusted;
//   };
//   const findBestImages = (palette, fragmentMap) => {
//     return {
//       ...fragmentMap,
//       fragments: fragmentMap.fragments.map(fragment => {
//         const distances = [];
//         palette.forEach(image => {
//           distances.push(getEuclideanDistance(image.rgb, fragment.rgb));
//         });
//         const bestFitIndex = distances.indexOf(Math.min.apply(null, distances));
//         const bestFitImage = palette[bestFitIndex].image;

//         return { ...fragment, mosaicImage: bestFitImage };
//       })
//     };
//   };

//   //Split the host image and assign an rgb value to each fragment
//   // Retreive a list of images to create the mosaic
//   const [hostImageMappedByColor, imagePalette] = await Promise.all([
//     splitImage(src, width, height, scale),
//     new Promise(resolve => {
//       getPaths(imagesWidth, imagesHeight, pathsPromise).then(paths =>
//         createImages(paths).then(palette => {
//           resolve(palette);
//         })
//       );
//     })
//   ]);

//   // Map an rgb color value to each mosaic image
//   const colorMappedImagePallete = imagePalette
//     .map(image => {
//       const rgb = getAverageColor(image);
//       const isTransparent = rgb => rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0;
//       if (isTransparent(rgb)) {
//         return null;
//       }
//       return { image: image, rgb: rgb };
//     })
//     .filter(obj => obj !== null);

//   // Find best image appears to be significantly reducing the amount of images used
//   const result = findBestImages(
//     colorMappedImagePallete,
//     hostImageMappedByColor
//   );

//   return result;
// };

const createMosaic = async (
  src,
  hostWidth,
  hostHeight,
  scale = 1,
  pathsPromise
) => {
  // Specify size of each mosaic images
  const imagesWidth = (Math.sqrt(hostWidth) * scale) / scale ** 2;
  const imagesHeight = (Math.sqrt(hostHeight) * scale) / scale ** 2;

  const getPaths = async () => {
    // Takes in a Promise that returns images from API
    const paths = await pathsPromise;
    const compressedPaths = await Promise.all(
      // Signlificantly reduces size of images
      // Stretch images into a square shape
      paths.map(src => scaleImage(src, imagesWidth))
    );
    return compressedPaths.map(obj => obj.src);
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
  const findBestImages = (palette, fragmentMap) => {
    return {
      ...fragmentMap,
      fragments: fragmentMap.fragments.map(fragment => {
        const distances = [];
        palette.forEach(image => {
          distances.push(getEuclideanDistance(image.rgb, fragment.rgb));
        });
        const bestFitIndex = distances.indexOf(Math.min.apply(null, distances));
        const bestFitImage = palette[bestFitIndex].image;

        return { ...fragment, mosaicImage: bestFitImage };
      })
    };
  };
  const mapImagePaletteByColor = imagePalette => {
    // Map an rgb color value to each mosaic image
    return imagePalette
      .map(image => {
        const rgb = getAverageColor(image);
        const isTransparent = rgb => rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0;
        if (isTransparent(rgb)) {
          return null;
        }
        return { image: image, rgb: rgb };
      })
      .filter(obj => obj !== null);
  };

  const createImagePalette = () => {
    return new Promise(resolve => {
      getPaths(imagesWidth, imagesHeight, pathsPromise).then(paths =>
        createImages(paths).then(palette => {
          resolve(palette);
        })
      );
    });
  };

  // const splitImage

  const create = async () => {
    //Split the host image and assign an rgb value to each fragment
    // Retreive a list of images to create the mosaic
    const [hostImageMappedByColor, imagePalette] = await Promise.all([
      splitImage(src, hostWidth, hostHeight, scale),
      createImagePalette()
    ]);

    const colorMappedImagePallete = mapImagePaletteByColor(imagePalette);

    // Find best image appears to be significantly reducing the amount of images used
    return findBestImages(colorMappedImagePallete, hostImageMappedByColor);
  };
  return create();
};

export default createMosaic;
