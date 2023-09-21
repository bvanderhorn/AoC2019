import * as h from './helpers';

export var execute = (program: number[], index: {i:number}, halt: {h:boolean}, input: number = 0) => {
    var [opm, a0, b0, c0] = program.slice(index.i, index.i + 4);
    // h.print('index ',index, ':', opm, a0, b0, c0 );

    var op:number = +`0${opm.toString()}`.split('').slice2(-2).join('');
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
        case 5:
            if (a != 0) index.i = b;
            else index.i += 3;
            break;
        case 6:
            if (a == 0) index.i = b;
            else index.i += 3;
            break;
        case 7:
            program[c0] = a < b ? 1 : 0;
            index.i += 4;
            break;
        case 8:
            program[c0] = a == b ? 1 : 0;
            index.i += 4;
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