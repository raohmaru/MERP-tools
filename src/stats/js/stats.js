import Ease from '../../js/libs/paprika/easing/index.js'

// https://javascript.info/bezier-curve
function bezier3(t, x1, x2, x3) {
    return ((1 - t) ** 2) * x1 + 2 * (1 - t) * t * x2 + t ** 2 * x3;
}
const easing = {
    bezier(t) {
        const x = bezier3(t, ...points.x);
        return bezier3(x, ...points.y);
    },
};
const $ = (id) => document.getElementById(id);

const canvas = $('stage');
const ctx = stage.getContext('2d');
const offset = 20;
const len = 20;
const scaleX = canvas.width - offset * 2;
const scaleY = 300;
const points = {
    x: [0, 0.56, 1],
    y: [0, 0.999, 1]
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.x[1] = parseFloat($('bx').value);
    points.y[1] = parseFloat($('by').value);

    // Draw X Y axis
    ctx.strokeStyle = '#99f';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - offset);
    ctx.lineTo(canvas.width, canvas.height - offset);
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset, canvas.height);
    ctx.stroke();

    let easingFunc;
    const ease = $('easing').value.split('.');
    if (Ease[ease[0]]) {
        easingFunc = Ease[ease[0]][ease[1]];
    } else {
        easingFunc = easing[ease[0]];
    }

    const min = parseInt($('min').value);
    const max = parseInt($('max').value);
    let x, y, px, py, v, m;

    ctx.save();
    ctx.translate(offset, canvas.height - offset);
    ctx.textAlign = 'center';
    for (let i = 0; i <= len; i++) {
        // Draw lines of the curve
        ctx.strokeStyle = '#fff';
        ctx.fillStyle  = '#fff';
        ctx.beginPath();
        ctx.moveTo(px, py);
        x = (i + 0) / len;
        y = easingFunc(x) * scaleY;
        x *= scaleX;
        ctx.lineTo(x, -y);
        ctx.stroke();
        px = x;
        py = -y;

        // Draws a line between value and X-axis
        m = i === 1 || i % 5 === 0;
        ctx.strokeStyle = m ? '#f00' : '#900';
        ctx.beginPath();
        ctx.moveTo(x, -y);
        ctx.lineTo(x, 0);
        ctx.stroke();

        if (i > 0) {
            // Draws a dot at each step
            ctx.beginPath();
            ctx.ellipse(x, -y, m ? 3 : 2, m ? 3 : 2, 0, 0, Math.PI * 2);
            ctx.fill();
    
            // Draws the value of each step
            if (m) {
                ctx.fillStyle = '#ff0';
            }
            v = easingFunc(i / len) * (max - min) + min;
            ctx.fillText(v.toFixed(), x, -y - 10);
            
            // Draws the step
            ctx.fillStyle  = '#d00';
            ctx.fillText(i + 0, x, 15);
        }

        // Draw bezier points
        if (i === 0 && easingFunc.name === 'bezier') {
            ctx.strokeStyle = '#0a0';
            ctx.beginPath();
            ctx.moveTo(px, py);
            for (let i = 1; i < points.x.length; i++) {
                let x = points.x[i];
                if (i < points.x.length - 1) {
                    x = 0.5 + (0.5 - x);
                }
                ctx.lineTo(x * scaleX, -points.y[i] * scaleY);
            }
            ctx.stroke();
        }
    }

    ctx.restore();
}

$('options').addEventListener('change', draw);
$('options').addEventListener('input', draw);
$('copy').addEventListener('click', e => {
    const v = ['min', 'max', 'bx', 'by'].map(id => Number($(id).value));
    navigator.clipboard.writeText(v.join(', '));
});

draw();