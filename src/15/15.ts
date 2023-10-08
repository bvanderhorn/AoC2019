import * as h from '../helpers';
import * as ic from '../intcode';

var getTile = (type:number) : string => "#.$*D"[type];
var getDirCode = (dir: string) : number => "^v<>".indexOf(dir) + 1;
var getCoor = (curCoor: [number, number], dir: string) : [number, number] => 
    curCoor.plusEach([[0,-1], [0,1], [-1,0], [1,0]][getDirCode(dir) - 1]) as [number, number];

var mapToString = (map: Map<string, number>) : string =>
    h.coorMapToMap(map, getTile, " ", [[-22,22], [-22,22]]).stringc(x => "$*D".includes(x), 'c') + "\n";

var curMap = (map: Map<string, number>, curCoor: [number, number]) : string => {
    var coorCopy = new Map(map);
    coorCopy.set(curCoor.toString(), 4);
    return mapToString(coorCopy);
}

var simpleMap = (program: number[], steps:number, verbose = false) : Map<string, number> => {
    var coor: Map<string, number> = new Map<string, number>();
    var curCoor: [number, number] = [0,0];
    coor.set(curCoor.toString(), 3);

    var state = new ic.State(program.copy());
    if (verbose) h.print(curMap(coor, curCoor));

    // simple strategy: go any direction till first wall, then always keep wall left;
    // repeat for [steps], then return map
    var dirs = "^>v<";
    var dir = "^";
    for (var i = 0; i < steps; i++) {
        var nextCoor = getCoor(curCoor, dir);
        state.input.push(getDirCode(dir));
        var output = state.runTillInputNeededOrHalt();
        var type = output[0];
        if (!coor.get(nextCoor.toString())) coor.set(nextCoor.toString(), type);
        dir = dirs.get(dirs.indexOf(dir) + (type==0 ? 1 : -1));
        if (type != 0) curCoor = nextCoor;
        
        if (verbose) h.printu(curMap(coor, curCoor));
    }
    
    return coor;
}
var stringToCoor = (str: string) : [number, number] => str.split(',').tonum() as [number, number];

var cleanMap = (map: Map<string, number>) : [number, number][] => 
    Array.from(map).filter(x => x[1] != 0).map(x => stringToCoor(x[0]));

var program = h.read(15, "program.txt")[0].split(',').tonum();

// retrieve the map
var map = simpleMap(program, 5E3);
h.print(mapToString(map));
var oxygen = Array.from(map).find(x => x[1] == 2)![0];

// part 1
var distances = h.simpleDijkstra(cleanMap(map), [0,0]);
h.print("part 1:", distances.get(oxygen));

// part 2
var distances2 = h.simpleDijkstra(cleanMap(map), stringToCoor(oxygen));
h.print("part 2:", Array.from(distances2.values()).max());