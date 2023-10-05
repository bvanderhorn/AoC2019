import * as h from '../helpers';
type Vector = [number, number, number];
class Moon {
    public position: Vector;
    public velocity: Vector;

    constructor(position: Vector, velocity: Vector) {
        [this.position, this.velocity] = [position, velocity];
    }

    public getGravity = (others: Moon[]) : Vector => 
        this.position.map( (x,i) => others.map(y => y.position[i] -x).sign().sum()) as Vector;

    public applyGravity = (others: Moon[]) : void => {
        this.velocity = this.velocity.plusEach(this.getGravity(others)) as Vector;
    }
    public applyVelocity = () : void => {
        this.position = this.position.plusEach(this.velocity) as Vector;
    }

    public getEnergy = () : number => this.position.abs().sum() * this.velocity.abs().sum();

    public summary = () : {position: Vector, velocity: Vector} => ({position: this.position, velocity: this.velocity});
}
var plotXY = (moons: Moon[]) : string => {
    var range = [-10, 10];
    var str: string[][] = [];
    for (var y = range[1]; y >= range[0]; y--) {
        var curStr : string[] = [];
        for (var x = range[0]; x <= range[1]; x++) {
            curStr.push(moons.some(m => h.equals2(m.position.slice(0,2), [x,y])) ? "o" : ".");
        }
        str.push(curStr);
    }
    return str.stringc(x => x == "o", 'c');
}
var getState = (moons: Moon[]) : number[] => moons.map(m => [m.position, m.velocity]).flat(2);
var move = (moons: Moon[], steps: number = 1, verbose:boolean = false) : void => {
    console.clear();
    // var states = new Set<string>();
    // states.add(getState(moons));
    var state0 = getState(moons);
    var stepsize = 1E6;
    for (var i = 1; i <= steps; i++) {
        if (i%stepsize == 0) h.print("step", i/stepsize, "*1E6"); 
        moons.forEach(m => m.applyGravity(moons));
        moons.forEach(m => m.applyVelocity());
        if (verbose) h.print("step",i, ":\n",moons.map(m => m.summary()))
        h.printu(plotXY(moons));
        // var state = getState(moons);
        if (h.equals2(getState(moons), state0)) {
            h.print("found a state that has already been seen after", i, "steps");
            return;
        }
        //states.add(state);
    }
    h.print("\n");
    
}
var moons = h.read(12, "moons.txt", "ex").match("<x=(.*), y=(.*), z=(.*)>").tonum().map(x => new Moon(x, [0,0,0]));
// h.print(plotXY(moons));
// var moons1 = moons.slice(0);
// move(moons1, 100);
// h.print("part 1:", moons1.map(m => m.getEnergy()).sum());

// h.print("factors of ", 4686774924, ":", h.factorize(4686774924));

// part 2
var moons2 = moons.slice(0);
// console.time("move");
move(moons2, 10000);
// console.timeEnd("move");

