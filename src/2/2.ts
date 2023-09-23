import * as h from '../helpers';
import * as ic from '../intcode';

var multiRun = (program: number[], noun:number, verb:number): number => {
    var current = program.copy();
    current[1] = noun;
    current[2] = verb;
    ic.run(current);
    return current[0];
}

var searchInputSpace = (program:number[], target:number) : [number,number] => {
    for (const noun of h.range(0,100)) for (const verb of h.range(0,100)) {
        if (multiRun(program, noun, verb) == target) return [noun,verb];
    }    
    throw new Error("no solution found");
}

var program = h.read(2, "program.txt",)[0].split(',').tonum();
h.print("part 1:", multiRun(program, 12, 2));
var [noun,verb] = searchInputSpace(program, 19690720);
h.print("part 2:", 100 * noun + verb);