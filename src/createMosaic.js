import {
  scaleImage,
  createImages,
  createImage,
  getAverageColor
} from "./utilities.js";

const createMosaic = async (
  src,
  hostWidth,
  hostHeight,
  scale = 1,
  mosaicImages
) => {
  // Specify size of each mosaic images
  const imagesWidth = (Math.sqrt(hostWidth) * scale) / scale ** 2;
  const imagesHeight = (Math.sqrt(hostHeight) * scale) / scale ** 2;

  const findBestImages = (palette, fragmentMap) => {
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
    const isTransparent = rgb => rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0;

    // Map an rgb color value to each mosaic image
    return imagePalette
      .map(image => {
        const rgb = getAverageColor(image);
        if (isTransparent(rgb)) {
          return null;
        }
        return { image: image, rgb: rgb };
      })
      .filter(obj => obj !== null);
  };

  const createImagePalette = () => {
    const compressImages = async () => {
      // Takes in a list of images and compresses them
      const compressedImages = await Promise.all(
        // Signlificantly reduces size of images
        // Stretch images into a square shape
        mosaicImages.map(src => scaleImage(src, imagesWidth))
      );
      return compressedImages.map(obj => obj.src);
    };
    return new Promise(resolve => {
      compressImages(imagesWidth, imagesHeight, mosaicImages).then(images =>
        createImages(images).then(palette => {
          resolve(palette);
        })
      );
    });
  };

  const splitImage = src => {
    // Takes an in image url, a width and a height and returns an object containing the fragmented images

    // Convert width and height to perfect squares
    const w = Math.floor(Math.sqrt(hostWidth)) ** 2;
    const h = Math.floor(Math.sqrt(hostHeight)) ** 2;
    const cols = Math.sqrt(w) * scale;
    const rows = Math.sqrt(h) * scale;

    const mapColor = (image, x, y, sliceWidth, sliceHeight) => {
      // Returns a slice of an image as well as its coresponding rgb value
      const canvas = new OffscreenCanvas(sliceWidth, sliceHeight); // TODO make async
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        x,
        y,
        sliceWidth,
        sliceHeight,
        0,
        0,
        sliceWidth,
        sliceHeight
      );

      const rgb = getAverageColor(canvas);
      const fragment = canvas.transferToImageBitmap();

      return {
        fragment,
        rgb,
        coords: { x, y }
      };
    };
    const fragment = image => {
      // Splits an image into canvas elements and returns an array of canvas elements
      // This is the most performance intensive part of the application
      const c = scale ** 2;
      const fragments = [];

      for (let row = 0; row < rows; row++) {
        let y = (row * rows) / c;

        for (let col = 0; col < cols; col++) {
          let x = (col * cols) / c;
          fragments.push(mapColor(image, x, y, cols / c, rows / c));
        }
      }
      return fragments;
    };

    return new Promise(resolve => {
      const mosaic = {
        width: w,
        height: h,
        nCols: cols,
        nRows: rows,
        fragments: [],
        image: null
      };

      createImage(src).then(img => {
        mosaic.image = img;
        mosaic.fragments = fragment(img);
        resolve(mosaic);
      });
    });
  };

  // const splitImage

  const create = async () => {
    const [hostImageMappedByColor, imagePalette] = await Promise.all([
      splitImage(src, hostWidth, hostHeight, scale),
      createImagePalette()
    ]);
    const colorMappedImagePallete = mapImagePaletteByColor(imagePalette);
    return findBestImages(colorMappedImagePallete, hostImageMappedByColor);
  };
  return create();
};

export default createMosaic;
