Grid.presets = {
  glidergun: [["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                          *                       "],
              ["                        * *                       "],
              ["              **      **            **            "],
              ["             *   *    **            **            "],
              ["  **        *     *   **                          "],
              ["  **        *   * **    * *                       "],
              ["            *     *       *                       "],
              ["             *   *                                "],
              ["              **                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "],
              ["                                                  "]]
};

Grid.applyPreset = function(preset) {
  Grid.resetGrid();
  Grid.context.beginPath();
  for (var y = 0; y < this.height; ++y) {
    var row = this.presets[preset][y][0].split("");
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
