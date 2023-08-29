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
var crossings : Crossing[] = crossingStrings.toList().map(x => {
    return {coor: eval(`[${x}]`), steps: [-1,-1]};
});
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