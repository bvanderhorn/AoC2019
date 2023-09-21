import * as h from './helpers';

export var execute = (program: number[], index: {i:number}, halt: {h:boolean}, input: number = 0) => {
    var [opm, a0, b0, c0] = program.slice(index.i, index.i + 4);
    // h.print('index ',index, ':', opm, a0, b0, c0 );

    var op:number = +`0${opm.toString()}`.split('').slice2(-2).join('');
    // h.print('op',op);
    var modes:number[] = `0000${opm.toString()}`.split('').slice2(0,-2).map((m:string) => +m).reverse();
    var [a, b, c] = [a0, b0, c0].map((n:number,i:number) => modes[i] == 1 ? n : program[n]);

    switch (op) {
        case 1:
            program[c0] = a + b;
            index.i += 4;
            break;
        case 2:
            program[c0] = a * b;
            index.i += 4;
            break;
        case 3:
            program[a0] = input;
            index.i += 2;
            break;
        case 4:
            h.print(a);
            index.i += 2;
            break;
        case 99:
            halt.h = true;
            break;
        default:
            throw new Error("invalid opcode");
    }
}

export var run = (program: number[], input: number = 0): number => {
    var current = program.copy();
    var index = {i:0};
    var halt = {h:false};
    while(true) {
        execute(current, index, halt, input);
        if (halt.h) break;
    }
    return current[0];
}

export var searchInputSpace = (program:number[], target:number, input:number = 0) : [number,number] => {
    for (const noun of h.range(0,100)) for (const verb of h.range(0,100)) {
        var current = program.copy();
        current[1] = noun;
        current[2] = verb;
        if (run(current, input) == target) return [noun,verb];
    }
    
    throw new Error("no solution found");
}