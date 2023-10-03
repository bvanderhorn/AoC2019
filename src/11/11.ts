import * as h from '../helpers';
import * as ic from '../intcode';

type RunState = {
    panels: Map<string, boolean>,
    curPanel: [number, number],
    direction: string,
    state: ic.State
}

var getMove = (direction:string) : [number, number] => {
    switch (direction) {
        case "^": return [0, 1];
        case "v": return [0, -1];
        case "<": return [-1, 0];
        case ">": return [1, 0];
        default: throw new Error("invalid direction");
    }
}

var move = (rs: RunState) : void => {
    var output = rs.state.runTillInputNeededOrHalt(true);
    if (output.length > 0) rs.panels.set(rs.curPanel.toString(), output[0] == 1);
    var turn = output[1] == 0 ? -1 : 1;
    rs.direction = dirs.get((dirs.indexOf(rs.direction) + turn));
    rs.curPanel = rs.curPanel.plusEach(getMove(rs.direction)) as [number, number];
    rs.state.input.push(rs.panels.get(rs.curPanel.toString()) ? 1 : 0);
}

var printRunState = (rs: RunState) : void => {
    var keys = Array.from(rs.panels.keys());
    var minX = keys.map(x => x[0]).min() - 2;
    var maxX = keys.map(x => x[0]).max() + 2;
    var minY = keys.map(x => x[1]).min() - 2;
    var maxY = keys.map(x => x[1]).max() + 2;
    var str = "";
    for (var y = maxY; y >= minY; y--) {
        for (var x = minX; x <= maxX; x++) {
            h.equals2([x,y], rs.curPanel) 
                ? str += rs.direction
                : str += rs.panels.get([x,y].toString()) ? "#" : ".";
        }
        str += "\n";
    }
    str.split('\n').split('').printc(x => "^>v<".includes(x), 'c');
}

var program = h.read(11, "program.txt")[0].split(',').tonum();
var dirs = "^>v<";

var runState: RunState = {
    panels : new Map<string, boolean>(),
    curPanel: [0,0],
    direction: "^",
    state: new ic.State(program.copy(), [0])
}

while(!runState.state.halt) {
    move(runState);
    printRunState(runState);
}
h.print("part 1:", runState.panels.size);