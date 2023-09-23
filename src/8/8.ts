import * as h from '../helpers';

var getPixel = (layers: number[][], index:number) : number => layers.map(x => x[index]).filter(x => x != 2)[0];
var render = (pixels: number[], dims: number[]) : string => {
    var [w,h] = dims;
    var lines : string[] = [];
    while (pixels.length > 0) lines.push(pixels.splice(0,w).map(x => x == 1 ? '█' : ' ').join(''));
    return lines.join('\n');
}

var pixels = h.read(8, "pixels.txt")[0].split('').tonum();
var dims = [25,6];

var layers : number[][] = [];
while (pixels.length > 0) layers.push(pixels.splice(0, dims.prod()));
var layerF0 = layers.sort((a,b) => a.filter(x => x == 0).length - b.filter(x => x == 0).length)[0];
h.print("part 1:", layerF0.filter(x => x == 1).length * layerF0.filter(x => x == 2).length);

var finalPixels = h.range(0, dims.prod()).map(i => getPixel(layers, i));
h.print("part 2:\n", render(finalPixels, dims));