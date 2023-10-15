import * as h from '../helpers';

var calculateIndexRaw = (sequence:number[], index:number) : number => {
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
    return result;
}
var getSetSum = (sequence: number[], index: number, length: number) : number => {
	var result = 0;
	var max = index+length-1;
	while(index<=max && index<sequence.length) {
		result += sequence[index];
		index++;
	}
	return result;
}
var calculateIndexWithDiff = (sequence:number[], index:number, last: number) : number => {
	// only works if index >= sqrt(sequence.length)
    // note: given index is really k+1, with k being the last index
	// >> that makes index itself n (being the previous n)
    var k = index - 1;
    var n = index;

    // minus sign arrangement
    // pattern -n, +2n, +3n, -4n, -5n, +6n ...
    var currentSign = -1;
    var previousSign = -1;
    var setIndex = 0;

    // calculate
    var result = last;
    while (k + setIndex*n < sequence.length) {
        result += currentSign*getSetSum(sequence, k + setIndex*n, setIndex+1);
        
        // update minus signs
        if (previousSign == currentSign) currentSign = -currentSign;
        else previousSign = currentSign;

        // update set counter
        setIndex++;
    }

    return result;
}
var lastDigit = (xk:number) : number => Math.abs(xk)%10;
var nextPhase = (curPhase:number[], out:number[]) : void => {
    for (var i=0;i<curPhase.length; i++) out[i] = lastDigit(calculateIndexRaw(curPhase,i));
}

var nextPhase2 = (curPhase:number[], out:number[]) : void => {
    var sequenceLengthRoot = Math.sqrt(curPhase.length);
    var diffIndex = Math.ceil(sequenceLengthRoot);
    //h.print("sequence length ",curPhase.length, "square root:",sequenceLengthRoot, "=> first diff calculated index: ", diffIndex);

    var lastValue = 0;
    for (var i=0;i<curPhase.length; i++) {
        lastValue = i<diffIndex
            ? calculateIndexRaw(curPhase,i)
            : calculateIndexWithDiff(curPhase,i,lastValue);
        
        out[i] = lastDigit(lastValue);
    }

}

var sequence = h.read(16, "sequence.txt")[0].split('').tonum();
var phases = 100;

// part 1
var s1 = sequence.copy();
var s1a = sequence.copy();
console.time("part 1");
for (var j=0;j<phases;j++) {
    if (j%2===0) nextPhase2(s1, s1a);
    else nextPhase2(s1a, s1);
}
console.timeEnd("part 1");
h.print("piece-wise part 1:", (phases%2===0 ? s1 : s1a).slice(0,8).join(''));

// part 2
var s2Set = sequence.copy();
var times = 1E4;
var s2 : number[]= Array(s2Set.length * times).fill(0);
s2 = s2.map((_,i) => s2Set[i%s2Set.length]);


// h.print(`pt 2 first ${s2.length} indices`);
// var firstArray = Array(s2.length).fill(0);
// var pb = new h.ProgressBar(n, 1E2);
// for (var i=0;i<n;i++) {
//     pb.show(i);
//     firstArray[i] = lastDigit(calculateIndexRaw(s2, i));
// }
