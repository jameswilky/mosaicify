import FastAverageColor from "../node_modules/fast-average-color/dist/index.es6.js";
const fac = new FastAverageColor();

export const getAverageColor = image => {
  let rgb;
  rgb = fac
    .getColor(image, { mode: "precision" })
    .rgb.match(/\d+/g)
    .map(color => parseInt(color));

  return rgb;
};

export const getBase64Image = imgUrl => {
  return new Promise(resolve => {
    const img = new Image();

    // onload fires when the image is fully loaded, and has width and height
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL); // the base64 string
    };

    // set attributes and src
    img.setAttribute("crossOrigin", "anonymous"); //
    img.src = imgUrl;
  });
};
export function isUnique(arr, prop) {
  var tmpArr = [];
  for (var obj in arr) {
    if (tmpArr.indexOf(arr[obj][prop]) < 0) {
      tmpArr.push(arr[obj][prop]);
    }
  }
  return tmpArr;
}
export const formToJSON = elements => {
  /**
   * Retrieves input data from a form and returns it as a JSON object.
   * @param  {HTMLFormControlsCollection} elements  the form elements
   * @return {Object}                               form data as an object literal
   */
  const isValidElement = element => {
    return element.name && element.value;
  };
  const isValidValue = element => {
    return !["checkbox", "radio"].includes(element.type) || element.checked;
  };
  const isCheckbox = element => element.type === "checkbox";
  const isMultiSelect = element => element.options && element.multiple;
  const getSelectValues = options =>
    [].reduce.call(
      options,
      (values, option) => {
        return option.selected ? values.concat(option.value) : values;
      },
      []
    );

  return [].reduce.call(
    elements,
    (data, element) => {
      // Make sure the element has the required properties and should be added.
      if (isValidElement(element) && isValidValue(element)) {
        /*
         * Some fields allow for more than one value, so we need to check if this
         * is one of those fields and, if so, store the values as an array.
         */
        if (isCheckbox(element)) {
          data[element.name] = (data[element.name] || []).concat(element.value);
        } else if (isMultiSelect(element)) {
          data[element.name] = getSelectValues(element);
        } else {
          data[element.name] = element.value;
        }
      }

      return data;
    },
    {}
  );
};

export function scaleImage(url, maxWidth, maxHeight = false) {
  // The function that scales an images with canvas then runs a callback.

  const img = new Image();

  // When the images is loaded, resize it in canvas.
  return new Promise(resolve => {
    img.onload = function() {
      let height, width;
      // Scale based on the highest dimension
      if (maxHeight === false) {
        // If no height specifed, make the width and height the same size
        height = maxWidth;
        width = maxWidth;
      } else if (img.width > img.height) {
        width = maxWidth;
        height = (maxWidth / img.width) * img.height;
      } else {
        height = maxHeight;
        width = (maxHeight / img.height) * img.width;
      }
      const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      // draw the img into canvas
      ctx.drawImage(this, 0, 0, width, height);

      // Run the callback on what to do with the canvas element.
      resolve({
        canvas: canvas,
        src: canvas.toDataURL("image/jpg"),
        width: width,
        height: height
      });
    };

    img.src = url;
  });
}

export function getFileName(path) {
  return path.match(/[-_\w]+[.][\w]+$/i)[0];
}

export const toImage = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = function() {
      const image = new Image();
      image.addEventListener("load", () => {
        resolve(image);
      });
      image.src = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
    }
  });
};

export const createImage = path =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);

    img.src = path;
  });

export const createImages = async paths => {
  const loadImg = paths => Promise.all(paths.map(createImage));
  return await loadImg(paths);
};
