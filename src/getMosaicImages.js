const checkImage = path =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);

    img.src = path;
  });
const loadImg = paths => Promise.all(paths.map(checkImage));

const getMosaicImages = async () => {
  const prefix = "../images/mosaic/";
  const paths = [
    `${prefix}black.jpg`,
    `${prefix}white.jpg`,
    `${prefix}yellow.jpg`
  ];

  return await loadImg(paths);
};
export default getMosaicImages;
