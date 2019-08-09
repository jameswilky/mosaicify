const checkImage = path =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);

    img.src = path;
  });
const loadImg = paths => Promise.all(paths.map(checkImage));

const getImagePalette = async paths => {
  return await loadImg(paths);
};
export default getImagePalette;