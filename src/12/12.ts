import * as h from '../helpers';
type Vector = number[];
class Moon {
    public position: Vector;
    public velocity: Vector;

    constructor(position: Vector, velocity: Vector = [0,0]) {
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
    public stringify = () : string => JSON.stringify(this.summary());
}
var plotXY = (moons: Moon[], fit:boolean = false) : string => {
    var range = [-10, 10];
    if (fit) {
        var xRange = moons.map(m => m.position[0]).minmax();
        var yRange = moons.map(m => m.position[1]).minmax();
        range = [Math.min(xRange[0], yRange[0]), Math.max(xRange[1], yRange[1])];
    }
    var str: string[][] = [];
    for (var y = range[1]; y >= range[0]; y--) {
        var curStr : string[] = [];
        for (var x = range[0]; x <= range[1]; x++) {
            var mIndex = moons.findIndex(m => h.equals2(m.position.slice(0,2), [x,y]));
            curStr.push(mIndex>-1 ? mIndex.toString() : ".");
        }
        str.push(curStr);
    }
    return str.stringc(x => x != ".", 'c');
}

var copyMoons = (moons: Moon[]) : Moon[] => moons.map(m => new Moon(m.position, m.velocity));

var areEquivalent = (moons1: Moon[], moons2: Moon[]) : boolean =>
    moons1.map(x => x.stringify()).includesAll(moons2.map(x => x.stringify()));
var move = (moons: Moon[]) : void => {
    moons.forEach(m => m.applyGravity(moons));
    moons.forEach(m => m.applyVelocity());
}
var keepDim = (vector:Vector, dim:number) : Vector => vector.map((x,i) => i==dim? x: 0);
var keepDimension = (moons: Moon[], dimension: number) : Moon[] => 
    moons.map(m => new Moon(keepDim(m.position,dimension), keepDim(m.velocity,dimension)));

var getState = (moons: Moon[]) : number[] => moons.map(m => [m.position, m.velocity]).flat(2);
// var run = async (moons: Moon[], steps: number = 1, verbose:boolean = false) : Promise<number> => {
var run = (moons: Moon[], steps: number = 1E6, verbose:boolean = false) : number => {
    // console.clear();
    var state0 = getState(moons);
    for (var i = 1; i <= steps; i++) {
        move(moons);
        if (verbose) h.print("step",i, ":\n",moons.map(m => m.summary()))
        // await h.sleep(300);
        // h.printu("step ", i, '\n',plotXY(moons));
        // if (areEquivalent(moons0, moons)) h.print("=> equivalent state after", i, "steps");
        // var state = getState(moons);
        if (h.equals2(getState(moons), state0)) {
            h.print("found a state that has already been seen after", i, "steps");
            return i;
        }
        //states.add(state);
    }
    // h.print("\n");
    return -1;
}
var moons = h.read(12, "moons.txt", "ex").match("<x=(.*), y=(.*), z=(.*)>").tonum().map(x => new Moon(x, [0,0,0]));
h.print(plotXY(moons, true));
var moons1 = copyMoons(moons);
run(moons1, 100);
h.print("part 1:", moons1.map(m => m.getEnergy()).sum());

h.factorize(4686774924, true);
h.factorize(7030162386, true);

// part 2
var moonDims = [0,1,2].map(d => keepDimension(moons, d));
// console.time("run");
var testMoons = [new Moon([0, 0]), new Moon([0,0]), new Moon([-5,0])];
// h.factorize(18,true);
// h.factorize(8,true);
// h.getCommonFactors(8,18,true);
var repeatances = moonDims.map(m => run(m));
h.print(repeatances);
var cf = h.getCommonFactors2(repeatances, true);
h.print("part 2:", repeatances.times(1/cf.prod()).prod());

// console.timeEnd("run");

