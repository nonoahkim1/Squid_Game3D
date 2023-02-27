// variable to hold a reference to our A-Frame world
let world;

// speed variable for moving our point light around
let lightSpeed = 0.05;
let skylight;

//Array to hold our robots
let robots = [];
let playerRobots = [];

let squidBox1;
let squidBox2;
let o, P;

let robot;


function preload() {
	win = loadSound('win.mp3');
}

function setup() {
	//Grabbing reference to canvas
	let myCanvas = createCanvas(512,512).id();

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	// set a background color for the world using RGB values
	world.setBackground(0, 0, 0);

	let sky = new Sky({
		asset: 'sky1'
	});
	world.add(sky);

	var text = new Text({
		text: 'Click me to Teleport!',
		red: 255, green: 200, blue: 200,
		side: 'double',
		x: 0, y: 2, z: 0,
		scaleX: 15, scaleY: 15, scaleZ: 15
	});
	world.add(text);

	var text2 = new Text({
		text: 'Click me to get Bigger!',
		red: 100, green: 200, blue: 245,
		side: 'double',
		x: 0, y: 10, z: 0,
		scaleX: 10, scaleY: 10, scaleZ: 10
	});
	world.add(text2);

	//World boundaries - used for robots and player
	let wall1 = new Box({
		x:-89.5,
		y:2,
		z:0,
		width: 1,
		height: 89,
		depth: 176,
		red: 128, green: 128, blue: 128
	});
	let wall2 = new Box({
		x:89.5,
		y:2,
		z:0,
		width: 1,
		height: 89,
		depth: 176,
		red: 128, green: 128, blue: 128
	});
	let wall3 = new Box({
		x:0,
		y:2,
		z:-89.5,
		width: 176,
		height: 89,
		depth: 1,
		red: 128, green: 128, blue: 128
	});
	let wall4 = new Box({
		x:0,
		y:2,
		z:89.5,
		width: 176,
		height: 89,
		depth: 1,
		red: 128, green: 128, blue: 128
	});
	//Make all walls solid
	wall1.tag.object3D.userData.solid = true;
	wall2.tag.object3D.userData.solid = true;
	wall3.tag.object3D.userData.solid = true;
	wall4.tag.object3D.userData.solid = true;

	//Add all boxes to world
	world.add(wall1);
	world.add(wall2);
	world.add(wall3);
	world.add(wall4);

	let bridgeWall1 = new Box({
		x:-88.5, y:2, z:200,
		width: 1, height: 89, depth: 176,
		red: 255, green: 255, blue: 255,
		asset: 'squid2'
	});
	let bridgeWall2 = new Box({
		x:88.5,y:2,z:200,
		width: 1,height: 89,depth: 176,
		red: 255, green: 255, blue: 255,
		asset: "squid1",
	});
	let bridgeWall3 = new Box({
		x:0,y:2,z:285,
		width: 176,height: 89,depth: 1,
		red: 255, green: 255, blue: 255,
	});
	let bridgeWall4 = new Box({
		x:0,y:2,z:115,
		width: 176,height: 89,depth: 1,
		red: 255, green: 255, blue: 255,
		asset: "squid3",
	});

	bridgeWall1.tag.object3D.userData.solid = true;
	bridgeWall2.tag.object3D.userData.solid = true;
	bridgeWall3.tag.object3D.userData.solid = true;
	bridgeWall4.tag.object3D.userData.solid = true;
	world.add(bridgeWall1);
	world.add(bridgeWall2);
	world.add(bridgeWall3);
	world.add(bridgeWall4);

	playground = new GLTF({
		asset: 'playground',
		x: 0,
		y: 12.8,
		z: 0,
	});
	world.add(playground);

	doll = new GLTF({
		asset: 'doll',
		x: 2,
		y: 0.22,
		z: 70,
		rotationY: 180,
	});
	world.add(doll);

	var s = doll.getScale();

	// update accordingly
	doll.setScale(s.x + 4, s.y + 4, s.z + 4);


	steve = new GLTF({
		asset: 'steve',
		x: 2,
		y: 0.22,
		z: 2,
	});
	world.add(steve);


	let teleportBox = new Box({
		x: 0,
		y: 1,
		z: 0,
		width: 1,
		height: 1,
		depth: 1,
		red: 200, green: 200, blue: 200,
		clickFunction: function(theBox) {
			// teleport the user here immediately
			world.teleportToObject(objectiveBox);
			doll_position = "back";
		}
	});
	world.add(teleportBox);

	let teleportBox2 = new Box({
		x: 0,
		y: 1,
		z: 150,
		width: 1,
		height: 1,
		depth: 1,
		red: 100, green: 100, blue: 100,
		clickFunction: function(theBox) {
			// teleport the user here immediately
			world.teleportToObject(objectiveBox2);
		}
	});
	world.add(teleportBox2);

	let teleportBox3 = new Box({
		x: 0,
		y: 3,
		z: 198,
		width: 1,
		height: 1,
		depth: 1,
		red: 100, green: 100, blue: 100,
		clickFunction: function(theBox) {
			// teleport the user here immediately
			world.teleportToObject(teleportBox);
		}
	});
	world.add(teleportBox3);

	let objectiveBox = new Box({
		x: 0,
		y: 1,
		z: 150,
		width: 0,
		height: 0,
		depth: 0,
		red: 0, green: 0, blue: 0
	});
	world.add(objectiveBox);

	let objectiveBox2 = new Box({
		x: 0,
		y: 1,
		z: 5,
		width: 0,
		height: 0,
		depth: 0,
		red: 0, green: 0, blue: 0
	});
	world.add(objectiveBox2);


	//Create invisible plane to apply to world so user can't fall through.
	let g = new Plane({x:0, y:0.2, z:0, width:180, height:180, red:0, green:102, blue:153, rotationX:-90, metalness:0.25});

	// set the ground so that it is considered 'solid'
	g.tag.object3D.userData.solid = true;

	// add the plane to our world
	world.add(g);

	//Create invisible plane in the bridge game environment so user can't fall through.
	let f = new Plane({x:0, y:0.2, z:200, width:180, height:180, red:55, green:61, blue:61, rotationX:-90, metalness:0.25});

	// set the ground so that it is considered 'solid'
	f.tag.object3D.userData.solid = true;

	// add the plane to our world
	world.add(f);

	//Create 20 robots
	for (let i = 0; i<= 20; i++) {
		var dummy = new SquidWorker(5, 0, 0);
		robots.push(dummy);

		var players = new dummyPlayers(10, 0, 0);
		playerRobots.push(players);
	}

	// Create stairs
	let stair1a = new Box({
		width:4,height:1,depth:2,
		x:0,y:0.25,z:170,
		red:200, green: 200, blue:200,
		asset: "marble",

	});
	stair1a.tag.object3D.userData.stairs = true;
	world.add(stair1a);

	let stair2 = new Box({
		width:4,height:1,depth:2,
		x:0,y:0.25,z:172,
		red:200, green: 200, blue:200,
		asset: "marble",
	});
	stair2.tag.object3D.userData.stairs = true;
	world.add(stair2);

	let stair3 = new Box({
		width:4,height:1,depth:2,
		x:0,y:0.75,z:174,
		red:200, green: 200, blue:200,
		asset: "marble",
	});
	stair3.tag.object3D.userData.stairs = true;
	world.add(stair3);

	let stair4 = new Box({
		width:4,height:1,depth:2,
		x:0,y:1.25,z:176,
		red:200, green: 200, blue:200,
		asset: "marble",
	});
	stair4.tag.object3D.userData.stairs = true;
	world.add(stair4);

	//Create platforms

	//Choice 1, Left
	let platform1a = new Box({
		width: 2, height:.25, depth:2,
		x:1.5, y:2,z: 178,
		red:200, green: 200, blue:200,
		asset: "glass",

	});
	platform1a.tag.object3D.userData.stairs = true;
	world.add(platform1a);
	//Choice 1, Right
	let platform1b = new Box({
		width: 2, height:.25, depth:2,
		x:-1.5, y:2,z: 178,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform1b.tag.object3D.userData.stairs = false;
	world.add(platform1b);

	//Choice 2, Left
	let platform2a = new Box({
		width: 2, height:.25, depth:2,
		x:1.5, y:2,z: 180.5,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform2a.tag.object3D.userData.stairs = false;
	world.add(platform2a);
	//Choice 2, Right
	let platform2b = new Box({
		width: 2, height:.25, depth:2,
		x:-1.5, y:2,z: 180.5,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform2b.tag.object3D.userData.stairs = true;
	world.add(platform2b);

	//Choice 3, Left
	let platform3a = new Box({
		width: 2, height:.25, depth:2,
		x:1.5, y:2,z: 183,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform3a.tag.object3D.userData.stairs = true;
	world.add(platform3a);
	//Choice 3, Right
	let platform3b = new Box({
		width: 2, height:.25, depth:2,
		x:-1.5, y:2,z: 183,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform3b.tag.object3D.userData.stairs = false;
	world.add(platform3b);

	//Choice 4, Left
	let platform4a = new Box({
		width: 2, height:.25, depth:2,
		x:1.5, y:2,z: 185.5,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform4a.tag.object3D.userData.stairs = false;
	world.add(platform4a);
	//Choice 4, Right
	let platform4b = new Box({
		width: 2, height:.25, depth:2,
		x:-1.5, y:2,z: 185.5,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform4b.tag.object3D.userData.stairs = true;
	world.add(platform4b);

	//Choice 5, Left
	let platform5a = new Box({
		width: 2, height:.25, depth:2,
		x:1.5, y:2,z: 188,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform5a.tag.object3D.userData.stairs = true;
	world.add(platform5a);
	//Choice 5, Right
	let platform5b = new Box({
		width: 2, height:.25, depth:2,
		x:-1.5, y:2,z: 188,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform5b.tag.object3D.userData.stairs = false;
	world.add(platform5b);

	//Choice 6, Left
	let platform6a = new Box({
		width: 2, height:.25, depth:2,
		x:1.5, y:2,z: 190.5,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform6a.tag.object3D.userData.stairs = false;
	world.add(platform6a);
	//Choice 6, Right
	let platform6b = new Box({
		width: 2, height:.25, depth:2,
		x:-1.5, y:2,z: 190.5,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform6b.tag.object3D.userData.stairs = true;
	world.add(platform6b);

	//Choice 7, Left
	let platform7a = new Box({
		width: 2, height:.25, depth:2,
		x:1.5, y:2,z: 193,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform7a.tag.object3D.userData.stairs = true;
	world.add(platform7a);
	//Choice 7, Right
	let platform7b = new Box({
		width: 2, height:.25, depth:2,
		x:-1.5, y:2,z: 193,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform7b.tag.object3D.userData.stairs = false;
	world.add(platform7b);

	//Choice 8, Left
	let platform8a = new Box({
		width: 2, height:.25, depth:2,
		x:1.5, y:2,z: 195.5,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform8a.tag.object3D.userData.stairs = false;
	world.add(platform8a);
	//Choice 8, Right
	let platform8b = new Box({
		width: 2, height:.25, depth:2,
		x:-1.5, y:2,z: 195.5,
		red:200, green: 200, blue:200,
		asset: "glass",
	});
	platform8b.tag.object3D.userData.stairs = true;
	world.add(platform8b);

	//Add "leading lines" to the tiles
	let leftLine1 = new Box({
		width:0.25, height:0.25, depth: 15,
		x:2.25, y:1.75, z:185,
		red: 0, blue:0, green:0,
	});
	world.add(leftLine1);

	let leftLine2 = new Box({
		width:0.25, height:0.25, depth: 15,
		x:0.65, y:1.75, z:185,
		red: 0, blue:0, green:0,
	});
	world.add(leftLine2);

	let leftLine3 = new Box({
		width:0.25, height:0.25, depth: 15,
		x:-2.25, y:1.75, z:185,
		red: 0, blue:0, green:0,
	});
	world.add(leftLine3);

	let leftLine4 = new Box({
		width:0.25, height:0.25, depth: 15,
		x:-0.65, y:1.75, z:185,
		red: 0, blue:0, green:0,
	});
	world.add(leftLine4);

	//Platform once you reach the end
	let finalPlatform = new Box({
		width: 10, height: .5, depth:10,
		x:0.0, y:2, z:198,
		red:200, green:200, blue:200,
	});
	finalPlatform.tag.object3D.userData.stairs = true;
	world.add(finalPlatform);

	//Creating box for final platform when bridge game is finished
	let finalPlatformWall1 = new Box({
		width: 10, height: 8, depth: 1,
		x: 0.0, y:6, z: 203,
		red:200, green: 200, blue: 200,
	})
	world.add(finalPlatformWall1);

	let finalPlatformWall2 = new Box({
		width: 1, height: 8, depth: 10,
		x: 5, y:6, z: 198,
		red:200, green: 200, blue: 200,
	})
	world.add(finalPlatformWall2);

	let finalPlatformWall3 = new Box({
		width: 1, height: 8, depth: 10,
		x: -5, y:6, z: 198,
		red:200, green: 200, blue: 200,
	})
	world.add(finalPlatformWall3);

	//each set of platforms requries that the z value be changed by 2.5, and that the name be changed
	//all left platforms are "real tiles", while right tiles are fake tiles, and user should fall through

	//Spectator Platforms
	let specLVL1 = new Box({
		width:7.5, height:1, depth: 10,
		x:-37, y:0.5, z:185,
		red: 255, blue:255, green:255,
	});
	world.add(specLVL1);

	let specLVL2 = new Box({
		width:2, height:3, depth: 10,
		x:-40, y:2, z:185,
		red:200, green:200, blue:200
	})
	world.add(specLVL2);

	let VIP1 = new VIPs(-40, 0.5, 181);
	let VIP2 = new VIPs(-40, 0.5, 185);
	let VIP3 = new VIPs(-40, 0.5, 189);

	sensor = new Sensor();

	//END ADD CODE**************************
		//Squid games boxes
	squidBox1 = new Box({
		x: 4, y: 8, z: 0,
		width:2, height:2, depth:2,
		asset: 'boxGraphic',
		clickFunction: function(theBox) {
			// get the current scale of the object (this is an object with three properties - x, y & z)
			var s = squidBox1.getScale();

			// update accordingly
			squidBox1.setScale(s.x + 0.2, s.y + 0.2, s.z + 0.2);
		}
	});
	world.add(squidBox1);
		//towers for box1
		let onetower1 = new Box({
			x: 4, y: 6, z: 0,
			width:2, height:2, depth:2,
			red: 255, green: 255, blue: 255,
		});
		let onetower2 = new Box({
			x: 4, y: 4, z: 0,
			width:2, height:2, depth:2,
			red: 255, green: 255, blue: 255,
		});
		let onetower3 = new Box({
			x: 4, y: 2, z: 0,
			width:2, height:2, depth:2,
			red: 255, green: 255, blue: 255,
		});
		let onetower4 = new Box({
			x: 4, y: 0, z: 0,
			width:2, height:2, depth:2,
			red: 255, green: 255, blue: 255,
		});
		world.add(onetower1);
		world.add(onetower2);
		world.add(onetower3);
		world.add(onetower4);
	squidBox2 = new Box({
		x: -4, y: 8, z: 0,
		width:2, height:2, depth:2,
		asset: 'boxGraphic',
		clickFunction: function(theBox) {
			// get the current scale of the object (this is an object with three properties - x, y & z)
			var s = squidBox2.getScale();

			// update accordingly
			squidBox2.setScale(s.x + 0.2, s.y + 0.2, s.z + 0.2);
		}
	});
	world.add(squidBox2);
		//towers for box2
		let twotower1 = new Box({
			x: -4, y: 6, z: 0,
			width:2, height:2, depth:2,
			red: 255, green: 255, blue: 255,
		});
		let twotower2 = new Box({
			x: -4, y: 4, z: 0,
			width:2, height:2, depth:2,
			red: 255, green: 255, blue: 255,
		});
		let twotower3 = new Box({
			x: -4, y: 2, z: 0,
			width:2, height:2, depth:2,
			red: 255, green: 255, blue: 255,
		});
		let twotower4 = new Box({
			x: -4, y: 0, z: 0,
			width:2, height:2, depth:2,
			red: 255, green: 255, blue: 255,
		});
		world.add(twotower1);
		world.add(twotower2);
		world.add(twotower3);
		world.add(twotower4);


	// create our gravity sensor (see class below)
	// this object detects what is below the user
	sensor = new Sensor();

}


function myFunction() {
	if (song_played == false) {
		song_played = true;
	}
	if (num < 18 && doll_position == "back") {
		doll.spinY(10);
		num++;
	}
	else {
		doll_position = "front";
		num = 0;
	}
}
function turn_fast(e) {
		e.spinY(0.01);
}

let num = 0;
let counter = 0;
let b1;
let userP, userR;
let doll_position = "front";
let red;
let song_played = false
let turned = 0;
let setX, setY, setZ;
let userX, userZ;

let gravity = 0.02;
let jumping = false;
let jumpPower;

function draw() {

	let whatsBelow = sensor.getEntityBelowUser();
	//console.log(whatsBelow.distance);

	// if what's below us is a set of stairs we should adjust our y value so we are on top of it
	if (whatsBelow && jumping == false) {
		let cp = world.getUserPosition();

		// falling
		if (whatsBelow.distance > 1.01) {
			world.setUserPosition( cp.x, cp.y-0.05, cp.z);
		}
		else if (whatsBelow.object.el.object3D.userData.stairs && whatsBelow.distance < 1) {
			world.setUserPosition( cp.x, cp.y + (1-whatsBelow.distance), cp.z);
		}
	}

	if ( keyIsDown(32) && jumping == false) { // && whatsBelow.distance < 1.01
		 jumping = true;
		 jumpPower = -0.35;
	 }

	let a = world.getUserPosition();

	let z = steve.getWorldPosition();
	if (z.y >= 5 && z.z >= 193 && win.isPlaying() == false) {
		win.play();
	}

	if (jumping) {
		 let cp = world.getUserPosition();
		 world.setUserPosition( cp.x, cp.y-jumpPower, cp.z);
		 steve.setY(-jumpPower);

		 jumpPower += gravity;

		 if (whatsBelow.distance < 1.4) {
			 jumping = false;
		 }
	}

	let b = world.getUserPosition();
	 if (b.y < 0.97 && jumping == false) {
		 world.setUserPosition( b.x, 1, b.z);
		 steve.setY(1);
	}



	userP = world.getUserPosition();
	userR = world.getUserRotation();


	setX =  (userP.x + (-2*sin(userR.y) ) ) ;
	setY =  ( (userP.y-0.8) );
	setZ =  (userP.z + (-2*cos(userR.y) ) ) ;

	//steve is 2 in front of user
	//set position for player character using user position

	steve.setX(setX);
	steve.setY(setY);
	steve.setZ(setZ);
	//set rotation for player character using user rotation
	steve.setRotation(0, userR.y*180/3.14 + 180, userR.z*180/3.14);


	if (doll_position == "back") {
		setTimeout(myFunction, 3000);
	}

	if (doll_position == "back") {
		setTimeout(myFunction, 3000);
	}

	//DYNAMIC TEXTURES
	fill(random(255));
	ellipse(random(width), random(height), random(width));

	//For all robots
	for (var i = 0; i < robots.length; i++) {
		robots[i].move();
	}

	for (var j = 0; j < playerRobots.length; j++) {
		playerRobots[j].move();
	}
}

class Sensor {

	constructor() {
		// raycaster - think of this like a "beam" that will fire out of the
		// bottom of the user's position to figure out what is below their avatar
		this.rayCaster = new THREE.Raycaster();
		this.userPosition = new THREE.Vector3(0,0,0);
		this.downVector = new THREE.Vector3(0,-1,0);
		this.intersects = [];

		this.rayCasterFront = new THREE.Raycaster();
		this.cursorPosition = new THREE.Vector2(0,0);
		this.intersectsFront = [];
	}

	getEntityBelowUser() {
		// update the user's current position
		let cp = world.getUserPosition();
		this.userPosition.x = setX;//cp.x;
		this.userPosition.y = cp.y;//cp.y;
		this.userPosition.z = setZ;//cp.z-2;

		this.rayCaster.set(this.userPosition, this.downVector);
		this.intersects = this.rayCaster.intersectObjects( world.threeSceneReference.children, true );

		// determine which "solid" or "stairs" items are below
		for (let i = 0; i < this.intersects.length; i++) {
			if (!(this.intersects[i].object.el.object3D.userData.solid || this.intersects[i].object.el.object3D.userData.stairs)) {
				this.intersects.splice(i,1);
				i--;
			}
		}

		if (this.intersects.length > 0) {
			return this.intersects[0];
		}
		return false;
	}
}

class SquidWorker {
	constructor(x, y, z) {

		this.container = new Container3D( {
			x: x, y: y, z: z
		});
		world.add(this.container);

		this.rightLeg = new Box({
			width: 0.25, height: 0.5, depth: 0.25,
			x: 2.6, y: 0.5, z:0,
			red:255, green: 0, blue: 0,
		});
		this.container.add(this.rightLeg);

		this.leftLeg = new Box({
			width: 0.25, height: 0.5, depth: 0.25,
			x: 2.9, y: 0.5, z:0,
			red:255, green: 0, blue: 0,
		});
		this.container.add(this.leftLeg);

		this.body = new Box({
			width: 0.7, height: 0.7, depth: 0.4,
			x: 2.75, y: 1.1, z:0,
			red:255, green: 0, blue: 0,
		});
		this.container.add(this.body);

		//Sphere head
		this.head = new Sphere({
			// width: 0.5, height: 0.7, depth: 0.3,
			scaleX : 0.25, scaleY: 0.25, scaleZ: 0.25,
			x: 2.75, y: 1.6, z: 0.0,
			red: 255, green: 255, blue: 255,
		});
		this.container.add(this.head);

		this.leftArm = new Box({
			width: 0.1, height: 0.5, depth: 0.1,
			x: 2.35, y: 1.20, z:0,
			red:255, green: 0, blue: 0,
		});
		this.container.add(this.leftArm);

		this.rightArm = new Box({
			width: 0.1, height: 0.5, depth: 0.1,
			x: 3.15, y: 1.20, z:0,
			red:255, green: 0, blue: 0,
		});
		this.container.add(this.rightArm);

		// keep track of an offset in Perlin noise space
		this.xOffset = random(1000);
		this.zOffset = random(2000, 3000);
	}
	move() {
		// compute how the particle should move
		// the particle should always move up by a small amount
		var yMovement = 0;

		// the particle should randomly move in the x & z directions
		var xMovement = map( noise(this.xOffset), 0, 1, -0.05, 0.05);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.05, 0.05);

		// update our posotions in perlin noise space
		this.xOffset += 0.01;
		this.yOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.container.nudge(xMovement, yMovement, zMovement);

		//Keeps dummy robots from moving out of space
		if (this.container.x > 85 || this.container.x < -85 || this.container.z > 85 || this.container.z < -85.5) {
			this.container.x = 0;
			this.container.z = 0;
		}
	}
}

class dummyPlayers {
	constructor(x, y, z) {

		this.container = new Container3D( {
			x: x, y: y, z: z
		});
		world.add(this.container);

		this.rightLeg = new Box({
			width: 0.25, height: 0.5, depth: 0.25,
			x: 2.6, y: 0.5, z:0,
			red:4, green: 122, blue: 55,
		});
		this.container.add(this.rightLeg);

		this.leftLeg = new Box({
			width: 0.25, height: 0.5, depth: 0.25,
			x: 2.9, y: 0.5, z:0,
			red:4, green: 122, blue: 55,
		});
		this.container.add(this.leftLeg);

		this.body = new Box({
			width: 0.7, height: 0.7, depth: 0.4,
			x: 2.75, y: 1.1, z:0,
			red:4, green: 122, blue: 55,
		});
		this.container.add(this.body);

		this.head = new Sphere({
			// width: 0.5, height: 0.7, depth: 0.3,
			scaleX : 0.25, scaleY: 0.25, scaleZ: 0.25,
			x: 2.75, y: 1.6, z: 0.0,
			red: 255, green: 255, blue: 255,
		});
		this.container.add(this.head);

		this.leftArm = new Box({
			width: 0.1, height: 0.5, depth: 0.1,
			x: 2.35, y: 1.20, z:0,
			red:4, green: 122, blue: 55,
		});
		this.container.add(this.leftArm);

		this.rightArm = new Box({
			width: 0.1, height: 0.5, depth: 0.1,
			x: 3.15, y: 1.20, z:0,
			red:4, green: 122, blue: 55,
		});
		this.container.add(this.rightArm);

		// keep track of an offset in Perlin noise space
		this.xOffset = random(5000);
		this.zOffset = random(1000, 7000);
	}
	move() {
		// compute how the particle should move
		// the particle should always move up by a small amount
		var yMovement = 0;

		// the particle should randomly move in the x & z directions
		var xMovement = map( noise(this.xOffset), 0, 1, -0.05, 0.05);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.05, 0.05);

		// update our posotions in perlin noise space
		this.xOffset += 0.01;
		this.yOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.container.nudge(xMovement, yMovement, zMovement);

		//Keeps dummy robots from moving out of space
		if (this.container.x > 85 || this.container.x < -85 || this.container.z > 85 || this.container.z < -85.5) {
			this.container.x = 0;
			this.container.z = 0;
		}
	}
}
class VIPs {
	constructor(x, y, z) {

		this.container = new Container3D( {
			x: x, y: y, z: z
		});
		world.add(this.container);

		this.rightLeg = new Box({
			width: 0.25, height: 0.5, depth: 0.25,
			x: 2.6, y: 0.5, z:0,
			red: 0, green: 0, blue: 0,
		});
		this.container.add(this.rightLeg);

		this.leftLeg = new Box({
			width: 0.25, height: 0.5, depth: 0.25,
			x: 2.9, y: 0.5, z:0,
			red: 0, green: 0, blue: 0,
		});
		this.container.add(this.leftLeg);

		this.body = new Box({
			width: 0.7, height: 0.7, depth: 0.4,
			x: 2.75, y: 1.1, z:0,
			red: 0, green: 0, blue: 0,
		});
		this.container.add(this.body);

		//Sphere head
		this.head = new Sphere({
			// width: 0.5, height: 0.7, depth: 0.3,
			scaleX : 0.25, scaleY: 0.25, scaleZ: 0.25,
			x: 2.75, y: 1.6, z: 0.0,
			red: 255, green: 255, blue: 255,
		});
		this.container.add(this.head);

		this.leftArm = new Box({
			width: 0.1, height: 0.5, depth: 0.1,
			x: 2.35, y: 1.20, z:0,
			red: 0, green: 0, blue: 0,
		});
		this.container.add(this.leftArm);

		this.rightArm = new Box({
			width: 0.1, height: 0.5, depth: 0.1,
			x: 3.15, y: 1.20, z:0,
			red: 0, green: 0, blue: 0,
		});
		this.container.add(this.rightArm);
	}
}
