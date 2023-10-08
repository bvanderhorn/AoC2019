import * as h from '../helpers';
import * as ic from '../intcode';

var getTile = (type:number) : string => "#.$*D"[type];
var getDirCode = (dir: string) : number => "^v<>".indexOf(dir) + 1;
var getCoor = (curCoor: [number, number], dir: string) : [number, number] => 
    curCoor.plusEach([[0,-1], [0,1], [-1,0], [1,0]][getDirCode(dir) - 1]) as [number, number];

var mapToArray = (map: Map<string, number>) : [number, number, number][] =>
    Array.from(map, ([k,v]) => [...k.split(',').map(x => +x), v] as [number, number, number]);

var mapToString = (map: Map<string, number>) : string => arrayToString(mapToArray(map));

var arrayToString = (array: [number, number, number][]) : string =>
    h.coorToMap(array, getTile, " ", [[-22,22], [-22,22]]).stringc(x => "$*D".includes(x), 'c') + "\n";

var curMap = (map: Map<string, number>, curCoor: [number, number]) : string => {
    var coorCopy = new Map(map);
    coorCopy.set(curCoor.toString(), 4);
    return mapToString(coorCopy);
}

var simpleMap = (program: number[], steps:number = 1E6, verbose = false) : [number, number, number][] => {
    var coor: Map<string, number> = new Map<string, number>();
    var curCoor: [number, number] = [0,0];
    coor.set(curCoor.toString(), 3);

    var state = new ic.State(program.copy());
    if (verbose) h.print(curMap(coor, curCoor));

    // simple strategy: go any direction till first wall, then always keep wall left;
    // repeat for [steps], then return map
    var dir = "^";
    for (var i = 0; i < steps; i++) {
        var nextCoor = getCoor(curCoor, dir);
        state.input.push(getDirCode(dir));
        var output = state.runTillInputNeededOrHalt();
        var type = output[0];
        if (!coor.get(nextCoor.toString())) coor.set(nextCoor.toString(), type);
        if (type == 0) {
            dir = "^>v<".get("^>v<".indexOf(dir) + 1);
        } else {
            dir = "^>v<".get("^>v<".indexOf(dir) - 1);
            curCoor = nextCoor;
        }
        
        if (verbose) h.printu(curMap(coor, curCoor));
    }
    
    return mapToArray(coor);
}

var program = h.read(15, "program.txt")[0].split(',').tonum();
console.time("part 1");
var map = simpleMap(program, 5E3);
h.print(arrayToString(map));
console.timeEnd("part 1");