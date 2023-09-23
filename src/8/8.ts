import * as h from '../helpers';

var getPixel = (layers: number[][], index:number) : number => layers.map(x => x[index]).filter(x => x != 2)[0];
var render = (pixels: number[], dims: number[]) : string => {
    var lines : string[] = [];
    while (pixels.length > 0) lines.push(pixels.splice(0,dims[0]).map(x => x == 1 ? '█' : ' ').join(''));
    return lines.join('\n');
}

var pixels = h.read(8, "pixels.txt")[0].split('').tonum();
var dims = [25,6];
// var dims = [2,2];

var layers : number[][] = [];
while (pixels.length > 0) layers.push(pixels.splice(0, dims.prod()));
var layerF0 = layers.slice(0).sort((a,b) => a.filter(x => x == 0).length - b.filter(x => x == 0).length)[0];
h.print("part 1:", layerF0.filter(x => x == 1).length * layerF0.filter(x => x == 2).length);

var finalPixels: number[] = h.range(0, dims.prod()).map(i => getPixel(layers, i));
h.print("part 2:");
h.print(render(finalPixels, dims));