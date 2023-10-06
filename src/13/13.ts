import * as h from '../helpers';
import * as ic from '../intcode';

var getTile = (type:number) : string => {
    switch (type) {
        case 0: return " ";
        case 1: return "#";
        case 2: return "X";
        case 3: return "-";
        case 4: return "o";
        default: throw new Error("invalid tile type");
    }
}

var draw = (tiles: number[][]) : void => {
    var xRange = tiles.map(x => x[0]).minmax();
    var yRange = tiles.map(x => x[1]).minmax();
    var str: string[][] = [];
    for (var y = yRange[0]; y <= yRange[1]; y++) {
        var curStr : string[] = [];
        for (var x = xRange[0]; x <= xRange[1]; x++) {
            var mIndex = tiles.findIndex(m => h.equals2(m.slice(0,2), [x,y]));
            curStr.push(mIndex>-1 ? getTile(tiles[mIndex][2]) : ".");
        }
        str.push(curStr);
    }
    str.printc(x => x != ".", 'c');
}

var program = h.read(13, "program.txt")[0].split(',').tonum();
h.print(program.slice(0,5));
var state = new ic.State(program.copy(), []);
var tiles = state.runTillInputNeededOrHalt().chunks(3);
h.print("part 1:",tiles.map(x => x.last()).count(2));

// part 2
draw(tiles);