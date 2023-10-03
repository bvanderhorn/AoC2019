import * as h from '../helpers';
import * as ic from '../intcode';

type RunState = {
    panels: Map<[number, number], boolean>,
    curPanel: [number, number],
    direction: string,
    state: ic.State
}

var getMove = (direction:string) : [number, number] => {
    switch (direction) {
        case "U": return [0, 1];
        case "D": return [0, -1];
        case "L": return [-1, 0];
        case "R": return [1, 0];
        default: throw new Error("invalid direction");
    }
}

var move = (rs: RunState) : void => {
    var output = rs.state.runTillInputNeededOrHalt();
    if (output.length > 0) rs.panels.set(rs.curPanel, output[0] == 1);
    var turn = output[1] == 0 ? -1 : 1;
    rs.direction = dirs.get((dirs.indexOf(rs.direction) + turn));
    rs.curPanel = rs.curPanel.plusEach(getMove(rs.direction)) as [number, number];
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
    move(runState);
}
h.print("part 1:", runState.panels.size);