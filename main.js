// Based on Wikipedia's description of the algorithm
// http://en.wikipedia.org/wiki/Conway's_Game_of_Life#Rules

var log;
log = console.log.bind(console);

var Grid = {};

var WIDTH      = 100,
    HEIGHT     = 50,
    PIXELWIDTH = 17,
    SPEED      = 30; // Milliseconds

Grid.setup = function(width, height, pixelWidth, canvas) {
  this.canvas        = canvas;
  this.canvas.width  = width  * pixelWidth;
  this.canvas.height = height * pixelWidth;
  this.paused        = true;
  this.width         = width;
  this.height        = height;
  this.context       = this.canvas.getContext("2d");
  this.pixelWidth    = pixelWidth;
  this.canvas.addEventListener("mousedown", this.mouse.down, false);
  this.canvas.addEventListener("mouseup", this.mouse.up, false);
  this.canvas.addEventListener("mousemove", this.mouse.move, false);
  this.generationNumber = 0;
  document.addEventListener("keydown", this.key.down, false);
  this.resetGrid();
};

Grid.drawOutLine = function() {
  this.context.beginPath();
  for (var x = 0; x < this.width; ++x) {
    this.context.moveTo(x * this.pixelWidth, 0);
    this.context.lineTo(x * this.pixelWidth, this.height * this.pixelWidth);
  }
  for (var y = 0; y < this.height; ++y) {
    this.context.moveTo(0, y * this.pixelWidth);
    this.context.lineTo(this.width * this.pixelWidth, y * this.pixelWidth);
  }
  this.context.strokeStyle = "#ddd";
  this.context.stroke();
};

Grid.createGrid = function() {
  return Array.apply(null, new Array(this.height))
    .map(Boolean.prototype.valueOf, false)
    .map(function() {
      return Array.apply(null, new Array(this.width))
        .map(Boolean.prototype.valueOf, false);
    }.bind(this));
};

Grid.clearPixels = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.drawOutLine();
};

Grid.resetGrid = function() {
  delete this.pixels;
  this.clearPixels();
  this.pixels = this.createGrid();
};

Grid.putPixel = function(x, y) {
  this.pixels[y][x] = true;
  this.context.rect(x * this.pixelWidth + 1, y * this.pixelWidth + 1, this.pixelWidth - 2, this.pixelWidth - 2);
};

Grid.flipPixel = function(x, y) {
  this.pixels[y][x] = !this.pixels[y][x];
  if (this.pixels[y][x]) {
    this.context.rect(x * this.pixelWidth, y * this.pixelWidth, this.pixelWidth, this.pixelWidth);
  } else {
    this.context.clearRect(x * this.pixelWidth, y * this.pixelWidth, this.pixelWidth, this.pixelWidth);
  }
};

Grid.delPixel = function(x, y) {
  this.pixels[y][x] = false;
  this.context.clearRect(x * this.pixelWidth + 1, y * this.pixelWidth + 1, this.pixelWidth - 2, this.pixelWidth - 2);
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

Grid.mouse = {
  move: function(ev) {
    if (this.mouseHeld) {
      var x = Math.floor(ev.offsetX / Grid.pixelWidth),
          y = Math.floor(ev.offsetY / Grid.pixelWidth);
      if (this.oldX === x && this.oldY === y) {
        return false;
      }
      this.oldX = x;
      this.oldY = y;
      Grid.context.beginPath();
      // Grid.flipPixel(x, y);
      if (this.rightClick) {
        Grid.delPixel(x, y);
      } else {
        Grid.putPixel(x, y);
      }
      Grid.context.closePath();
      Grid.context.fill();
    }
  },
  down: function(ev) {
    this.mouseHeld = true;
    var x = Math.floor(ev.offsetX / Grid.pixelWidth),
        y = Math.floor(ev.offsetY / Grid.pixelWidth);
    this.oldX = x;
    this.oldY = y;
    this.rightClick = ev.which === 3;
    Grid.context.beginPath();
    if (this.rightClick) {
      Grid.delPixel(x, y);
    } else {
      Grid.putPixel(x, y);
    }
    // Grid.flipPixel(x, y);
    Grid.context.closePath();
    Grid.context.fill();
  },
  up: function() {
    this.mouseHeld = false;
  }
};

Grid.key = {
  down: function(ev) {
    if (ev.which === 190 && Grid.presets.random) {
      Grid.applyPreset("random");
      Grid.generationNumber = 0;
      document.getElementById("gen-num").innerText = Grid.generationNumber;
    } else if (ev.which === 32) {
      ev.preventDefault();
      Grid.nextGeneration();
      Grid.generationNumber += 1;
      document.getElementById("gen-num").innerText = Grid.generationNumber;
    } else if (ev.which === 13) {
      Grid.paused = !Grid.paused;
      if (Grid.paused) {
        window.clearInterval(Grid.generationLoop);
      } else {
        Grid.generationLoop = window.setInterval(function() {
          Grid.nextGeneration();
          Grid.generationNumber += 1;
          document.getElementById("gen-num").innerText = Grid.generationNumber;
        }, SPEED);
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  Grid.setup(WIDTH, HEIGHT, PIXELWIDTH, document.getElementById("grid"));
  Grid.applyPreset("glidergun");
  // Grid.createRandom(8);
}, false);
