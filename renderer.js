let cz = 1;
let ctx, cw, ch, r, offsetX, offsetY, grd;
const stars = [];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genStars() {
	for (let i = 0; i < 10000; i++) {
		stars.push([getRandomInt(-100000000, 100000000), getRandomInt(-100000000, 100000000), getRandomInt(500, 4000)]);
	}
}

function refreshViewport() {

	/*let w = window.innerWidth;
	let h = window.innerHeight;
	let r = w / h;
	if (r > 16 / 9) w = h * 16 / 9;
	if (r < 16 / 9) h = w * 9 / 16;
	$("#game-wrapper").width(w);
	$("#game-wrapper").height(h);
	$("#canvas").get(0).getContext("2d").canvas.width = w;
	$("#canvas").get(0).getContext("2d").canvas.height = h;*/

	ctx = $("#canvas").get(0).getContext("2d");
	ctx.canvas.width = cw;
	ctx.canvas.height = ch;

	offsetX = rocket.posX + rocket.width / 2 - $("#canvas").width() / 2;
	offsetY = rocket.posY + rocket.height / 2 - $("#canvas").height() / 2;

	//ctx.setTransform(0.5, 0, 0, 0.5, 0, 0);

	ctx.clearRect(0, 0, $("#canvas").width(), $("#canvas").height());

	ctx.save();

	// sky - old
	/*let background = new Image();
	background.src = "https://images.financialexpress.com/2020/04/sky1200.jpg?w=1200&h=800&imflag=true";
	ctx.drawImage(background, 0, 0, 1000, 600, 0 - rocket.posX, -1400 - rocket.posY, 1000, 2000);*/

	// space
	ctx.beginPath();
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, 1000, 600);


	ctx.translate($("#canvas").width() / 2, $("#canvas").height() / 2);
	let scl = Math.pow(10, zoom * 10) / 100000;
	ctx.scale(cz + scl - cz, cz + scl - cz);
	cz = scl;
	ctx.translate(-$("#canvas").width() / 2, -$("#canvas").height() / 2);

	if (thrust > 70) {
		let dx = Math.random() * (thrust - 70) / 10;
		let dy = Math.random() * (thrust - 70) / 10;
		ctx.translate(dx, dy);
	}

	// sky
	/*let grd = ctx.createLinearGradient(0- offsetX, 0- offsetY, 0, -1400 - offsetY);
	grd.addColorStop(1, "rgb(0, 15, 65)");
	grd.addColorStop(0, "rgb(60, 200, 255)");
	ctx.fillStyle = grd;
	ctx.fillRect(-1000- offsetX, -1400- offsetY, 3000, 2000);*/

	// stars
	ctx.fillStyle = "white";
	for (let j = 0; j < stars.length; j++) {
		if (stars[j][0] + offsetX > offsetX) {
			ctx.beginPath();
			ctx.arc(stars[j][0] - offsetX, stars[j][1] - offsetY, stars[j][2], 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	// sky
	grd = ctx.createRadialGradient(500 - offsetX, earth.radius +  earth.posX - offsetY, earth.radius + 1000, 500 - offsetX, earth.radius +  earth.posX - offsetY, earth.radius + 40000);
	grd.addColorStop(0, "rgba(190, 210, 250, 1)");
	grd.addColorStop(1, "rgba(190, 210, 250, 0)");
	ctx.fillStyle = grd;
	ctx.arc(500 - offsetX,  earth.radius +  earth.posX - offsetY, earth.radius +  earth.posX + 40000, 0, 2 * Math.PI);
	ctx.fill();


	function pickHex(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
	}

	// earth
	const rgb = pickHex([0, 255, 0], [0, 0, 255], zoom + 0.4);
	ctx.fillStyle = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
	ctx.beginPath();
	ctx.arc(earth.posX - offsetX, earth.posY - offsetY, earth.radius, 0, 2 * Math.PI);
	//ctx.fillRect(-earth.radius / 2 - offsetX, 400 - offsetY, earth.radius, earth.radius);
	ctx.fill();


	// moon
	ctx.fillStyle = "grey";
	ctx.beginPath();
	ctx.arc(5000 - offsetX, -10000000 - offsetY, 1737000, 0, 2 * Math.PI);
	ctx.fill();


	// orientate to rocket
	ctx.translate($("#canvas").width() / 2, $("#canvas").height() / 2);
	ctx.rotate(rocket.rotP);

	// rocket flame
	/*ctx.beginPath();
	ctx.rotate(rocket.rotT);
	ctx.fillStyle = "red";
	ctx.fillRect(-15 / 2, 80 / 2, 15, thrust * 0.4);
	ctx.rotate(-rocket.rotT);*/


	// rocket
	ctx.fillStyle = "white";
	/*ctx.beginPath();
	ctx.moveTo(0, -80 / 2);
	ctx.lineTo(-3, -75 / 2);
	ctx.lineTo(-30 / 2, -50 / 2);
	ctx.lineTo(30 / 2, -50 / 2);
	ctx.lineTo(3, -75 / 2);
	ctx.fill();*/
	ctx.beginPath();
	ctx.fillRect(-rocket.width / 2, -rocket.height / 2, rocket.width, rocket.height);
	/*ctx.fillStyle = "grey";
	ctx.beginPath();
	ctx.moveTo(-5, 80 / 2);
	ctx.lineTo(5, 80 / 2);
	ctx.lineTo(10, 80 / 2 + 10);
	ctx.lineTo(-10, 80 / 2 + 10);
	ctx.fill();*/


	/*ctx.beginPath();
	grd = ctx.createRadialGradient(0, -80 / 2, 0, 0, -30, 20);
	grd.addColorStop(0, "rgba(210, 80, 0, 0.4)");
	grd.addColorStop(1, "rgba(210, 80, 0, 0)");
	ctx.fillStyle = grd;
	//ctx.arc(0, -80 / 2, 21, Math.PI / 4, Math.PI - Math.PI / 4);
	ctx.moveTo(0, -80 / 2);
	ctx.lineTo(-30, -20 / 2);
	ctx.lineTo(30, -20 / 2);
	ctx.fill();*/


	if (scl < 0.2) {
		ctx.beginPath();
		ctx.moveTo(0 * 1 / scl / 2, -40 * 1 / scl / 2);
    ctx.lineTo(-30 * 1 / scl / 2, 40 * 1 / scl / 2);
    ctx.lineTo(30 * 1 / scl / 2, 40 * 1 / scl / 2);
		ctx.fillStyle = "white";
    ctx.fill();

		ctx.beginPath();
		ctx.rotate(rocket.rotT);
		ctx.fillStyle = "rgba(210,10,10," + thrust/100 + ")";
		ctx.fillRect(-15 * 1 / scl / 2, 40 * 1 / scl / 2, 15 * 1 / scl, thrust * 0.4 * 1 / scl);
		ctx.rotate(-rocket.rotT);
	}


	ctx.rotate(-rocket.rotP);
	ctx.translate(-$("#canvas").width() / 2, -$("#canvas").height() / 2);


	// launch pad
	ctx.beginPath();
	ctx.fillStyle = "grey";
	ctx.fillRect(470 - offsetX, 360 - offsetY, 40, 15);
	ctx.beginPath();
	ctx.fillRect(500 - offsetX, 320 - offsetY, 10, 40);


	// particles

	//ctx.rotate(rocket.rotT);

	if (Math.random() < thrust && thrust > 0 && (Math.abs(rocket.velX) > 0.1 || Math.abs(rocket.velY) > 0.1)) {
		px = rotPoint(rocket.posX + rocket.width / 2, rocket.posY + rocket.height / 2, rocket.posX + rocket.width / 2, rocket.posY + rocket.height / 2, -rocket.rotP)[0] + Math.random() * 5;
		py = rotPoint(rocket.posX + rocket.width / 2, rocket.posY + rocket.height / 2, rocket.posX + rocket.width / 2, rocket.posY + rocket.height / 2, -rocket.rotP)[1] + 30 + Math.random() * 15;
		pr = Math.random() * 10 * thrust / 100 + 5;
		particles.push({
			x: px,
			y: py,
			vx: -(thrust / 50) * Math.cos(rocket.rotP + Math.PI / 2),
			vy: -(thrust / 50) * Math.sin(rocket.rotP - Math.PI / 2),
			r: pr,
			c: ["rgba(" + hexToRgb(colors[Math.floor(Math.random() * colors.length)]) + ", 0.2)", "rgba(" + hexToRgb(colors[Math.floor(Math.random() * colors.length)]) + ", 0)"],
			a: 30
		});
	}

	if (Math.random() < thrust && Math.random() * 100 < 20 && thrust > 0 && (Math.abs(rocket.velX) > 0.1 || Math.abs(rocket.velY) > 0.1)) {
		px = rotPoint(rocket.posX + rocket.width / 2, rocket.posY + rocket.height / 2, rocket.posX + rocket.width / 2, rocket.posY + rocket.height / 2, -rocket.rotP)[0] + Math.random() * 15;
		py = rotPoint(rocket.posX + rocket.width / 2, rocket.posY + rocket.height / 2, rocket.posX + rocket.width / 2, rocket.posY + rocket.height, -rocket.rotP)[1] + 20 + Math.random() * 15;
		pr = Math.random() * 20 * thrust / 100 + 5;
		particles.push({
			x: px,
			y: py,
			vx: -(thrust / 100) * Math.cos(rocket.rotP + Math.PI / 2),
			vy: -(thrust / 100) * Math.sin(rocket.rotP - Math.PI / 2),
			r: pr,
			c: ["rgba(180, 180, 180, 0.2)", "rgba(200, 200, 200, 0)"],
			a: 200
		});
	}


	for (let i = 0; i < particles.length; i++) {
		ctx.beginPath();
		grd = ctx.createRadialGradient(particles[i].x - offsetX, particles[i].y - offsetY, 0, particles[i].x - offsetX, particles[i].y - offsetY, particles[i].r);
		grd.addColorStop(0, particles[i].c[0]);
		grd.addColorStop(1, particles[i].c[1]);
		ctx.fillStyle = grd;
		ctx.arc(particles[i].x - 5 - offsetX, particles[i].y - 5 - offsetY, particles[i].r, 0, Math.PI * 2);
		ctx.fill();
		particles[i].a--;
		particles[i].x += particles[i].vx;
		particles[i].y += particles[i].vy;
		particles[i].r += 0.1;
		if (particles[i].a <= 0) particles.splice(i, 1);
	}

	//ctx.rotate(-rocket.rotT);


	ctx.restore();



	/*ctx.translate($("#canvas").width() / 2, $("#canvas").height() / 2 + 200);

	ctx.rotate(rocket.rotP);

	ctx.beginPath();
	ctx.arc(0, 0, 60, 0, Math.PI);
	ctx.fillStyle = "green";
	ctx.fill();

	ctx.beginPath();
	ctx.arc(0, 0, 60, Math.PI, 0);
	ctx.fillStyle = "blue";
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(-60, 0);
	ctx.lineTo(60, 0);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 4;
	ctx.stroke();


	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(-15, -10);
	ctx.lineTo(15, -10);
	ctx.stroke();

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.moveTo(-25, -20);
	ctx.lineTo(25, -20);
	ctx.stroke();

	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(-15, -30);
	ctx.lineTo(15, -30);
	ctx.stroke();

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.moveTo(-20, -40);
	ctx.lineTo(20, -40);
	ctx.stroke();

	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(-15, -50);
	ctx.lineTo(15, -50);
	ctx.stroke();


	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(-15, 10);
	ctx.lineTo(15, 10);
	ctx.stroke();

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.moveTo(-25, 20);
	ctx.lineTo(25, 20);
	ctx.stroke();

	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(-15, 30);
	ctx.lineTo(15, 30);
	ctx.stroke();

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.moveTo(-20, 40);
	ctx.lineTo(20, 40);
	ctx.stroke();

	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(-15, 50);
	ctx.lineTo(15, 50);
	ctx.stroke();


	ctx.lineWidth = 4;


	ctx.rotate(-rocket.rotP);

	// border
	ctx.beginPath();
	ctx.arc(0, 0, 60, 0, Math.PI * 2);
	ctx.strokeStyle = "black";
	ctx.stroke();

	// prograde
	let x = 0 + (rocket.velX * 60) / Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2));
	let y = 0 + (rocket.velY * 60) / Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2));
	ctx.strokeStyle = "yellow";
	ctx.beginPath();
	ctx.arc(x, y, 3, 0, Math.PI * 2);
	ctx.fillStyle = "yellow";
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(x - 10, y);
	ctx.lineTo(x - 20, y);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(x, y - 10);
	ctx.lineTo(x, y - 20);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(x + 10, y);
	ctx.lineTo(x + 20, y);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2);
	ctx.stroke();


	// retrograde
	x = 0 - (rocket.velX * 60) / Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2));
	y = 0 - (rocket.velY * 60) / Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2));

	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2);
	ctx.stroke();

	ctx.translate(x, y);

	ctx.beginPath();
	ctx.moveTo(0, -10);
	ctx.lineTo(0, -20);
	ctx.stroke();

	ctx.rotate(Math.PI * 2 / 3);

	ctx.beginPath();
	ctx.moveTo(0, -10);
	ctx.lineTo(0, -20);
	ctx.stroke();

	ctx.rotate(Math.PI * 2 / 3);

	ctx.beginPath();
	ctx.moveTo(0, -10);
	ctx.lineTo(0, -20);
	ctx.stroke();

	ctx.rotate(-Math.PI * 2 / 3);
	ctx.rotate(-Math.PI * 2 / 3);

	ctx.lineWidth = 2;

	ctx.rotate(Math.PI / 4);

	ctx.beginPath();
	ctx.moveTo(0, 10);
	ctx.lineTo(0, -10);
	ctx.stroke();

	ctx.rotate(Math.PI / 2);

	ctx.beginPath();
	ctx.moveTo(0, 10);
	ctx.lineTo(0, -10);
	ctx.stroke();

	ctx.rotate(-Math.PI * 3 / 4);

	ctx.lineWidth = 4;


	ctx.translate(-x, -y);

	// radial in
	x = 0 + (rocket.velY * 60 * Math.sign(Fg.x)) / (Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2)));
	y = 0 + (rocket.velX * 60 * Math.sign(Fg.y)) / (Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2)));

	ctx.strokeStyle = "silver";

	ctx.translate(x, y);

	ctx.rotate(Math.PI / 4);

	ctx.beginPath();
	ctx.moveTo(0, 10);
	ctx.lineTo(0, 5);
	ctx.stroke();

	ctx.rotate(Math.PI / 2);

	ctx.beginPath();
	ctx.moveTo(0, 10);
	ctx.lineTo(0, 5);
	ctx.stroke();

	ctx.rotate(Math.PI / 2);

	ctx.beginPath();
	ctx.moveTo(0, 10);
	ctx.lineTo(0, 5);
	ctx.stroke();

	ctx.rotate(Math.PI / 2);

	ctx.beginPath();
	ctx.moveTo(0, 10);
	ctx.lineTo(0, 5);
	ctx.stroke();

	ctx.rotate(-Math.PI * 7 / 4);
	ctx.translate(-x, -y);

	ctx.beginPath();
	ctx.arc(x, y, 12, 0, Math.PI * 2);
	ctx.stroke();

	// radial out
	x = 0 - (rocket.velY * 60 * Math.sign(Fg.x)) / (Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2)));
	y = 0 - (rocket.velX * 60 * Math.sign(Fg.y)) / (Math.sqrt(Math.pow(rocket.velX, 2) + Math.pow(rocket.velY, 2)));

	ctx.strokeStyle = "silver";

	ctx.translate(x, y);

	ctx.rotate(Math.PI / 4);

	ctx.beginPath();
	ctx.moveTo(0, 20);
	ctx.lineTo(0, 10);
	ctx.stroke();

	ctx.rotate(Math.PI / 2);

	ctx.beginPath();
	ctx.moveTo(0, 20);
	ctx.lineTo(0, 10);
	ctx.stroke();

	ctx.rotate(Math.PI / 2);

	ctx.beginPath();
	ctx.moveTo(0, 20);
	ctx.lineTo(0, 10);
	ctx.stroke();

	ctx.rotate(Math.PI / 2);

	ctx.beginPath();
	ctx.moveTo(0, 20);
	ctx.lineTo(0, 10);
	ctx.stroke();

	ctx.rotate(-Math.PI * 7 / 4);
	ctx.translate(-x, -y);

	ctx.beginPath();
	ctx.arc(x, y, 3, 0, Math.PI * 2);
	ctx.fillStyle = "silver";
	ctx.fill();

	ctx.beginPath();
	ctx.arc(x, y, 12, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = "yellow";

	// center
	ctx.shadowBlur = 6;
	ctx.shadowColor = "black";
	ctx.beginPath();
	ctx.arc(0, 0, 3, 0, Math.PI * 2);
	ctx.fillStyle = "yellow";
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(-32, 0);
	ctx.lineTo(-15, 0);
	ctx.lineTo(0, 12);
	ctx.lineTo(15, 0);
	ctx.lineTo(32, 0);
	ctx.strokeStyle = "yellow";
	ctx.stroke();
	ctx.shadowBlur = 0;*/


	ctx.translate(-$("#canvas").width() / 2, -$("#canvas").height() / 2 -200);

}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? String(parseInt(result[1], 16)) + "," + String(parseInt(result[2], 16)) + ","
	+ String(parseInt(result[3], 16)) : null;
}

function rotPoint(cx, cy, x, y, angle) {
	return [
					(Math.cos(angle) * (x - cx)) + (Math.sin(angle) * (y - cy)) + cx,
					(Math.cos(angle) * (y - cy)) - (Math.sin(angle) * (x - cx)) + cy
				];
}

let particles = [];
const colors = ["#8B8989","#CDC9C9","#EEE9E9","#8B6969","#856363","#6F4242","#BC8F8F","#CD9B9B","#8B3A3A","#C67171","#802A2A","#CD5C5C","#CD5555","#A52A2A","#8B2323","#8E2323","#A62A2A","#CD3333","#CC3232","#EEB4B4","#BE2625","#8B1A1A","#B22222","#CD2626","#DB2929","#8C1717","#F08080","#EE6363","#EE3B3B","#EE2C2C","#330000","#660000","#800000","#8B0000","#CD0000","#EE0000","#FF0000","#FF3030","#FF3333","#FF4040","#FF6666","#FF6A6A","#FFC1C1","#FFCCCC","#FFFAFA","#A02422","#C65D57","#D44942","#F2473F","#E3170D","#9D1309","#CDB7B5","#AF4035","#ECC3BF","#FC1501","#CC1100","#EED5D2","#FA8072","#FFE4E1","#8B7D7B","#D66F62","#C75D4D","#FF2400","#8A3324","#CD4F39","#EE5C42","#FF5333","#FF6347","#B0A6A4","#8B3E2F","#8B3626","#CD5B45","#EE6A50","#FF7256","#B3432B","#D43D1A","#F5785A","#FF3300","#FF3D0D","#8B4C39","#CD7054","#C73F17","#EE8262","#FF8C69","#A78D84","#E9967A","#FF5721","#5E2612","#E04006","#8B2500","#CD3700","#EE4000","#FF4500","#FF7F50","#8B5742","#CD8162","#EE9572","#B13E0F","#691F01","#FFA07A","#5C4033","#D19275","#A0522D","#CD6839","#8A360F","#EE7942","#FF7D40","#FF8247","#8B4726","#DB9370","#87421F","#993300","#F87531","#292421","#97694F","#5E2605","#FBA16C","#FF6103","#964514","#E47833","#FF7722","#6B4226","#5C3317","#733D1A","#FF6600","#FF7216","#FF9955","#A68064","#855E42","#E9C2A6","#CD661D","#D2691E","#8B4513","#EE7621","#FF7F24","#FFF5EE","#CDC5BF","#EEE5DE","#BC7642","#603311","#E3701A","#C76114","#FA9A50","#8B8682","#EE8833","#FEE8D6","#B6AFA9","#8B7765","#CDAF95","#EECBAD","#F4A460","#FFDAB9","#8B5A2B","#B87333","#EE9A49","#AA5303","#FFA54F","#E7C6A5","#CD853F","#CD7F32","#CC7F32","#FAF0E6","#CC7722","#8B4500","#CD6600","#EE7600","#FF8000","#FF7F00","#FFCC99","#C9AF94","#362819","#B67C3D","#C77826","#E3A869","#E38217","#7B3F00","#CDB79E","#9F703A","#EBCEAC","#EBC79E","#EDC393","#E18E2E","#C76E06","#DD7500","#FF8600","#CDC0B0","#8B7355","#EED5B7","#DFAE74","#ED9121","#FF8C00","#FFE4C4","#FFEFDB","#8B7D6B","#A39480","#CDAA7D","#D2B48C","#EEDFCC","#C48E48","#DEB887","#9C661F","#EEC591","#FAEBD7","#D98719","#FCE6C9","#FF9912","#FFD39B","#8B8378","#B28647","#734A12","#8B795E","#CDB38B","#EECFA1","#DC8909","#FCD59C","#FEF0DB","#AA6600","#FFA824","#FFC469","#FFDEAD","#FFEBCD","#A67D3D","#EED6AF","#FFEFD5","#FFA812","#FFE4B5","#8B7E66","#8C7853","#CDBA96","#EED8AE","#F5DEB3","#FDF5E6","#8B5A00","#CD8500","#EE9A00","#FFA500","#FFE7BA","#D5B77A","#8E6B23","#AC7F24","#FFAA00","#FFB00F","#FFFAF0","#E8C782","#F0A804","#FCB514","#FEE5AC","#FFB90F","#9D8851","#DAA520","#8B6914","#CD9B1D","#EEB422","#8B6508","#B8860B","#CD950C","#EEAD0E","#FFC125","#E6B426","#EDCB62","#E5BC3B","#CDAB2D","#FFCC11","#E0DFDB","#FFF8DC","#C6C3B5","#CDC8B1","#EEE8CD","#CFB53B","#FCD116","#FEF1B5","#8B814C","#CDBE70","#EEDC82","#FCDC3B","#FFEC8B","#8B8878","#C5C1AA","#E3CF57","#EEDD82","#8B7500","#CDAD00","#EEC900","#FFD700","#B5A642","#FBDB0C","#E2DDB5","#F3E88E","#FFE303","#CDC9A5","#EEE9BF","#D6C537","#F0E68C","#FBEC5D","#FFE600","#FFFACD","#615E3F","#8B864E","#CDC673","#EEE8AA","#EEE685","#FFF68F","#8B8970","#BDB76B","#E0D873","#BAAF07","#FFFCCF","#CBCAB6","#EEEB8D","#7B7922","#CECC15","#3A3A38","#8B8B83","#8B8B7A","#808069","#CDCDC1","#CDCDB4","#D8D8BF","#4F4F2F","#9F9F5F","#EEEEE0","#777733","#8E8E38","#EEEED1","#F5F5DC","#EAEAAE","#DBDB70","#D9D919","#FAFAD2","#808000","#8B8B00","#CDCD00","#CCCC00","#EEEE00","#FFFF00","#FFFF7E","#FFFFAA","#FFFFCC","#FFFFE0","#FFFFF0","#F4F776","#CDD704","#98A148","#CFD784","#D1E231","#AEBB51","#D0D2C4","#A2BC13","#B3C95A","#859C27","#CDE472","#FCFFF0","#C8F526","#414F12","#668014","#AADD00","#BCE937","#54632C","#8BA446","#A2C93A","#D4ED91","#BEE554","#9CCB19","#A2C257","#E8F1D4","#698B22","#79973F","#6B8E23","#99CC32","#9ACD32","#B3EE3A","#C0FF3E","#DFFFA5","#556B2F","#6E8B3D","#A2CD5A","#BCEE68","#CAFF70","#ADFF2F","#385E0F"];
