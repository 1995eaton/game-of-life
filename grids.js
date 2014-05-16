Grid.presetDimensions = {
  glidergun: [50, 30]
};
Grid.presets = {
  glidergun: ["                                                  ",
              "                                                  ",
              "                          *                       ",
              "                        * *                       ",
              "              **      **            **            ",
              "             *   *    **            **            ",
              "  **        *     *   **                          ",
              "  **        *   * **    * *                       ",
              "            *     *       *                       ",
              "             *   *                                ",
              "              **                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  "]
};

Grid.applyPreset = function(preset) {
  if (this.presetDimensions.hasOwnProperty(preset)) {
    var dimensions = this.presetDimensions[preset];
    this.setup(dimensions[0], dimensions[1], this.hiddenRegionSize, this.canvas);
  }
  Grid.resetGrid();
  Grid.context.beginPath();
  for (var y = 0; y < this.height - this.hiddenRegionSize, y < this.presets[preset].length; ++y) {
    var row = this.presets[preset][y].split("");
    for (var x = 0; x < this.width - this.hiddenRegionSize; ++x) {
      if (row[x] === "*") {
        this.pixels[y + this.initialY][x + this.initialX] = true;
        Grid.putPixel(x, y);
      }
    }
  }
  Grid.context.closePath();
  Grid.context.fill();
};

Grid.createRandom = function(s) {
  Grid.resetGrid();
  Grid.context.beginPath();
  delete this.presets.random;
  Grid.presets.random = [];
  for (var y = 0; y < this.height; ++y) {
    var string = "";
    for (var x = 0; x < this.width; ++x) {
      if (Math.floor(Math.random() * s) === 0) {
        this.pixels[y][x] = true;
        string += "*";
        Grid.putPixel(x, y);
      } else {
        string += " ";
      }
    }
    this.presets.random.push(string);
  }
  log("[\"" + this.presets.random.join("\",\n \"") + "\"]");
  Grid.context.closePath();
  Grid.context.fill();
};
