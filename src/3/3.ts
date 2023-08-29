import * as h from '../helpers';

type Crossing = {
    coor: [number, number]
    steps: [number, number]
}
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
var getCrossings = (line1: number[][], line2: number[][]): number[][] => {
    var dx1 = [line1[0][0], line1[1][0]].sort((a, b) => a - b);
    var dx2 = [line2[0][0], line2[1][0]].sort((a, b) => a - b);
    var dy1 = [line1[0][1], line1[1][1]].sort((a, b) => a - b);
    var dy2 = [line2[0][1], line2[1][1]].sort((a, b) => a - b);

    if (h.overlaps(dx1, dx2) && h.overlaps(dy1, dy2)) {
        var xmin = [dx1[0], dx2[0]].max();
        var xmax = [dx1[1], dx2[1]].min();
        var ymin = [dy1[0], dy2[0]].max();
        var ymax = [dy1[1], dy2[1]].min();

        return getCoordinates(xmin, xmax, ymin, ymax);
    }

    return [];
}

var getCoordinates = (xmin: number, xmax:number, ymin:number, ymax:number): number[][] => {
    var out = [];
    for (const x of h.range(xmin, xmax+1)) for (const y of h.range(ymin, ymax+1)) out.push([x,y]);
    return out;
}

var crossingOnIndex = (coor: [number,number], line: number[][]) : number => {
    var [xl, yl] = [ [line[0][0], line[1][0]], [line[0][1], line[1][1]] ];
    var [x, y] = coor;
    if (x <= xl.max() && x >= xl.min() && y <= yl.max() && y >= yl.min()) {
        return Math.abs(x - line[0][0]) + Math.abs(y - line[0][1]);
    }
    return -1;
}
var lineSteps = (line: number[][]) : number => {
    return Math.abs(line[0][0] - line[1][0]) + Math.abs(line[0][1] - line[1][1]);
}
var superExpand = (corners: number[][]) : number[][] => {
    var out : number[][] = [];
    for (const i of h.range(0, corners.length -1)) out = out.concat(h.expand(corners[i], corners[i+1]));
    return out;
}

var visualize = (corners: number[][][], crossings: Crossing[]) : string => {
    var flat = corners.flat();
    var [xes, ys] = [flat.map(x => x[0]), flat.map(x => x[1])];
    var [xmin, xmax, ymin, ymax] = [xes.min(), xes.max(), ys.min(), ys.max()];
    if ([xmax, ymax].prod() > 1E6) 
        return "too big to visualize";
    var matrix : string[][] = h.ea([ymax-ymin+1, xmax-xmin+1], ".");
    for (const i of h.range(0, corners.length)) 
        for (const c of superExpand(corners[i]))
            matrix[c[1]-ymin][c[0]-xmin] = i == 0 ? 'a' : 'b';
    for (const c of crossings) matrix[c.coor[1]-ymin][c.coor[0]-xmin] = 'X';
    return matrix.map(x => x.join('')).join('\n');
}

// execute
var wires = h.read(3, "wires.txt").split(',');
var corners = wires.map(getCorners);
var crossingCoordinates : number[][] = [];
for (const i of h.range(0, corners[0].length-1)) 
    for (const j of h.range(0, corners[1].length-1))
        crossingCoordinates = crossingCoordinates.concat(getCrossings(corners[0].slice(i, i+2), corners[1].slice(j, j+2)));
var crossings : Crossing[] = crossingCoordinates.unique().map(x => {
    return {coor: eval(`[${x}]`), steps: [-1,-1]};
});

h.write(3, "visual.txt", visualize(corners, crossings));

// part 1
var distances = crossings.map(x => x.coor.manhattan().sum());
h.print("part 1:", distances.filter(d => d != 0).min());

// part 2
corners.forEach((c, i) => {
    var steps = 0;
    for (const j of h.range(0, c.length-1)) {
        var line = [c[j], c[j+1]];
        for (const crossing of crossings.filter(x => x.steps[i] == -1)) {
            var s = crossingOnIndex(crossing.coor, line);
            if (s != -1) crossing.steps[i] = steps + s;
        }
        steps += lineSteps(line);
    }
})

var lowestSteps : Crossing = crossings.filter(x => x.steps[0] > 0 && x.steps[1] > 0).sort( (a,b) => a.steps.sum() - b.steps.sum() )[0];
h.print("part 2:");
h.print(" lowest crossing:", lowestSteps);
h.print(" steps:", lowestSteps.steps.sum());
//h.print(" all crossings:", crossings);