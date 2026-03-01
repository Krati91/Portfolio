(function () {
  var canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var COLOR = '65,191,231';
  var NODE_COUNT = 90;
  var LINK_DIST  = 150;

  var nodes = [];
  for (var i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.0 + 0.5,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38
    });
  }

  var angle = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    angle += 0.0008;

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(angle);
    ctx.translate(-W / 2, -H / 2);

    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -60) n.x = W + 60;
      else if (n.x > W + 60) n.x = -60;
      if (n.y < -60) n.y = H + 60;
      else if (n.y > H + 60) n.y = -60;
    }

    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var dx = nodes[a].x - nodes[b].x;
        var dy = nodes[a].y - nodes[b].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.strokeStyle = 'rgba(' + COLOR + ',' + ((1 - d / LINK_DIST) * 0.28) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    for (var m = 0; m < nodes.length; m++) {
      ctx.beginPath();
      ctx.arc(nodes[m].x, nodes[m].y, nodes[m].r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + COLOR + ',0.6)';
      ctx.fill();
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  draw();
})();
