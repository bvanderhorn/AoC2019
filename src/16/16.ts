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

var allPatterns = getAllPatterns(sequence.length);
// h.print("sequence:", sequence.join(''));
var phases = 100;

// part 1
var s1 = sequence.copy(); 
console.time("part 1");
for (var i=0;i<phases;i++) {
    s1 = applyPatterns(s1, allPatterns);
    // h.print("after", i+1, ":", s1.join(''));
}
console.timeEnd("part 1");
h.print("part 1:", s1.slice(0,8).join(''));

// part 2: piece-wise
const bp = [1,0,-1,0];
var getFromPattern = (n:number, index:number) : number => {
    var ims = index-n+1;
    return ims<0 ? 0 : bp[Math.floor(ims/n) % 4];
}
var calculateIndex = (sequence:number[], index:number) : number => {
    var n = index + 1;
    var result = 0;
    for (var i=0;i<sequence.length; i++) result += getFromPattern(n,i)*sequence[i]; 
    return Math.abs(result)%10;
}
var nextPhase = (curPhase:number[]) : number[] => {
    var out: number[] = Array(curPhase.length).fill(0);
    for (var i=0;i<curPhase.length; i++) {
        h.progress(i,curPhase.length,1E3);
        out[i] = calculateIndex(curPhase,i);
    }
    return out;
}

// piece-wise part 1
var s2Set = sequence.copy();
var times = 1E4;
var s2 = Array(s2Set.length * times).fill("");
s2 = s2.map((_,i) => s2Set[i%s2Set.length]);
h.print("s2 size:", s2.length);

console.time("piece-wise single phase");
var first = calculateIndex(s2, 0);
console.timeEnd("piece-wise single phase");
// h.print("piece-wise part 1:", s2.slice(0,8).join(''));