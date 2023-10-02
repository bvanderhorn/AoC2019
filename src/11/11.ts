import * as h from '../helpers';
import * as ic from '../intcode';

type RunState = {
    panels: Map<[number, number], boolean>,
    curPanel: [number, number],
    direction: string,
    state: ic.State
}

var getPanel = (panel: [number, number], direction: string) : [number, number] => {
    switch (direction) {
        case "U": return [panel[0], panel[1] + 1];
        case "D": return [panel[0], panel[1] - 1];
        case "L": return [panel[0] - 1, panel[1]];
        case "R": return [panel[0] + 1, panel[1]];
        default: throw new Error("invalid direction");
    }
}

var move = (rs: RunState) : void => {
    var output = rs.state.runTillInputNeededOrHalt();
    if (output.length > 0) rs.panels.set(rs.curPanel, output[0] == 1);
    var turn = output[1] == 0 ? -1 : 1;
    rs.direction = dirs.get((dirs.indexOf(rs.direction) + turn));
    rs.curPanel = getPanel(rs.curPanel, rs.direction);
    rs.state.input.push(rs.panels.get(rs.curPanel) ? 1 : 0);
}

var program = h.read(11, "program.txt")[0].split(',').tonum();
var dirs = "URDL";

var runState: RunState = {
    panels : new Map<[number, number], boolean>(),
    curPanel: [0,0],
    direction: "U",
    state: new ic.State(program.copy(), [0])
}

while(!runState.state.halt) {
    
}
