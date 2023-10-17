import * as h from '../helpers';
var getCurpIp = (index:number, startIndex: number) : [number, number] => {
    var start = index;
    var n = index + 1;
    if (startIndex < start) return [0, startIndex];

    var mod = Math.floor((startIndex - start)/n) % 4;
    var curp = [1,0,-1,0][mod];

    var ip = (startIndex - start) % n;
    return [curp, ip];
}
var calculateIndexHybrid = (sequence:number[], index:number, startIndex:number = index, startResult:number = 0, maxIndex:number = sequence.length) : number => {
    var result = startResult;
    var [curP, iP] = getCurpIp(index, startIndex);
    var i = startIndex;

    if (curP === 0) {
        var di = index - iP;
        i += di;
        iP = 0;
        curP = getCurpIp(index, i)[0];
    }

    while(i<maxIndex) {
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
var getSetSum = (sequence: number[], index: number, length: number, maxIndex:number = sequence.length) : number => {
	var result = 0;
	var max = index+length-1;
	while(index<=max && index < maxIndex) {
		result += sequence[index];
		index++;
	}
	return result;
}

var getFirstPart = (sequence:number[], index:number, last:number, skipIndex: number): number => {
    var k = index -1;
    var n = index;

    if (index === 0) return sequence[0];

    // minus sign arrangement
    // pattern -n, +2n, +3n, -4n, -5n, +6n ...
    var currentSign = -1;
    var previousSign = -1;
    var setIndex = 0;

    // calculate
    var result = last;
    while (setIndex <=skipIndex) {
        result += currentSign*getSetSum(sequence, k + setIndex*n, setIndex+1);
        
        // update minus signs
        if (previousSign == currentSign) currentSign = -currentSign;
        else previousSign = currentSign;

        // update set counter
        setIndex++;
    }

    return result;
}

var calculateIndexWithDiff = (sequence:number[], index:number, last: number, maxIndex:number = sequence.length) : number => {
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
    while (k + setIndex*n < maxIndex) {
        result += currentSign*getSetSum(sequence, k + setIndex*n, setIndex+1, maxIndex);
        
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
    for (var i=0;i<curPhase.length; i++) out[i] = lastDigit(calculateIndexHybrid(curPhase,i));
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
            ? calculateIndexHybrid(curPhase,i)
            : calculateIndexWithDiff(curPhase,i,lastValue);
        
        out[i] = lastDigit(lastValue);
    }
}

var nextPhase3 = (curPhase:number[], out:number[], verbose:boolean = false, maxIndex:number = curPhase.length) : void => {

    var sequenceLengthRoot = Math.sqrt(curPhase.length);
    var diffIndex = Math.ceil(sequenceLengthRoot);

    var skipIndex = 1;
    var startResult : number = 0;
    var sign = 1;
    var pb = new h.ProgressBar(maxIndex, 1E2);
    var lastValue = 0;

    for (var i=0;i<Math.min(curPhase.length,maxIndex); i++) {
        pb.show(i, verbose);
        var n = i+1;
        
        if (i<diffIndex){
            // update startResult
            startResult = getFirstPart(curPhase, i, startResult,skipIndex);

            // update skipIndex
            if ((i+2)%4===0 && i > 2) {
                skipIndex += 2;
                sign = -sign;
                startResult += sign*getSetSum(curPhase, skipIndex*n-1, n);
            }

            lastValue = calculateIndexHybrid(curPhase, i, (skipIndex+2)*n-1, startResult);
        }
        else {
            lastValue = calculateIndexWithDiff(curPhase,i,lastValue);
        }
            
        out[i] = lastDigit(lastValue);
    }
}

var applyPhases = (sequence:number[], phases:number, verbose=false, type:number = 2) : number[] => {
    var s1 = sequence.copy();
    var s2 = sequence.copy();
    var np = type == 2 ? nextPhase2 : nextPhase3;

    var pb = new h.ProgressBar(phases, 1E2);
    for (var j=0;j<phases;j++) {
        pb.show(j, verbose);
        if (j%2===0) np(s1, s2);
        else np(s2, s1);
    }

    return phases%2===0 ? s1 : s2;
}

var testTime = (sequence:number[],) : void => {
    nextPhase3(sequence, Array(sequence.length).fill(0), true);
}

var sequence = h.read(16, "sequence.txt")[0].split('').tonum();
var phases = 100;
// h.print("test:", calculateIndexWithDiff([1,2,3,4,5], 1,0,2));
h.print("getFirstPart:", getFirstPart([1,2,3,4,5],1,1,1))
h.print("test2:", calculateIndexHybrid([1,2,3,4,5,6], 0, 2, 1));

// part 1
console.time("part 1");
var finalSequence = applyPhases(sequence, phases, false, 3);
console.timeEnd("part 1");
h.print("piece-wise part 1:", finalSequence.slice(0,8).join(''));

// testing
// var s = [1,2,3,4,5,6];
// var fs2 = applyPhases(s,1,false,2);
// h.print("type 2:",fs2);
// var fs3 = applyPhases(s,1,false,3);
// h.print("type 3:", fs3);

// part 2
var s2Set = sequence.copy();
var times = 1E4;
var s2 : number[]= Array(s2Set.length * times).fill(0);
s2 = s2.map((_,i) => s2Set[i%s2Set.length]);

// // time testing
testTime(s2);

// var s2FinalSequence = applyPhases(s2, phases, true,3);
// // h.write(16, "final_sequence.txt", s2FinalSequence.join(''));
// var messageOffset = +sequence.slice(0,7).join('');
// h.print("message offset:",messageOffset);
// var message = s2FinalSequence.slice(messageOffset, messageOffset+8);
// h.print("part 2:", +message.join(''));
