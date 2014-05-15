Grid.presets = {
  glidergun: ["                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
              "                                                  ",
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
  Grid.resetGrid();
  Grid.context.beginPath();
  for (var y = 0; y < this.height; ++y) {
    var row = this.presets[preset][y % (this.presets[preset].length - 1)].split("");
    for (var x = 0; x < this.width; ++x) {
      if (row[x] === "*") {
        this.pixels[y][x] = true;
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
