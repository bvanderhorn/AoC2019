import * as h from '../helpers';
import * as ic from '../intcode';

var multiRun = (program: number[], phase:number[], part:number, callback: (p:number[], i:number[]) => number[]) : number => {
    var output = 0;
    for (const p of phase) {
        h.print("phase ", p, "input ", output);
        program.print(", ");
        output = callback(part == 1 ? program.copy() : program, [p, output])[0];
    }
    return output;
}

var run1 = (program: number[], input: number[] = []): number[] => {
    var index = {i:0};
    var halt = {h:false};
    var inputIndex = 0;
    while(true) {
        var output = ic.execute(program, index, halt, input[inputIndex]);
        if (output != undefined) {
            input[1] = output;
            // h.print("output is new input:", input[1]);
        }
        // program.print(', ');
        if (ic.isConsumed(program, index.i)) {
            inputIndex = 1;
        }
        if (halt.h) return [input[1]];
    }
}

var program = h.read(7, "program.txt", "ex")[0].split(',').tonum();
var phases: number[][] = [0,1,2,3,4].permutations();
h.print(phases.length);
// h.print("part 1:", phases.map(p => multiRun(program.copy(), p, 1, ic.run)).max());

// part 2
var phases2: number[][] = [5,6,7,8,9].permutations();
var allPhases: number[][] = phases.map(p => phases2.map(p2 => p.concat(p2))).flat();
allPhases.slice(0,10).print();
h.print("phases: ", allPhases[0]);
var test = multiRun(program.copy(), allPhases[0], 2, run1);
// h.print("test: ", test);
// h.print("part 2:", allPhases.map(p => multiRun(program.copy(), p, 2, run1)).max());