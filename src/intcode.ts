import * as h from './helpers';

export type Instruction = {
    op: number,
    modes: number[],
    params: number[],
    roughParams: number[]
}

export var isConsumed = (program: number[], index: number) : boolean => {
    var {op, modes, params, roughParams} = getInstruction(program, index);
    return op == 3;
}

export var getInstruction = (program: number[], index: number, verbose = false) : Instruction => {
    var [opm, a0, b0, c0] = program.slice(index, index + 4);
    h.printVerbose(verbose,'index ',index, ':', opm, a0, b0, c0 );

    var op:number = +`0${opm.toString()}`.split('').slice2(-2).join('');
    var modes:number[] = `0000${opm.toString()}`.split('').slice2(0,-2).map((m:string) => +m).reverse();
    var params = [a0, b0, c0].map((n:number,i:number) => modes[i] == 1 ? n : program[n]);
    var roughParams = [a0, b0, c0];

    return {op, modes, params, roughParams};
}

export var execute = (program: number[], index: {i:number}, halt: {h:boolean}, input: number, verbose: boolean = false) : number|undefined => {
    // executes one instruction and returns if input was consumed
    var {op, modes, params, roughParams} = getInstruction(program, index.i);
    var [a, b, c] =  params;
    var [a0, b0, c0] = roughParams;

    switch (op) {
        case 1:
            program[c0] = a + b;
            index.i += 4;
            h.printVerbose(verbose, `program[${c0}] = ${a} + ${b} => ${program[c0]}, index += 4 => ${index.i}`)
            break;
        case 2:
            program[c0] = a * b;
            index.i += 4;
            h.printVerbose(verbose, `program[${c0}] = ${a} * ${b} => ${program[c0]}, index += 4 => ${index.i}`)
            break;
        case 3:
            program[a0] = input;
            index.i += 2;
            h.printVerbose(verbose, `program[${a0}] = input => ${input}, index += 2 => ${index.i}`)
            break;
        case 4:
            // h.print(a);
            index.i += 2;
            h.printVerbose(verbose, `output = ${a}, index += 2 => ${index.i}`)
            return a;
        case 5:
            var str =`index (${index.i}) = ${a} != 0 ? ${b} : index + 3 => `;
            if (a != 0) index.i = b;
            else index.i += 3;
            h.printVerbose(verbose, str,index.i);
            break;
        case 6:
            var str =`index (${index.i}) = ${a} == 0 ? ${b} : index + 3 => `;
            if (a == 0) index.i = b;
            else index.i += 3;
            h.printVerbose(verbose, str,index.i);
            break;
        case 7:
            program[c0] = a < b ? 1 : 0;
            index.i += 4;
            h.printVerbose(verbose, `program[${c0}] = ${a} < ${b} ? 1 : 0 => ${program[c0]}, index += 4 => ${index.i}`)
            break;
        case 8:
            program[c0] = a == b ? 1 : 0;
            index.i += 4;
            h.printVerbose(verbose, `program[${c0}] = ${a} == ${b} ? 1 : 0 => ${program[c0]}, index += 4 => ${index.i}`)
            break;
        case 99:
            halt.h = true;
            h.printVerbose(verbose, `halt => ${halt.h}`)
            break;
        default:
            throw new Error("invalid opcode");
    }
}

export var run = (program: number[], input: number[] = []): number[] => {
    var index = {i:0};
    var halt = {h:false};
    var inputIndex = 0;
    var output:number[] = [];
    while(true) {
        var curOutput = execute(program, index, halt, input[inputIndex]);
        if (curOutput != undefined) output.push(curOutput);
        var consumed = isConsumed(program, index.i);
        if (consumed) inputIndex++;
        if (halt.h) break;
    }
    return output;
}