import * as h from '../helpers';

var pixels = h.read(8, "pixels.txt")[0].split('').tonum();
var dims = [25,6];
var layers : number[][] = [];
while (pixels.length > 0) layers.push(pixels.splice(0, dims.prod()));
var layerF0 = layers.sort((a,b) => a.filter(x => x == 0).length - b.filter(x => x == 0).length)[0];
h.print("part 1:", layerF0.filter(x => x == 1).length * layerF0.filter(x => x == 2).length);