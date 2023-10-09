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
var mod = (n:number) : void => {
    var l = sequence.length
    var patternLength = n*4;
    var modd = l % patternLength;
    h.print("pattern ",n,":", l, "%", patternLength, "=>", modd,";", )
}

var sequence = h.read(16, "sequence.txt")[0].split('').tonum();

// var allPatterns = getAllPatterns(sequence.length);
// h.print("sequence:", initSequence.join(''));
var phases = 100;

// part 1
// var s1 = sequence.copy(); 
// for (var i=0;i<phases;i++) s1 = applyPatterns(s1, allPatterns);
// h.print("part 1:", s1.slice(0,8).join(''));

// part 2
h.print("sequence length:", sequence.length, "factors:", h.factorize(sequence.length));
h.range(1,101).map(x => mod(x));

h.print(1E4%6);
