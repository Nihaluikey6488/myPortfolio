import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// ---- Fast and smooth timings taaki stuck na lage ----
const HOLD = 0.2; 
const CLEAR = 1.6; // Jaldi clear hoga
const SLIDE_UP = 0.5; // Fast curtain slide-up

const RENDER_SCALE = 0.75;

function createSmokeSim(canvas, opts) {
  opts = opts || {};
  var pointerTarget = opts.pointerTarget || canvas;

  var gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!gl) return null;
  if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) return null;

  var CFG = {
    SIM_RES: 128,
    DYE_RES: 512,
    PRESSURE_ITER: 20,
    PRESSURE: 0.8,
    CURL: 32,
    VEL_DISSIPATION: 0.35,
    SPLAT_FORCE: 8000,
    POINTER_RADIUS: 0.005,
    POINTER_ERASE: 0.95,
    BUOYANCY_IDLE: 2.0,
    BUOYANCY_CLEAR: 14,
    ERODE: 3.5,
  };

  var state = { progress: 0, fade: 0 };
  var destroyed = false;
  var raf = 0;
  var listeners = [];
  var resources = [];

  var VERT = `#version 300 es
in vec2 aPosition;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

  var HEADER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 fragColor;
`;

  var NOISE = `
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5; mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 6; i++) { v += a * noise(p); p = r * p * 2.03 + 7.1; a *= 0.5; }
  return v;
}
`;

  var FRAG = {
    fill: NOISE + `
uniform float uAspect; uniform vec2 uSeed;
void main () {
  vec2 p = vUv * vec2(uAspect, 1.0) * 2.6 + uSeed;
  vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
  float f = fbm(p + 2.6 * q);
  float d = 0.95 + f * 1.0;
  fragColor = vec4(vec3(d), 1.0);
}`,

    splat: `
uniform sampler2D uTarget; uniform float uAspect; uniform vec3 uColor; uniform vec2 uPoint; uniform float uRadius;
void main () {
  vec2 p = vUv - uPoint; p.x *= uAspect;
  vec3 s = exp(-dot(p, p) / uRadius) * uColor;
  fragColor = vec4(texture(uTarget, vUv).xyz + s, 1.0);
}`,

    advectVel: `
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float uDissipation;
void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  vec4 result = texture(uSource, coord);
  fragColor = result / (1.0 + uDissipation * dt);
}`,

    advectDye: NOISE + `
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt;
uniform float uErode; uniform float uSweep; uniform float uTime; uniform float uAspect;
void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  float d = texture(uSource, coord).x;
  float n = noise(vUv * vec2(uAspect, 1.0) * 3.5 + vec2(0.0, uTime * 0.25));
  float m = smoothstep(uSweep + 0.22, uSweep - 0.18, vUv.y + (n - 0.5) * 0.4);
  float rate = uErode * (0.05 + 0.95 * m) * (0.5 + 0.8 * n);
  d = max(d - rate * dt, 0.0);
  fragColor = vec4(vec3(d), 1.0);
}`,

    divergence: `
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x; float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y; float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,

    curl: `
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y; float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x; float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,

    vorticity: `
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main () {
  float L = texture(uCurl, vL).x; float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x; float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C; force.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(min(max(v, -1000.0), 1000.0), 0.0, 1.0);
}`,

    pressure: `
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main () {
  float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
  float div = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`,

    clear: `
uniform sampler2D uTexture; uniform float uValue;
void main () { fragColor = uValue * texture(uTexture, vUv); }`,

    gradSub: `
uniform sampler2D uPressure; uniform sampler2D uVelocity; uniform sampler2D uDye; uniform float uBuoy; uniform float dt;
void main () {
  float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
  vec2 v = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  v.y += uBuoy * clamp(texture(uDye, vUv).x, 0.0, 1.5) * dt;
  fragColor = vec4(v, 0.0, 1.0);
}`,

    display: `
uniform sampler2D uDye; uniform vec2 texelSize; uniform float uFade;
void main () {
  float d = max(texture(uDye, vUv).x, 0.0);
  float dl = max(texture(uDye, vL).x, 0.0); float dr = max(texture(uDye, vR).x, 0.0);
  float dt2 = max(texture(uDye, vT).x, 0.0); float db = max(texture(uDye, vB).x, 0.0);

  vec2 g = vec2(dr - dl, dt2 - db);
  float shade = clamp(dot(g, vec2(-0.7, 0.7)) * 9.0, -1.0, 1.0);

  float a = smoothstep(0.0, 0.6, d);
  float body = clamp(d / 1.5, 0.0, 1.0);

  vec3 dark = vec3(0.0, 0.0, 0.0);
  vec3 lime = vec3(217.0/255.0, 249.0/255.0, 95.0/255.0);
  
  vec3 col = mix(dark, lime, pow(body, 2.0) * 0.85);
  col += shade * 0.12 * (0.5 + body);
  col = max(col, 0.0);

  a *= (1.0 - uFade);
  fragColor = vec4(col * a, a);
}`,
  };

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('Shader compile error: ' + log);
    }
    return s;
  }

  var vertShader, vao, vbo;
  var P = {};
  var velocity, dye, pressure, divergenceFBO, curlFBO;

  function makeProgram(src) {
    var fs = compile(gl.FRAGMENT_SHADER, HEADER + src);
    var p = gl.createProgram();
    gl.attachShader(p, vertShader);
    gl.attachShader(p, fs);
    gl.bindAttribLocation(p, 0, 'aPosition');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Link error: ' + gl.getProgramInfoLog(p));
    var uniforms = {};
    var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var info = gl.getActiveUniform(p, i);
      uniforms[info.name] = gl.getUniformLocation(p, info.name);
    }
    resources.push(function () { gl.deleteProgram(p); gl.deleteShader(fs); });
    return { program: p, u: uniforms };
  }

  function createFBO(w, h) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('FBO incomplete');
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    resources.push(function () { gl.deleteTexture(texture); gl.deleteFramebuffer(fbo); });
    return {
      texture: texture, fbo: fbo, width: w, height: h, tx: 1 / w, ty: 1 / h,
      attach: function (unit) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return unit;
      },
    };
  }

  function createDouble(w, h) {
    var a = createFBO(w, h), b = createFBO(w, h);
    return {
      width: w, height: h, tx: 1 / w, ty: 1 / h,
      get read() { return a; }, get write() { return b; },
      swap: function () { var t = a; a = b; b = t; },
    };
  }

  function getRes(res) {
    var aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspect < 1) aspect = 1 / aspect;
    var min = Math.round(res), max = Math.round(res * aspect);
    return gl.drawingBufferWidth > gl.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
  }

  function blit(target) {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function use(prog) { gl.useProgram(prog.program); return prog.u; }

  try {
    vertShader = compile(gl.VERTEX_SHADER, VERT);
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    resources.push(function () { gl.deleteBuffer(vbo); gl.deleteVertexArray(vao); gl.deleteShader(vertShader); });

    for (var k in FRAG) P[k] = makeProgram(FRAG[k]);

    var simRes = getRes(CFG.SIM_RES);
    var dyeRes = getRes(CFG.DYE_RES);
    velocity = createDouble(simRes.width, simRes.height);
    dye = createDouble(dyeRes.width, dyeRes.height);
    pressure = createDouble(simRes.width, simRes.height);
    divergenceFBO = createFBO(simRes.width, simRes.height);
    curlFBO = createFBO(simRes.width, simRes.height);
  } catch (e) {
    console.error(e);
    destroy();
    return null;
  }

  gl.disable(gl.BLEND);

  (function () {
    var u = use(P.fill);
    gl.uniform2f(u.texelSize, dye.tx, dye.ty);
    gl.uniform1f(u.uAspect, canvas.width / canvas.height);
    gl.uniform2f(u.uSeed, Math.random() * 50, Math.random() * 50);
    blit(dye.read);
  })();

  function aspect() { return canvas.width / canvas.height; }
  function corrR(r) { var a = aspect(); return a > 1 ? r * a : r; }

  function splat(x, y, dx, dy, radius, erase) {
    var u = use(P.splat);
    gl.uniform2f(u.texelSize, velocity.tx, velocity.ty);
    gl.uniform1i(u.uTarget, velocity.read.attach(0));
    gl.uniform1f(u.uAspect, aspect());
    gl.uniform2f(u.uPoint, x, y);
    gl.uniform3f(u.uColor, dx, dy, 0);
    gl.uniform1f(u.uRadius, corrR(radius));
    blit(velocity.write);
    velocity.swap();

    if (erase) {
      gl.uniform1i(u.uTarget, dye.read.attach(0));
      gl.uniform3f(u.uColor, -erase, -erase, -erase);
      gl.uniform1f(u.uRadius, corrR(radius * 3.2));
      blit(dye.write);
      dye.swap();
    }
  }

  function step(dt, time) {
    gl.disable(gl.BLEND);
    var u;

    u = use(P.curl);
    gl.uniform2f(u.texelSize, velocity.tx, velocity.ty);
    gl.uniform1i(u.uVelocity, velocity.read.attach(0));
    blit(curlFBO);

    u = use(P.vorticity);
    gl.uniform2f(u.texelSize, velocity.tx, velocity.ty);
    gl.uniform1i(u.uVelocity, velocity.read.attach(0));
    gl.uniform1i(u.uCurl, curlFBO.attach(1));
    gl.uniform1f(u.curl, CFG.CURL);
    gl.uniform1f(u.dt, dt);
    blit(velocity.write);
    velocity.swap();

    u = use(P.divergence);
    gl.uniform2f(u.texelSize, velocity.tx, velocity.ty);
    gl.uniform1i(u.uVelocity, velocity.read.attach(0));
    blit(divergenceFBO);

    u = use(P.clear);
    gl.uniform1i(u.uTexture, pressure.read.attach(0));
    gl.uniform1f(u.uValue, CFG.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    u = use(P.pressure);
    gl.uniform2f(u.texelSize, velocity.tx, velocity.ty);
    gl.uniform1i(u.uDivergence, divergenceFBO.attach(0));
    for (var i = 0; i < CFG.PRESSURE_ITER; i++) {
      gl.uniform1i(u.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    var prog = state.progress;
    u = use(P.gradSub);
    gl.uniform2f(u.texelSize, velocity.tx, velocity.ty);
    gl.uniform1i(u.uPressure, pressure.read.attach(0));
    gl.uniform1i(u.uVelocity, velocity.read.attach(1));
    gl.uniform1i(u.uDye, dye.read.attach(2));
    gl.uniform1f(u.uBuoy, CFG.BUOYANCY_IDLE + prog * (CFG.BUOYANCY_CLEAR - CFG.BUOYANCY_IDLE));
    gl.uniform1f(u.dt, dt);
    blit(velocity.write);
    velocity.swap();

    u = use(P.advectVel);
    gl.uniform2f(u.texelSize, velocity.tx, velocity.ty);
    gl.uniform1i(u.uVelocity, velocity.read.attach(0));
    gl.uniform1i(u.uSource, velocity.read.attach(0));
    gl.uniform1f(u.dt, dt);
    gl.uniform1f(u.uDissipation, CFG.VEL_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    u = use(P.advectDye);
    gl.uniform2f(u.texelSize, velocity.tx, velocity.ty);
    gl.uniform1i(u.uVelocity, velocity.read.attach(0));
    gl.uniform1i(u.uSource, dye.read.attach(1));
    gl.uniform1f(u.dt, dt);
    gl.uniform1f(u.uErode, prog > 0 ? CFG.ERODE : 0);
    gl.uniform1f(u.uSweep, -0.5 + prog * 1.8);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uAspect, aspect());
    blit(dye.write);
    dye.swap();
  }

  function render() {
    var u = use(P.display);
    gl.uniform2f(u.texelSize, dye.tx, dye.ty);
    gl.uniform1i(u.uDye, dye.read.attach(0));
    gl.uniform1f(u.uFade, state.fade);
    gl.clearColor(0, 0, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    blit(null);
  }

  function rnd(a, b) { return a + Math.random() * (b - a); }
  var holdTimer = 0;

  function autoSplats(dt) {
    var prog = state.progress;
    if (prog <= 0) {
      holdTimer -= dt;
      if (holdTimer <= 0) {
        holdTimer = rnd(0.15, 0.3);
        splat(Math.random(), Math.random(), rnd(-1800, 1800), rnd(-1800, 1800), 0.004, 0);
      }
    } else if (prog < 1) {
      var sweepY = -0.5 + prog * 1.8;
      for (var i = 0; i < 2; i++) {
        splat(Math.random(), Math.min(Math.max(sweepY, 0), 1), rnd(-1200, 1200), rnd(2000, 4500), 0.006, 0.6);
      }
    }
  }

  for (var s = 0; s < 10; s++) {
    splat(Math.random(), Math.random(), rnd(-2500, 2500), rnd(-2500, 2500), 0.005, 0);
  }

  var last = null;
  function onMove(e) {
    var r = pointerTarget.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width;
    var y = 1 - (e.clientY - r.top) / r.height;
    if (last) {
      var dx = x - last.x, dy = y - last.y;
      var a = aspect();
      if (a < 1) dx *= a;
      if (a > 1) dy /= a;
      var speed = Math.sqrt(dx * dx + dy * dy);
      if (speed > 0) {
        var erase = Math.min(speed * 70, 1) * CFG.POINTER_ERASE;
        splat(x, y, dx * CFG.SPLAT_FORCE, dy * CFG.SPLAT_FORCE, CFG.POINTER_RADIUS, erase);
      }
    }
    last = { x: x, y: y };
  }
  function onLeave() { last = null; }
  function listen(el, ev, fn, o) { el.addEventListener(ev, fn, o); listeners.push(function () { el.removeEventListener(ev, fn, o); }); }
  listen(pointerTarget, 'pointermove', onMove);
  listen(pointerTarget, 'pointerdown', onMove);
  listen(pointerTarget, 'pointerleave', onLeave);

  var lastT = performance.now();
  var elapsed = 0;
  function frame(now) {
    if (destroyed) return;
    var dt = Math.min((now - lastT) / 1000, 1 / 60);
    lastT = now;
    if (dt > 0) {
      elapsed += dt;
      autoSplats(dt);
      step(dt, elapsed);
    }
    render();
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    listeners.forEach(function (f) { f(); });
    resources.forEach(function (f) { try { f(); } catch (e) {} });
  }

  return { state: state, destroy: destroy };
}

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    let finished = false;
    let tl = null;
    let sim = null;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (onCompleteRef.current) onCompleteRef.current();
    };

    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    canvas.width = Math.max(2, Math.floor(window.innerWidth * RENDER_SCALE));
    canvas.height = Math.max(2, Math.floor(window.innerHeight * RENDER_SCALE));

    if (!reduceMotion) {
      sim = createSmokeSim(canvas, { pointerTarget: container });
    }

    if (sim) {
      tl = gsap.timeline();
      
      // Jaise hi smoke progress start ho, background me homepage render hota rahega
      // Aur clear hone ke sath hi container smooth fast curtain ki tarah upar slide ho jayega
      tl.to(sim.state, { progress: 1, duration: CLEAR, delay: HOLD, ease: 'power1.inOut' })
        .to(containerRef.current, {
          yPercent: -100,
          duration: SLIDE_UP,
          ease: 'power3.inOut',
          onComplete: finish,
        }, '-=0.4'); // Pehle se thoda aur overlap kiya taaki delay bilkul na ho
    } else {
      tl = gsap.timeline({ onComplete: finish });
      tl.to(container, { yPercent: -100, duration: 0.4, ease: 'power2.out' });
    }

    return () => {
      if (tl) tl.kill();
      if (sim) sim.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden select-none bg-black pointer-events-auto"
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}