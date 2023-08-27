import * as h from '../helpers';

var dirs = new Map<string, number[]>([[ 'U', [0, 1]], ['D', [0, -1]], ['L', [-1, 0]], ['R', [1, 0]]]);
var move = (wire: number[][], instruction: string): void => {
    var [dir, step] = [instruction[0], parseInt(instruction.slice(1))];
    wire.push((dirs.get(dir) ?? [0,0]).times(step).plusEach(wire.last()));
}

var wires = h.read(3, "wires.txt").split(',');
var corners = wires.map(x => {
    var wire = [[0,0]];
    x.forEach(m => move(wire, m));
    return wire;
});
h.print(wires[0].slice(0,5));
h.print(corners[0].slice(0,5));