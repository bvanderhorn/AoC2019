import * as h from '../helpers';
import * as ic from '../intcode';

class RunState {
    public panels: Map<string, boolean> = new Map<string, boolean>();
    public curPanel: [number, number];
    public direction: string;
    public state: ic.State;
    private _dirs : string = "^>v<";

    constructor(program: number[], startPanel: [number, number], startDirection: string) {
        this.curPanel = startPanel;
        this.direction = startDirection;
        this.state = new ic.State(program.copy(), [])
    }

    public move = (verbose:boolean = false) : void => {
        this.state.input.push(this.panels.get(this.curPanel.toString()) ? 1 : 0);
        if (verbose) h.print("curPanel:", this.curPanel, "direction:", this.direction, "input:", this.state.input);
        var output = this.state.runTillInputNeededOrHalt(verbose);
        if (output.length > 0) this.panels.set(this.curPanel.toString(), output[0] == 1);
        var turn = output[1] == 0 ? -1 : 1;
        this.direction = this._dirs.get((this._dirs.indexOf(this.direction) + turn));
        this.curPanel = this.curPanel.plusEach(this._getMove(this.direction)) as [number, number];
        if (verbose) this.print();
    }

    public print = () : void => {
        var keys = Array.from(this.panels.keys()).map(x => x.split(',').map(y => +y));
        var minX = keys.map(x => x[0]).min() - 1;
        var maxX = keys.map(x => x[0]).max() + 1;
        var minY = keys.map(x => x[1]).min() - 1;
        var maxY = keys.map(x => x[1]).max() + 1;
        var str = "";
        for (var y = maxY; y >= minY; y--) {
            for (var x = minX; x <= maxX; x++) {
                h.equals2([x,y], this.curPanel) 
                    ? str += this.direction
                    : str += this.panels.get([x,y].toString()) ? "#" : ".";
            }
            str += "\n";
        }
        str.split('\n').split('').printc(x => this._dirs.includes(x), 'c');
    }

    public run = (verbose: boolean = false) : void => {
        while(!this.state.halt) {
            this.move(verbose);
        }
    }

    private _getMove = (direction:string) : [number, number] => {
        var directions = "^>v<";
        if (!directions.includes(direction)) throw new Error("invalid direction");
        return [[0,1], [1,0], [0,-1], [-1,0]][directions.indexOf(direction)] as [number, number];
    }
}

var program = h.read(11, "program.txt")[0].split(',').tonum();

// part 1
var rs = new RunState(program, [0,0], '^');
rs.run();
h.print("part 1:", rs.panels.size);

// part 2
var rs = new RunState(program, [0,0], '^');
rs.panels.set(rs.curPanel.toString(), true);
rs.run();
h.print("part 2:");
rs.print();