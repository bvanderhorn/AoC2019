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

var program = h.read(2, "program.txt",)[0].split(',').tonum();
program[1] = 12;
program[2] = 2;
for (const i of h.range(0, program.length, 4)) if (!execute(program, i)) break;

h.print("part 1:", program[0]);