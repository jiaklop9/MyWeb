// 一个可选的布尔值，表示事件监听器是在捕获阶段（true）还是冒泡阶段（false）执行。
// 这里设置为 false，表示在冒泡阶段执行。
window.addEventListener("resize", resizeCanvas, false);
window.addEventListener("DOMContentLoaded", onLoad, false);
// 这是浏览器提供的用于执行动画的方法。通常，使用这个方法来调度在下一次浏览器重绘之前更新动画的帧
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
var canvas, ctx, w, h, particles = [], probability = 0.04,
    xPoint, yPoint;
function onLoad() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.requestAnimationFrame(updateWorld);
}

function resizeCanvas() {
    //  使用条件语句检查是否存在名为 canvas 的变量。!! 是一个将值转换为布尔类型的惯用方法。
    // 如果 canvas 存在且不为 null 或 undefined，则执行接下来的代码块
    if (!!canvas) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
}

function updateWorld() {
    update();
    paint();
    window.requestAnimationFrame(updateWorld);
}

function update() {
    if (particles.length < 500 && Math.random() < probability) {
        createFirework();
    }
    var alive = [];
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].move()) {
            alive.push(particles[i]);
        }
    }
    particles = alive;
}

function paint() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
    }
}

function createFirework() {
    xPoint = Math.random() * (w - 200) + 100;
    yPoint = Math.random() * (h - 200) + 100;
    var nFire = Math.random() * 50 + 100;
    var c = "rgb(" + (~~(Math.random() * 200 + 55)) + ","
        + (~~(Math.random() * 200 + 55)) + "," + (~~(Math.random() * 200 + 55)) + ")";
    for (var i = 0; i < nFire; i++) {
        var particle = new Particle();
        particle.color = c;
        var vy = Math.sqrt(25 - particle.vx * particle.vx);
        if (Math.abs(particle.vy) > vy) {
            particle.vy = particle.vy > 0 ? vy : -vy;
        }
        particles.push(particle);
    }
}

function Particle() {
    this.w = this.h = Math.random() * 4 + 1;
    this.x = xPoint - this.w / 2;
    this.y = yPoint - this.h / 2;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.alpha = Math.random() * .5 + .5;
    this.color;
}

Particle.prototype = {
    gravity: 0.05,
    move: function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.alpha -= 0.01;
        if (this.x <= -this.w || this.x >= screen.width ||
            this.y >= screen.height ||
            this.alpha <= 0) {
            return false;
        }
        return true;
    },
    draw: function (c) {
        c.save();
        c.beginPath();
        c.translate(this.x + this.w / 2, this.y + this.h / 2);
        c.arc(0, 0, this.w, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;
        c.closePath();
        c.fill();
        c.restore();
    }
} 
