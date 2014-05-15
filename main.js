var log;
log = console.log.bind(console);

var Grid = {};

var WIDTH      = 50,
    HEIGHT     = 50,
    PIXELWIDTH = 15,
    SPEED      = 30; // Milliseconds

Grid.setup = function(width, height, pixelWidth, canvas) {
  this.canvas        = canvas;
  this.canvas.width  = width  * pixelWidth;
  this.canvas.height = height * pixelWidth;
  this.width         = width;
  this.height        = height;
  this.context       = this.canvas.getContext("2d");
  this.pixelWidth    = pixelWidth;
  this.resetGrid();
};

Grid.createGrid = function() {
  var pixels = Array.apply(null, new Array(this.height)).map(Boolean.prototype.valueOf, false);
  for (var i = 0; i < this.height; ++i) {
    pixels[i] = Array.apply(null, new Array(this.width)).map(Boolean.prototype.valueOf, false);
  }
  return pixels;
};

Grid.clearPixels = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Grid.resetGrid = function() {
  delete this.pixels;
  this.pixels = this.createGrid();
  this.clearPixels();
};

Grid.putPixel = function(x, y) {
  this.pixels[y][x] = true;
  this.context.rect(x * this.pixelWidth, y * this.pixelWidth, this.pixelWidth, this.pixelWidth);
};

Grid.delPixel = function(x, y) {
  this.pixels[y][x] = false;
  this.context.clearRect(x * this.pixelWidth, y * this.pixelWidth, this.pixelWidth, this.pixelWidth);
};

Grid.neighborCount = function(x, y) {
  var count = 0;
  var gy = y > 0,
      gx = x > 0,
      ly = y + 1 < this.height,
      lx = x + 1 < this.width;
  if (gy && gx && this.pixels[y - 1][x - 1]) count += 1;
  if (gy && this.pixels[y - 1][x]) count += 1;
  if (gy && lx && this.pixels[y - 1][x + 1]) count += 1;
  if (gx && this.pixels[y][x - 1]) count += 1;
  if (lx && this.pixels[y][x + 1]) count += 1;
  if (ly && gx && this.pixels[y + 1][x - 1]) count += 1;
  if (ly && this.pixels[y + 1][x]) count += 1;
  if (ly && lx && this.pixels[y + 1][x + 1]) count += 1;
  return count;
};

Grid.nextGeneration = function() {
  var x, y;
  this.genStep = this.createGrid();
  this.clearPixels();
  this.context.beginPath();
  for (y = 0; y < this.height; ++y) {
    for (x = 0; x < this.width; ++x) {
      var count = this.neighborCount(x, y);
      if (count < 2) {
        this.genStep[y][x] = false;
      } else if (this.pixels[y][x] && (count === 2 || count === 3)) {
        this.genStep[y][x] = true;
      } else if (this.pixels[y][x] && count > 3) {
        this.genStep[y][x] = false;
      } else if (!this.pixels[y][x] && count === 3) {
        this.genStep[y][x] = true;
      }
    }
  }
  for (y = 0; y < this.height; ++y) {
    for (x = 0; x < this.width; ++x) {
      if (this.genStep[y][x]) {
        this.putPixel(x, y);
        this.pixels[y][x] = true;
      } else {
        this.pixels[y][x] = false;
      }
    }
  }
  this.context.closePath();
  this.context.fill();
};

document.addEventListener("DOMContentLoaded", function() {
  Grid.setup(WIDTH, HEIGHT, PIXELWIDTH, document.getElementById("grid"));
  Grid.applyPreset("glidergun");
  var paused = true,
      generate;
  document.addEventListener("keydown", function(e) {
    if (e.which === 32) {
      e.preventDefault();
      Grid.nextGeneration();
    } else if (e.which === 13) {
      paused = !paused;
      if (paused) {
        window.clearInterval(generate);
      } else {
        generate = window.setInterval(function() {
          Grid.nextGeneration();
        }, SPEED);
      }
    }
  });
}, false);
