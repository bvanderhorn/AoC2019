import * as h from '../helpers';
import * as ic from '../intcode';

var customRun = (program: number[], phase:number[], part:number, callback: (p:number[], i:number[]) => number[]) : number => {
    var output = 0;
    for (const p of phase) output = callback(part == 1 ? program.copy() : program, [p, output])[0];
    return output;
}

var run1 = (program: number[], input: number[] = []): number[] => {
    var index = {i:0};
    var halt = {h:false};
    var inputIndex = 0;
    while(true) {
        var output:number[] = [];
        var consumed = ic.execute(program, index, halt, input[inputIndex], output);
        if (consumed) inputIndex = 1;
        if (output.length > 0) {
            input[1] = output[0];
        }
        if (halt.h) return output;
    }
}

var program = h.read(7, "program.txt", "ex")[0].split(',').tonum();
var phases: number[][] = [0,1,2,3,4].permutations();
h.print(phases.length);
h.print("part 1:", phases.map(p => customRun(program.copy(), p, 1, ic.run)).max());

// part 2
var phases2: number[][] = [5,6,7,8,9].permutations();
var allPhases: number[][] = phases.map(p => phases2.map(p2 => p.concat(p2))).flat();
allPhases.slice(0,10).print();
h.print("part 2:", allPhases.map(p => customRun(program.copy(), p, 2, run1)).max());