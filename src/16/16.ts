import * as h from '../helpers';

var getPattern = (n: number, length: number) : number[] => {
    var basePattern = [0, 1, 0, -1];
    var nPattern = basePattern.flatMap(x => Array(n).fill(x));
    var times = Math.ceil(length / nPattern.length)+1;
    return Array(times).fill(nPattern).flat().slice(1, length+1);
}
var getAllPatterns = (length: number) : number[][] => Array(length).fill(0).map((_,i) => getPattern(i+1, length));
var applyPattern = (sequence: number[], pattern: number[]) : number => +sequence.timesEach(pattern).sum().toString().split('').last();
var applyPatterns = (sequence: number[], patterns: number[][]) : number[] => patterns.map(p => applyPattern(sequence, p));


var initSequence = h.read(16, "sequence.txt")[0].split('').tonum();
var allPatterns = getAllPatterns(initSequence.length);
h.print("sequence:", initSequence.join(''));

var phases = 100;
var sequence = initSequence.copy(); 
for (var i=0;i<phases;i++) sequence = applyPatterns(sequence, allPatterns);
h.print("part 1:", sequence.slice(0,8).join(''));