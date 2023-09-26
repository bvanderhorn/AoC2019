import * as h from '../helpers';
import * as ic from '../intcode';

var multiRun = (program: number[], phase:number[]) : number => {
    var output = 0;
    for (const p of phase) output = (new ic.State(program.copy(), [p, output])).run()[0];
    return output;
}

var initStates = (program: number[], phases:number[]) : ic.State[] => {
    var states = phases.map(p => new ic.State(program.copy(), [p]));
    states[0].input.push(0);
    return states;
}
var runStateTillInputNeededOrHalt = (state: ic.State) : number[] => {
    var output:number[] = [];
    while (!state.halt) {
        if (state.awaitingInput) {
            return output;
        }
        var curOutput = state.execute();
        if (curOutput != undefined) output.push(curOutput);
    }
    return output;
}
var nextAmpIndex = (ampIndex: number) : number => ampIndex == 4 ? 0 : ampIndex + 1;

var runFeedback = (states: ic.State[]) : number => {
    var ampIndex = 0;
    while (states.some(s => !s.halt)) {
        if (states[ampIndex].awaitingInput || states[ampIndex].halt) {
            ampIndex = nextAmpIndex(ampIndex);
            continue;
        }
        var output = runStateTillInputNeededOrHalt(states[ampIndex]);
        var nextState = states[nextAmpIndex(ampIndex)];
        nextState.input.push(...output);
        // h.print(stringifyStates(states));
        ampIndex = nextAmpIndex(ampIndex);
    }
    return states.map(s => s.input).flat()[0];
}

var stringifyStates = (states: ic.State[]) : string => h.stringify(states.map(s => s.simplify()));

var program = h.read(7, "program.txt")[0].split(',').tonum();
var phases: number[][] = [0,1,2,3,4].permutations();
h.print("part 1:", phases.map(p => multiRun(program.copy(), p)).max());

var phases2: number[][] = [5,6,7,8,9].permutations();
h.print("part 2:", phases2.map(x => runFeedback(initStates(program, x))).max());