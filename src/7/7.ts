import * as h from '../helpers';
import * as ic from '../intcode';

var customRun = (program: number[], phase:number[]) : number => {
    var output = 0;
    for (const p of phase) output = ic.run(program.copy(), [p, output])[0];
    return output;
}

var program = h.read(7, "program.txt",)[0].split(',').tonum();
var phases = [0,1,2,3,4].permutations();
h.print(phases.length);
h.print("part 1:", phases.map(p => customRun(program, p)).max());