function isUnique(arr, prop) {
  var tmpArr = [];
  for (var obj in arr) {
    if (tmpArr.indexOf(arr[obj][prop]) < 0) {
      tmpArr.push(arr[obj][prop]);
    }
  }
  return tmpArr;
}

export default isUnique;
