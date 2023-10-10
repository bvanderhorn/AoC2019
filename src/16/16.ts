import * as h from '../helpers';

// const basePattern = [1,0,-1,0];
// var getFromPattern = (n:number, index:number) : number => {
//     var ims = index-n+1;
//     return ims<0 ? 0 : basePattern[Math.floor(ims/n) % 4];
// }
var calculateIndex = (sequence:number[], index:number) : number => {
    var n = index + 1;
    var result = 0;
    var curP = true;
    var iP = 0;
    var i = n-1;
    while(i<sequence.length) {
	    if (sequence[i] !=0) result += curP ? sequence[i] : -sequence[i];
	    if(iP<n-1) {
		    i++;
		    iP++;
	    } else {
		    i+=n+1;
		    iP=0;
		    curP = !curP;
	    }
    }
    return Math.abs(result)%10;
}
var nextPhase = (curPhase:number[]) : number[] => {
    var out: number[] = Array(curPhase.length).fill(0);
    for (var i=0;i<curPhase.length; i++) {
        // h.progress(i,curPhase.length,1E3);
        out[i] = calculateIndex(curPhase,i);
    }
    return out;
}

var sequence = h.read(16, "sequence.txt")[0].split('').tonum();
var phases = 100;

// part 1
var s1 = sequence.copy(); 
console.time("part 1");
for (var j=0;j<100;j++) s2 = nextPhase(s1);
console.timeEnd("part 1");
h.print("piece-wise part 1:", s1.slice(0,8).join(''));

// part 2
var s2Set = sequence.copy();
var times = 1E4;
var s2 = Array(s2Set.length * times).fill(0);
s2 = s2.map((_,i) => s2Set[i%s2Set.length]);

var n = 1E4;
console.time(`pt 2 first ${n} indices`);
for (var i=0;i<n;i++) calculateIndex(s2, i);
console.timeEnd(`pt 2 first ${n} indices`);
