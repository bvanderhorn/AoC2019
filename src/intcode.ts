import * as h from './helpers';

export var execute = (program: number[], index: {i:number}, halt: {h:boolean}, input: number, output: number[] = []) : boolean => {
    // executes one instruction and returns if input was consumed
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
            return true;
        case 4:
            // h.print(a);
            output.push(a);
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
    return false;
}

export var run = (program: number[], input: number[] = []): number[] => {
    var index = {i:0};
    var halt = {h:false};
    var inputIndex = 0;
    var output:number[] = [];
    while(true) {
        var consumed = execute(program, index, halt, input[inputIndex], output);
        if (consumed) inputIndex++;
        if (halt.h) break;
    }
    return output;
}