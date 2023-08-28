import * as h from '../helpers';

var dirs = new Map<string, number[]>([[ 'U', [0, 1]], ['D', [0, -1]], ['L', [-1, 0]], ['R', [1, 0]]]);
var move = (wire: number[][], instruction: string): void => {
    var [dir, step] = [instruction[0], parseInt(instruction.slice(1))];
    wire.push((dirs.get(dir) ?? [0,0]).times(step).plusEach(wire.last()));
}
var getCorners = (instructions: string[]): number[][] => {
    var wire = [[0,0]];
    instructions.forEach(m => move(wire, m));
    return wire;
}
var getCrossings = (line1: number[][], line2: number[][]): string[] => {
    var coor1 = h.expand(line1[0], line1[1]);
    var coor2 = h.expand(line2[0], line2[1]);
    return coor1.filter(x => coor2.includes2(x)).map(x => x.toString());
}

var wires = h.read(3, "wires.txt").split(',');
var corners = wires.map(getCorners);
var crossings = corners[0].map((x,i) => { corners[1].map((y,j) => {
    if (i ==0 || j == 0) return;
    return getCrossings([corners[0][i-1], x], [corners[1][j-1], y]);
})}).flat().filter(x => x != undefined).toSet();

h.print(wires[0].slice(0,5));
h.print(corners[0].slice(0,5));
h.print(crossings.toList().slice(0,5));
h.print(crossings.toList().length);