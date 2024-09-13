const initX = 500 - 30 / 2;
const initY = 330 - 80 / 2;

let rocket = {
	posX: initX,
	posY: initY,
	posX0: initX,
	posY0: initY,
	velX: 0,
	velY: 0,
	velX0: 0,
	velY0: 0,
	accX: 0,
	accY: 0,
	forX: 0,
	forY: 0,
	rotT: 0,
	rotA: 0,
	rotV: 0,
	rotV0: 0,
	rotP: 0,
	rotP0: 0,
	fuelMass: 400000,
	fuelMass0: 400000,
	mass: 22000,
	Isp: 311,
	airArea: 0,
	width: 3.7,
	height: 48
};

const earth = {
	posX: 500,
	posY: 6371370,
	mass: 5.97 * Math.pow(10, 24),
	radius: 6371000
};

const moon = {
	posX: 5000,
	posY: -10000000,
	mass: 7.35 * Math.pow(10, 22),
	radius: 1737000
};

let airDens = 0;

let enableSas = false;

let Fg = {};

const G = 6.674 * Math.pow(10, -11); // gravitational constant
let vel = 0, mass = 0, Fr = 0;

const audio = new Audio('https://raw.githubusercontent.com/PPTGames/Project-Space/master/rocket_boost_engine.mp3');
const bgm1 = new Audio('https://raw.githubusercontent.com/PPTGames/Project-Space/master/%F0%9F%8E%B5%20Orbital%20Romance%20-%20Sir%20Cubworth%20%F0%9F%8E%A7%20No%20Copyright%20Music%20%F0%9F%8E%B6%20YouTube%20Audio%20Library.mp3');

function refreshPhysics(dt) {

	vel = Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2));
	mass = rocket.mass + rocket.fuelMass;
	distRE = Math.sqrt(Math.pow(rocket.posX + rocket.width / 2 - earth.posX, 2) + Math.pow(rocket.posY + rocket.height / 2 - earth.posY, 2));
	distRM = Math.sqrt(Math.pow(rocket.posX + rocket.width / 2 - moon.posX, 2) + Math.pow(rocket.posY + rocket.height / 2 - moon.posY, 2));

	document.getElementById("rocket_engine_sfx").volume = rocket.fuelMass > 0 ? thrust : 0;
	document.getElementById("bgm_space").volume = (distRE - earth.radius > 50000 ? 1 : 0);

	$("#title").html("Project: Space | pre-alpha 4 | " + Math.min(1 / dt) + " fps");
	$("#panel-info").html("Velocity: " + Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2)) + " m/s<br>" + "Fuel: "
	+ Math.round(rocket.fuelMass) + "<br>" + "Alt: " + (distRE - earth.radius) + "<br>" + "PosY: " + rocket.posY);

	// air
	airDens = Math.pow(1.21 * Math.E, -((Math.sqrt(Math.pow(rocket.posX - 500, 2) + Math.pow(rocket.posY - 7000370, 2))) - 7000000) / 6948.71)
	rocket.airArea = ((Math.cos(rocket.rotP) * rocket.velX + Math.sin(rocket.rotP) * rocket.velY) / vel)
		* Math.PI * 15 * 15 + 2 * Math.sin(Math.acos((Math.cos(rocket.rotP) * rocket.velX + Math.sin(rocket.rotP) * rocket.velY) / vel)) * 15 * 80;

	// gravitational force
	Fg = {
		x: -mass * G * (((earth.mass * (rocket.posX + rocket.width / 2 - earth.posX)) / Math.pow(distRE, 3)) + ((moon.mass * (rocket.posX + rocket.width / 2 - moon.posX)) / Math.pow(distRM, 3))),
		y: -mass * G * (((earth.mass * (rocket.posY + rocket.height / 2 - earth.posY)) / Math.pow(distRE, 3)) + ((moon.mass * (rocket.posY + rocket.height / 2 - moon.posY)) / Math.pow(distRM, 3)))
	};

	if (Math.pow(rocket.posX + rocket.width / 2 - earth.posX, 2) + Math.pow(rocket.posY + rocket.height - earth.posY, 2) < Math.pow(earth.radius, 2)) {
		Fg = { x: 0, y: 0 };
		rocket.velX = 0;
		rocket.velY = 0;
		//console.log(Math.sin(Math.atan((rocket.posY - earth.posY) / (rocket.posX - earth.posX))) * earth.radius);
		//rocket.posX = Math.cos(Math.atan((rocket.posY - earth.posY) / (rocket.posX - earth.posX))) * earth.radius + rocket.posX;
		//rocket.posY = Math.sin(Math.atan((rocket.posY - earth.posY) / (rocket.posX - earth.posX))) * earth.radius + rocket.posY;

		vx = rocket.posX + rocket.width / 2 - earth.posX;
		vy = rocket.posY + rocket.height - earth.posY;
    lineLength = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
    vx = vx / lineLength;
		vy = vy / lineLength;
    rocket.posX = earth.posX + vx * earth.radius;
		rocket.posY = earth.posY + vy * earth.radius;
	}

	if (rocket.fuelMass <= 0) rocket.fuelMass = 0;
	if (rocket.fuelMass > 0) rocket.forY = thrust * -7607000;
	else rocket.forY = 0;
	rocket.rotT = (steer) / 10000000;
	//console.log(rocket.rotT);

	rocket.forX = Math.sqrt(rocket.forX * rocket.forX + rocket.forY * rocket.forY) * Math.cos(rocket.rotP - Math.PI / 2);
	rocket.forY = Math.sqrt(rocket.forX * rocket.forX + rocket.forY * rocket.forY) * Math.sin(rocket.rotP - Math.PI / 2);

	const Ft = {
		x: rocket.forX,
		y: rocket.forY
	}; // thrust force

	Fr = {
		x: Fg.x + Ft.x,
		y: Fg.y + Ft.y
	}; // resultant force

	//Fr = Ft; // temp

	rocket.fuelMass0 = rocket.fuelMass;
	if (rocket.fuelMass > 0) rocket.fuelMass = rocket.fuelMass0 - Math.sqrt(rocket.forX * rocket.forX + rocket.forY * rocket.forY) * dt / (9.81 * rocket.Isp);


	rocket.rotP0 = rocket.rotP;
	rocket.rotV0 = rocket.rotV;

	rocket.rotA = Math.sqrt(rocket.forX * rocket.forX + rocket.forY * rocket.forY) * Math.sin(rocket.rotT);
	rocket.rotV = rocket.rotV0 + rocket.rotA * dt;
	rocket.rotP = rocket.rotP0 + rocket.rotV * dt + 0.5 * rocket.rotA * dt * dt


	rocket.accX = Fr.x / (rocket.mass + rocket.fuelMass);
	rocket.accY = Fr.y / (rocket.mass + rocket.fuelMass);

	rocket.velX0 = rocket.velX;
	rocket.velY0 = rocket.velY;
	rocket.posX0 = rocket.posX;
	rocket.posY0 = rocket.posY;

	rocket.velX = rocket.velX0 + rocket.accX * dt;
	rocket.velY = rocket.velY0 + rocket.accY * dt;

	rocket.posX = rocket.posX0 + rocket.velX0 * dt + 0.5 * rocket.accX * dt * dt;
	rocket.posY = rocket.posY0 + rocket.velY0 * dt + 0.5 * rocket.accY * dt * dt;

	//if ($("#sas").is(":checked"))
	if (enableSas) sasRefresh();

}

let sound = false;

$(document).ready(function(){

	$(document).on("click", function() {
		if (!sound) {
			document.getElementById("rocket_engine_sfx").loop = true;
			document.getElementById("rocket_engine_sfx").play();
			document.getElementById("bgm_space").loop = true;
			document.getElementById("bgm_space").play();
			sound = true;
		}
	});

	$("#steering-slider").on("mouseup", function() {
		//$("#steering-slider").val(10);
	});

	$(document).on("keydown", function(e) {
		if (e.which == 83) {
			$("#thrust-slider").val(Number(thrust) - 1);
		} else if (e.which == 87) {
			$("#thrust-slider").val(Number(thrust) + 1);
		}

		if (e.which == 65) {
			$("#steering-slider").val(Number(steer) - 1);
			//rocket.rotT = -0.0000001;
		} else if (e.which == 68) {
			$("#steering-slider").val(Number(steer) + 1);
			//rocket.rotT = 0.0000001;
		} else {
			$("#steering-slider").val(10);
		}
	});

});
