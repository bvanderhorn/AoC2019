import * as h from '../helpers';
import * as ic from '../intcode';

var multiRun = (program: number[], phase:number[]) : number => {
    var output = 0;
    for (const p of phase) output = ic.run(program.copy(), [p, output])[0];
    return output;
}

type State = {
    program: number[],
    index: {i:number},
    input: number[],
    halt: {h:boolean},
    awaitingInput: boolean
}

var initStates = (program: number[], phases:number[]) : State[] => {
    return phases.map(p => ({
        program: program.copy(),
        index: {i:0},
        input: [p],
        halt: {h:false},
        awaitingInput: false
    }));
}
var runStateTillInputNeededOrHalt = (state: State) : number[] => {
    var output:number[] = [];
    while (!state.halt.h) {
        var needsInput = ic.needsInput(state.program, state.index.i);
        if (needsInput && state.input.length == 0) {
            state.awaitingInput = true;
            return output;
        }
        var nextInput: number =  needsInput ? (state.input.shift() ?? 0) : 0;
        var curOutput = ic.execute(state.program, state.index, state.halt, nextInput);
        if (curOutput != undefined) output.push(curOutput);
    }
    return output;
}
var nextAmpIndex = (ampIndex: number) : number => ampIndex == 4 ? 0 : ampIndex + 1;

var runFeedback = (states: State[]) : void => {
    var ampIndex = 0;
    while (states.some(s => !s.halt.h)) {
        if (states[ampIndex].awaitingInput || states[ampIndex].halt.h) {
            ampIndex = nextAmpIndex(ampIndex);
            continue;
        }
        var output = runStateTillInputNeededOrHalt(states[ampIndex]);
        var nextState = states[nextAmpIndex(ampIndex)];
        nextState.input.push(...output);
        if (nextState.awaitingInput || nextState.input.length > 0) nextState.awaitingInput = false;
        ampIndex = nextAmpIndex(ampIndex);
    }
}

var stringifyState = (state: State) : string => {
    return {program: JSON.stringify(state.program), index: state.index.i, input: JSON.stringify(state.input), halt: state.halt.h, awaitingInput: state.awaitingInput};
}
var stringifyStates = (states: State[]) : string => h.stringify(states.map(stringifyState));


var program = h.read(7, "program.txt", "ex")[0].split(',').tonum();
var phases: number[][] = [0,1,2,3,4].permutations();
// h.print("part 1:", phases.map(p => multiRun(program.copy(), p)).max());

// part 2
var phases2: number[][] = [5,6,7,8,9].permutations();
var states = initStates(program, phases2[0]);
// runFeedback(states);
h.print(stringifyStates(states));
// h.print("test: ", test);
// h.print("part 2:", allPhases.map(p => multiRun(program.copy(), p, 2, run1)).max());