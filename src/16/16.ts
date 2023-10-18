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

var getLookup = (lookups:number[][], lookupIndex:number, index:number, c1i1c2i2:[number, number, number, number]) : number => {
    var nofLookups = lookups.length/2;
    var [curp0, ip0, curp1, ip1] = c1i1c2i2;
    // var [curp0, ip0, curp1, ip1] = getCurpIp2(index, nofLookups, lookupIndex);
    // var [curp0, ip0] = getCurpIp(index,lookupIndex*nofLookups);
    // var [curp1, ip1] = getCurpIp(index, (lookupIndex+1)*nofLookups-1);
    if (curp0 === 0) {
        if (curp1 === 0) return 0;
        return curp1*lookups[2*nofLookups -(ip1+1)][lookupIndex];
    }
    else if (curp1 == curp0) return curp1*lookups[nofLookups][lookupIndex];

    // else: curp0 != 0, curp1 == 0
    var i = index - ip0 + 1;
    return curp0*lookups[i][lookupIndex];
}

var moveCurpIp = (curp:number, ip:number, last:number, index:number, isStart:boolean, move:number) : [number, number,boolean, number] => {
    var n = index + 1;
    var limit = isStart ? index : n;
    var ipraw = ip+move;
    if (ipraw < limit) return [curp, ipraw, isStart, last];
    return [curp === 0 ? -last : 0, ipraw-limit, false, curp === 0 ? last: -last];
}

var calculateIndexWithLookups = (sequence:number[], index:number, lookups:number[][]) : number => {
    // only works if index >= lookups.length/2
    var nofLookups = lookups.length/2;
    var llength = sequence.length/nofLookups;
    var result = 0;
    var last = -1;
    var [c1,i1,c2,i2] = [0,0,0,0];
    var isStart = true;
    for (var l=0;l<llength;l++) {
        [c2,i2, isStart, last] = moveCurpIp(c1,i1, last, index,isStart, nofLookups-1);
        result += getLookup(lookups, l,index, [c1,i1,c2,i2]);
        [c1,i1, isStart, last] = moveCurpIp(c2,i2,last, index, isStart, 1);
    }
    return result;
}
var lastDigit = (xk:number) : number => Math.abs(xk)%10;
var nextPhase = (curPhase:number[], out:number[]) : void => {
    for (var i=0;i<curPhase.length; i++) out[i] = lastDigit(calculateIndexRaw(curPhase,i));
}

var nextPhase3 = (curPhase:number[], out:number[], lookupIterations:number[] = [25], diffIndex: number = Math.ceil(Math.sqrt(curPhase.length)), verbose:boolean = false, maxIndex:number = curPhase.length) : void => {
    var allLookups = getAllLookups(curPhase, lookupIterations);
    var pb = new h.ProgressBar(maxIndex, 1E2);
    // var lookups = getLookups(curPhase, nofLookups);
    // var sequenceLengthRoot = Math.sqrt(curPhase.length);
    // var diffIndex = 3*Math.ceil(sequenceLengthRoot);

    var lastValue = 0;
    for (var i=0;i<maxIndex; i++) {

        // 0 <= i < nofLookups: calculate raw
        // nofLookups <= i < 2*sqrt(sequence.length): use lookups
        // i >= 2*sqrt(sequence.length): calculate using diffs
        if (i<lookupIterations[0] && i<diffIndex) lastValue = calculateIndexRaw(curPhase,i);
        else if (i < diffIndex) {
            var iteration = lookupIterations.findIndex((x,j) => i>=x && ((j == lookupIterations.length-1) || i<lookupIterations[j+1]));
            lastValue = calculateIndexWithLookups(curPhase, i,allLookups[iteration]);
        } else {
            lastValue = calculateIndexWithDiff(curPhase,i,lastValue);
        }

        out[i] = lastDigit(lastValue);
        pb.show(i, verbose);
    }

}

var applyPhases3 = (sequence:number[], phases:number, lookupIterations:number[] = [25], diffIndex:number = Math.ceil(Math.sqrt(sequence.length)), verbose=false) : number[] => {
    var s1 = sequence.copy();
    var s2 = sequence.copy();

    var pb = new h.ProgressBar(phases, 1E2);
    for (var j=0;j<phases;j++) {
        if (j%2===0) nextPhase3(s1, s2,lookupIterations, diffIndex);
        else nextPhase3(s2, s1,lookupIterations, diffIndex);
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

var getCurpIp2 = (index:number, loopLength:number, loopIndex:number) : [number, number, number, number] => {
    var n = index + 1;
    var startIndex = loopIndex*loopLength;
    var delta = startIndex-index;
    // var delta2 = delta+loopLength-1;
    var [curp, ip, cur2, ip2] = [0,0,0,0];

    if (delta<0) {
        [curp, ip]  = [0, startIndex];
        var ip2raw = ip + loopLength -1;
        if (ip2raw>=index) [cur2, ip2] = [1,ip2raw-index];
        else [cur2, ip2] = [0, ip2raw];
    }
    else {
        var mod = Math.floor(delta/n) % 4;
        curp = basePattern[mod];
        ip = delta % n;
        var ip2raw = ip + loopLength-1;
        if (ip2raw>=n) [cur2, ip2] = [basePattern[(mod+1)%4], ip2raw-n];
        else [cur2, ip2] = [curp, ip2raw];
    }
    // var [curptest, iptest, curptest2, iptest2] = [getCurpIp(index, loopLength*loopIndex), getCurpIp(index, (loopIndex+1)*loopLength-1)].flat();
    // if (curp != curptest || ip != iptest || cur2 != curptest2 || ip2 != iptest2) {
    //     throw new Error("wrong!");
    // }
    return [curp, ip, cur2, ip2];
}

var getAllLookups = (sequence:number[], lookupIterations:number[]) : number[][][] => lookupIterations.map(i => getLookups(sequence,i));
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
    nextPhase3(sequence, Array(sequence.length).fill(0), [100,200,500,1000,2000,5000], 3*Math.ceil(Math.sqrt(sequence.length)), true,maxIndex);
}

var s2FinalSequence = applyPhases3(s2, phases, [100,200,500,1000,2000,5000], 3*Math.ceil(Math.sqrt(s2.length)),true);
// h.write(16, "final_sequence.txt", s2FinalSequence.join(''));
var messageOffset = +sequence.slice(0,7).join('');
h.print("message offset:",messageOffset);
var message = s2FinalSequence.slice(messageOffset, messageOffset+8);
h.print("part 2:", +message.join(''));
