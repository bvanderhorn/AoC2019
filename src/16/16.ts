import * as h from '../helpers';

var calculateToIndex = (sequence:number[], index:number) : number => {
    var result = 0;
    var curP = 1;
    var iP = 0;
    var i = index;
    while(i<sequence.length) {
	    result += curP*sequence[i];
	    if(iP<index) {
		    i++;
		    iP++;
	    } else {
		    i+=index+2;
		    iP=0;
		    curP = -curP;
	    }
    }
    return Math.abs(result)%10;
}
var nextPhase = (curPhase:number[], out:number[]) : void => {
    for (var i=0;i<curPhase.length; i++) out[i] = calculateToIndex(curPhase,i);
}

var pn = (i:number): number[] => Array(i+1).fill(0).map((_:number,n:number) => getFromPattern(n+1,i));
var calculateFromIndex = (sequenceOnIndex: number, index: number, out:number[]) : void => {
    for (var j=0; j<=index;j++) out[j] += getFromPattern(j+1,index)*sequenceOnIndex;
}
const basePattern = [1,0,-1,0];
var getFromPattern = (n:number, index:number) : number => {
    var ims = index-n+1;
    return ims<0 ? 0 : basePattern[Math.floor(ims/n) % 4];
}

var sequence = h.read(16, "sequence.txt", "ex")[0].split('').tonum();
var phases = 100;

// part 1
var s1 = sequence.copy();
var s1a = sequence.copy();
console.time("part 1");
for (var j=0;j<phases;j++) {
    if (j%2===0) nextPhase(s1, s1a);
    else nextPhase(s1a, s1);
}
console.timeEnd("part 1");
h.print("piece-wise part 1:", (phases%2===0 ? s1 : s1a).slice(0,8).join(''));

// for (const i of h.range(0,50)) h.print("pattern", i, ":", JSON.stringify(pn(i)));

// console.time("maxPattern");
// var maxPattern = pn(65E5);
// console.timeEnd("maxPattern");
// console.time("minPattern");
// var minPattern = pn(0);
// console.timeEnd("minPattern");
// part 2
var s2Set = sequence.copy();
var times = 1E4;
var s2 : number[]= Array(s2Set.length * times).fill(0);
s2 = s2.map((_,i) => s2Set[i%s2Set.length]);

// var n = 100;
// console.time(`pt 2 first ${n} indices`);
// for (var i=0;i<n;i++) calculateToIndex(s2, i); 
// console.timeEnd(`pt 2 first ${n} indices`);

// test calculateFromIndex
var s2a = Array(s2Set.length * times).fill(0);
var imax = 1E4;
console.time("fromIndex");
for (var i=0;i<imax;i++) calculateFromIndex(s2[i],i,s2a);
console.timeEnd("fromIndex");