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

var program = h.read(15, "program.txt")[0].split(',').tonum();

// get the map
var map = simpleMap(program, 5E3);
// h.print(mapToString(map));

// Dijkstra
var start = [0,0];
var oxygen = Array.from(map).find(x => x[1] == 2)![0];
var distances = new Map<string, number>();
distances.set(start.toString(), 0);
var remaining : number[][] = [start];
var visited = new Set<string>();

while (remaining.length > 0) {
    var cur = remaining.shift()!;
    var curDist = distances.get(cur.toString())!;
    var neighbors = [[0,1], [0,-1], [1,0], [-1,0]].map(x => cur.plusEach(x) as [number, number]);
    for (const n of neighbors) {
        var notYetVisited = !visited.has(n.toString());
        var notAWall = map.get(n.toString()) != 0;
        if (notYetVisited && notAWall) {
            if (curDist + 1 < (distances.get(n.toString()) ?? 1E10))
            distances.set(n.toString(), curDist + 1);
            if (!remaining.includes2(n)) remaining.push(n);
        }
    }
    visited.add(cur.toString());
}

h.print("part 1:", distances.get(oxygen.toString()));