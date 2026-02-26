let particles = [];
let font;
let sampled = false;

function preload() {
  font = loadFont('PixelifySans-Medium.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sampleText();
}

function sampleText() {
  let pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(0);
  pg.fill(255);
  pg.textFont(font);
  pg.textSize(120);
  pg.textAlign(CENTER, CENTER);
  pg.text('SEE ME', width / 2, height / 2);
  pg.loadPixels();

  let spacing = 6; 
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      let index = (x + y * width) * 4;
      let r = pg.pixels[index];
      if (r > 128) { // if pixel is bright (part of the text)
        particles.push(new Particle(x, y));
      }
    }
  }

  pg.remove();
}

function draw() {
  background(0);
  for (let p of particles) {
    p.update();
    p.draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  particles = [];
  sampleText();
}

class Particle {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = random(2, 4);
    this.scatterRadius = 120; 
    this.scatterStrength = 8; 
    this.springStrength = 0.06; 
    this.damping = 0.85;
  }

  update() {
    let mouse = createVector(mouseX, mouseY);
    let distToMouse = p5.Vector.dist(this.pos, mouse);

    if (distToMouse < this.scatterRadius) {
      let flee = p5.Vector.sub(this.pos, mouse);
      flee.normalize();
      let strength = map(distToMouse, 0, this.scatterRadius, this.scatterStrength, 0);
      flee.mult(strength);
      this.acc.add(flee);
    } else {
      let toHome = p5.Vector.sub(this.home, this.pos);
      toHome.mult(this.springStrength);
      this.acc.add(toHome);
    }

    this.vel.add(this.acc);
    this.vel.mult(this.damping);
    this.pos.add(this.vel);
    this.acc.mult(0); 
  }

  draw() {
    let distToMouse = p5.Vector.dist(this.pos, createVector(mouseX, mouseY));
    let alpha = map(distToMouse, 0, 120, 180, 255);
    fill(255, 255, 255, alpha);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}