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

var getLookup = (lookups:number[][], lookupIndex:number, index:number) : number => {
    var nofLookups = lookups.length/2;
    var [curp0, ip0] = getCurpIp(index,lookupIndex*nofLookups);
    var [curp1, ip1] = getCurpIp(index, (lookupIndex+1)*nofLookups-1);
    if (curp0 === 0) {
        if (curp1 === 0) return 0;
        return curp1*lookups[2*nofLookups -(ip1+1)][lookupIndex];
    }
    else if (curp1 == curp0) return curp1*lookups[nofLookups][lookupIndex];

    // else: curp0 != 0, curp1 == 0
    var i = index - ip0 + 1;
    return curp0*lookups[i][lookupIndex];
}

var calculateIndexWithLookups = (sequence:number[], index:number, lookups:number[][]) : number => {
    // only works if index >= lookups.length/2
    var nofLookups = lookups.length/2;
    var llength = sequence.length/nofLookups;
    var result = 0;
    for (var l=0;l<llength;l++) result += getLookup(lookups, l,index);
    return result;
}
var lastDigit = (xk:number) : number => Math.abs(xk)%10;
var nextPhase = (curPhase:number[], out:number[]) : void => {
    for (var i=0;i<curPhase.length; i++) out[i] = lastDigit(calculateIndexRaw(curPhase,i));
}

var nextPhase3 = (curPhase:number[], out:number[], nofLookups:number = 25, verbose:boolean = false, maxIndex:number = curPhase.length) : void => {

    var pb = new h.ProgressBar(maxIndex, 1E2);
    var lookups = getLookups(curPhase, nofLookups);
    var sequenceLengthRoot = Math.sqrt(curPhase.length);
    var diffIndex = 2*Math.ceil(sequenceLengthRoot);

    var lastValue = 0;
    for (var i=0;i<maxIndex; i++) {

        // 0 <= i < nofLookups: calculate raw
        // nofLookups <= i < 2*sqrt(sequence.length): use lookups
        // i >= 2*sqrt(sequence.length): calculate using diffs
        lastValue = i<nofLookups && i<diffIndex
            ? calculateIndexRaw(curPhase,i)
            : i < diffIndex
                ? calculateIndexWithLookups(curPhase, i,lookups)
                : calculateIndexWithDiff(curPhase,i,lastValue);
        
        out[i] = lastDigit(lastValue);
        pb.show(i, verbose);
    }

}

var applyPhases3 = (sequence:number[], phases:number, nofLookups:number = 25, verbose=false) : number[] => {
    var s1 = sequence.copy();
    var s2 = sequence.copy();

    var pb = new h.ProgressBar(phases, 1E2);
    for (var j=0;j<phases;j++) {
        if (j%2===0) nextPhase3(s1, s2,nofLookups);
        else nextPhase3(s2, s1,nofLookups);
        pb.show(j, verbose);
    }

    return phases%2===0 ? s1 : s2;
}

var getCurpIp = (index:number, startIndex: number) : [number, number] => {
    var delta = startIndex-index;
    var n = index + 1;

    if (delta<0) return [0, startIndex];

    var mod = Math.floor(delta/n) % 4;
    var curp = basePattern[mod];

    var ip = delta % n;
    return [curp, ip];
}

var getLookups = (sequence:number[], nofLookups:number) : number[][] => {
    var llength = sequence.length/nofLookups;
    var arr = Array(llength).fill(0);
    var lookups: number[][] = Array(nofLookups*2).fill([]);
    lookups[0] = arr.slice(0);

    // left upbuild
    for (var l = 1; l <= nofLookups; l++) { // each lookup
        lookups[l] = arr.slice(0);
        for (var j = 0; j < llength; j++) { // each index in the lookup
            lookups[l][j] = lookups[l - 1][j] + sequence[j * nofLookups + l - 1];
        }
    }

    // right downbuild
    for (var l = 1; l < nofLookups; l++) { // each lookup
        lookups[l + nofLookups] = arr.slice(0);
        for (var j = 0; j < llength; j++) { // each index in the lookup
            lookups[l + nofLookups][j] = lookups[l + nofLookups - 1][j] - sequence[j * nofLookups + l-1];
        }
    }

    return lookups;
}

var sequence = h.read(16, "sequence.txt")[0].split('').tonum();
var phases = 100;
const basePattern = [1,0,-1,0];

// part 1
console.time("part 1");
var finalSequence = applyPhases3(sequence, phases);
console.timeEnd("part 1");
h.print("piece-wise part 1:", finalSequence.slice(0,8).join(''));


// part 2
var s2Set = sequence.copy();
var times = 1E4;
var s2 : number[]= Array(s2Set.length * times).fill(0);
s2 = s2.map((_,i) => s2Set[i%s2Set.length]);

// // testing
var testTime = (sequence:number[],maxIndex:number = sequence.length) : void => {
    nextPhase3(sequence, Array(sequence.length).fill(0), 400, true,maxIndex);
}
// testTime(s2);

var s2FinalSequence = applyPhases3(s2, phases, 400, true);
h.write(16, "final_sequence.txt", s2FinalSequence.join(''));
var messageOffset = +sequence.slice(0,7).join('');
h.print("message offset:",messageOffset);
var message = s2FinalSequence.slice(messageOffset, messageOffset+8);
h.print("part 2:", +message.join(''));
