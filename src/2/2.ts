import * as h from '../helpers';

var execute = (program: number[], index: number): boolean => {
    var [op, a, b, c] = program.slice(index, index + 4);
    //h.print('index ',index, ':', op, a, b, c )
    switch (op) {
        case 1:
            program[c] = program[a] + program[b];
            break;
        case 2:
            program[c] = program[a] * program[b];
            break;
        case 99:
            return false;
        default:
            throw new Error("invalid opcode");
    }

    return true;
}

var run = (program: number[], noun: number, verb: number): number => {
    var current = program.copy();
    current[1] = noun;
    current[2] = verb;
    for (const i of h.range(0, current.length, 4)) if (!execute(current, i)) break;
    return current[0];
}

var searchInputSpace = (program:number[], target:number) : [number,number] {
    for (const noun of h.range(0,100)) for (const verb of h.range(0,100)) {
            if (run(program, noun, verb) == target) return [noun,verb];
        }
    
    throw new Error("no solution found");
}

var program = h.read(2, "program.txt",)[0].split(',').tonum();

h.print("part 1:", run(program, 12, 2));
var [noun,verb] = searchInputSpace(program, 19690720);
h.print("part 2:", 100 * noun + verb);