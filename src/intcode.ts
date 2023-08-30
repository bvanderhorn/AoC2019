import * as h from './helpers';

export var execute = (program: number[], index: {i:number}): boolean => {
    var [op, a, b, c] = program.slice(index.i, index.i + 4);
    //h.print('index ',index, ':', op, a, b, c )
    switch (op) {
        case 1:
            program[c] = program[a] + program[b];
            break;
        case 2:
            program[c] = program[a] * program[b];
            break;
        case 3:
            
        case 99:
            return false;
        default:
            throw new Error("invalid opcode");
    }

    return true;
}

export var run = (program: number[], noun: number, verb: number): number => {
    var current = program.copy();
    current[1] = noun;
    current[2] = verb;
    var i = {i:0};
    while(true) if (!execute(current, i)) break;
    return current[0];
}

export var searchInputSpace = (program:number[], target:number) : [number,number] => {
    for (const noun of h.range(0,100)) for (const verb of h.range(0,100)) {
        if (run(program, noun, verb) == target) return [noun,verb];
    }
    
    throw new Error("no solution found");
}