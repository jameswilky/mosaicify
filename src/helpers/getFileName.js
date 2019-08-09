export default function getFileName(path) {
  return path.match(/[-_\w]+[.][\w]+$/i)[0];
}
