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

  var NODE_COUNT   = 55;
  var LINK_DIST    = 150;
  var LINK_DIST_SQ = LINK_DIST * LINK_DIST;
  var FRAME_MS     = 1000 / 30; // cap at 30fps — halves GPU/CPU load vs 60fps
  var STROKE_COLOR = '#41BFE7';

  // 3 opacity buckets — 3 batched draw calls instead of one per edge
  var BUCKETS = [
    { maxSq: 0.11 * LINK_DIST_SQ, alpha: 0.22 },  // d  0–33%
    { maxSq: 0.44 * LINK_DIST_SQ, alpha: 0.13 },  // d 33–66%
    { maxSq: 1.00 * LINK_DIST_SQ, alpha: 0.05 }   // d 66–100%
  ];

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

  var angle    = 0;
  var lastTime = 0;

  function draw(now) {
    requestAnimationFrame(draw);

    if (document.hidden) return; // pause when tab not visible
    var elapsed = now - lastTime;
    if (elapsed < FRAME_MS) return; // 30fps cap
    lastTime = now - (elapsed % FRAME_MS);

    var dt = elapsed / 16.667; // normalize speed to 60fps base

    ctx.clearRect(0, 0, W, H);
    angle += 0.0008 * dt;

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(angle);
    ctx.translate(-W / 2, -H / 2);

    // Move nodes
    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      if (n.x < -60) n.x = W + 60;
      else if (n.x > W + 60) n.x = -60;
      if (n.y < -60) n.y = H + 60;
      else if (n.y > H + 60) n.y = -60;
    }

    // Draw edges batched into 3 opacity buckets (3 stroke calls total)
    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth   = 1;
    for (var bi = 0; bi < BUCKETS.length; bi++) {
      var minSq = bi > 0 ? BUCKETS[bi - 1].maxSq : 0;
      var maxSq = BUCKETS[bi].maxSq;
      ctx.globalAlpha = BUCKETS[bi].alpha;
      ctx.beginPath();
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx  = nodes[a].x - nodes[b].x;
          var dy  = nodes[a].y - nodes[b].y;
          var dsq = dx * dx + dy * dy;
          if (dsq >= minSq && dsq < maxSq) {
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
          }
        }
      }
      ctx.stroke();
    }

    // Draw all nodes in a single batched path + fill
    ctx.globalAlpha = 0.6;
    ctx.fillStyle   = STROKE_COLOR;
    ctx.beginPath();
    for (var m = 0; m < nodes.length; m++) {
      ctx.moveTo(nodes[m].x + nodes[m].r, nodes[m].y);
      ctx.arc(nodes[m].x, nodes[m].y, nodes[m].r, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(draw);
})();

