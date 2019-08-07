#Problem

- Create an image composed of other images.

#Proposed Solution 1

1. Split the host image into a n x k grid of smaller images. These images will be stored in an Array.
2. For each image in the array, get the average RGB color value
3. Search API/Database for images by color value.
4. return the image which most closely matches the color required by the slice of image
5. Map each slice of the image to a CSS grid container

# Main Components

1. Images = splitImage(img, h, v) function

   - Takes in the host image file and a horizontal and vertical property
   - The H and V property determine how many splits across each axis need to be made
   - e.g h = 8, v = 16 will return an array of 8x16 images

   - returns an object containing the number of horizontal elements, number of vertical elements and an array of images

   https://stackoverflow.com/questions/21933043/split-an-image-using-javascript

2. Images.elements.forEach(img => {
   getAverageColor(img)
   })

   - getAverageColor takes in an image and returns an average rgb value
   - https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript
   - https://github.com/lokesh/color-thief
   - https://sighack.com/post/averaging-rgb-colors-the-right-way
   - Worth considering when averaging colors: https://www.youtube.com/watch?v=LKnqECcg6Gw

3. API

   - Use Pixabay API https://pixabay.com/api/docs/ to download 1024? images
   - run the getAverageColor function on each picture to get the average color for each image

4. colors.forEach(color => {
   outputImages += imageTree.getClosestColor(color)}
   )

   - ???check out https://www.alanzucconi.com/2015/09/30/colour-sorting/ and create a sorted array of each color
   - When given a color from the client return an image with the lowest euclidean distance
   - euclidean distance = √((r2-r1)2 + (g2-g1)2 + (b2-b1)2)
     Further reading ... https://en.wikipedia.org/wiki/Color_difference

   - Data structure:
     - Create an array of arrays. Each subarray contains colors within a certain euclidean distance. Each subarray will have a key equal to an rbg value which represents the average of the values it holds. Given a color, it compares its euclidean distance with each parent array, then looks into the child array for the next closest difference. This process could be repeated for more accuracy, but not sure how to decide how large each array should be, as a larger array will create less accuracy...i think... - A tree data structure might be ideal here... - Implement 2nd step sorting algorithm in https://www.alanzucconi.com/2015/09/30/colour-sorting/ - looking at the array image from the article, 8 appears to be the best number to split by, as 2 would average as black, 4 would average as white. so 8 is the first choice that distinctly seperates the colors.
   - Algorithm:
     - divide the array by 8, and take the average (centre) color as the key for the sub array. The sub array should then be divided further by (8?) the key should be the average of the colors. recursively repeat this untill a sub array length is less than 8.
     - once we reach a subarray with less than 8 values, compare the euclidean distance of each item in that subarray and return the color with the lowest euclidean distance
     - https://www.quora.com/How-can-we-check-for-the-complexity-log-n-and-n-log-n-for-an-algorithm

- this could be implemented in 2 ways :
  - iteratre each color in the input array that needs to matched with an image, then check the imageTree and get the closest color for each. O(n^2)
  - OR, sort the in initial array (O(n))? once and turn it into a similar structure as the imageTree , and then

5.

HSL Colors

- hue of 0 is gray scale. saturation of 0 is grayscale. increasing lightness from 0 to 100 goes from black to white
-
