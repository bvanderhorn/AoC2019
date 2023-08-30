import * as h from '../helpers';
var meets = (n: number) => {
    var s = n.toString();
    var containsDouble = false;
    for (const i of h.range(1, s.length)){
        if (s[i] < s[i-1]) return false;
        if (s[i] == s[i-1]) containsDouble = true;
    }
    return containsDouble;
}

// execute
var range = h.read(4, "range.txt")[0].split('-').tonum();

// day 1: brute force
var count = 0;
for (const i of h.range(range[0], range[1]+1)) if (meets(i)) count++;
h.print("part 1:", count);