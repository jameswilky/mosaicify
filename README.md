# Mosaicify

This project was created with javascript, css and the pixabay image api.

### Live Site Link

https://jameswilky.github.io/mosaicify/

## Note

This takes along time to compute, particularly when the `scale` and `width` are set above 8 and 1024px respectively. Javascript is single threaded so it may look like the browser has crashed, but please wait for up to a minute

## How it works

1.  The form takes in a query for the `mosaicImages` which are found on pixabay, aswell as an upload input that requires an image file which will be the `hostImage`. Alternatively, if a file is not supplied, the pixabay api is called to find a `hostImage` file.

2.  Once the images are loaded, the user is prompted to specify a `width` and a `scale`. The larger the width and scale, the longer the algorithm will take, but it will result in a much more detailed image.

3.  The `hostImage` `mosaiceImages` `scale` and `width` parameters are then passed to the `createMosaic()` function which handles the following:

    - The `hostImage` is then split into fragments that are mapped by their average color
    - Then `mosaicImages` are then mapped by their average color
    - Then the `colorMappedMosaicImages` are compared to the `colorMappedHostImages` by finding the shortest Euclidean distance between each RGB value. I used a modifed formula that better accounts for human perception of color values, which is explained in more detail [here](https://en.wikipedia.org/wiki/Color_difference)

4)  Once the best mosaic images are found for each slice of the host image, they are drawn to the canvas and converted to an image file which can be downloaded.

## Pitfalls and room for improvement

Due to time constraints there were a few features of the application that I did not get to implement/optimize.

### Performance

Javascript is single-threaded language, which makes it not suited for computationally intensive tasks. The most intensive part of the program is during the color mapping phase which could be improved in various ways such as:

##### Web Workers

When the `scale` and `width` properties are high, the event loop is blocked which prevents user interaction. The simple solution to this would be to use [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) which simply offloads the computation on to another thread and pings the main thread when it is complete. This would not increase the actual speed, but it would prevent the browser from crashing, which would also allow correct implementation of the loading bar.

##### WebGL

Another way to improve the speed of the color mapping would be to use [WebGL](https://en.wikipedia.org/wiki/WebGL) to take advantage of the users GPU.

##### Use a server

The overall most effective solution would be to create the mosaic on a remote server that can use languages such as Python or C++ which are much better languages for heading multithreaded computations.

##### Algorithm Idea

When mapping the colors of the host image, instead of getting the average color of each picture, get the average color of a larger slice of the host image. If two contiguous images are the same average color, we can assume that all images contained are the same color. This would drastically increase the processing speed of images with large backgrounds of the same color, as there are less fragments that need to be checked.

### Accuracy

##### Heatmaps instead of Average Color

Instead of using the average color of two images, create a heatmap that compares the color distribution of each image. This could also be improved by rotating the target mosaic image to find the best fit.

### UI

##### Dark/Light mode

I started implementing this but did not have time to finish. If you want to get an idea of how it looks open the `index.html` file and replace the `theme` tags with a value of `light` to `dark`

##### Image picker carousel

When searching for an image on pixabay, allow the user to click through other preview images instead of being forced to use the first result

##### Loading bar

Because the main thead is blocked, the loading bar not actually communicating how long the task is taking. So instead it just blocks the thread for another second and allows the loading bar to animate. Obviously this slows the overall computation time by a second, but hey, it looks cool.
