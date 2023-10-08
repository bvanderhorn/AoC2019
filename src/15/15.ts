import * as h from '../helpers';
import * as ic from '../intcode';

var getTile = (type:number) : string => "#.$*"[type];
var getDirCode = (dir: string) : number => "^>v<".indexOf(dir) + 1;
var getCoor = (curCoor: [number, number], dir: string) : [number, number] => 
    curCoor.plusEach([[0,1], [1,0], [0,-1], [-1,0]][getDirCode(dir) - 1]) as [number, number];

var simpleMap = (program: number[], steps:number = 1E6) : [number, number, number][] => {
    var coor: Map<string, number> = new Map<string, number>();
    var curCoor: [number, number] = [0,0];
    coor.set(curCoor.toString(), 3);

    var state = new ic.State(program.copy());

    // simple strategy: go any direction till first wall, then always keep wall left;
    // repeat for 1E6 steps, then return map
    var dir = "^";
    for (var i = 0; i < steps; i++) {
        var nextCoor = getCoor(curCoor, dir);
        state.input.push(getDirCode(dir));
        var output = state.runTillInputNeededOrHalt();
        var type = output[0];
        coor.set(nextCoor.toString(), type);
        if (type == 0) {
            dir = "^>v<".get("^>v<".indexOf(dir) + 1);
        } else {
            curCoor = nextCoor;
        }
    }
    return Array.from(coor, ([k,v]) => [...k.split(',').map(x => +x), v] as [number, number, number]);
}

var program = h.read(15, "program.txt")[0].split(',').tonum();
var map = simpleMap(program, 1E2);
h.coorToMap(map, getTile, " ").printc(x => "$*".includes(x), 'c');