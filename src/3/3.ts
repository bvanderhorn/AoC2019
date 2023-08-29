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
var getCrossings = (line1: number[][], line2: number[][]): Set<string> => {
    var dx1 = [line1[0][0], line1[1][0]].sort();
    var dx2 = [line2[0][0], line2[1][0]].sort();
    var dy1 = [line1[0][1], line1[1][1]].sort();
    var dy2 = [line2[0][1], line2[1][1]].sort();

    if (h.overlaps(dx1, dx2) && h.overlaps(dy1, dy2)) {
        var xmin = [dx1[0], dx2[0]].max();
        var xmax = [dx1[1], dx2[1]].min();
        var ymin = [dy1[0], dy2[0]].max();
        var ymax = [dy1[1], dy2[1]].min();

        return getCoordinates(xmin, xmax, ymin, ymax).map(x => x.toString()).toSet();
    }

    return new Set<string>();
}

var getCoordinates = (xmin: number, xmax:number, ymin:number, ymax:number): number[][] => {
    var out = [];
    for (const x of h.range(xmin, xmax+1)) for (const y of h.range(ymin, ymax+1)) out.push([x,y]);
    return out;
}

// execute
var wires = h.read(3, "wires.txt").split(',');
var corners = wires.map(getCorners);
var crossingStrings = corners[0].map((x,i) => { return corners[1].map((y,j) => { 
    if(i>0 && j>0) return getCrossings([corners[0][i-1], x], [corners[1][j-1], y]).toList();
})}).flat().filter(x => x!= undefined).flat().toSet();

var crossings = crossingStrings.toList().map(x => eval(`[${x}]`));

// part 1
var distances = crossings.map(x => x.manhattan().sum());
h.print("part 1:", distances.filter(d => d != 0).min());

// part 2
