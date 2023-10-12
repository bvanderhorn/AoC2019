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

// console.time("maxPattern");
// var maxPattern = pn(65E5);
// console.timeEnd("maxPattern");
// console.time("minPattern");
// var minPattern = pn(0);
// console.timeEnd("minPattern");
// part 2
var s2Set = sequence.copy();
var times = 1E5;
var s2 : number[]= Array(s2Set.length * times).fill(0);
s2 = s2.map((_,i) => s2Set[i%s2Set.length]);

var n = 1E5;
var pb = new h.ProgressBar(n, 1E2);
console.time(`pt 2 first ${n} indices`);
for (var i=0;i<n;i++) {
    pb.show(i);
    calculateToIndex(s2, i);
} 
console.timeEnd(`pt 2 first ${n} indices`);