import * as h from '../helpers';

var calculateIndex = (sequence:number[], index:number) : number => {
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
    for (var i=0;i<curPhase.length; i++) out[i] = calculateIndex(curPhase,i);
}

var sequence = h.read(16, "sequence.txt")[0].split('').tonum();
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

// part 2
var s2Set = sequence.copy();
var times = 1E4;
var s2 = Array(s2Set.length * times).fill(0);
s2 = s2.map((_,i) => s2Set[i%s2Set.length]);

var n = 100;
console.time(`pt 2 first ${n} indices`);
for (var i=0;i<n;i++) calculateIndex(s2, i);
console.timeEnd(`pt 2 first ${n} indices`);
