import * as h from '../helpers';
import * as ic from '../intcode';

class TileState {

   public tiles: number[][] = [];
   public state: ic.State;
   public input: number[] = [];
   private _score: number = 0;
   
   constructor(program: number[]) {
	   this.state = new ic.State(program.copy(), []);
	   this.runOnce();
   }
   public nextMove = () : number => {
	   var xball = this.getx(4);
	   var xpad = this.getx(3);
	   return  h.sign(xball - xpad);
   }
   
   public getx = (tiletype:number) : number => {
	   var bindex = this.tiles.findIndex(x => x[2] == tiletype);
	   return this.tiles[bindex][0];
   }
   
   public run = async (draw: boolean= true): Promise<void> => {
	   if (draw) h.print(this.draw());
	   while (!this.state.halt) {
		this.runOnce(this.nextMove());
		if (draw) {
			h.printu(this.draw() + "\n");
			await h.sleep(10);
		}
	   }
   }
   
   public runOnce = (input:number=-2) : void => {
	   if (input>-2) this.state.input.push(input);
	   var newTiles = this.state.runTillInputNeededOrHalt().chunks(3);
	   this.update(newTiles);
	   //this.draw();
   }

   public get score() : number {
	   return this._score;
   }

   private  setScore = () : void => {
       var scoreIndex = this.tiles.findIndex(x => x[0] == -1 && x[1] == 0);
       if (scoreIndex > -1) {
           this._score = this.tiles[scoreIndex][2];
           this.tiles.splice(scoreIndex, 1);
       }
   }

   private getTile = (type:number) : string => {
       var tiles = " #X-o";
       if (type<0 || type >= tiles.length) throw new Error("invalid tile type");
       return tiles[type];
   }

   public draw = () : string => {
       var xRange = this.tiles.map(x => x[0]).minmax();
       var yRange = this.tiles.map(x => x[1]).minmax();
       var str: string[][] = [];
       for (var y = yRange[0]; y <= yRange[1]; y++) {
           var curStr : string[] = [];
           for (var x = xRange[0]; x <= xRange[1]; x++) {
               var mIndex = this.tiles.findIndex(m => h.equals2(m.slice(0,2), [x,y]));
               curStr.push(mIndex>-1 ? this.getTile(this.tiles[mIndex][2]) : ".");
           }
           str.push(curStr);
       }
       var scoreLine = "score: " + h.colorStr(this.score, 'y') + "\n";
       return scoreLine + str.stringc(x => "o-".includes(x), 'c');
   }

   public update = (newTiles: number[][] ) : void => {
       for (const t of newTiles) {
	   var tindex = this.tiles.findIndex(x => h.equals2(x.slice(0,2), t.slice(0,2)));
	   if (tindex>-1) this.tiles.splice(tindex, 1,t);
	   else this.tiles.push(t);
       }
	this.setScore();
   }
}

var program = h.read(13, "program.txt")[0].split(',').tonum();
var state1 = new TileState(program);
h.print("part 1:",state1.tiles.map(x => x.last()).count(2));

// part 2
var program2 = program.copy();
program2[0] = 2;
var state2 = new TileState(program2);
// state2.state.print(false);
state2.run(true);
