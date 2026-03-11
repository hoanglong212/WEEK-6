import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const API_BASE =
  typeof window !== "undefined" && window.location.protocol === "https:"
    ? "https://week-6-qer0.onrender.com"
    : "http://127.0.0.1:8000";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES — merged both apps
═══════════════════════════════════════════════════════════════ */
const GlobalStyles = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=JetBrains+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
    const s = document.createElement("style");
    s.textContent = `
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      html { scroll-behavior:smooth; }
      body { background:#020812; color:#C8DCEE; font-family:'Syne',sans-serif; overflow-x:hidden; cursor:none; }
      ::-webkit-scrollbar { width:3px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:linear-gradient(to bottom,#00E5FF44,#7C3AED44); border-radius:99px; }
      #cursor-dot { position:fixed;width:8px;height:8px;border-radius:50%;background:#00E5FF;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);box-shadow:0 0 12px #00E5FF,0 0 24px #00E5FF88;transition:width .15s,height .15s; }
      body:has(button:hover) #cursor-dot { width:12px;height:12px;background:#00FFA3; }
      .f-orb { font-family:'Orbitron',monospace; }
      .f-mono { font-family:'JetBrains Mono',monospace; }
      .f-syne { font-family:'Syne',sans-serif; }
      @keyframes aurora { 0%,100%{transform:translate(0,0) rotate(0deg) scale(1)} 25%{transform:translate(3%,2%) rotate(2deg) scale(1.03)} 50%{transform:translate(-2%,4%) rotate(-1deg) scale(0.97)} 75%{transform:translate(4%,-2%) rotate(3deg) scale(1.02)} }
      @keyframes aurora2 { 0%,100%{transform:translate(0,0) rotate(0deg) scale(1)} 33%{transform:translate(-4%,3%) rotate(-2deg) scale(1.04)} 66%{transform:translate(3%,-3%) rotate(2deg) scale(0.98)} }
      @keyframes spin { to{transform:rotate(360deg)} }
      @keyframes cspin { to{transform:rotate(-360deg)} }
      @keyframes float-y { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
      @keyframes float-y2 { 0%,100%{transform:translateY(-18px)} 50%{transform:translateY(0)} }
      @keyframes pulse-ring { 0%{transform:scale(.95);opacity:.9} 50%{transform:scale(1.05);opacity:.4} 100%{transform:scale(.95);opacity:.9} }
      @keyframes scan-v { 0%{top:-4px;opacity:0} 5%{opacity:.8} 95%{opacity:.8} 100%{top:100%;opacity:0} }
      @keyframes scan-h { 0%{transform:translateX(-100%)} 100%{transform:translateX(100vw)} }
      @keyframes blink { 50%{opacity:0} }
      @keyframes hue-shift { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
      @keyframes data-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      @keyframes border-glow { 0%,100%{box-shadow:0 0 15px rgba(0,229,255,.2),inset 0 0 15px rgba(0,229,255,.03)} 50%{box-shadow:0 0 40px rgba(0,229,255,.35),inset 0 0 25px rgba(0,229,255,.07)} }
      @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes pulse-glow { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.8;transform:scale(1.06)} }
      .anim-aurora1 { animation:aurora 18s ease-in-out infinite; }
      .anim-aurora2 { animation:aurora2 22s ease-in-out infinite; }
      .anim-float { animation:float-y 5s ease-in-out infinite; }
      .anim-float2 { animation:float-y2 5s ease-in-out infinite; }
      
      .glass-card { background:linear-gradient(135deg,rgba(8,20,40,.85) 0%,rgba(4,10,22,.9) 100%);border:1px solid rgba(0,229,255,.1);border-radius:16px;position:relative;overflow:hidden; }
      .glass-card::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,229,255,.04) 0%,transparent 50%,rgba(124,58,237,.03) 100%);pointer-events:none; }
      .glass-card-glow { border-color:rgba(0,229,255,.28) !important;box-shadow:0 0 50px rgba(0,229,255,.1),0 0 100px rgba(0,229,255,.04) !important; }
      .grad-border { position:relative;border-radius:16px; }
      .grad-border::after { content:'';position:absolute;inset:-1px;border-radius:17px;background:linear-gradient(135deg,rgba(0,229,255,.5),rgba(124,58,237,.3),rgba(0,255,163,.4));z-index:-1;opacity:0;transition:opacity .3s; }
      .grad-border:hover::after { opacity:1; }
      .cyber-input { width:100%;background:rgba(0,0,0,.5);border:1px solid rgba(0,229,255,.12);border-radius:10px;color:#C8DCEE;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:border-color .25s,box-shadow .25s,background .25s; }
      .cyber-input:focus { border-color:rgba(0,229,255,.45);background:rgba(0,229,255,.03);box-shadow:0 0 0 3px rgba(0,229,255,.05),0 0 25px rgba(0,229,255,.08); }
      .cyber-input::placeholder { color:rgba(100,140,170,.35); }
      .threat-tag { display:inline-flex;align-items:center;gap:7px;padding:5px 13px;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.8px;cursor:default;transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden; }
      .threat-tag:hover { transform:translateY(-2px) scale(1.04); }
      .ticker-content { display:inline-block; animation:data-scroll 22s linear infinite; }
      .shimmer-text { background:linear-gradient(90deg,#00FF41,#00E5FF,#00FFA3,#00FF41);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite; }
      .glass-lp { background:rgba(0,255,65,.03);border:1px solid rgba(0,255,65,.12); }
      .fade-in { animation:fadeUp .6s ease both; }
      @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      nav a { text-decoration:none; }
    `;
    document.head.appendChild(s);
    const dot = document.createElement("div");
    dot.id = "cursor-dot";
    document.body.appendChild(dot);
    const moveCursor = (e) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", moveCursor);
    return () => {
      try {
        document.head.removeChild(link);
        document.head.removeChild(s);
      } catch (e) {}
      try {
        document.body.removeChild(dot);
      } catch (e) {}
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);
  return null;
};

const AuroraBlobs = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}
  >
    <div
      className="anim-aurora1"
      style={{
        position: "absolute",
        width: "80vw",
        height: "80vh",
        top: "-20vh",
        left: "-10vw",
        background:
          "radial-gradient(ellipse at center,rgba(0,229,255,.04) 0%,transparent 65%)",
      }}
    />
    <div
      className="anim-aurora2"
      style={{
        position: "absolute",
        width: "70vw",
        height: "70vh",
        bottom: "-20vh",
        right: "-10vw",
        background:
          "radial-gradient(ellipse at center,rgba(124,58,237,.04) 0%,transparent 65%)",
      }}
    />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   THREAT RADAR — smooth sweep-arm + delta-time + offscreen canvas
═══════════════════════════════════════════════════════════════ */
const ThreatRadar = ({ mx, my }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const ppx = useTransform(
    mx,
    [0, typeof window !== "undefined" ? window.innerWidth : 1200],
    [-8, 8],
  );
  const ppy = useTransform(
    my,
    [0, typeof window !== "undefined" ? window.innerHeight : 800],
    [-5, 5],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const S = 580,
      DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = S * DPR;
    canvas.height = S * DPR;
    canvas.style.width = S + "px";
    canvas.style.height = S + "px";
    ctx.scale(DPR, DPR);

    const CX = S / 2,
      CY = S / 2,
      PAD = 32,
      R = S / 2 - PAD - 10;
    const TAU = Math.PI * 2;
    const GD = (a) => `rgba(0,255,65,${a})`;
    const RD = (a) => `rgba(255,80,80,${a})`;
    const CD = (a) => `rgba(0,229,255,${a})`;
    const RPM = 1 / 7; // one rotation per 7s — slow, cinematic
    const WORLD_SPEED = 16; // px per second downward drift
    let worldY = 0;

    // Threats use cartesian world coords (wx, wy); worldY scrolls them downward
    const THREATS = [
      { label: "PHISH-URL", locked: true, wx: -120, wy: -80 },
      { label: "SPOOF-DOM", locked: true, wx: 130, wy: -200 },
      { label: "MAL-ATTACH", locked: true, wx: -60, wy: 120 },
      { label: "TRACK-PXL", locked: false, wx: 175, wy: 55 },
      { label: "HTML-INJ", locked: false, wx: -185, wy: 250 },
      { label: "OBFUS-URL", locked: true, wx: 55, wy: -260 },
      { label: "BEC-SIGNAL", locked: false, wx: 195, wy: -140 },
      { label: "URGENCY", locked: false, wx: -25, wy: 320 },
      { label: "C2-BEACON", locked: true, wx: 75, wy: 230 },
      { label: "EXFIL", locked: false, wx: -145, wy: -340 },
      { label: "RANSOM-C2", locked: true, wx: 90, wy: 400 },
      { label: "DNS-SPOOF", locked: true, wx: -200, wy: -160 },
      { label: "MACRO-INJ", locked: false, wx: 160, wy: -320 },
      { label: "CRED-HARV", locked: true, wx: -100, wy: 180 },
    ].map((t) => ({ ...t, echo: 0, pulseR: 0 }));

    // ── Pre-render static layer (inner radar + decorative bezel) ─────
    const bg = document.createElement("canvas");
    bg.width = S * DPR;
    bg.height = S * DPR;
    const bx = bg.getContext("2d");
    bx.scale(DPR, DPR);

    // ① Inner circle background + grid + rings
    bx.save();
    bx.beginPath();
    bx.arc(CX, CY, R, 0, TAU);
    bx.clip();
    bx.fillStyle = "rgba(0,12,3,1)";
    bx.fillRect(0, 0, S, S);
    // radial gradient overlay for depth
    const rg = bx.createRadialGradient(CX, CY, 0, CX, CY, R);
    rg.addColorStop(0, "rgba(0,40,8,0.6)");
    rg.addColorStop(0.6, "rgba(0,18,4,0.2)");
    rg.addColorStop(1, "rgba(0,0,0,0.5)");
    bx.fillStyle = rg;
    bx.fillRect(0, 0, S, S);
    // faint grid
    bx.strokeStyle = "rgba(0,180,50,0.04)";
    bx.lineWidth = 0.5;
    const GS = 34;
    for (let x = 0; x < S; x += GS) {
      bx.beginPath();
      bx.moveTo(x, 0);
      bx.lineTo(x, S);
      bx.stroke();
    }
    for (let y = 0; y < S; y += GS) {
      bx.beginPath();
      bx.moveTo(0, y);
      bx.lineTo(S, y);
      bx.stroke();
    }
    // 4 range rings
    for (let i = 1; i <= 4; i++) {
      const rr = (R / 4) * i;
      bx.beginPath();
      bx.arc(CX, CY, rr, 0, TAU);
      if (i === 4) {
        bx.strokeStyle = GD(0.32);
        bx.lineWidth = 1.0;
      } else {
        bx.strokeStyle = GD(0.07);
        bx.lineWidth = 0.5;
      }
      bx.stroke();
      // range label
      if (i < 4) {
        bx.font = "7px 'JetBrains Mono',monospace";
        bx.fillStyle = GD(0.2);
        bx.textAlign = "left";
        bx.fillText(`${i * 25}%`, CX + rr + 3, CY - 2);
      }
    }
    // crosshair axes
    bx.strokeStyle = GD(0.1);
    bx.lineWidth = 0.5;
    [
      [CX - R, CY, CX + R, CY],
      [CX, CY - R, CX, CY + R],
    ].forEach(([x1, y1, x2, y2]) => {
      bx.beginPath();
      bx.moveTo(x1, y1);
      bx.lineTo(x2, y2);
      bx.stroke();
    });
    // 45° diagonal marks
    bx.strokeStyle = GD(0.05);
    bx.lineWidth = 0.4;
    [Math.PI / 4, (3 * Math.PI) / 4].forEach((a) => {
      bx.beginPath();
      bx.moveTo(CX - Math.cos(a) * R, CY - Math.sin(a) * R);
      bx.lineTo(CX + Math.cos(a) * R, CY + Math.sin(a) * R);
      bx.stroke();
    });
    bx.restore();

    // ② Outer bezel rings (3 concentric)
    bx.beginPath();
    bx.arc(CX, CY, R + 2, 0, TAU);
    bx.strokeStyle = GD(0.5);
    bx.lineWidth = 2;
    bx.stroke();
    bx.beginPath();
    bx.arc(CX, CY, R + 9, 0, TAU);
    bx.strokeStyle = GD(0.18);
    bx.lineWidth = 6;
    bx.stroke();
    bx.beginPath();
    bx.arc(CX, CY, R + 12, 0, TAU);
    bx.strokeStyle = GD(0.55);
    bx.lineWidth = 1.2;
    bx.stroke();
    bx.beginPath();
    bx.arc(CX, CY, R + 22, 0, TAU);
    bx.strokeStyle = GD(0.08);
    bx.lineWidth = 0.5;
    bx.stroke();

    // ③ 36 ticks on bezel
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * TAU,
        maj = i % 9 === 0,
        med = i % 3 === 0;
      const r1 = R + 12,
        r2 = R + (maj ? 22 : med ? 18 : 15);
      bx.beginPath();
      bx.moveTo(CX + Math.cos(a) * r1, CY + Math.sin(a) * r1);
      bx.lineTo(CX + Math.cos(a) * r2, CY + Math.sin(a) * r2);
      bx.strokeStyle = GD(maj ? 0.75 : med ? 0.35 : 0.15);
      bx.lineWidth = maj ? 1.4 : med ? 0.7 : 0.4;
      bx.stroke();
      if (maj) {
        const deg = i * 10;
        bx.font = "bold 8px 'JetBrains Mono',monospace";
        bx.textAlign = "center";
        bx.fillStyle = GD(0.45);
        bx.fillText(
          String(deg).padStart(3, "0"),
          CX + Math.cos(a) * (R + 28),
          CY + Math.sin(a) * (R + 28) + 3,
        );
      }
    }

    // ④ Arc text — top: "◆ SENTINEL THREAT RADAR ◆", bottom: "◇ EMAIL ANALYZER v2.0 ◇"
    const drawArcText = (text, arcR, startA, dir, style, size) => {
      bx.font = `${style} ${size}px 'JetBrains Mono',monospace`;
      bx.textAlign = "center";
      bx.textBaseline = "middle";
      const total = text.length;
      const step = (dir === "top" ? -1 : 1) * 0.072;
      const offset = (step * (total - 1)) / 2;
      for (let i = 0; i < total; i++) {
        const charA =
          startA + (i - (total - 1) / 2) * step * (dir === "top" ? -1 : 1);
        bx.save();
        bx.translate(CX + Math.cos(charA) * arcR, CY + Math.sin(charA) * arcR);
        bx.rotate(charA + (dir === "top" ? -Math.PI / 2 : Math.PI / 2));
        bx.fillText(text[i], 0, 0);
        bx.restore();
      }
      bx.textBaseline = "alphabetic";
    };
    bx.fillStyle = GD(0.4);
    drawArcText(
      "◆  ACTIVE THREAT DETECTION SYSTEM  ◆",
      R + 36,
      -Math.PI / 2,
      "top",
      "bold",
      7,
    );
    bx.fillStyle = GD(0.25);
    drawArcText(
      "◇  SENTINEL  AI  RADAR  v2.0  ◇",
      R + 36,
      Math.PI / 2,
      "bottom",
      "",
      7,
    );

    // ⑤ Side data panels (static decorative)
    const panH = 110,
      panW = 42,
      panY = CY - panH / 2;
    const LP = PAD * 0.3;
    // Left panel bg
    bx.fillStyle = "rgba(0,255,65,0.025)";
    bx.fillRect(LP, panY, panW, panH);
    bx.strokeStyle = GD(0.18);
    bx.lineWidth = 0.7;
    bx.strokeRect(LP, panY, panW, panH);
    // Left panel: signal strength bars
    bx.font = "7px 'JetBrains Mono',monospace";
    bx.textAlign = "left";
    bx.fillStyle = GD(0.4);
    bx.fillText("SIG", LP + 4, panY + 11);
    for (let b = 0; b < 5; b++) {
      const bh = 5 + b * 5,
        active = b < 4;
      bx.fillStyle = active ? GD(0.65) : GD(0.1);
      bx.fillRect(LP + 4 + b * 7, panY + 24, 4, bh);
    }
    bx.fillStyle = GD(0.4);
    bx.fillText("LAT", LP + 4, panY + 58);
    bx.fillStyle = GD(0.7);
    bx.fillText("10.8234", LP + 4, panY + 68);
    bx.fillStyle = GD(0.4);
    bx.fillText("LON", LP + 4, panY + 80);
    bx.fillStyle = GD(0.7);
    bx.fillText("106.629", LP + 4, panY + 90);
    bx.fillStyle = GD(0.4);
    bx.fillText("ALT", LP + 4, panY + 102);
    bx.fillStyle = GD(0.7);
    bx.fillText("0142m", LP + 4, panY + 112);
    // Right panel
    const RP = S - LP - panW;
    bx.fillStyle = "rgba(0,255,65,0.025)";
    bx.fillRect(RP, panY, panW, panH);
    bx.strokeStyle = GD(0.18);
    bx.lineWidth = 0.7;
    bx.strokeRect(RP, panY, panW, panH);
    bx.font = "7px 'JetBrains Mono',monospace";
    bx.textAlign = "left";
    bx.fillStyle = GD(0.4);
    bx.fillText("THRT", RP + 3, panY + 11);
    bx.font = "bold 15px 'JetBrains Mono',monospace";
    bx.fillStyle = RD(0.85);
    bx.fillText("05", RP + 5, panY + 28);
    bx.font = "7px 'JetBrains Mono',monospace";
    bx.fillStyle = GD(0.35);
    bx.fillText("LOCK", RP + 3, panY + 38);
    bx.fillStyle = GD(0.4);
    bx.fillText("FREQ", RP + 3, panY + 54);
    bx.fillStyle = GD(0.75);
    bx.fillText("0.55G", RP + 3, panY + 64);
    bx.fillStyle = GD(0.4);
    bx.fillText("MODE", RP + 3, panY + 78);
    bx.fillStyle = GD(0.75);
    bx.fillText("SCAN", RP + 3, panY + 88);
    bx.fillStyle = GD(0.4);
    bx.fillText("SENS", RP + 3, panY + 102);
    bx.fillStyle = GD(0.75);
    bx.fillText("AUTO", RP + 3, panY + 112);

    // ⑥ Outer frame + corner brackets
    bx.strokeStyle = "rgba(0,180,50,0.3)";
    bx.lineWidth = 1.2;
    bx.strokeRect(1, 1, S - 2, S - 2);
    bx.strokeStyle = "rgba(0,180,50,0.07)";
    bx.lineWidth = 0.5;
    bx.strokeRect(PAD * 0.4, PAD * 0.4, S - PAD * 0.8, S - PAD * 0.8);
    bx.strokeStyle = GD(0.55);
    bx.lineWidth = 1.8;
    [
      [8, 8, 1, 1],
      [S - 8, 8, -1, 1],
      [S - 8, S - 8, -1, -1],
      [8, S - 8, 1, -1],
    ].forEach(([px, py, sx, sy]) => {
      bx.beginPath();
      bx.moveTo(px, py + sy * 18);
      bx.lineTo(px, py);
      bx.lineTo(px + sx * 18, py);
      bx.stroke();
      bx.beginPath();
      bx.arc(px, py, 2, 0, TAU);
      bx.fillStyle = GD(0.8);
      bx.fill();
    });
    // ⑦ Top-left and top-right HUD labels (static)
    bx.font = "bold 8px 'JetBrains Mono',monospace";
    bx.fillStyle = GD(0.5);
    bx.textAlign = "left";
    bx.fillText("SENTINEL:", 14, 20);
    bx.font = "7px 'JetBrains Mono',monospace";
    bx.fillStyle = CD(0.4);
    bx.textAlign = "right";
    bx.fillText("SYSTEM ACTIVE", S - 14, 20);

    // ── Animation state ────────────────────────────────────────
    let sweepAngle = -Math.PI / 2;
    let lastTime = null;
    let blinkT = 0;
    let scanProgressT = 0;

    const draw = (ts) => {
      if (!lastTime) lastTime = ts;
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;
      sweepAngle = (sweepAngle + dt * TAU * RPM) % TAU;
      blinkT += dt;
      scanProgressT = (scanProgressT + dt * 0.9) % 1;

      // Scroll world downward
      worldY += WORLD_SPEED * dt;
      // Wrap threats: when a threat scrolls too far below centre, re-enter from top
      THREATS.forEach((t) => {
        // screen position from world coords
        t.sx = CX + t.wx;
        t.sy = CY + (t.wy + worldY);
        // Wrap: when threat drifts below radar, re-enter from top
        if (t.sy > CY + R * 1.4) {
          t.wy -= R * 2.8;
          t.sy = CY + (t.wy + worldY);
        }
      });

      // Detect threat hits by current screen position angle from centre
      THREATS.forEach((t) => {
        t.echo = Math.max(0, t.echo - dt * 0.22);
        // Compute current polar angle of this threat from centre
        const dx = t.sx - CX,
          dy = t.sy - CY;
        const dist = Math.hypot(dx, dy);
        if (dist > R || dist < 4) return; // outside radar or at centre
        const ta = ((Math.atan2(dy, dx) % TAU) + TAU) % TAU;
        let sw = ((sweepAngle % TAU) + TAU) % TAU;
        let prev = (((sweepAngle - dt * TAU * RPM) % TAU) + TAU) % TAU;
        const crossed =
          prev < sw ? ta >= prev && ta <= sw : ta >= prev || ta <= sw;
        if (crossed) {
          t.echo = 1.0;
          t.pulseR = 0;
        }
        if (t.echo > 0) t.pulseR = Math.min(t.pulseR + dt * 60, 50);
      });

      // ── Draw ──────────────────────────────────────────────
      ctx.clearRect(0, 0, S, S);
      ctx.drawImage(bg, 0, 0, S * DPR, S * DPR, 0, 0, S, S);

      // ── Inside circle clip ──────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, TAU);
      ctx.clip();

      // Sweep glow fan (28 slices, quadratic fade)
      const FAN = Math.PI * 0.7;
      for (let i = 0; i < 28; i++) {
        const frac = (i + 1) / 28,
          frac2 = frac * frac;
        const a0 = sweepAngle - FAN * (1 - frac),
          a1 = sweepAngle - FAN * (1 - (i + 2) / 28);
        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.arc(CX, CY, R, a0, a1);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,255,65,${frac2 * 0.07})`;
        ctx.fill();
      }
      // Sweep arm — bright edge with a soft halo line
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(CX + Math.cos(sweepAngle) * R, CY + Math.sin(sweepAngle) * R);
      ctx.strokeStyle = "rgba(80,255,120,0.95)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(CX + Math.cos(sweepAngle) * R, CY + Math.sin(sweepAngle) * R);
      ctx.strokeStyle = "rgba(0,255,65,0.2)";
      ctx.lineWidth = 7;
      ctx.stroke();

      // Threat blips
      THREATS.forEach((t) => {
        if (t.echo <= 0.01 || !t.sx) return;
        const a = t.echo,
          col = t.locked ? "255,80,80" : "0,255,65";
        // Expanding pulse ring
        if (t.pulseR > 0 && t.pulseR < 48) {
          ctx.beginPath();
          ctx.arc(t.sx, t.sy, t.pulseR, 0, TAU);
          ctx.strokeStyle = `rgba(${col},${a * (1 - t.pulseR / 50) * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        // Two echo rings
        [12, 22].forEach((rr, ri) => {
          ctx.beginPath();
          ctx.arc(t.sx, t.sy, rr, 0, TAU);
          ctx.strokeStyle = `rgba(${col},${a * (0.55 - ri * 0.2)})`;
          ctx.lineWidth = 1.2 - ri * 0.3;
          ctx.stroke();
        });
        // Core dot / icon
        ctx.save();
        ctx.globalAlpha = Math.min(1, a * 1.1);
        ctx.translate(t.sx, t.sy);
        if (t.locked) {
          ctx.beginPath();
          ctx.moveTo(0, -8);
          ctx.lineTo(-5.5, 5);
          ctx.lineTo(5.5, 5);
          ctx.closePath();
          ctx.fillStyle = "rgba(255,80,80,1)";
          ctx.fill();
          const SZ = 13,
            ARM = 4;
          ctx.strokeStyle = "rgba(255,80,80,0.75)";
          ctx.lineWidth = 1.2;
          [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ].forEach(([sx, sy]) => {
            ctx.beginPath();
            ctx.moveTo(sx * SZ, sy * (SZ - ARM));
            ctx.lineTo(sx * SZ, sy * SZ);
            ctx.lineTo(sx * (SZ - ARM), sy * SZ);
            ctx.stroke();
          });
        } else {
          // Diamond dot
          ctx.beginPath();
          ctx.moveTo(0, -5);
          ctx.lineTo(4, 0);
          ctx.lineTo(0, 5);
          ctx.lineTo(-4, 0);
          ctx.closePath();
          ctx.fillStyle = "rgba(0,255,65,1)";
          ctx.fill();
        }
        ctx.restore();
        // Label with leader line
        if (a > 0.1) {
          const right = t.sx > CX,
            lx = t.sx + (right ? 22 : -22),
            ly = t.sy - 5;
          ctx.globalAlpha = a * 0.95;
          ctx.beginPath();
          ctx.moveTo(t.sx + (right ? 10 : -10), t.sy);
          ctx.lineTo(lx + (right ? -3 : 3), ly + 4);
          ctx.strokeStyle = t.locked
            ? `rgba(255,100,100,${a * 0.5})`
            : `rgba(0,255,65,${a * 0.4})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
          ctx.fillStyle = t.locked ? "rgba(255,110,110,1)" : "rgba(0,255,65,1)";
          ctx.font = "bold 8px 'JetBrains Mono',monospace";
          ctx.textAlign = right ? "left" : "right";
          ctx.fillText(t.label, lx, ly);
          ctx.globalAlpha = 1;
          ctx.textAlign = "left";
        }
      });

      // Centre emitter crosshair
      ctx.strokeStyle = "rgba(160,255,180,0.6)";
      ctx.lineWidth = 0.7;
      [
        [CX - 10, CY, CX - 3, CY],
        [CX + 3, CY, CX + 10, CY],
        [CX, CY - 10, CX, CY - 3],
        [CX, CY + 3, CX, CY + 10],
      ].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
      ctx.beginPath();
      ctx.arc(CX, CY, 3, 0, TAU);
      ctx.fillStyle = "rgba(200,255,200,0.95)";
      ctx.fill();

      ctx.restore(); // end clip

      // ── Outside clip: dynamic HUD ──────────────────────────
      const found = THREATS.filter((t) => t.echo > 0.05);
      const locked = found.filter((t) => t.locked);

      // Threat list top-left (dynamic, next to "SENTINEL:")
      ctx.font = "bold 7px 'JetBrains Mono',monospace";
      ctx.textAlign = "left";
      let hx = 78;
      found.slice(0, 6).forEach((t) => {
        ctx.fillStyle = t.locked
          ? "rgba(255,90,90,0.9)"
          : "rgba(0,255,65,0.75)";
        ctx.fillText(t.label, hx, 20);
        hx += ctx.measureText(t.label).width + 8;
      });

      // LIVE blink + counter (top-right)
      ctx.font = "7px 'JetBrains Mono',monospace";
      ctx.textAlign = "right";
      ctx.fillStyle = GD(0.35);
      ctx.globalAlpha = 0.8;
      ctx.fillText(`${found.length}/${THREATS.length} DETECTED`, S - 28, 20);
      ctx.globalAlpha = 1;
      if (Math.sin(blinkT * Math.PI * 2) > 0) {
        ctx.beginPath();
        ctx.arc(S - 18, 14, 3.5, 0, TAU);
        ctx.fillStyle = "rgba(255,70,70,0.9)";
        ctx.fill();
      }
      ctx.fillStyle = "rgba(255,70,70,0.5)";
      ctx.font = "6px 'JetBrains Mono',monospace";
      ctx.textAlign = "right";
      ctx.fillText("LIVE", S - 24, 14);

      // Scan progress bar (bottom)
      const barY = S - 11,
        barX = PAD + 4,
        barW = S - PAD * 2 - 8;
      ctx.strokeStyle = GD(0.15);
      ctx.lineWidth = 0.5;
      ctx.strokeRect(barX, barY, barW, 4);
      const norm = ((((sweepAngle + Math.PI / 2) % TAU) + TAU) % TAU) / TAU;
      ctx.fillStyle = GD(0.45);
      ctx.fillRect(barX, barY, barW * norm, 4);
      ctx.font = "6px 'JetBrains Mono',monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = GD(0.3);
      ctx.fillText("SCAN PROGRESS", barX, barY - 2);
      ctx.textAlign = "right";
      ctx.fillText(`LOCKED: ${locked.length}`, S - barX, barY - 2);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <motion.div style={{ x: ppx, y: ppy }}>
      <div
        style={{
          position: "relative",
          width: 580,
          height: 580,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -48,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(0,255,65,0.07) 0%,transparent 60%)",
            animation: "pulse-glow 4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SHARED SMALL COMPONENTS
═══════════════════════════════════════════════════════════════ */
const ScanLine = () => (
  <div
    style={{
      position: "fixed",
      left: 0,
      right: 0,
      height: 2,
      zIndex: 200,
      pointerEvents: "none",
      background:
        "linear-gradient(90deg,transparent 0%,rgba(0,229,255,.08) 15%,rgba(0,229,255,.9) 50%,rgba(0,229,255,.08) 85%,transparent 100%)",
      boxShadow: "0 0 20px rgba(0,229,255,.6),0 0 60px rgba(0,229,255,.3)",
      animation: "scan-v 2.6s linear infinite",
    }}
  />
);
const TypeWriter = ({ texts }) => {
  const [i, setI] = useState(0),
    [disp, setDisp] = useState(""),
    [ci, setCi] = useState(0);
  useEffect(() => {
    const cur = texts[i % texts.length];
    if (ci < cur.length) {
      const t = setTimeout(() => {
        setDisp(cur.slice(0, ci + 1));
        setCi((c) => c + 1);
      }, 36);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setI((x) => x + 1);
      setCi(0);
      setDisp("");
    }, 1100);
    return () => clearTimeout(t);
  }, [ci, i]);
  return (
    <span
      className="f-mono"
      style={{ color: "#00E5FF", fontSize: 12, letterSpacing: 0.8 }}
    >
      {disp}
      <span
        style={{ animation: "blink 1s step-end infinite", color: "#00FFA3" }}
      >
        ▌
      </span>
    </span>
  );
};
const AnimNum = ({ to, suffix = "" }) => (
  <span>
    {to}
    {suffix}
  </span>
);
const RiskGauge = ({ score }) => {
  const R = 58,
    C = 2 * Math.PI * R,
    pct = score / 100,
    stopA = pct < 0.3 ? "#00FFA3" : pct < 0.6 ? "#FFD60A" : "#FF4D6D",
    stopB = pct < 0.3 ? "#00E5FF" : pct < 0.6 ? "#FF9500" : "#FF0055",
    label = pct < 0.3 ? "LOW RISK" : pct < 0.6 ? "MODERATE" : "HIGH RISK",
    glowColor =
      pct < 0.3
        ? "rgba(0,255,163,.4)"
        : pct < 0.6
          ? "rgba(255,214,10,.4)"
          : "rgba(255,77,109,.4)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ position: "relative", width: 148, height: 148 }}>
        <svg
          width="148"
          height="148"
          style={{ transform: "rotate(-90deg)", position: "absolute" }}
        >
          <defs>
            <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={stopA} />
              <stop offset="100%" stopColor={stopB} />
            </linearGradient>
          </defs>
          <circle
            cx="74"
            cy="74"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,.05)"
            strokeWidth="9"
          />
          <circle
            cx="74"
            cy="74"
            r={R}
            fill="none"
            stroke="url(#arc-grad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C - pct * C}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="f-orb"
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: stopA,
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <div
            className="f-mono"
            style={{
              fontSize: 8,
              color: stopA,
              letterSpacing: 2,
              marginTop: 4,
              opacity: 0.7,
            }}
          >
            /100
          </div>
        </div>
      </div>
      <div
        className="f-mono"
        style={{
          fontSize: 9,
          letterSpacing: 3,
          color: stopA,
          background: `${stopA}12`,
          border: `1px solid ${stopA}30`,
          padding: "3px 12px",
          borderRadius: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
};
const StatCard = ({ icon, label, value, color, raw }) => (
  <div
    style={{
      background: `linear-gradient(135deg,${color}08,rgba(0,0,0,.4))`,
      border: `1px solid ${color}20`,
      borderRadius: 12,
      padding: "18px 14px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
    <div
      className="f-orb"
      style={{ fontSize: 24, color, fontWeight: 900, lineHeight: 1 }}
    >
      {raw ? value : value}
    </div>
    <div
      className="f-mono"
      style={{
        fontSize: 8,
        color: "rgba(100,140,170,.6)",
        letterSpacing: 1.5,
        marginTop: 6,
      }}
    >
      {label}
    </div>
  </div>
);
const Panel = ({ title, icon, color = "#00E5FF", children, delay = 0 }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="glass-card"
      style={{
        marginBottom: 10,
        overflow: "hidden",
        border: `1px solid ${color}15`,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${color}12`,
              border: `1px solid ${color}28`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            {icon}
          </div>
          <span
            className="f-orb"
            style={{ color: "#A8C0D8", fontSize: 10, letterSpacing: 2.5 }}
          >
            {title}
          </span>
        </div>
        <span
          style={{
            color,
            fontSize: 12,
            transition: "transform .2s",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "4px 20px 20px",
            borderTop: `1px solid ${color}12`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
const Tag = ({ label, color }) => (
  <span
    className="threat-tag"
    style={{ color, background: `${color}0D`, border: `1px solid ${color}38` }}
  >
    <span
      style={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
    {label}
  </span>
);
const Verdict = ({ v }) => {
  const map = {
    HAM: { c: "#00FFA3", label: "SAFE", sub: "No threats detected" },
    SUSPICIOUS: {
      c: "#FFD60A",
      label: "SUSPICIOUS",
      sub: "Manual review advised",
    },
    SPAM: { c: "#FF4D6D", label: "THREAT", sub: "Malicious email confirmed" },
  };
  const { c, label, sub } = map[v] || map.SUSPICIOUS;
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 12 }}
      style={{
        padding: "20px 28px",
        borderRadius: 14,
        background: `linear-gradient(135deg,${c}08 0%,rgba(0,0,0,.5) 100%)`,
        border: `1px solid ${c}40`,
        textAlign: "center",
        boxShadow: `0 0 40px ${c}18,0 0 80px ${c}08`,
      }}
    >
      <div
        className="f-mono"
        style={{
          fontSize: 9,
          color: `${c}88`,
          letterSpacing: 4,
          marginBottom: 8,
        }}
      >
        VERDICT
      </div>
      <div
        className="f-orb"
        style={{
          fontSize: 26,
          fontWeight: 900,
          color: c,
          letterSpacing: 2,
          textShadow: `0 0 30px ${c}99`,
        }}
      >
        {label}
      </div>
      <div
        className="f-mono"
        style={{
          fontSize: 10,
          color: `${c}66`,
          marginTop: 6,
          letterSpacing: 0.5,
        }}
      >
        {sub}
      </div>
    </motion.div>
  );
};
const BarStat = ({ label, val, color }) => (
  <div style={{ marginBottom: 4 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 7,
      }}
    >
      <span
        className="f-mono"
        style={{
          fontSize: 9,
          color: "rgba(100,140,170,.6)",
          letterSpacing: 1.5,
        }}
      >
        {label}
      </span>
      <span className="f-mono" style={{ fontSize: 12, color, fontWeight: 500 }}>
        {val}%
      </span>
    </div>
    <div
      style={{
        height: 5,
        background: "rgba(255,255,255,.04)",
        borderRadius: 99,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${val}%`,
          height: "100%",
          background: `linear-gradient(90deg,${color}60,${color})`,
          borderRadius: 99,
        }}
      />
    </div>
  </div>
);
const ScanAnim = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      padding: "32px 0",
    }}
  >
    <div style={{ position: "relative", width: 88, height: 88 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "2px solid rgba(0,229,255,.15)",
          borderTopColor: "#00E5FF",
          animation: "spin 1s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: "50%",
          border: "1.5px solid rgba(0,255,163,.12)",
          borderBottomColor: "#00FFA3",
          animation: "cspin 1.6s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 20,
          borderRadius: "50%",
          border: "1px solid rgba(124,58,237,.15)",
          borderLeftColor: "#7C3AED",
          animation: "spin 2.2s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#00E5FF",
            boxShadow: "0 0 20px #00E5FF,0 0 40px #00E5FF66",
            animation: "pulse-ring 1.2s ease-in-out infinite",
          }}
        />
      </div>
    </div>
    <TypeWriter
      texts={[
        "Parsing MIME structure...",
        "Resolving sender domain...",
        "Extracting anchor tags...",
        "Analyzing language entropy...",
        "Checking URL reputation...",
        "Computing threat vectors...",
        "Generating AI verdict...",
      ]}
    />
  </motion.div>
);

const DataTicker = () => {
  const items =
    "THREAT DB UPDATED 03:24:11 UTC  ◆  247,832 PHISHING DOMAINS TRACKED  ◆  AI MODEL v2.4.1  ◆  LATENCY 12ms  ◆  UPTIME 99.98%  ◆  NEW VECTOR: BEC CAMPAIGN DETECTED  ◆  LAST SCAN: 0.3s AGO  ◆  ";
  return (
    <div
      style={{
        borderTop: "1px solid rgba(0,229,255,.08)",
        borderBottom: "1px solid rgba(0,229,255,.08)",
        background: "rgba(0,229,255,.02)",
        padding: "7px 0",
        overflow: "hidden",
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 60,
          background: "linear-gradient(to right,#020812,transparent)",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 60,
          background: "linear-gradient(to left,#020812,transparent)",
          zIndex: 2,
        }}
      />
      <div
        className="ticker-content f-mono"
        style={{
          color: "rgba(0,229,255,.35)",
          fontSize: 10,
          letterSpacing: 1.5,
        }}
      >
        {items + items}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   DEMO DATA
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE COMPONENTS
═══════════════════════════════════════════════════════════════ */
const EMPTY_ANALYSIS = {
  verdict: "SUSPICIOUS",
  confidence: 0,
  spamProb: 0,
  riskScore: 0,
  threats: [],
  headers: {
    from: "N/A",
    replyTo: "N/A",
    returnPath: "N/A",
    spf: "N/A",
    dkim: "N/A",
    dmarc: "N/A",
    domain: "N/A",
  },
  urls: [],
  attach: [],
  kw: [],
  stats: { links: 0, html: false, attach: 0, phishKw: 0 },
};

const normalizeVerdict = (verdict) => {
  const key = String(verdict || "")
    .trim()
    .toUpperCase();
  if (!key) return "SUSPICIOUS";
  if (["HAM", "SAFE", "LEGITIMATE", "LEGIT"].includes(key)) return "HAM";
  if (["SUSPICIOUS", "REVIEW"].includes(key)) return "SUSPICIOUS";
  if (["SPAM", "THREAT", "MALICIOUS"].includes(key)) return "SPAM";
  return "SUSPICIOUS";
};

const toPercent = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  if (n <= 1) return Math.max(0, Math.min(100, Math.round(n * 100)));
  return Math.max(0, Math.min(100, Math.round(n)));
};

const urlKey = (url) =>
  String(url || "")
    .trim()
    .toLowerCase()
    .replace(/\/+$/, "");

const deriveAttachmentExt = (filename) => {
  const match = String(filename || "").match(/(\.[a-z0-9]{1,8})$/i);
  return match ? match[1].toLowerCase() : "";
};

const classifyHeaderDomain = (headerFlags) => {
  const hasMismatch = headerFlags.some((flag) =>
    /differs from sender domain/i.test(flag),
  );
  return hasMismatch ? "MISMATCH" : "ALIGNED";
};

const mapApiResponseToView = (payload) => {
  const headerFlags = Array.isArray(payload?.header_flags)
    ? payload.header_flags
    : [];
  const languageFlags = Array.isArray(payload?.language_flags)
    ? payload.language_flags
    : [];
  const extractedUrls = Array.isArray(payload?.extracted_urls)
    ? payload.extracted_urls
    : [];
  const suspiciousUrls = new Set(
    (Array.isArray(payload?.suspicious_urls)
      ? payload.suspicious_urls
      : []
    ).map((url) => urlKey(url)),
  );
  const trackingUrls = new Set(
    (Array.isArray(payload?.tracking_urls) ? payload.tracking_urls : []).map(
      (url) => urlKey(url),
    ),
  );
  const attachmentNames = Array.isArray(payload?.attachment_names)
    ? payload.attachment_names
    : [];
  const indicators = Array.isArray(payload?.indicators)
    ? payload.indicators
    : [];

  return {
    verdict: normalizeVerdict(payload?.verdict),
    confidence: toPercent(payload?.confidence),
    spamProb: toPercent(payload?.spam_probability),
    riskScore: toPercent(payload?.risk_score),
    threats: indicators
      .filter((x) => typeof x === "string" && x.trim())
      .slice(0, 8),
    headers: {
      from: payload?.sender || "N/A",
      replyTo: payload?.reply_to || "N/A",
      returnPath: payload?.return_path || "N/A",
      spf: "N/A",
      dkim: "N/A",
      dmarc: "N/A",
      domain: classifyHeaderDomain(headerFlags),
    },
    urls: extractedUrls.map((url) => {
      const key = urlKey(url);
      const suspicious = suspiciousUrls.has(key);
      const tracking = trackingUrls.has(key);
      return {
        url,
        sus: suspicious,
        type: suspicious ? "Suspicious" : tracking ? "Tracking" : "Link",
      };
    }),
    attach: attachmentNames.map((name) => {
      const ext = deriveAttachmentExt(name);
      const danger = [
        ".exe",
        ".js",
        ".scr",
        ".bat",
        ".cmd",
        ".ps1",
        ".vbs",
        ".docm",
        ".xlsm",
      ].includes(ext);
      return { name, ext, danger };
    }),
    kw: languageFlags,
    stats: {
      links: Number(payload?.url_count || extractedUrls.length || 0),
      html: Boolean(payload?.has_html),
      attach: Number(payload?.attachment_count || attachmentNames.length || 0),
      phishKw: languageFlags.length,
    },
  };
};

const LandingTicker = () => {
  const items = [
    "⬡ 2.4B THREATS BLOCKED TODAY",
    "◈ 99.97% DETECTION RATE",
    "◆ <0.3ms SCAN LATENCY",
    "⬡ 140+ THREAT VECTORS",
    "◈ SOC2 TYPE II CERTIFIED",
    "◆ ZERO TRUST ARCHITECTURE",
    "⬡ AI-POWERED ENGINE",
    "◈ REAL-TIME INTELLIGENCE",
    "◆ 50M+ EMAILS SCANNED",
    "⬡ ENTERPRISE GRADE",
  ];
  const str = items.join("    ");
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(0,255,65,.1)",
        borderBottom: "1px solid rgba(0,255,65,.1)",
        background: "rgba(0,255,65,.02)",
        padding: "10px 0",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "ticker 40s linear infinite",
        }}
      >
        {[str, str].map((s, i) => (
          <span
            key={i}
            className="f-mono"
            style={{
              color: "rgba(0,255,65,.5)",
              fontSize: 10,
              letterSpacing: 2,
              paddingRight: 40,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};
const Counter = ({ target, suffix = "", label, color = "#00FF41" }) => {
  const fmt = (n) => {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(0) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
    return n.toLocaleString();
  };
  return (
    <div
      style={{
        textAlign: "center",
        padding: "32px 16px",
        borderRight: "1px solid rgba(0,255,65,.06)",
      }}
    >
      <div
        className="f-orb"
        style={{
          fontSize: "clamp(28px,3vw,44px)",
          fontWeight: 900,
          color,
          lineHeight: 1,
          letterSpacing: -1,
        }}
      >
        {fmt(target)}
        {suffix}
      </div>
      <div
        className="f-mono"
        style={{
          color: "rgba(200,220,238,.5)",
          fontSize: 10,
          letterSpacing: 2,
          marginTop: 10,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};
const FeatureCard = ({ icon, title, desc, color = "#00FF41", delay = 0 }) => {
  const [hov, setHov] = useState(false);
  const col =
    color === "red"
      ? "255,60,60"
      : color === "#00E5FF"
        ? "0,229,255"
        : "0,255,65";
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "32px 28px",
        borderRadius: 8,
        cursor: "none",
        background: hov ? `rgba(${col},.06)` : "rgba(0,255,65,.025)",
        border: `1px solid rgba(${col},${hov ? 0.25 : 0.1})`,
        transition: "all .35s ease",
        boxShadow: hov ? `0 8px 40px rgba(${col},.08)` : "none",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          background: `rgba(${col},.1)`,
          border: `1px solid rgba(${col},.25)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          fontSize: 20,
        }}
      >
        {icon}
      </div>
      <div
        className="f-orb"
        style={{
          color:
            color === "red"
              ? "#FF6060"
              : color === "#00E5FF"
                ? "#00E5FF"
                : "#00FF41",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1.5,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{ color: "rgba(200,220,238,.6)", fontSize: 14, lineHeight: 1.7 }}
      >
        {desc}
      </div>
    </div>
  );
};
const PricingCard = ({
  tier,
  price,
  period = "/mo",
  features,
  highlight = false,
  delay = 0,
  onStart,
}) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="fade-in"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "36px 28px",
        borderRadius: 8,
        cursor: "none",
        position: "relative",
        background: highlight ? "rgba(0,255,65,.06)" : "rgba(0,20,8,.6)",
        border: highlight
          ? "1px solid rgba(0,255,65,.35)"
          : "1px solid rgba(0,255,65,.1)",
        boxShadow: highlight
          ? "0 0 60px rgba(0,255,65,.1),inset 0 0 40px rgba(0,255,65,.03)"
          : "none",
        transform: highlight || hov ? "translateY(-6px)" : "translateY(0)",
        transition: "all .35s ease",
      }}
    >
      {highlight && (
        <div
          className="f-mono"
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#00FF41",
            color: "#020812",
            padding: "4px 16px",
            borderRadius: 99,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          MOST POPULAR
        </div>
      )}
      <div
        className="f-mono"
        style={{
          color: "rgba(0,255,65,.6)",
          fontSize: 10,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {tier}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          marginBottom: 24,
        }}
      >
        <span
          className="f-orb"
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: highlight ? "#00FF41" : "#C8DCEE",
          }}
        >
          ${price}
        </span>
        <span
          className="f-mono"
          style={{ color: "rgba(200,220,238,.4)", fontSize: 12 }}
        >
          {period}
        </span>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(0,255,65,.1)",
          paddingTop: 24,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {features.map((f, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span style={{ color: "#00FF41", fontSize: 10 }}>◆</span>
            <span
              className="f-mono"
              style={{ color: "rgba(200,220,238,.7)", fontSize: 12 }}
            >
              {f}
            </span>
          </div>
        ))}
      </div>
      <button
        className="f-orb"
        onClick={onStart}
        style={{
          width: "100%",
          marginTop: 28,
          padding: "12px",
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          cursor: "none",
          background: highlight ? "rgba(0,255,65,.15)" : "transparent",
          border: highlight
            ? "1px solid rgba(0,255,65,.5)"
            : "1px solid rgba(0,255,65,.2)",
          color: highlight ? "#00FF41" : "rgba(0,255,65,.6)",
          transition: "all .25s",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(0,255,65,.25)";
          e.target.style.boxShadow = "0 0 20px rgba(0,255,65,.15)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = highlight
            ? "rgba(0,255,65,.15)"
            : "transparent";
          e.target.style.boxShadow = "none";
        }}
      >
        GET STARTED
      </button>
    </div>
  );
};
const Step = ({ num, title, desc, delay = 0 }) => (
  <div
    className="fade-in"
    style={{
      display: "flex",
      gap: 24,
      alignItems: "flex-start",
      animationDelay: delay + "s",
    }}
  >
    <div
      style={{
        flexShrink: 0,
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: "1px solid rgba(0,255,65,.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,255,65,.06)",
      }}
    >
      <span
        className="f-orb"
        style={{ color: "#00FF41", fontSize: 16, fontWeight: 700 }}
      >
        {num}
      </span>
    </div>
    <div>
      <div
        className="f-orb"
        style={{
          color: "#00FF41",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{ color: "rgba(200,220,238,.6)", fontSize: 14, lineHeight: 1.7 }}
      >
        {desc}
      </div>
    </div>
  </div>
);
const Testimonial = ({ quote, name, role, company, delay = 0 }) => (
  <div
    className="fade-in glass-lp"
    style={{ padding: "28px", borderRadius: 8 }}
  >
    <div
      style={{
        color: "rgba(0,255,65,.4)",
        fontSize: 32,
        lineHeight: 1,
        marginBottom: 16,
        fontFamily: "serif",
      }}
    >
      "
    </div>
    <div
      style={{
        color: "rgba(200,220,238,.8)",
        fontSize: 14,
        lineHeight: 1.75,
        marginBottom: 20,
      }}
    >
      {quote}
    </div>
    <div style={{ borderTop: "1px solid rgba(0,255,65,.1)", paddingTop: 16 }}>
      <div
        className="f-orb"
        style={{ color: "#00FF41", fontSize: 12, fontWeight: 600 }}
      >
        {name}
      </div>
      <div
        className="f-mono"
        style={{
          color: "rgba(200,220,238,.4)",
          fontSize: 10,
          letterSpacing: 1,
          marginTop: 2,
        }}
      >
        {role} · {company}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   UNIFIED NAV
═══════════════════════════════════════════════════════════════ */
const Nav = ({ page, setPage, scrollY }) => {
  const scrolled = scrollY > 60;
  const isApp = page === "app";
  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 5%",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: isApp
          ? "rgba(2,8,18,.95)"
          : scrolled
            ? "rgba(2,8,18,.88)"
            : "transparent",
        borderBottom:
          scrolled || isApp
            ? "1px solid rgba(0,255,65,.1)"
            : "1px solid transparent",
        backdropFilter: scrolled || isApp ? "blur(18px)" : "none",
        transition: "all .4s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "none",
        }}
        onClick={() => setPage("landing")}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            border: "1px solid rgba(0,255,65,.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,255,65,.08)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#00FF41" strokeWidth="1" />
            <circle
              cx="8"
              cy="8"
              r="3"
              stroke="#00FF41"
              strokeWidth="1"
              opacity=".5"
            />
            <line
              x1="8"
              y1="2"
              x2="8"
              y2="8"
              stroke="#00FF41"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <span
          className="f-orb"
          style={{
            color: "#00FF41",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 2,
          }}
        >
          SENTINEL
        </span>
        <span
          className="f-mono"
          style={{
            color: "rgba(0,255,65,.4)",
            fontSize: 9,
            letterSpacing: 1,
            marginTop: 2,
          }}
        >
          v2.0
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {isApp ? (
          <button
            onClick={() => setPage("landing")}
            className="f-mono"
            style={{
              background: "transparent",
              border: "1px solid rgba(0,255,65,.3)",
              color: "rgba(0,255,65,.7)",
              padding: "8px 18px",
              borderRadius: 4,
              fontSize: 11,
              letterSpacing: 1,
              cursor: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all .2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(0,255,65,.7)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(0,255,65,.3)")
            }
          >
            ← BACK TO HOME
          </button>
        ) : (
          <>
            {["Features", "How It Works", "Pricing"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="f-mono"
                style={{
                  color: "rgba(200,220,238,.6)",
                  fontSize: 12,
                  letterSpacing: 1,
                  transition: "color .2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#00FF41")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(200,220,238,.6)")
                }
              >
                {l}
              </a>
            ))}
            <button
              onClick={() => setPage("app")}
              className="f-orb"
              style={{
                marginLeft: 16,
                background: "rgba(0,255,65,.12)",
                border: "1px solid rgba(0,255,65,.5)",
                color: "#00FF41",
                padding: "8px 22px",
                borderRadius: 4,
                fontSize: 11,
                letterSpacing: 1,
                cursor: "none",
                transition: "all .2s",
                boxShadow: "0 0 20px rgba(0,255,65,.1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(0,255,65,.22)";
                e.target.style.boxShadow = "0 0 30px rgba(0,255,65,.25)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(0,255,65,.12)";
                e.target.style.boxShadow = "0 0 20px rgba(0,255,65,.1)";
              }}
            >
              ANALYZE EMAIL
            </button>
          </>
        )}
        {isApp && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 6,
              background: "rgba(0,229,255,.05)",
              border: "1px solid rgba(0,229,255,.18)",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00FFA3",
                boxShadow: "0 0 6px #00FFA3",
                animation: "pulse-ring 2s ease-in-out infinite",
              }}
            />
            <span
              className="f-mono"
              style={{
                fontSize: 9,
                color: "rgba(0,255,163,.7)",
                letterSpacing: 1,
              }}
            >
              ONLINE
            </span>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════════ */
const LandingPage = ({ mx, my, goToApp }) => (
  <div style={{ position: "relative", zIndex: 1 }}>
    {/* Hero */}
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "80px 5% 40px",
      }}
    >
      <div style={{ flex: 1, maxWidth: 560 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="f-mono"
          style={{
            color: "rgba(0,255,65,.6)",
            fontSize: 10,
            letterSpacing: 3,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00FF41",
              display: "inline-block",
              animation: "blink 1.2s ease-in-out infinite",
            }}
          />
          AI-POWERED EMAIL THREAT DETECTION
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="f-orb"
          style={{
            fontSize: "clamp(36px,4.5vw,62px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: -1,
            marginBottom: 24,
          }}
        >
          <span style={{ color: "#C8DCEE" }}>DETECT THREATS</span>
          <br />
          <span className="shimmer-text">BEFORE THEY STRIKE</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            color: "rgba(200,220,238,.65)",
            fontSize: 16,
            lineHeight: 1.8,
            marginBottom: 36,
            maxWidth: 460,
          }}
        >
          Sentinel uses military-grade sonar intelligence to scan every email in
          real-time — detecting phishing, malware, spoofing, and zero-day
          exploits before they reach your inbox.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          <button
            onClick={goToApp}
            className="f-orb"
            style={{
              padding: "14px 32px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              cursor: "none",
              background: "rgba(0,255,65,.14)",
              border: "1px solid rgba(0,255,65,.5)",
              color: "#00FF41",
              boxShadow: "0 0 30px rgba(0,255,65,.15)",
              transition: "all .25s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(0,255,65,.26)";
              e.target.style.boxShadow = "0 0 50px rgba(0,255,65,.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(0,255,65,.14)";
              e.target.style.boxShadow = "0 0 30px rgba(0,255,65,.15)";
            }}
          >
            START FREE TRIAL
          </button>
          <button
            onClick={goToApp}
            className="f-orb"
            style={{
              padding: "14px 32px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              cursor: "none",
              background: "transparent",
              border: "1px solid rgba(200,220,238,.2)",
              color: "rgba(200,220,238,.7)",
              transition: "all .25s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "rgba(0,229,255,.4)";
              e.target.style.color = "#00E5FF";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(200,220,238,.2)";
              e.target.style.color = "rgba(200,220,238,.7)";
            }}
          >
            VIEW LIVE DEMO
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {["SOC2 CERTIFIED", "GDPR COMPLIANT", "ISO 27001", "ZERO LOGS"].map(
            (b) => (
              <div
                key={b}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <span style={{ color: "rgba(0,255,65,.5)", fontSize: 8 }}>
                  ◆
                </span>
                <span
                  className="f-mono"
                  style={{
                    color: "rgba(200,220,238,.4)",
                    fontSize: 9,
                    letterSpacing: 1,
                  }}
                >
                  {b}
                </span>
              </div>
            ),
          )}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{ transform: "scale(0.72)", transformOrigin: "center center" }}
        >
          <ThreatRadar mx={mx} my={my} />
        </div>
      </motion.div>
    </section>

    <LandingTicker />

    {/* Stats */}
    <section style={{ padding: "80px 5%" }} id="features">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          borderTop: "1px solid rgba(0,255,65,.1)",
          borderBottom: "1px solid rgba(0,255,65,.1)",
          background: "rgba(0,255,65,.015)",
        }}
      >
        <Counter
          target={2400000000}
          suffix="+"
          label="Threats Blocked"
          color="#00FF41"
        />
        <Counter
          target={99.97}
          suffix="%"
          label="Detection Rate"
          color="#00E5FF"
        />
        <Counter
          target={50000000}
          suffix="+"
          label="Emails Scanned"
          color="#00FFA3"
        />
        <Counter
          target={140}
          suffix="+"
          label="Threat Vectors"
          color="#FF6B6B"
        />
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: "100px 5%" }}>
      <div
        className="fade-in"
        style={{ textAlign: "center", marginBottom: 64 }}
      >
        <div
          className="f-mono"
          style={{
            color: "rgba(0,255,65,.6)",
            fontSize: 10,
            letterSpacing: 3,
            marginBottom: 12,
          }}
        >
          ◆ CAPABILITIES ◆
        </div>
        <h2
          className="f-orb"
          style={{
            fontSize: "clamp(28px,3.5vw,44px)",
            fontWeight: 900,
            color: "#C8DCEE",
            letterSpacing: -1,
          }}
        >
          MILITARY-GRADE <span style={{ color: "#00FF41" }}>PROTECTION</span>
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 20,
        }}
      >
        <FeatureCard
          delay={0}
          icon="⬡"
          color="#00FF41"
          title="SONAR DETECTION"
          desc="Our proprietary ping-wave algorithm maps your email landscape in real-time, detecting anomalies the instant they appear — milliseconds before delivery."
        />
        <FeatureCard
          delay={0.1}
          icon="◈"
          color="#00E5FF"
          title="ZERO-DAY DEFENSE"
          desc="AI pattern-matching trained on 50B+ threat samples identifies unknown attack vectors with 99.3% accuracy, even without prior signatures."
        />
        <FeatureCard
          delay={0.2}
          icon="◆"
          color="#00FFA3"
          title="LINK DETONATION"
          desc="Every URL is detonated in an isolated sandbox environment. Our crawler follows redirects and analyzes final destinations before you ever click."
        />
        <FeatureCard
          delay={0.3}
          icon="▲"
          color="red"
          title="THREAT LOCKDOWN"
          desc="Confirmed threats are quarantined instantly with lock-bracket isolation. Admins receive real-time alerts with full forensic analysis."
        />
        <FeatureCard
          delay={0.4}
          icon="◇"
          color="#00E5FF"
          title="BEHAVIORAL AI"
          desc="Machine learning models analyze sender behavior, timing patterns, and linguistic anomalies to detect impersonation and BEC attacks."
        />
        <FeatureCard
          delay={0.5}
          icon="⬡"
          color="#00FF41"
          title="CONTINUOUS RADAR"
          desc="24/7 persistent threat monitoring with adaptive sensitivity. The system recalibrates detection thresholds dynamically."
        />
      </div>
    </section>

    {/* How It Works */}
    <section id="how-it-works" style={{ padding: "100px 5%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div>
          <div className="fade-in" style={{ marginBottom: 48 }}>
            <div
              className="f-mono"
              style={{
                color: "rgba(0,255,65,.6)",
                fontSize: 10,
                letterSpacing: 3,
                marginBottom: 12,
              }}
            >
              ◆ HOW IT WORKS ◆
            </div>
            <h2
              className="f-orb"
              style={{
                fontSize: "clamp(28px,3vw,40px)",
                fontWeight: 900,
                color: "#C8DCEE",
                letterSpacing: -1,
                lineHeight: 1.2,
              }}
            >
              FROM INBOX TO
              <br />
              <span style={{ color: "#00FF41" }}>VERDICT</span> IN 0.3ms
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <Step
              delay={0.1}
              num="01"
              title="EMAIL INTERCEPTED"
              desc="Every incoming email is intercepted at the MX layer before delivery. Zero latency impact — your users never notice a delay."
            />
            <Step
              delay={0.2}
              num="02"
              title="SONAR SCAN INITIATED"
              desc="Our ping-wave engine emits a detection signal across the email structure, mapping every link, attachment, header anomaly, and behavioral signature."
            />
            <Step
              delay={0.3}
              num="03"
              title="THREATS ECHO BACK"
              desc="Malicious elements echo back a unique signature. The AI classifies each echo by threat type, confidence score, and severity in real-time."
            />
            <Step
              delay={0.4}
              num="04"
              title="VERDICT DELIVERED"
              desc="Clean emails delivered instantly. Threats quarantined, logged with full forensics, and your security team alerted with actionable intelligence."
            />
          </div>
        </div>
        <div className="fade-in" style={{ position: "relative" }}>
          <div
            className="glass-lp"
            style={{
              borderRadius: 12,
              padding: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg,transparent,#00FF41,transparent)",
                opacity: 0.4,
                animation: "scan-h 3s linear infinite",
              }}
            />
            <div
              className="f-mono"
              style={{
                color: "rgba(0,255,65,.5)",
                fontSize: 9,
                letterSpacing: 2,
                marginBottom: 20,
              }}
            >
              ◆ LIVE ANALYSIS FEED
            </div>
            {[
              {
                label: "PHISHING LINK DETECTED",
                val: "BLOCKED",
                color: "#FF6060",
                time: "0.12ms",
              },
              {
                label: "SENDER VERIFIED",
                val: "CLEAN",
                color: "#00FF41",
                time: "0.08ms",
              },
              {
                label: "ATTACHMENT SANDBOXED",
                val: "SCANNING",
                color: "#FFD60A",
                time: "0.31ms",
              },
              {
                label: "HEADER SPOOFING",
                val: "BLOCKED",
                color: "#FF6060",
                time: "0.09ms",
              },
              {
                label: "URL REPUTATION CHECK",
                val: "CLEAN",
                color: "#00FF41",
                time: "0.15ms",
              },
              {
                label: "BEHAVIORAL ANALYSIS",
                val: "ANOMALY",
                color: "#FF9500",
                time: "0.22ms",
              },
            ].map((item, i) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(0,255,65,.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: item.color,
                      flexShrink: 0,
                      boxShadow: `0 0 6px ${item.color}`,
                    }}
                  />
                  <span
                    className="f-mono"
                    style={{ color: "rgba(200,220,238,.7)", fontSize: 11 }}
                  >
                    {item.label}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    className="f-mono"
                    style={{ color: "rgba(200,220,238,.3)", fontSize: 9 }}
                  >
                    {item.time}
                  </span>
                  <span
                    className="f-mono"
                    style={{
                      color: item.color,
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: 1,
                    }}
                  >
                    {item.val}
                  </span>
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 20,
                padding: "12px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                className="f-mono"
                style={{ color: "rgba(0,255,65,.5)", fontSize: 10 }}
              >
                VERDICT:
              </span>
              <span
                className="f-orb"
                style={{
                  color: "#FF6060",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                ⚠ THREAT DETECTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "80px 5%" }}>
      <div
        className="fade-in"
        style={{
          borderRadius: 12,
          padding: "60px 5%",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "rgba(0,255,65,.04)",
          border: "1px solid rgba(0,255,65,.2)",
          boxShadow:
            "0 0 80px rgba(0,255,65,.06),inset 0 0 60px rgba(0,255,65,.02)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(0,255,65,.5),transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(0,255,65,.5),transparent)",
          }}
        />
        <div
          className="f-mono"
          style={{
            color: "rgba(0,255,65,.6)",
            fontSize: 10,
            letterSpacing: 3,
            marginBottom: 16,
          }}
        >
          ◆ START TODAY ◆
        </div>
        <h2
          className="f-orb"
          style={{
            fontSize: "clamp(28px,4vw,52px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: -1,
            marginBottom: 16,
          }}
        >
          <span style={{ color: "#C8DCEE" }}>YOUR INBOX IS BEING</span>
          <br />
          <span className="shimmer-text">TARGETED RIGHT NOW</span>
        </h2>
        <p
          style={{
            color: "rgba(200,220,238,.55)",
            fontSize: 15,
            lineHeight: 1.7,
            marginBottom: 36,
            maxWidth: 500,
            margin: "0 auto 36px",
          }}
        >
          Every second you wait, threats accumulate. Deploy Sentinel in under 5
          minutes and start protecting your organization today.
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={goToApp}
            className="f-orb"
            style={{
              padding: "16px 40px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
              cursor: "none",
              background: "rgba(0,255,65,.16)",
              border: "1px solid rgba(0,255,65,.55)",
              color: "#00FF41",
              boxShadow: "0 0 40px rgba(0,255,65,.2)",
              transition: "all .25s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(0,255,65,.28)";
              e.target.style.boxShadow = "0 0 60px rgba(0,255,65,.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(0,255,65,.16)";
              e.target.style.boxShadow = "0 0 40px rgba(0,255,65,.2)";
            }}
          >
            DEPLOY SENTINEL FREE
          </button>
          <button
            onClick={goToApp}
            className="f-orb"
            style={{
              padding: "16px 40px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
              cursor: "none",
              background: "transparent",
              border: "1px solid rgba(200,220,238,.2)",
              color: "rgba(200,220,238,.6)",
              transition: "all .25s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "rgba(0,229,255,.4)";
              e.target.style.color = "#00E5FF";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(200,220,238,.2)";
              e.target.style.color = "rgba(200,220,238,.6)";
            }}
          >
            BOOK A DEMO
          </button>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer
      style={{
        borderTop: "1px solid rgba(0,255,65,.1)",
        padding: "60px 5% 32px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
          marginBottom: 48,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "1px solid rgba(0,255,65,.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,255,65,.06)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#00FF41" strokeWidth="1" />
                <circle
                  cx="8"
                  cy="8"
                  r="3"
                  stroke="#00FF41"
                  strokeWidth="1"
                  opacity=".5"
                />
                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="8"
                  stroke="#00FF41"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <span
              className="f-orb"
              style={{
                color: "#00FF41",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 2,
              }}
            >
              SENTINEL
            </span>
          </div>
          <p
            style={{
              color: "rgba(200,220,238,.45)",
              fontSize: 13,
              lineHeight: 1.75,
              maxWidth: 280,
            }}
          >
            Military-grade AI email threat detection. Protecting organizations
            from phishing, malware, and zero-day attacks in real-time.
          </p>
        </div>
        {[
          {
            title: "PRODUCT",
            links: ["Features", "Pricing", "Changelog", "Roadmap", "Status"],
          },
          {
            title: "COMPANY",
            links: ["About", "Blog", "Careers", "Press", "Contact"],
          },
          {
            title: "RESOURCES",
            links: [
              "Documentation",
              "API Reference",
              "Security",
              "Privacy",
              "Terms",
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <div
              className="f-mono"
              style={{
                color: "rgba(0,255,65,.5)",
                fontSize: 9,
                letterSpacing: 3,
                marginBottom: 20,
              }}
            >
              {col.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="f-mono"
                  style={{
                    color: "rgba(200,220,238,.45)",
                    fontSize: 12,
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF41")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(200,220,238,.45)")
                  }
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(0,255,65,.08)",
          paddingTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span
          className="f-mono"
          style={{
            color: "rgba(200,220,238,.3)",
            fontSize: 10,
            letterSpacing: 1,
          }}
        >
          © 2026 SENTINEL SECURITY INC. ALL RIGHTS RESERVEresult.
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["PRIVACY", "TERMS", "SECURITY"].map((l) => (
            <a
              key={l}
              href="#"
              className="f-mono"
              style={{
                color: "rgba(200,220,238,.3)",
                fontSize: 9,
                letterSpacing: 1,
                transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "rgba(0,255,65,.6)")}
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(200,220,238,.3)")
              }
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   ANALYZER APP PAGE
═══════════════════════════════════════════════════════════════ */
const AnalyzerApp = ({ mx, my }) => {
  const [tab, setTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [subj, setSubj] = useState("");
  const [body, setBody] = useState("");
  const [drag, setDrag] = useState(false);
  const [focused, setFocused] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [analysis, setAnalysis] = useState(EMPTY_ANALYSIS);
  const [error, setError] = useState("");
  const canScan = file || body.trim().length > 5;
  const analyze = async () => {
    if (!canScan) return;
    setError("");
    setPhase("scanning");
    try {
      let response;
      if (tab === "upload" && file) {
        const form = new FormData();
        form.append("file", file);
        response = await fetch(`${API_BASE}/analyze-email`, {
          method: "POST",
          body: form,
        });
      } else {
        response = await fetch(`${API_BASE}/analyze-text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: subj, body }),
        });
      }
      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        const detail =
          typeof errPayload?.detail === "string"
            ? errPayload.detail
            : `Request failed (${response.status})`;
        throw new Error(detail);
      }
      const payload = await response.json();
      setAnalysis(mapApiResponseToView(payload));
      setPhase("result");
    } catch (e) {
      console.error("Analyze failed", e);
      const msg = String(e?.message || "");
      const isNetworkError =
        e instanceof TypeError || /networkerror|failed to fetch/i.test(msg);
      if (isNetworkError) {
        setError(
          `Cannot reach backend at ${API_BASE}. Start backend on port 8000 or set VITE_API_BASE_URL.`,
        );
      } else {
        setError(msg || "Could not analyze this email.");
      }
      setPhase("idle");
    }
  };
  const reset = () => {
    setPhase("idle");
    setFile(null);
    setBody("");
    setSubj("");
    setError("");
    setAnalysis(EMPTY_ANALYSIS);
  };
  const result = analysis || EMPTY_ANALYSIS;
  const phishScore = Math.min(100, Math.max(0, result.stats.phishKw * 25));
  const DRow = ({ k, v, status }) => (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid rgba(0,229,255,.05)",
      }}
    >
      <span
        className="f-mono"
        style={{
          fontSize: 9,
          color: "rgba(100,140,170,.5)",
          letterSpacing: 1.5,
          minWidth: 60,
        }}
      >
        {k}
      </span>
      <span
        className="f-mono"
        style={{
          fontSize: 11,
          color:
            status === "bad"
              ? "#FF4D6D"
              : status === "warn"
                ? "#FFD60A"
                : "#6899B8",
          flex: 1,
          wordBreak: "break-all",
        }}
      >
        {v}
      </span>
      {status && (
        <span
          className="f-mono"
          style={{
            fontSize: 8,
            padding: "2px 8px",
            borderRadius: 4,
            flexShrink: 0,
            background:
              status === "bad"
                ? "rgba(255,77,109,.1)"
                : status === "warn"
                  ? "rgba(255,214,10,.1)"
                  : "rgba(0,255,163,.1)",
            border: `1px solid ${status === "bad" ? "rgba(255,77,109,.3)" : status === "warn" ? "rgba(255,214,10,.3)" : "rgba(0,255,163,.3)"}`,
            color:
              status === "bad"
                ? "#FF4D6D"
                : status === "warn"
                  ? "#FFD60A"
                  : "#00FFA3",
          }}
        >
          {status === "bad" ? "FAIL" : status === "warn" ? "WARN" : "PASS"}
        </span>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        maxWidth: 920,
        margin: "0 auto",
        padding: "80px 24px 120px",
      }}
    >
      <DataTicker />
      {phase === "scanning" && <ScanLine />}
      {/* Hero */}
      <section style={{ textAlign: "center", padding: "40px 0 28px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div
            className="f-mono"
            style={{
              fontSize: 10,
              color: "rgba(0,229,255,.4)",
              letterSpacing: 5,
              marginTop: 20,
              marginBottom: 14,
            }}
          >
            ◆ AI-POWERED SECURITY ANALYSIS ◆
          </div>
          <h1
            className="f-orb"
            style={{
              fontSize: "clamp(28px,5vw,46px)",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: 1,
            }}
          >
            <span style={{ color: "#D0E8F8" }}>AI Email Threat</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg,#00E5FF 0%,#00FFA3 50%,#7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 20px rgba(0,229,255,.4))",
              }}
            >
              Analyzer
            </span>
          </h1>
          <p
            className="f-syne"
            style={{
              color: "rgba(100,140,170,.55)",
              fontSize: 14,
              margin: "18px auto 0",
              maxWidth: 520,
              lineHeight: 1.85,
            }}
          >
            Upload or paste an email to detect{" "}
            <span style={{ color: "rgba(0,229,255,.6)" }}>spam</span>,{" "}
            <span style={{ color: "rgba(255,77,109,.6)" }}>
              phishing patterns
            </span>
            , malicious links, and suspicious behaviors using advanced AI threat
            intelligence.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            {[
              "Header Forensics",
              "URL Analysis",
              "Language AI",
              "Attachment Scan",
              "Domain Reputation",
            ].map((f) => (
              <div
                key={f}
                className="f-mono"
                style={{
                  fontSize: 9,
                  color: "rgba(0,229,255,.45)",
                  letterSpacing: 1,
                  padding: "4px 12px",
                  borderRadius: 99,
                  background: "rgba(0,229,255,.04)",
                  border: "1px solid rgba(0,229,255,.1)",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Input */}
      <AnimatePresence>
        {phase !== "result" && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.97 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div
              className={`glass-card ${focused ? "glass-card-glow" : ""}`}
              style={{
                padding: "28px 30px",
                marginBottom: 20,
                transition: "all .3s",
              }}
            >
              {[
                {
                  t: 0,
                  l: 0,
                  bt: "2px solid rgba(0,229,255,.5)",
                  bl: "2px solid rgba(0,229,255,.5)",
                },
                {
                  t: 0,
                  r: 0,
                  bt: "2px solid rgba(0,229,255,.5)",
                  br: "2px solid rgba(0,229,255,.5)",
                },
                {
                  b: 0,
                  l: 0,
                  bb: "2px solid rgba(0,229,255,.5)",
                  bl: "2px solid rgba(0,229,255,.5)",
                },
                {
                  b: 0,
                  r: 0,
                  bb: "2px solid rgba(0,229,255,.5)",
                  br: "2px solid rgba(0,229,255,.5)",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ position: "absolute", width: 16, height: 16, ...s }}
                />
              ))}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 22,
                }}
              >
                <div
                  className="f-orb"
                  style={{
                    fontSize: 9,
                    color: "rgba(0,229,255,.4)",
                    letterSpacing: 3,
                  }}
                >
                  EMAIL INPUT
                </div>
                <div
                  className="f-mono"
                  style={{
                    fontSize: 9,
                    color: "rgba(100,140,170,.35)",
                    letterSpacing: 1,
                  }}
                >
                  MAX 25MB · .EML .MSG .TXT
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  background: "rgba(0,0,0,.5)",
                  borderRadius: 10,
                  padding: 4,
                  width: "fit-content",
                  marginBottom: 24,
                  border: "1px solid rgba(0,229,255,.07)",
                }}
              >
                {[
                  ["upload", "📎 Upload .eml"],
                  ["paste", "✏️ Paste Email"],
                ].map(([id, lbl]) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    style={{
                      padding: "9px 22px",
                      borderRadius: 7,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 11,
                      letterSpacing: 1,
                      transition: "all .25s",
                      background:
                        tab === id ? "rgba(0,229,255,.1)" : "transparent",
                      color: tab === id ? "#00E5FF" : "rgba(100,140,170,.4)",
                      boxShadow:
                        tab === id
                          ? "0 0 16px rgba(0,229,255,.2),inset 0 1px 0 rgba(0,229,255,.1)"
                          : "none",
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {tab === "upload" ? (
                  <motion.div
                    key="up"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    transition={{ duration: 0.2 }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDrag(true);
                    }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDrag(false);
                      const f = e.dataTransfer.files[0];
                      if (f) setFile(f);
                    }}
                    onClick={() => document.getElementById("fi2").click()}
                    style={{
                      border: `1.5px dashed ${drag ? "#00E5FF" : file ? "#00FFA3" : "rgba(0,229,255,.16)"}`,
                      borderRadius: 12,
                      padding: "50px 28px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: drag
                        ? "rgba(0,229,255,.04)"
                        : "rgba(0,0,0,.2)",
                      transition: "all .3s",
                    }}
                  >
                    <input
                      id="fi2"
                      type="file"
                      accept=".eml,.msg,.txt"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) setFile(f);
                      }}
                    />
                    <div style={{ fontSize: 44, marginBottom: 14 }}>
                      {file ? "✅" : "📧"}
                    </div>
                    {file ? (
                      <>
                        <div
                          className="f-mono"
                          style={{ color: "#00FFA3", fontSize: 14 }}
                        >
                          {file.name}
                        </div>
                        <div
                          style={{
                            color: "rgba(0,255,163,.4)",
                            fontSize: 12,
                            marginTop: 6,
                          }}
                        >
                          {(file.size / 1024).toFixed(1)} KB · Ready for
                          analysis
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="f-orb"
                          style={{
                            color: "rgba(100,140,170,.5)",
                            fontSize: 11,
                            letterSpacing: 3,
                          }}
                        >
                          DROP FILE HERE
                        </div>
                        <div
                          style={{
                            color: "rgba(100,140,170,.25)",
                            fontSize: 12,
                            marginTop: 8,
                          }}
                        >
                          or click to browse — supports .eml, .msg, .txt
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="ps"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <label
                        className="f-mono"
                        style={{
                          display: "block",
                          fontSize: 9,
                          color: "rgba(100,140,170,.45)",
                          letterSpacing: 2,
                          marginBottom: 8,
                        }}
                      >
                        SUBJECT LINE
                      </label>
                      <input
                        value={subj}
                        onChange={(e) => setSubj(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Re: Urgent — Verify Your Account Immediately"
                        className="cyber-input"
                        style={{ padding: "12px 16px" }}
                      />
                    </div>
                    <div>
                      <label
                        className="f-mono"
                        style={{
                          display: "block",
                          fontSize: 9,
                          color: "rgba(100,140,170,.45)",
                          letterSpacing: 2,
                          marginBottom: 8,
                        }}
                      >
                        FULL EMAIL BODY
                      </label>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={
                          "Paste complete email content here...\n\nInclude headers for best analysis results."
                        }
                        rows={9}
                        className="cyber-input"
                        style={{
                          padding: "14px 16px",
                          resize: "vertical",
                          lineHeight: 1.7,
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ textAlign: "center" }}>
              <AnimatePresence mode="wait">
                {phase === "scanning" ? (
                  <motion.div
                    key="scan"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className="glass-card"
                      style={{
                        borderRadius: 16,
                        padding: "8px 56px",
                        display: "inline-block",
                        border: "1px solid rgba(0,229,255,.15)",
                      }}
                    >
                      <ScanAnim />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.button
                      onClick={analyze}
                      disabled={!canScan}
                      whileHover={canScan ? { scale: 1.04, y: -2 } : {}}
                      whileTap={canScan ? { scale: 0.96 } : {}}
                      style={{
                        padding: "17px 68px",
                        borderRadius: 10,
                        border: "none",
                        cursor: canScan ? "pointer" : "not-allowed",
                        background: canScan
                          ? "linear-gradient(135deg,rgba(0,229,255,.16),rgba(124,58,237,.22))"
                          : "rgba(255,255,255,.02)",
                        boxShadow: canScan
                          ? "0 0 40px rgba(0,229,255,.22),0 0 80px rgba(0,229,255,.08),inset 0 1px 0 rgba(0,229,255,.15)"
                          : "none",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: canScan
                          ? "rgba(0,229,255,.38)"
                          : "rgba(255,255,255,.04)",
                        transition: "all .3s",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {canScan && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(90deg,transparent,rgba(0,229,255,.05),transparent)",
                            animation: "data-scroll 3s linear infinite",
                          }}
                        />
                      )}
                      <span
                        className="f-orb"
                        style={{
                          fontSize: 12,
                          letterSpacing: 4,
                          color: canScan ? "#00E5FF" : "rgba(100,140,170,.2)",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        ⬡ ANALYZE EMAIL
                      </span>
                    </motion.button>
                    {!canScan && (
                      <p
                        className="f-mono"
                        style={{
                          color: "rgba(100,140,170,.2)",
                          fontSize: 9,
                          letterSpacing: 2,
                          marginTop: 16,
                        }}
                      >
                        UPLOAD OR PASTE EMAIL TO BEGIN SCAN
                      </p>
                    )}
                    {error && (
                      <p
                        className="f-mono"
                        style={{
                          color: "#FF7A8C",
                          fontSize: 10,
                          letterSpacing: 0.8,
                          marginTop: 16,
                        }}
                      >
                        {error}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {phase === "result" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#00FFA3",
                    boxShadow: "0 0 8px #00FFA3",
                    animation: "pulse-ring 1.5s ease-in-out infinite",
                  }}
                />
                <span
                  className="f-orb"
                  style={{
                    fontSize: 9,
                    color: "rgba(0,255,163,.6)",
                    letterSpacing: 3,
                  }}
                >
                  ANALYSIS COMPLETE
                </span>
                <span
                  className="f-mono"
                  style={{
                    fontSize: 9,
                    color: "rgba(100,140,170,.3)",
                    letterSpacing: 1,
                  }}
                >
                  · 0.34s
                </span>
              </div>
              <button
                onClick={reset}
                className="f-mono"
                style={{
                  background: "none",
                  border: "1px solid rgba(0,229,255,.15)",
                  borderRadius: 7,
                  color: "rgba(100,140,170,.5)",
                  padding: "7px 16px",
                  cursor: "pointer",
                  fontSize: 9,
                  letterSpacing: 1.5,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#00E5FF";
                  e.target.style.borderColor = "rgba(0,229,255,.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "rgba(100,140,170,.5)";
                  e.target.style.borderColor = "rgba(0,229,255,.15)";
                }}
              >
                ← NEW SCAN
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card"
              style={{ padding: "28px 32px", marginBottom: 14 }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 28,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Verdict v={result.verdict} />
                <RiskGauge score={result.riskScore} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    flex: 1,
                    minWidth: 200,
                  }}
                >
                  <BarStat
                    label="DETECTION CONFIDENCE"
                    val={result.confidence}
                    color="#00E5FF"
                    delay={0.3}
                  />
                  <BarStat
                    label="SPAM PROBABILITY"
                    val={result.spamProb}
                    color="#FF4D6D"
                    delay={0.4}
                  />
                  <BarStat
                    label="PHISH SCORE"
                    val={phishScore}
                    color="#FFD60A"
                    delay={0.5}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card"
              style={{ padding: "22px 26px", marginBottom: 14 }}
            >
              <div
                className="f-orb"
                style={{
                  fontSize: 9,
                  color: "rgba(100,140,170,.4)",
                  letterSpacing: 3,
                  marginBottom: 16,
                }}
              >
                ACTIVE THREAT INDICATORS
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.threats.map((t, i) => (
                  <Tag
                    key={t}
                    label={t.toUpperCase()}
                    color={
                      [
                        "#FF4D6D",
                        "#FFD60A",
                        "#FF4D6D",
                        "#FFD60A",
                        "#7C3AED",
                        "#FF4D6D",
                        "#FF4D6D",
                        "#FFD60A",
                      ][i]
                    }
                    delay={0.35 + i * 0.05}
                  />
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <StatCard
                icon="🔗"
                label="EXTRACTED LINKS"
                value={result.stats.links}
                color="#00E5FF"
                delay={0.4}
              />
              <StatCard
                icon="📄"
                label="HTML CONTENT"
                value={result.stats.html ? "YES" : "NO"}
                color="#7C3AED"
                raw
                delay={0.45}
              />
              <StatCard
                icon="📎"
                label="ATTACHMENTS"
                value={result.stats.attach}
                color="#FF4D6D"
                delay={0.5}
              />
              <StatCard
                icon="⚠️"
                label="PHISH KEYWORDS"
                value={result.stats.phishKw}
                color="#FFD60A"
                delay={0.55}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <div
                className="f-orb"
                style={{
                  fontSize: 9,
                  color: "rgba(100,140,170,.4)",
                  letterSpacing: 3,
                  marginBottom: 14,
                }}
              >
                FORENSIC ANALYSIS
              </div>
              <Panel
                title="HEADER ANALYSIS"
                icon="🔍"
                color="#00E5FF"
                delay={0.5}
              >
                <div style={{ marginTop: 10 }}>
                  <DRow k="FROM" v={result.headers.from} status="bad" />
                  <DRow k="REPLY-TO" v={result.headers.replyTo} status="bad" />
                  <DRow k="SPF" v={result.headers.spf} status="bad" />
                  <DRow k="DKIM" v={result.headers.dkim} status="bad" />
                  <DRow k="DMARC" v={result.headers.dmarc} status="bad" />
                  <DRow k="DOMAIN" v={result.headers.domain} status="warn" />
                </div>
              </Panel>
              <Panel
                title="URL ANALYSIS"
                icon="🌐"
                color="#00FFA3"
                delay={0.55}
              >
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {result.urls.map(({ url, sus, type }, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        borderRadius: 8,
                        background: sus
                          ? "rgba(255,77,109,.04)"
                          : "rgba(0,255,163,.03)",
                        border: `1px solid ${sus ? "rgba(255,77,109,.15)" : "rgba(0,255,163,.12)"}`,
                      }}
                    >
                      <span style={{ fontSize: 12 }}>{sus ? "🔴" : "🟢"}</span>
                      <span
                        className="f-mono"
                        style={{
                          fontSize: 11,
                          color: sus ? "#FF4D6D" : "#00FFA3",
                          flex: 1,
                          wordBreak: "break-all",
                        }}
                      >
                        {url}
                      </span>
                      <span
                        className="f-mono"
                        style={{
                          fontSize: 8,
                          color: sus
                            ? "rgba(255,77,109,.6)"
                            : "rgba(0,255,163,.5)",
                          background: sus
                            ? "rgba(255,77,109,.08)"
                            : "rgba(0,255,163,.06)",
                          border: `1px solid ${sus ? "rgba(255,77,109,.2)" : "rgba(0,255,163,.15)"}`,
                          padding: "2px 8px",
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                      >
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel
                title="ATTACHMENT ANALYSIS"
                icon="📎"
                color="#FF4D6D"
                delay={0.6}
              >
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {result.attach.map((a, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 8,
                        background: "rgba(255,77,109,.04)",
                        border: "1px solid rgba(255,77,109,.16)",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>⚠️</span>
                      <div style={{ flex: 1 }}>
                        <div
                          className="f-mono"
                          style={{ fontSize: 12, color: "#FF4D6D" }}
                        >
                          {a.name}
                        </div>
                        <div
                          className="f-mono"
                          style={{
                            fontSize: 9,
                            color: "rgba(255,77,109,.45)",
                            marginTop: 3,
                          }}
                        >
                          DOUBLE EXTENSION — POTENTIAL EXECUTABLE DISGUISE
                        </div>
                      </div>
                      <span
                        className="f-mono"
                        style={{
                          fontSize: 9,
                          color: "#FF4D6D",
                          background: "rgba(255,77,109,.1)",
                          border: "1px solid rgba(255,77,109,.3)",
                          padding: "3px 10px",
                          borderRadius: 4,
                        }}
                      >
                        DANGER
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel
                title="LANGUAGE SIGNALS"
                icon="🧠"
                color="#7C3AED"
                delay={0.65}
              >
                <div style={{ marginTop: 14 }}>
                  <div
                    className="f-mono"
                    style={{
                      fontSize: 9,
                      color: "rgba(100,140,170,.4)",
                      letterSpacing: 2,
                      marginBottom: 12,
                    }}
                  >
                    DETECTED PHISHING PATTERNS
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.kw.map((kw) => (
                      <span
                        key={kw}
                        className="f-mono"
                        style={{
                          fontSize: 11,
                          color: "#9B6FE0",
                          background: "rgba(124,58,237,.08)",
                          border: "1px solid rgba(124,58,237,.22)",
                          padding: "5px 13px",
                          borderRadius: 6,
                        }}
                      >
                        "{kw}"
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 18,
                      padding: "14px 16px",
                      borderRadius: 8,
                      background: "rgba(124,58,237,.05)",
                      border: "1px solid rgba(124,58,237,.14)",
                    }}
                  >
                    <div
                      className="f-mono"
                      style={{
                        fontSize: 9,
                        color: "rgba(124,58,237,.6)",
                        letterSpacing: 2,
                        marginBottom: 8,
                      }}
                    >
                      AI LANGUAGE ENTROPY SCORE
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "rgba(255,255,255,.04)",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "84%" }}
                        transition={{
                          duration: 1.5,
                          delay: 0.8,
                          ease: "easeOut",
                        }}
                        style={{
                          height: "100%",
                          background:
                            "linear-gradient(90deg,#7C3AED66,#7C3AED)",
                          borderRadius: 99,
                          boxShadow: "0 0 10px #7C3AED",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                      }}
                    >
                      <span
                        className="f-mono"
                        style={{ fontSize: 8, color: "rgba(124,58,237,.4)" }}
                      >
                        LEGITIMATE
                      </span>
                      <span
                        className="f-mono"
                        style={{ fontSize: 9, color: "#9B6FE0" }}
                      >
                        84% MANIPULATIVE
                      </span>
                    </div>
                  </div>
                </div>
              </Panel>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          textAlign: "center",
          marginTop: 72,
          paddingTop: 30,
          borderTop: "1px solid rgba(0,229,255,.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {[
            "247,832 THREATS TRACKED",
            "99.98% UPTIME",
            "<15ms LATENCY",
            "AI MODEL v2.4.1",
          ].map((s) => (
            <span
              key={s}
              className="f-mono"
              style={{
                fontSize: 9,
                color: "rgba(100,140,170,.2)",
                letterSpacing: 1,
              }}
            >
              {s}
            </span>
          ))}
        </div>
        <div
          className="f-mono"
          style={{
            fontSize: 8,
            color: "rgba(100,140,170,.12)",
            marginTop: 12,
            letterSpacing: 3,
          }}
        >
          SENTINEL AI · THREAT INTELLIGENCE PLATFORM · BUILD 2026.03
        </div>
      </motion.footer>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("landing");
  const [scrollY, setScrollY] = useState(0);
  const mx = useMotionValue(600),
    my = useMotionValue(400);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const goToApp = () => {
    setPage("app");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goHome = () => {
    setPage("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <GlobalStyles />
      <AuroraBlobs />
      <Nav
        page={page}
        setPage={(p) => {
          if (p === "landing") goHome();
          else goToApp();
        }}
        scrollY={scrollY}
      />
      <AnimatePresence mode="wait">
        {page === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage mx={mx} my={my} goToApp={goToApp} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4 }}
          >
            <AnalyzerApp mx={mx} my={my} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
