import * as h from './helpers';

export type Instruction = {
    op: number,
    modes: number[],
    params: number[],
    roughParams: number[]
}

export class State {
    public program: number[];
    public index: number;
    public input: number[];
    public halt: boolean;
    
    constructor(program: number[], input: number[] = []) {
        this.program = program;
        this.index = 0;
        this.input = input;
        this.halt = false;
    }

    public get awaitingInput(): boolean {
        return getInstruction(this.program, this.index).op == 3 && this.input.length == 0;
    }
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

export var execute = (state:State, verbose: boolean = false) : number|undefined => {
    // executes one instruction and returns if input was consumed
    var {op, modes, params, roughParams} = getInstruction(state.program, state.index, verbose);
    var [a, b, c] =  params;
    var [a0, b0, c0] = roughParams;
    if (state.awaitingInput) {
        h.printVerbose(verbose, `awaiting input => ${state.awaitingInput}`)
        return undefined;
    }

    switch (op) {
        case 1:
            state.program[c0] = a + b;
            state.index += 4;
            h.printVerbose(verbose, `program[${c0}] = ${a} + ${b} => ${state.program[c0]}, index += 4 => ${state.index}`)
            break;
        case 2:
            state.program[c0] = a * b;
            state.index += 4;
            h.printVerbose(verbose, `program[${c0}] = ${a} * ${b} => ${state.program[c0]}, index += 4 => ${state.index}`)
            break;
        case 3:
            var input = state.input.shift() ?? -1;
            state.program[a0] = input;
            state.index += 2;
            h.printVerbose(verbose, `program[${a0}] = input => ${input}, index += 2 => ${state.index}`)
            break;
        case 4:
            // h.print(a);
            state.index += 2;
            h.printVerbose(verbose, `output = ${a}, index += 2 => ${state.index}`)
            return a;
        case 5:
            var str =`index (${state.index}) = ${a} != 0 ? ${b} : index + 3 => `;
            if (a != 0) state.index = b;
            else state.index += 3;
            h.printVerbose(verbose, str,state.index);
            break;
        case 6:
            var str =`index (${state.index}) = ${a} == 0 ? ${b} : index + 3 => `;
            if (a == 0) state.index = b;
            else state.index += 3;
            h.printVerbose(verbose, str,state.index);
            break;
        case 7:
            state.program[c0] = a < b ? 1 : 0;
            state.index += 4;
            h.printVerbose(verbose, `program[${c0}] = ${a} < ${b} ? 1 : 0 => ${state.program[c0]}, index += 4 => ${state.index}`)
            break;
        case 8:
            state.program[c0] = a == b ? 1 : 0;
            state.index += 4;
            h.printVerbose(verbose, `program[${c0}] = ${a} == ${b} ? 1 : 0 => ${state.program[c0]}, index += 4 => ${state.index}`)
            break;
        case 99:
            state.halt = true;
            h.printVerbose(verbose, `halt => ${state.halt}`)
            break;
        default:
            throw new Error("invalid opcode");
    }
}

export var run = (program: number[], input: number[] = [], verbose:boolean = false): number[] => {
    var state = new State(program, input);
    var output:number[] = [];
    while(true) {
        var curOutput = execute(state, verbose);
        if (curOutput != undefined) output.push(curOutput);
        if (state.halt) break;
    }
    return output;
}