import * as h from '../helpers';
import * as ic from '../intcode';

const show = (output:number[]) : string => output.map(x => String.fromCharCode(x)).join('');
const getCrossings = (map:string) : [number,number][] => {
    var mapMatrix = map.split('\n').split('');
    var crossings: [number,number][] = [];
    for (var y=1;y<mapMatrix.length-2;y++) 
        for (var x=1;x<mapMatrix[y].length-1;x++)
            if (mapMatrix[y][x] == '#' && mapMatrix[y-1][x] == '#' && mapMatrix[y+1][x] == '#' && mapMatrix[y][x-1] == '#' && mapMatrix[y][x+1] == '#')
                crossings.push([x,y]);
    return crossings;
}

const program = h.read(17, "program.txt")[0].split(',').tonum();
var state = new ic.State(program.copy());
var output = state.runTillInputNeededOrHalt();
h.write(17,"output.txt",output.join(','));

h.print(output.length);
// show(output).printc(x => '^>v<X'.includes(x));
const map  = show(output).replace(/[\^>v<X]/g,'#');
h.print(map);
const crossings = getCrossings(map);
h.print(crossings);