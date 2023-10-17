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

var nextPhase2 = (curPhase:number[], out:number[], verbose:boolean = false, maxIndex:number = curPhase.length) : void => {
    var sequenceLengthRoot = Math.sqrt(curPhase.length);
    var diffIndex = Math.ceil(sequenceLengthRoot);

    h.printVerbose(verbose, "sequence length ",curPhase.length, "square root:",sequenceLengthRoot, "=> first diff calculated index: ", diffIndex);

    var lastValue = 0;
    var pb = new h.ProgressBar(maxIndex, 1E2);
    for (var i=0;i<maxIndex; i++) {
        pb.show(i, verbose);
        lastValue = i<diffIndex
            ? calculateIndexRaw(curPhase,i)
            : calculateIndexWithDiff(curPhase,i,lastValue);
        
        out[i] = lastDigit(lastValue);
    }
}

var applyPhases = (sequence:number[], phases:number, verbose=false) : number[] => {
    var s1 = sequence.copy();
    var s2 = sequence.copy();

    var pb = new h.ProgressBar(phases, 1E2);
    for (var j=0;j<phases;j++) {
        pb.show(j, verbose);
        if (j%2===0) nextPhase2(s1, s2);
        else nextPhase2(s2, s1);
    }

    return phases%2===0 ? s1 : s2;
}

var sequence = h.read(16, "sequence.txt")[0].split('').tonum();
var phases = 100;

// part 1
console.time("part 1");
var finalSequence = applyPhases(sequence, phases);
console.timeEnd("part 1");
h.print("piece-wise part 1:", finalSequence.slice(0,8).join(''));


// part 2
var s2Set = sequence.copy();
var times = 1E4;
var s2 : number[]= Array(s2Set.length * times).fill(0);
s2 = s2.map((_,i) => s2Set[i%s2Set.length]);

// testing
var testTime = (sequence:number[],maxIndex:number) : void => {
    nextPhase2(sequence, Array(sequence.length).fill(0), true,maxIndex);
}

testTime(s2,32);

var s2FinalSequence = applyPhases(s2, phases, true);
h.write(16, "final_sequence.txt", s2FinalSequence.join(''));
var messageOffset = +sequence.slice(0,7).join('');
h.print("message offset:",messageOffset);
var message = s2FinalSequence.slice(messageOffset, messageOffset+8);
h.print("part 2:", +message.join(''));
