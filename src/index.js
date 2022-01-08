import ImgPlatfrom from '/img/platform.png';
import ImgHills from '/img/hills.png';
import ImgBackground from '/img/background.jpeg';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const offsetWidth = 400;
const canvasWidth = innerWidth;
const canvasHeight = canvasWidth / 2;

const platformWidth = 400;
const platformHeight = 100;
const platformX = 0;
const platformY = canvasHeight - 100;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const gravity = 1;
const moveVelociy = 8;
const backgroundVelocity = 4;
const keys = {
	left: { pressed: false },
	right: { pressed: false },
	space: { pressed: false },
};

class Player {
	constructor(x, y) {
		this.position = { x: 100, y: 100 };
		this.velocity = { x: 0, y: 0 };
		this.width = 30;
		this.height = 30;
		this.scrollOffset = 0;
	}

	draw() {
		ctx.fillStyle = '#f00';
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		this.draw();

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y <= canvasHeight) this.velocity.y += gravity;
		else this.velocity.y = 0;

		if (keys.left.pressed && keys.right.pressed) this.velocity.x = 0;
		else if (keys.left.pressed && this.position.x > offsetWidth) this.velocity.x = -moveVelociy;
		else if (keys.right.pressed && this.position.x < canvasWidth - offsetWidth) this.velocity.x = moveVelociy;
		else {
			this.velocity.x = 0;

			if (keys.left.pressed) {
				this.scrollOffset -= moveVelociy;
				platforms.map((platform) => (platform.position.x += moveVelociy));
				genericObjects.map((genericObject) => (genericObject.position.x += backgroundVelocity));
			}
			if (keys.right.pressed) {
				this.scrollOffset += moveVelociy;
				platforms.map((platform) => (platform.position.x -= moveVelociy));
				genericObjects.map((genericObject) => (genericObject.position.x -= backgroundVelocity));
			}
		}
	}
}

class Platform {
	constructor(x, y, image) {
		this.position = { x, y };
		this.image = image;
		this.width = platformWidth;
		this.height = platformHeight;
	}

	draw() {
		ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}
}

class GenericObject {
	constructor(x, y, width, height, image) {
		this.position = { x, y };
		this.image = image;
		this.width = width;
		this.height = height;
	}

	draw() {
		ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}
}

function createImage(src) {
	const image = new Image();
	image.src = src;
	return image;
}

const platformImage = createImage(ImgPlatfrom);
const hillsImage = createImage(ImgHills);
const backgroundImage = createImage(ImgBackground);

const player = new Player();
const platforms = [
	new Platform(platformX - 1, platformY, platformImage),
	new Platform(platformX + platformWidth - 3, platformY, platformImage),
];
const genericObjects = [
	new GenericObject(0, 0, canvasWidth, canvasHeight, backgroundImage),
	new GenericObject(0, canvasHeight - 190, canvasWidth, 100, hillsImage),
];

function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	genericObjects.map((genericObject) => genericObject.draw());
	platforms.map((platform) => platform.draw());
	player.update();

	//rectangle collision
	platforms.map((platform) => {
		if (
			player.velocity.y >= 0 &&
			player.position.x + player.width >= platform.position.x &&
			player.position.x <= platform.position.x + platform.width &&
			player.position.y + player.height >= platform.position.y &&
			player.position.y <= platform.position.y + platform.height
		) {
			player.velocity.y = 0;
			player.position.y = platform.position.y - player.height;
		}
	});
}

animate();

addEventListener('keydown', ({ code }) => {
	if (code === 'KeyA') keys.left.pressed = true;
	else if (code === 'KeyD') keys.right.pressed = true;
	else if (code === 'Space' && player.velocity.y === 0) player.velocity.y = -20;
});

addEventListener('keyup', ({ code }) => {
	if (code === 'KeyA') keys.left.pressed = false;
	else if (code === 'KeyD') keys.right.pressed = false;
	else if (code === 'Space') keys.space.pressed = false;
});
