import * as h from '../helpers';

var meets1 = (n: number) => {
    var s = n.toString();
    var containsDouble = false;
    for (const i of h.range(1, s.length)){
        if (s[i] < s[i-1]) return false;
        if (s[i] == s[i-1]) containsDouble = true;
    }
    return containsDouble;
}

var meets2 = (n: number) => {
    var s = n.toString();
    var containsDouble = false;
    var streak = 1;
    for (const i of h.range(1, s.length)){
        if (s[i] < s[i-1]) return false;
        if (s[i] == s[i-1]) streak++;
        else {
            if (streak == 2) containsDouble = true;
            streak = 1;
        }
    }
    return containsDouble || streak == 2;
}

// execute
var range = h.read(4, "range.txt")[0].split('-').tonum();

var count1 = 0;
for (const i of h.range(range[0], range[1]+1)) if (meets1(i)) count1++;
h.print("part 1:", count1);

var count2 = 0;
for (const i of h.range(range[0], range[1]+1)) if (meets2(i)) count2++;
h.print("part 2:", count2);