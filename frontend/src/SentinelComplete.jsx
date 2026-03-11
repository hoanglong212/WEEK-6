import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://week-6-qer0.onrender.com").replace(/\/+$/, "");

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GLOBAL STYLES â€” merged both apps
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const GlobalStyles = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=JetBrains+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap";
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
      #cursor-ring { position:fixed;width:36px;height:36px;border-radius:50%;border:1px solid rgba(0,229,255,0.5);pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .3s,height .3s,border-color .3s; }
      body:has(button:hover) #cursor-dot { width:12px;height:12px;background:#00FFA3; }
      body:has(button:hover) #cursor-ring { width:48px;height:48px;border-color:rgba(0,255,163,0.6); }
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
      .anim-border-glow { animation:border-glow 3s ease-in-out infinite; }
      .glass-card { background:linear-gradient(135deg,rgba(8,20,40,.85) 0%,rgba(4,10,22,.9) 100%);backdrop-filter:blur(32px) saturate(180%);-webkit-backdrop-filter:blur(32px) saturate(180%);border:1px solid rgba(0,229,255,.1);border-radius:16px;position:relative;overflow:hidden; }
      .glass-card::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,229,255,.04) 0%,transparent 50%,rgba(124,58,237,.03) 100%);pointer-events:none; }
      .glass-card-glow { border-color:rgba(0,229,255,.28) !important;box-shadow:0 0 50px rgba(0,229,255,.1),0 0 100px rgba(0,229,255,.04) !important; }
      .grad-border { position:relative;border-radius:16px; }
      .grad-border::after { content:'';position:absolute;inset:-1px;border-radius:17px;background:linear-gradient(135deg,rgba(0,229,255,.5),rgba(124,58,237,.3),rgba(0,255,163,.4));z-index:-1;opacity:0;transition:opacity .3s; }
      .grad-border:hover::after { opacity:1; }
      .cyber-input { width:100%;background:rgba(0,0,0,.5);border:1px solid rgba(0,229,255,.12);border-radius:10px;color:#C8DCEE;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:border-color .25s,box-shadow .25s,background .25s; }
      .cyber-input:focus { border-color:rgba(0,229,255,.45);background:rgba(0,229,255,.03);box-shadow:0 0 0 3px rgba(0,229,255,.06),0 0 25px rgba(0,229,255,.08); }
      .cyber-input::placeholder { color:rgba(100,140,170,.35); }
      .threat-tag { display:inline-flex;align-items:center;gap:7px;padding:5px 13px;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.8px;cursor:default;transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden; }
      .threat-tag:hover { transform:translateY(-2px) scale(1.04); }
      .ticker-content { display:inline-block; animation:data-scroll 22s linear infinite; }
      .shimmer-text { background:linear-gradient(90deg,#00FF41,#00E5FF,#00FFA3,#00FF41);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite; }
      .glass-lp { background:rgba(0,255,65,.03);border:1px solid rgba(0,255,65,.12);backdrop-filter:blur(12px); }
      nav a { text-decoration:none; }
    `;
    document.head.appendChild(s);
    const dot = document.createElement("div"); dot.id="cursor-dot";
    const ring = document.createElement("div"); ring.id="cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    let raf2, tx=0, ty=0, rx2=0, ry2=0;
    const moveCursor = e => { tx=e.clientX; ty=e.clientY; };
    const animCursor = () => { rx2+=(tx-rx2)*.18; ry2+=(ty-ry2)*.18; dot.style.left=tx+"px"; dot.style.top=ty+"px"; ring.style.left=rx2+"px"; ring.style.top=ry2+"px"; raf2=requestAnimationFrame(animCursor); };
    window.addEventListener("mousemove",moveCursor);
    raf2=requestAnimationFrame(animCursor);
    return () => { try{document.head.removeChild(link);document.head.removeChild(s);}catch(e){} try{document.body.removeChild(dot);document.body.removeChild(ring);}catch(e){} window.removeEventListener("mousemove",moveCursor); cancelAnimationFrame(raf2); };
  }, []);
  return null;
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   AURORA BACKGROUND (full hex grid + particles)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const AuroraBackground = ({ mx, my }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener("resize", () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; });
    const particles = Array.from({length:120}, ()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.5+.3,a:Math.random()*.4+.06,c:["#00E5FF","#00FFA3","#7C3AED","#4080FF"][Math.floor(Math.random()*4)]}));
    const hexNodes = Array.from({length:16}, ()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.1,vy:(Math.random()-.5)*.1,ph:Math.random()*Math.PI*2,ph2:Math.random()*Math.PI*2}));
    const drawHex = (x,y,r,color) => { ctx.beginPath(); for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);const px=x+r*Math.cos(a);const py=y+r*Math.sin(a);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);} ctx.closePath(); ctx.strokeStyle=color; ctx.lineWidth=.7; ctx.stroke(); };
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      const ox=((mx?.get?.()||W/2)-W/2)/W*22, oy=((my?.get?.()||H/2)-H/2)/H*14;
      const hs=72; ctx.save();
      for(let row=0;row<Math.ceil(H/hs)+2;row++) for(let col=0;col<Math.ceil(W/hs)+2;col++) drawHex(col*hs*1.73+(row%2)*hs*.865+ox*.3,row*hs*1.5+oy*.3-hs,"rgba(0,229,255,0.028)",hs*.48);
      ctx.restore();
      hexNodes.forEach(n=>{n.x+=n.vx+ox*.01;n.y+=n.vy+oy*.01;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;n.ph+=.015;n.ph2+=.022;const pulse=.2+Math.sin(n.ph)*.15;const nr=2.5+Math.sin(n.ph2)*1.2;const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,28);g.addColorStop(0,`rgba(0,229,255,${pulse})`);g.addColorStop(1,"transparent");ctx.beginPath();ctx.arc(n.x,n.y,28,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.beginPath();ctx.arc(n.x,n.y,nr,0,Math.PI*2);ctx.fillStyle=`rgba(0,229,255,${pulse+.12})`;ctx.fill();});
      for(let i=0;i<hexNodes.length;i++) for(let j=i+1;j<hexNodes.length;j++){const d=Math.hypot(hexNodes[i].x-hexNodes[j].x,hexNodes[i].y-hexNodes[j].y);if(d<250){const a=(1-d/250)*0.1;const gr=ctx.createLinearGradient(hexNodes[i].x,hexNodes[i].y,hexNodes[j].x,hexNodes[j].y);gr.addColorStop(0,`rgba(0,229,255,${a})`);gr.addColorStop(.5,`rgba(124,58,237,${a*.8})`);gr.addColorStop(1,`rgba(0,255,163,${a})`);ctx.beginPath();ctx.moveTo(hexNodes[i].x,hexNodes[i].y);ctx.lineTo(hexNodes[j].x,hexNodes[j].y);ctx.strokeStyle=gr;ctx.lineWidth=.8;ctx.stroke();}}
      particles.forEach(p=>{p.x+=p.vx+ox*.007;p.y+=p.vy+oy*.007;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c+Math.round(p.a*255).toString(16).padStart(2,"0");ctx.fill();});
      rafRef.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(rafRef.current);
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}} />;
};

const AuroraBlobs = () => (
  <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
    <div className="anim-aurora1" style={{position:"absolute",width:"90vw",height:"90vh",top:"-30vh",left:"-20vw",background:"radial-gradient(ellipse at center,rgba(0,229,255,.06) 0%,rgba(0,229,255,.02) 40%,transparent 70%)",filter:"blur(60px)"}}/>
    <div className="anim-aurora2" style={{position:"absolute",width:"80vw",height:"80vh",bottom:"-25vh",right:"-15vw",background:"radial-gradient(ellipse at center,rgba(124,58,237,.07) 0%,rgba(124,58,237,.02) 40%,transparent 70%)",filter:"blur(70px)"}}/>
    <div style={{position:"absolute",width:"60vw",height:"60vh",top:"30vh",left:"20vw",background:"radial-gradient(ellipse at center,rgba(0,255,163,.03) 0%,transparent 65%)",filter:"blur(80px)",animation:"aurora 28s ease-in-out infinite reverse"}}/>
  </div>
);

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   THREAT RADAR â€” working ping wave sonar
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const ThreatRadar = ({ mx, my }) => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const ppx = useTransform(mx, [0,typeof window!=="undefined"?window.innerWidth:1200],[-8,8]);
  const ppy = useTransform(my, [0,typeof window!=="undefined"?window.innerHeight:800],[-5,5]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx    = canvas.getContext("2d");
    const S   = 580;
    const DPR = Math.min(window.devicePixelRatio||1, 2);
    canvas.width  = S*DPR; canvas.height = S*DPR;
    canvas.style.width = S+"px"; canvas.style.height = S+"px";
    ctx.scale(DPR, DPR);
    const CX=S/2, CY=S/2, PAD=28, R=S/2-PAD;
    const G="#00FF41", GD=(a)=>`rgba(0,255,65,${a})`;
    let worldY = 0;
    const SPEED = 0.15;
    const THREATS = [
      { label:"PHISH-URL",  locked:true,  wx:-120, wy:-80  },
      { label:"SPOOF-DOM",  locked:true,  wx: 130, wy:-200 },
      { label:"MAL-ATTACH", locked:true,  wx:-60,  wy: 120 },
      { label:"TRACK-PXL",  locked:false, wx: 175, wy: 55  },
      { label:"HTML-INJ",   locked:false, wx:-185, wy: 250 },
      { label:"OBFUS-URL",  locked:true,  wx: 55,  wy:-310 },
      { label:"BEC-SIGNAL", locked:false, wx: 200, wy:-150 },
      { label:"URGENCY",    locked:false, wx:-25,  wy: 380 },
      { label:"C2-BEACON",  locked:true,  wx: 75,  wy: 280 },
      { label:"EXFIL",      locked:false, wx:-145, wy:-420 },
    ].map(t=>({...t, echoes:[], blinkT:0, visible:false, _cd:0}));
    const TRAIL = [], TRAIL_MAX = 55;
    let ping = null;
    const PING_SPEED = 0.55, PING_MAX = R*1.6, PING_HIT = 18;
    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      worldY += SPEED;
      const toScreen = (wx, wy) => ({ sx: CX + wx, sy: CY + (wy - worldY) });
      TRAIL.push({x:CX, y:CY});
      if(TRAIL.length>TRAIL_MAX) TRAIL.shift();
      if(!ping) { ping = { sx:CX, sy:CY, r:0, alpha:1.0 }; THREATS.forEach(t=>{ t._cd=0; }); }
      ping.r    += PING_SPEED;
      ping.alpha = Math.max(0, 1 - ping.r/PING_MAX);
      THREATS.forEach(t => {
        if(t._cd>0){ t._cd--; return; }
        const {sx:tx, sy:ty} = toScreen(t.wx, t.wy);
        const dist = Math.hypot(tx - ping.sx, ty - ping.sy);
        if(Math.abs(ping.r - dist) < PING_HIT) { t.visible = true; t.echoes.push({ r:0, alpha:1.0 }); t._cd = 9999; }
      });
      if(ping.r >= PING_MAX) ping = null;
      // Frame
      ctx.strokeStyle="rgba(0,180,50,0.4)"; ctx.lineWidth=1.5; ctx.strokeRect(1,1,S-2,S-2);
      ctx.strokeStyle="rgba(0,180,50,0.13)"; ctx.lineWidth=0.5; ctx.strokeRect(PAD*.5,PAD*.5,S-PAD,S-PAD);
      // Red bg grid
      const GS=26; ctx.strokeStyle="rgba(200,40,0,0.16)"; ctx.lineWidth=0.5;
      for(let x=0;x<S;x+=GS){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,S);ctx.stroke();}
      for(let y=0;y<S;y+=GS){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(S,y);ctx.stroke();}
      // Clip
      ctx.save(); ctx.beginPath(); ctx.arc(CX,CY,R,0,Math.PI*2); ctx.clip();
      const bg=ctx.createRadialGradient(CX,CY,0,CX,CY,R); bg.addColorStop(0,"rgba(0,36,8,0.97)"); bg.addColorStop(0.6,"rgba(0,20,4,0.98)"); bg.addColorStop(1,"rgba(0,6,1,1)"); ctx.fillStyle=bg; ctx.fillRect(0,0,S,S);
      ctx.strokeStyle="rgba(0,220,50,0.055)"; ctx.lineWidth=0.5;
      const goy=((worldY%GS)+GS)%GS;
      for(let x=0;x<S;x+=GS){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,S);ctx.stroke();}
      for(let y=goy-GS;y<S+GS;y+=GS){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(S,y);ctx.stroke();}
      for(let i=1;i<=3;i++){const rr=(R/3)*i; ctx.beginPath(); ctx.arc(CX,CY,rr,0,Math.PI*2); ctx.strokeStyle=i===3?GD(0.42):GD(0.12); ctx.lineWidth=i===3?1.3:0.6; ctx.stroke();}
      [[CX-R,CY,CX+R,CY],[CX,CY-R,CX,CY+R]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=GD(0.13);ctx.lineWidth=0.6;ctx.stroke();});
      if(ping){
        const pa=ping.alpha;
        if(ping.r>12){const wake=ctx.createRadialGradient(ping.sx,ping.sy,ping.r*.55,ping.sx,ping.sy,ping.r);wake.addColorStop(0,"transparent");wake.addColorStop(0.7,GD(pa*.04));wake.addColorStop(1,GD(pa*.16));ctx.beginPath();ctx.arc(ping.sx,ping.sy,ping.r,0,Math.PI*2);ctx.fillStyle=wake;ctx.fill();}
        ctx.beginPath(); ctx.arc(ping.sx,ping.sy,ping.r,0,Math.PI*2); ctx.strokeStyle=`rgba(140,255,155,${pa*.88})`; ctx.lineWidth=2.2; ctx.shadowColor="#00FF41"; ctx.shadowBlur=20; ctx.stroke(); ctx.shadowBlur=0;
        if(ping.r>14){ctx.beginPath();ctx.arc(ping.sx,ping.sy,ping.r-10,0,Math.PI*2);ctx.strokeStyle=GD(pa*.1);ctx.lineWidth=7;ctx.stroke();}
      }
      THREATS.forEach(t => {
        const {sx:bx, sy:by} = toScreen(t.wx, t.wy);
        if(bx<-80||bx>S+80||by<-80||by>S+80) return;
        t.echoes = t.echoes.filter(e=>e.alpha>0.005);
        t.echoes.forEach(e => {
          e.r += 0.28; e.alpha = Math.max(0, e.alpha - 0.006);
          const col = t.locked?"255,120,120":"0,255,65";
          for(let ri=0;ri<2;ri++){const er=e.r-ri*12;if(er<=0||er>30)continue;const ea=Math.max(0,e.alpha-ri*.35);ctx.beginPath();ctx.arc(bx,by,er,0,Math.PI*2);ctx.strokeStyle=`rgba(${col},${ea*.9})`;ctx.lineWidth=1.4-ri*.4;ctx.shadowColor=t.locked?"#FF3030":"#00FF41";ctx.shadowBlur=6;ctx.stroke();ctx.shadowBlur=0;}
        });
        if(!t.visible) return;
        const isEchoing = t.echoes.length>0;
        if(!isEchoing) return;
        t.blinkT += t.locked?.07:0;
        const blinkOn = !t.locked||Math.sin(t.blinkT*3.5)>-0.15;
        const iconA   = Math.min(1,(t.echoes[0]?.alpha??0)*3);
        const halo=ctx.createRadialGradient(bx,by,0,bx,by,22);
        halo.addColorStop(0,t.locked?`rgba(255,60,60,${iconA*.5})`:GD(iconA*.42));
        halo.addColorStop(1,"transparent");
        ctx.beginPath(); ctx.arc(bx,by,22,0,Math.PI*2); ctx.fillStyle=halo; ctx.fill();
        if(blinkOn){ctx.save();ctx.globalAlpha=iconA;ctx.translate(bx,by);ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(-5,5);ctx.lineTo(5,5);ctx.closePath();ctx.fillStyle=t.locked?"rgba(255,80,80,1)":G;ctx.shadowColor=t.locked?"#FF3030":"#00FF41";ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;ctx.restore();}
        if(t.locked&&blinkOn){const SZ=14,ARM=4;ctx.globalAlpha=iconA*.85;ctx.strokeStyle="rgba(255,80,80,1)";ctx.lineWidth=1.3;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy])=>{ctx.beginPath();ctx.moveTo(bx+sx*SZ,by+sy*(SZ-ARM));ctx.lineTo(bx+sx*SZ,by+sy*SZ);ctx.lineTo(bx+sx*(SZ-ARM),by+sy*SZ);ctx.stroke();});ctx.globalAlpha=1;}
        const right=bx>CX, lx=bx+(right?22:-22), ly=by-4;
        ctx.globalAlpha=iconA*.88;
        ctx.beginPath(); ctx.moveTo(bx+(right?11:-11),by); ctx.lineTo(lx,ly+5); ctx.strokeStyle=t.locked?"rgba(255,80,80,0.4)":GD(.35); ctx.lineWidth=.7; ctx.stroke();
        ctx.fillStyle=t.locked?"rgba(255,110,110,1)":G; ctx.font="bold 9px 'JetBrains Mono',monospace"; ctx.textAlign=right?"left":"right"; ctx.fillText(t.label,lx+(right?2:-2),ly); ctx.globalAlpha=1; ctx.textAlign="left";
      });
      // Trail
      for(let i=1;i<TRAIL.length;i++){const frac=i/TRAIL.length;ctx.beginPath();ctx.moveTo(TRAIL[i-1].x,TRAIL[i-1].y);ctx.lineTo(TRAIL[i].x,TRAIL[i].y);ctx.strokeStyle=GD(frac*.38);ctx.lineWidth=frac*2.5;ctx.stroke();}
      // Emitter
      const eg=ctx.createRadialGradient(CX,CY,0,CX,CY,22);eg.addColorStop(0,"rgba(180,255,180,.55)");eg.addColorStop(1,"transparent");ctx.beginPath();ctx.arc(CX,CY,22,0,Math.PI*2);ctx.fillStyle=eg;ctx.fill();
      ctx.beginPath();ctx.moveTo(CX,CY-8);ctx.lineTo(CX,CY-20);ctx.strokeStyle="rgba(200,255,200,.8)";ctx.lineWidth=1.8;ctx.shadowColor="#00FF41";ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
      ctx.beginPath();ctx.arc(CX,CY,4,0,Math.PI*2);ctx.fillStyle="rgba(220,255,220,1)";ctx.shadowColor="#00FF41";ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;
      ctx.restore();
      // Outer rims
      [R+4,R+10,R+22].forEach((r2,i)=>{ctx.beginPath();ctx.arc(CX,CY,r2,0,Math.PI*2);ctx.strokeStyle=GD([0.38,0.14,0.05][i]);ctx.lineWidth=[1.8,1,.5][i];if(i===0){ctx.shadowColor="#00FF41";ctx.shadowBlur=16;}ctx.stroke();ctx.shadowBlur=0;});
      for(let i=0;i<72;i++){const a=(i/72)*Math.PI*2,maj=i%6===0,med=i%3===0,inner=maj?R+4:med?R+6:R+8;const x1=CX+Math.cos(a)*inner,y1=CY+Math.sin(a)*inner,x2=CX+Math.cos(a)*(R+16),y2=CY+Math.sin(a)*(R+16);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=GD(maj?.7:med?.35:.15);ctx.lineWidth=maj?1.5:med?.9:.5;ctx.stroke();}
      ctx.font="bold 10px 'JetBrains Mono',monospace"; ctx.textAlign="center";
      [[0,"000"],[Math.PI/2,"090"],[Math.PI,"180"],[Math.PI*1.5,"270"]].forEach(([a,l])=>{const lx2=CX+Math.cos(a)*(R+28),ly2=CY+Math.sin(a)*(R+28)+3.5;ctx.fillStyle=GD(.6);ctx.fillText(l+"Â°",lx2,ly2);});
      ctx.save();ctx.font="bold 8px 'JetBrains Mono',monospace";ctx.fillStyle=GD(.5);ctx.textAlign="center";
      const arcLabel="â—†  ACTIVE THREAT DETECTION SYSTEM  â—†",arcR=R+38,arcSpan=Math.PI*.72;
      for(let ci=0;ci<arcLabel.length;ci++){const t2=ci/(arcLabel.length-1),charA=-Math.PI/2-arcSpan/2+t2*arcSpan;ctx.save();ctx.translate(CX+Math.cos(charA)*arcR,CY+Math.sin(charA)*arcR);ctx.rotate(charA+Math.PI/2);ctx.fillText(arcLabel[ci],0,0);ctx.restore();}
      ctx.restore();
      ctx.save();ctx.font="8px 'JetBrains Mono',monospace";ctx.fillStyle=GD(.35);ctx.textAlign="center";
      const botLabel="â—‡  EMAIL THREAT ANALYZER v2.0  â—‡",botR=R+38,botSpan=Math.PI*.6;
      for(let ci=0;ci<botLabel.length;ci++){const t2=ci/(botLabel.length-1),charA=Math.PI/2-botSpan/2+t2*botSpan;ctx.save();ctx.translate(CX+Math.cos(charA)*botR,CY+Math.sin(charA)*botR);ctx.rotate(charA-Math.PI/2);ctx.fillText(botLabel[ci],0,0);ctx.restore();}
      ctx.restore();
      const found=THREATS.filter(t=>t.visible);
      const panelH=120,panelW=44,panelY2=CY-panelH/2;
      const LP=PAD*.4-2;
      ctx.fillStyle="rgba(0,255,65,0.03)";ctx.fillRect(LP-panelW+2,panelY2,panelW,panelH);ctx.strokeStyle=GD(.2);ctx.lineWidth=.7;ctx.strokeRect(LP-panelW+2,panelY2,panelW,panelH);
      const barsX=LP-panelW+6;ctx.font="7px 'JetBrains Mono',monospace";ctx.textAlign="left";ctx.fillStyle=GD(.4);ctx.fillText("SIG",barsX,panelY2+10);
      for(let b=0;b<5;b++){const bh=6+b*5,active=b<Math.floor(3+Math.sin(worldY*.03)*1.5);ctx.fillStyle=active?GD(.7):GD(.12);if(active){ctx.shadowColor="#00FF41";ctx.shadowBlur=4;}ctx.fillRect(barsX+b*7,panelY2+28,4,bh);ctx.shadowBlur=0;}
      ctx.fillStyle=GD(.5);ctx.fillText("LAT",barsX,panelY2+62);ctx.fillStyle=GD(.8);ctx.fillText((10.8234+(worldY*.5*.0001)).toFixed(4),barsX,panelY2+72);
      ctx.fillStyle=GD(.5);ctx.fillText("LON",barsX,panelY2+84);ctx.fillStyle=GD(.8);ctx.fillText((106.6297+(worldY*.5*.00008)).toFixed(4),barsX,panelY2+94);
      ctx.fillStyle=GD(.5);ctx.fillText("ALT",barsX,panelY2+108);ctx.fillStyle=GD(.8);ctx.fillText(String(Math.floor(worldY*.3)%9999).padStart(4,"0")+"m",barsX,panelY2+118);
      const rpX=S-PAD*.4+2;
      ctx.fillStyle="rgba(0,255,65,0.03)";ctx.fillRect(rpX-2,panelY2,panelW,panelH);ctx.strokeStyle=GD(.2);ctx.lineWidth=.7;ctx.strokeRect(rpX-2,panelY2,panelW,panelH);
      const rx3=rpX+3;ctx.font="7px 'JetBrains Mono',monospace";ctx.textAlign="left";
      ctx.fillStyle=GD(.5);ctx.fillText("THRT",rx3,panelY2+10);ctx.fillStyle="rgba(255,100,100,.9)";ctx.font="bold 16px 'JetBrains Mono',monospace";ctx.fillText(String(found.filter(t=>t.locked).length).padStart(2,"0"),rx3,panelY2+28);ctx.font="7px 'JetBrains Mono',monospace";ctx.fillStyle=GD(.4);ctx.fillText("LOCK",rx3,panelY2+38);
      const pg=panelW-8;ctx.fillStyle=GD(.5);ctx.fillText("SCAN",rx3,panelY2+54);ctx.fillStyle=GD(.1);ctx.fillRect(rx3,panelY2+58,pg,5);const pf=ping?ping.r/PING_MAX:1;ctx.fillStyle=GD(.7);ctx.shadowColor="#00FF41";ctx.shadowBlur=4;ctx.fillRect(rx3,panelY2+58,pg*pf,5);ctx.shadowBlur=0;
      ctx.fillStyle=GD(.4);ctx.font="7px 'JetBrains Mono',monospace";ctx.fillText("FREQ",rx3,panelY2+76);ctx.fillStyle=GD(.8);ctx.fillText("0.55G",rx3,panelY2+86);ctx.fillStyle=GD(.4);ctx.fillText("MODE",rx3,panelY2+100);ctx.fillStyle=GD(.7);ctx.fillText("SCAN",rx3,panelY2+110);
      const blinkOn2=Math.sin(worldY*.08)>0;
      if(blinkOn2){ctx.beginPath();ctx.arc(S-PAD*.4-4,PAD*.4+4,3.5,0,Math.PI*2);ctx.fillStyle="rgba(255,80,80,.9)";ctx.shadowColor="#FF4040";ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;}
      ctx.font="7px 'JetBrains Mono',monospace";ctx.textAlign="right";ctx.fillStyle=GD(.4);ctx.fillText("LIVE",S-PAD*.4-10,PAD*.4+8);
      ctx.fillStyle=G;ctx.font="bold 9px 'JetBrains Mono',monospace";ctx.textAlign="left";ctx.globalAlpha=.75;ctx.fillText("SENTINEL:",4,14);
      let hx=70;found.forEach(t=>{ctx.fillStyle=t.locked?"rgba(255,100,100,.9)":G;ctx.fillText(t.label,hx,14);hx+=ctx.measureText(t.label).width+8;});
      ctx.textAlign="right";ctx.globalAlpha=.5;ctx.fillText(`${found.length}/${THREATS.length} FOUND`,S-4,S-5);ctx.globalAlpha=1;ctx.textAlign="left";
      [[PAD*.4,PAD*.4,1,1],[S-PAD*.4,PAD*.4,-1,1],[S-PAD*.4,S-PAD*.4,-1,-1],[PAD*.4,S-PAD*.4,1,-1]].forEach(([bx2,by2,sx2,sy2])=>{ctx.strokeStyle=GD(.5);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(bx2,by2+sy2*10);ctx.lineTo(bx2,by2);ctx.lineTo(bx2+sx2*10,by2);ctx.stroke();ctx.beginPath();ctx.arc(bx2,by2,1.8,0,Math.PI*2);ctx.fillStyle=GD(.7);ctx.fill();});
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return (
    <motion.div style={{x:ppx, y:ppy}} className="anim-float">
      <div style={{position:"relative",width:580,height:580,margin:"0 auto"}}>
        <div style={{position:"absolute",inset:-48,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,255,65,0.08) 0%,transparent 60%)",animation:"pulse-glow 4s ease-in-out infinite",pointerEvents:"none"}}/>
        <canvas ref={canvasRef} style={{display:"block"}}/>
      </div>
    </motion.div>
  );
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SHARED SMALL COMPONENTS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const ScanLine = () => (
  <div style={{position:"fixed",left:0,right:0,height:2,zIndex:200,pointerEvents:"none",background:"linear-gradient(90deg,transparent 0%,rgba(0,229,255,.08) 15%,rgba(0,229,255,.9) 50%,rgba(0,229,255,.08) 85%,transparent 100%)",boxShadow:"0 0 20px rgba(0,229,255,.6),0 0 60px rgba(0,229,255,.3)",animation:"scan-v 2.6s linear infinite"}} />
);
const TypeWriter = ({texts}) => {
  const [i,setI]=useState(0),[disp,setDisp]=useState(""),[ci,setCi]=useState(0);
  useEffect(()=>{const cur=texts[i%texts.length];if(ci<cur.length){const t=setTimeout(()=>{setDisp(cur.slice(0,ci+1));setCi(c=>c+1);},36);return()=>clearTimeout(t);}const t=setTimeout(()=>{setI(x=>x+1);setCi(0);setDisp("");},1100);return()=>clearTimeout(t);},[ci,i]);
  return <span className="f-mono" style={{color:"#00E5FF",fontSize:12,letterSpacing:.8}}>{disp}<span style={{animation:"blink 1s step-end infinite",color:"#00FFA3"}}>â–Œ</span></span>;
};
const AnimNum = ({to, suffix=""}) => {
  const [v,setV]=useState(0);
  useEffect(()=>{let s=null;const f=(ts)=>{if(!s)s=ts;const p=Math.min((ts-s)/1500,1);setV(Math.round(p*to));if(p<1)requestAnimationFrame(f);};requestAnimationFrame(f);},[to]);
  return <span>{v}{suffix}</span>;
};
const RiskGauge = ({score}) => {
  const R=58,C=2*Math.PI*R,pct=score/100,stopA=pct<.3?"#00FFA3":pct<.6?"#FFD60A":"#FF4D6D",stopB=pct<.3?"#00E5FF":pct<.6?"#FF9500":"#FF0055",label=pct<.3?"LOW RISK":pct<.6?"MODERATE":"HIGH RISK",glowColor=pct<.3?"rgba(0,255,163,.4)":pct<.6?"rgba(255,214,10,.4)":"rgba(255,77,109,.4)";
  return (<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><div style={{position:"relative",width:148,height:148}}><svg width="148" height="148" style={{transform:"rotate(-90deg)",position:"absolute"}}><defs><linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={stopA}/><stop offset="100%" stopColor={stopB}/></linearGradient></defs><circle cx="74" cy="74" r={R} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="9"/><motion.circle cx="74" cy="74" r={R} fill="none" stroke="url(#arc-grad)" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} initial={{strokeDashoffset:C}} animate={{strokeDashoffset:C-(pct*C)}} transition={{duration:1.8,ease:"easeOut"}} style={{filter:`drop-shadow(0 0 8px ${glowColor})`}}/></svg><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><motion.div className="f-orb" style={{fontSize:32,fontWeight:900,color:stopA,lineHeight:1,textShadow:`0 0 20px ${stopA}88`}} initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:.5,type:"spring"}}><AnimNum to={score}/></motion.div><div className="f-mono" style={{fontSize:8,color:stopA,letterSpacing:2,marginTop:4,opacity:.7}}>/100</div></div></div><div className="f-mono" style={{fontSize:9,letterSpacing:3,color:stopA,background:`${stopA}12`,border:`1px solid ${stopA}30`,padding:"3px 12px",borderRadius:4}}>{label}</div></div>);
};
const StatCard = ({icon,label,value,color,raw,delay=0}) => (<motion.div initial={{opacity:0,y:20,scale:.95}} animate={{opacity:1,y:0,scale:1}} transition={{delay,type:"spring",stiffness:160}} whileHover={{y:-3,scale:1.03}} style={{background:`linear-gradient(135deg,${color}08,rgba(0,0,0,.4))`,border:`1px solid ${color}20`,borderRadius:12,padding:"18px 14px",textAlign:"center",position:"relative",overflow:"hidden",cursor:"default"}}><div style={{position:"absolute",top:-10,right:-10,width:50,height:50,background:`radial-gradient(circle,${color}18,transparent 70%)`,borderRadius:"50%"}}/><div style={{fontSize:24,marginBottom:10}}>{icon}</div><div className="f-orb" style={{fontSize:26,color,fontWeight:900,lineHeight:1,textShadow:`0 0 16px ${color}66`}}>{raw?value:<AnimNum to={typeof value==="number"?value:0}/>}</div><div className="f-mono" style={{fontSize:8,color:"rgba(100,140,170,.6)",letterSpacing:1.5,marginTop:6}}>{label}</div></motion.div>);
const Panel = ({title,icon,color="#00E5FF",children,delay=0}) => {
  const [open,setOpen]=useState(false);
  return (<motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay}} className="glass-card grad-border" style={{marginBottom:10,overflow:"hidden"}}><button onClick={()=>setOpen(o=>!o)} style={{width:"100%",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${color}18,${color}06)`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{icon}</div><span className="f-orb" style={{color:"#A8C0D8",fontSize:10,letterSpacing:2.5}}>{title}</span></div><motion.div animate={{rotate:open?180:0}} transition={{duration:.25}} style={{width:24,height:24,borderRadius:6,background:`${color}12`,border:`1px solid ${color}25`,display:"flex",alignItems:"center",justifyContent:"center",color}}><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M5 7L1 3h8z"/></svg></motion.div></button><AnimatePresence>{open&&(<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.3,ease:[.4,0,.2,1]}}><div style={{padding:"4px 20px 20px",borderTop:`1px solid ${color}12`}}>{children}</div></motion.div>)}</AnimatePresence></motion.div>);
};
const Tag = ({label,color,delay=0}) => (<motion.div className="threat-tag" initial={{opacity:0,scale:.7,y:8}} animate={{opacity:1,scale:1,y:0}} transition={{delay,type:"spring",stiffness:240,damping:16}} style={{color,background:`${color}0D`,border:`1px solid ${color}38`,boxShadow:`0 0 12px ${color}18`}}><div style={{width:5,height:5,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`,animation:"pulse-ring 2s ease-in-out infinite"}}/>{label}</motion.div>);
const Verdict = ({ v }) => {
  const map = {
    HAM: { c: "#00FFA3", label: "LEGITIMATE", sub: "No threats detected" },
    SUSPICIOUS: { c: "#FFD60A", label: "SUSPICIOUS", sub: "Manual review advised" },
    SPAM: { c: "#FF9F1A", label: "SPAM", sub: "Likely unsolicited or deceptive content" },
    THREAT: { c: "#FF4D6D", label: "THREAT", sub: "Malicious email confirmed" },
  };
  const key = (v || "").toUpperCase();
  const { c, label, sub } = map[key] || map.SUSPICIOUS;
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
      <div className="f-mono" style={{ fontSize: 9, color: `${c}88`, letterSpacing: 4, marginBottom: 8 }}>
        VERDICT
      </div>
      <div
        className="f-orb"
        style={{ fontSize: 26, fontWeight: 900, color: c, letterSpacing: 2, textShadow: `0 0 30px ${c}99` }}
      >
        {label}
      </div>
      <div className="f-mono" style={{ fontSize: 10, color: `${c}66`, marginTop: 6, letterSpacing: 0.5 }}>
        {sub}
      </div>
    </motion.div>
  );
};
const BarStat = ({label,val,color,delay=0}) => (<motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span className="f-mono" style={{fontSize:9,color:"rgba(100,140,170,.6)",letterSpacing:1.5}}>{label}</span><span className="f-mono" style={{fontSize:12,color,fontWeight:500}}><AnimNum to={val} suffix="%"/></span></div><div style={{height:5,background:"rgba(255,255,255,.04)",borderRadius:99,overflow:"hidden",position:"relative"}}><motion.div initial={{width:0}} animate={{width:`${val}%`}} transition={{duration:1.5,delay:delay+.2,ease:"easeOut"}} style={{height:"100%",background:`linear-gradient(90deg,${color}60,${color})`,borderRadius:99,boxShadow:`0 0 10px ${color}`}}/></div></motion.div>);
const ScanAnim = () => (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20,padding:"32px 0"}}><div style={{position:"relative",width:88,height:88}}><div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(0,229,255,.15)",borderTopColor:"#00E5FF",animation:"spin 1s linear infinite"}}/><div style={{position:"absolute",inset:10,borderRadius:"50%",border:"1.5px solid rgba(0,255,163,.12)",borderBottomColor:"#00FFA3",animation:"cspin 1.6s linear infinite"}}/><div style={{position:"absolute",inset:20,borderRadius:"50%",border:"1px solid rgba(124,58,237,.15)",borderLeftColor:"#7C3AED",animation:"spin 2.2s linear infinite"}}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:14,height:14,borderRadius:"50%",background:"#00E5FF",boxShadow:"0 0 20px #00E5FF,0 0 40px #00E5FF66",animation:"pulse-ring 1.2s ease-in-out infinite"}}/></div></div><TypeWriter texts={["Parsing MIME structure...","Resolving sender domain...","Extracting anchor tags...","Analyzing language entropy...","Checking URL reputation...","Computing threat vectors...","Generating AI verdict..."]}/><div style={{display:"flex",gap:6,alignItems:"center"}}>{[0,1,2,3,4,5].map(i=>(<motion.div key={i} style={{width:3,height:3,borderRadius:"50%",background:"#00E5FF"}} animate={{opacity:[.15,1,.15],scaleY:[.8,1.6,.8]}} transition={{duration:1,delay:i*.1,repeat:Infinity}}/>))}</div></motion.div>);

const DataTicker = () => {
  const items="THREAT DB UPDATED 03:24:11 UTC  â—†  247,832 PHISHING DOMAINS TRACKED  â—†  AI MODEL v2.4.1  â—†  LATENCY 12ms  â—†  UPTIME 99.98%  â—†  NEW VECTOR: BEC CAMPAIGN DETECTED  â—†  LAST SCAN: 0.3s AGO  â—†  ";
  return (<div style={{borderTop:"1px solid rgba(0,229,255,.08)",borderBottom:"1px solid rgba(0,229,255,.08)",background:"rgba(0,229,255,.02)",padding:"7px 0",overflow:"hidden",position:"relative",zIndex:5}}><div style={{position:"absolute",left:0,top:0,bottom:0,width:60,background:"linear-gradient(to right,#020812,transparent)",zIndex:2}}/><div style={{position:"absolute",right:0,top:0,bottom:0,width:60,background:"linear-gradient(to left,#020812,transparent)",zIndex:2}}/><div className="ticker-content f-mono" style={{color:"rgba(0,229,255,.35)",fontSize:10,letterSpacing:1.5}}>{items+items}</div></div>);
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DEMO DATA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const EMPTY_ANALYSIS = {
  verdict: "HAM",
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
  const key = String(verdict || "").trim().toUpperCase();
  if (!key) return "SUSPICIOUS";
  if (["HAM", "SAFE", "LEGITIMATE", "LEGIT"].includes(key)) return "HAM";
  if (["SUSPICIOUS", "REVIEW"].includes(key)) return "SUSPICIOUS";
  if (["SPAM"].includes(key)) return "SPAM";
  if (["THREAT", "MALICIOUS"].includes(key)) return "THREAT";
  return "SUSPICIOUS";
};

const toPercent = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  if (n <= 1) return Math.max(0, Math.min(100, Math.round(n * 100)));
  return Math.max(0, Math.min(100, Math.round(n)));
};

const urlKey = (url) => String(url || "").trim().toLowerCase().replace(/\/+$/, "");

const deriveAttachmentExt = (filename) => {
  const m = String(filename || "").match(/(\.[a-z0-9]{1,8})$/i);
  return m ? m[1].toLowerCase() : "";
};

const classifyHeaderDomain = (headerFlags) => {
  const hasMismatch = headerFlags.some((f) => /differs from sender domain/i.test(f));
  return hasMismatch ? "MISMATCH" : "ALIGNED";
};

const mapApiResponseToView = (payload) => {
  const headerFlags = Array.isArray(payload?.header_flags) ? payload.header_flags : [];
  const urlFlags = Array.isArray(payload?.url_flags) ? payload.url_flags : [];
  const attachmentFlags = Array.isArray(payload?.attachment_flags) ? payload.attachment_flags : [];
  const languageFlags = Array.isArray(payload?.language_flags) ? payload.language_flags : [];
  const htmlFlags = Array.isArray(payload?.html_flags) ? payload.html_flags : [];
  const indicators = Array.isArray(payload?.indicators) ? payload.indicators : [];

  const extractedUrls = Array.isArray(payload?.extracted_urls) ? payload.extracted_urls : [];
  const suspiciousUrls = new Set(
    (Array.isArray(payload?.suspicious_urls) ? payload.suspicious_urls : []).map((u) => urlKey(u)),
  );
  const trackingUrls = new Set(
    (Array.isArray(payload?.tracking_urls) ? payload.tracking_urls : []).map((u) => urlKey(u)),
  );

  const attachmentNames = Array.isArray(payload?.attachment_names) ? payload.attachment_names : [];

  const threatSignals = indicators.length
    ? indicators.filter((x) => typeof x === "string" && x.trim()).slice(0, 8)
    : [...headerFlags, ...urlFlags, ...attachmentFlags, ...languageFlags].slice(0, 8);

  return {
    verdict: normalizeVerdict(payload?.verdict),
    confidence: toPercent(payload?.confidence),
    spamProb: toPercent(payload?.spam_probability),
    riskScore: toPercent(payload?.risk_score),
    threats: threatSignals,
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
      const danger = [".exe", ".js", ".scr", ".bat", ".cmd", ".ps1", ".vbs", ".docm", ".xlsm"].includes(ext);
      return { name, ext, danger };
    }),
    kw: languageFlags,
    stats: {
      links: Number(payload?.url_count || extractedUrls.length || 0),
      html: Boolean(payload?.has_html || htmlFlags.length),
      attach: Number(payload?.attachment_count || attachmentNames.length || 0),
      phishKw: languageFlags.filter((x) => /phishing/i.test(x)).length,
    },
  };
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   LANDING PAGE COMPONENTS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const LandingTicker = () => {
  const items=["â¬¡ 2.4B THREATS BLOCKED TODAY","â—ˆ 99.97% DETECTION RATE","â—† <0.3ms SCAN LATENCY","â¬¡ 140+ THREAT VECTORS","â—ˆ SOC2 TYPE II CERTIFIED","â—† ZERO TRUST ARCHITECTURE","â¬¡ AI-POWERED ENGINE","â—ˆ REAL-TIME INTELLIGENCE","â—† 50M+ EMAILS SCANNED","â¬¡ ENTERPRISE GRADE"];
  const str=items.join("    ");
  return (<div style={{overflow:"hidden",borderTop:"1px solid rgba(0,255,65,.1)",borderBottom:"1px solid rgba(0,255,65,.1)",background:"rgba(0,255,65,.02)",padding:"10px 0",position:"relative",zIndex:10}}><div style={{display:"flex",whiteSpace:"nowrap",animation:"ticker 40s linear infinite"}}>{[str,str].map((s,i)=>(<span key={i} className="f-mono" style={{color:"rgba(0,255,65,.5)",fontSize:10,letterSpacing:2,paddingRight:40}}>{s}</span>))}</div></div>);
};
const Counter = ({target,suffix="",label,color="#00FF41"}) => {
  const [count,setCount]=useState(0),ref=useRef(null);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){let startTime=null;const step=ts=>{if(!startTime)startTime=ts;const prog=Math.min((ts-startTime)/2000,1);const ease=1-Math.pow(1-prog,3);setCount(Math.floor(ease*target));if(prog<1)requestAnimationFrame(step);};requestAnimationFrame(step);}},{threshold:.5});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[target]);
  const fmt=n=>{if(n>=1e9)return(n/1e9).toFixed(1)+"B";if(n>=1e6)return(n/1e6).toFixed(0)+"M";if(n>=1e3)return(n/1e3).toFixed(0)+"K";return n.toLocaleString();};
  return (<div ref={ref} style={{textAlign:"center",padding:"32px 16px",borderRight:"1px solid rgba(0,255,65,.06)"}}><div className="f-orb" style={{fontSize:"clamp(28px,3vw,44px)",fontWeight:900,color,lineHeight:1,letterSpacing:-1}}>{fmt(count)}{suffix}</div><div className="f-mono" style={{color:"rgba(200,220,238,.5)",fontSize:10,letterSpacing:2,marginTop:10,textTransform:"uppercase"}}>{label}</div></div>);
};
const FeatureCard = ({icon,title,desc,color="#00FF41",delay=0}) => {
  const [hov,setHov]=useState(false);
  const col=color==="red"?"255,60,60":color==="#00E5FF"?"0,229,255":"0,255,65";
  return (<motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6,delay}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{padding:"32px 28px",borderRadius:8,cursor:"none",background:hov?`rgba(${col},.06)`:"rgba(0,255,65,.025)",border:`1px solid rgba(${col},${hov?.25:.1})`,transition:"all .35s ease",boxShadow:hov?`0 8px 40px rgba(${col},.08)`:"none"}}><div style={{width:44,height:44,borderRadius:8,background:`rgba(${col},.1)`,border:`1px solid rgba(${col},.25)`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:20}}>{icon}</div><div className="f-orb" style={{color:color==="red"?"#FF6060":color==="#00E5FF"?"#00E5FF":"#00FF41",fontSize:13,fontWeight:600,letterSpacing:1.5,marginBottom:12}}>{title}</div><div style={{color:"rgba(200,220,238,.6)",fontSize:14,lineHeight:1.7}}>{desc}</div></motion.div>);
};
const PricingCard = ({tier,price,period="/mo",features,highlight=false,delay=0,onStart}) => {
  const [hov,setHov]=useState(false);
  return (<motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6,delay}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{padding:"36px 28px",borderRadius:8,cursor:"none",position:"relative",background:highlight?"rgba(0,255,65,.06)":"rgba(0,20,8,.6)",border:highlight?"1px solid rgba(0,255,65,.35)":"1px solid rgba(0,255,65,.1)",boxShadow:highlight?"0 0 60px rgba(0,255,65,.1),inset 0 0 40px rgba(0,255,65,.03)":"none",transform:(highlight||hov)?"translateY(-6px)":"translateY(0)",transition:"all .35s ease"}}>{highlight&&<div className="f-mono" style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"#00FF41",color:"#020812",padding:"4px 16px",borderRadius:99,fontSize:9,fontWeight:700,letterSpacing:2}}>MOST POPULAR</div>}<div className="f-mono" style={{color:"rgba(0,255,65,.6)",fontSize:10,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>{tier}</div><div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:24}}><span className="f-orb" style={{fontSize:42,fontWeight:900,color:highlight?"#00FF41":"#C8DCEE"}}>${price}</span><span className="f-mono" style={{color:"rgba(200,220,238,.4)",fontSize:12}}>{period}</span></div><div style={{borderTop:"1px solid rgba(0,255,65,.1)",paddingTop:24,display:"flex",flexDirection:"column",gap:14}}>{features.map((f,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10}}><span style={{color:"#00FF41",fontSize:10}}>â—†</span><span className="f-mono" style={{color:"rgba(200,220,238,.7)",fontSize:12}}>{f}</span></div>))}</div><button className="f-orb" onClick={onStart} style={{width:"100%",marginTop:28,padding:"12px",borderRadius:4,fontSize:11,fontWeight:700,letterSpacing:2,cursor:"none",background:highlight?"rgba(0,255,65,.15)":"transparent",border:highlight?"1px solid rgba(0,255,65,.5)":"1px solid rgba(0,255,65,.2)",color:highlight?"#00FF41":"rgba(0,255,65,.6)",transition:"all .25s"}} onMouseEnter={e=>{e.target.style.background="rgba(0,255,65,.25)";e.target.style.boxShadow="0 0 20px rgba(0,255,65,.15)";}} onMouseLeave={e=>{e.target.style.background=highlight?"rgba(0,255,65,.15)":"transparent";e.target.style.boxShadow="none";}}>GET STARTED</button></motion.div>);
};
const Step=({num,title,desc,delay=0})=>(<motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.6,delay}} style={{display:"flex",gap:24,alignItems:"flex-start"}}><div style={{flexShrink:0,width:52,height:52,borderRadius:"50%",border:"1px solid rgba(0,255,65,.3)",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,255,65,.06)"}}><span className="f-orb" style={{color:"#00FF41",fontSize:16,fontWeight:700}}>{num}</span></div><div><div className="f-orb" style={{color:"#00FF41",fontSize:13,fontWeight:600,letterSpacing:1,marginBottom:8}}>{title}</div><div style={{color:"rgba(200,220,238,.6)",fontSize:14,lineHeight:1.7}}>{desc}</div></div></motion.div>);
const Testimonial=({quote,name,role,company,delay=0})=>(<motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6,delay}} className="glass-lp" style={{padding:"28px",borderRadius:8}}><div style={{color:"rgba(0,255,65,.4)",fontSize:32,lineHeight:1,marginBottom:16,fontFamily:"serif"}}>"</div><div style={{color:"rgba(200,220,238,.8)",fontSize:14,lineHeight:1.75,marginBottom:20}}>{quote}</div><div style={{borderTop:"1px solid rgba(0,255,65,.1)",paddingTop:16}}><div className="f-orb" style={{color:"#00FF41",fontSize:12,fontWeight:600}}>{name}</div><div className="f-mono" style={{color:"rgba(200,220,238,.4)",fontSize:10,letterSpacing:1,marginTop:2}}>{role} Â· {company}</div></div></motion.div>);

const MiniRadar = () => {
  const ref=useRef(null),raf=useRef(null);
  useEffect(()=>{const c=ref.current;if(!c)return;const ctx=c.getContext("2d"),S=120,DPR=Math.min(window.devicePixelRatio||1,2);c.width=S*DPR;c.height=S*DPR;c.style.width=S+"px";c.style.height=S+"px";ctx.scale(DPR,DPR);const CX=S/2,CY=S/2,R=S/2-6;let t=0,sweep=0;const draw=()=>{ctx.clearRect(0,0,S,S);t+=.015;sweep+=.005;const bg=ctx.createRadialGradient(CX,CY,0,CX,CY,R);bg.addColorStop(0,"rgba(0,30,6,.95)");bg.addColorStop(1,"rgba(0,6,1,1)");ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.fillStyle=bg;ctx.fill();ctx.strokeStyle="rgba(0,255,65,.4)";ctx.lineWidth=1;ctx.stroke();for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(CX,CY,(R/3)*i,0,Math.PI*2);ctx.strokeStyle=`rgba(0,255,65,${i===3?.3:.08})`;ctx.lineWidth=.5;ctx.stroke();}[[CX-R,CY,CX+R,CY],[CX,CY-R,CX,CY+R]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle="rgba(0,255,65,.08)";ctx.lineWidth=.5;ctx.stroke();});for(let i=0;i<16;i++){const frac=i/16,a=sweep-frac*.8;const x=CX+Math.cos(a)*R,y=CY+Math.sin(a)*R;ctx.beginPath();ctx.moveTo(CX,CY);ctx.lineTo(x,y);ctx.strokeStyle=`rgba(0,255,65,${Math.pow(frac,2)*.12})`;ctx.lineWidth=frac*3;ctx.stroke();}const sx=CX+Math.cos(sweep)*R,sy=CY+Math.sin(sweep)*R;const g=ctx.createLinearGradient(CX,CY,sx,sy);g.addColorStop(0,"rgba(0,255,65,0)");g.addColorStop(1,"rgba(0,255,65,.7)");ctx.beginPath();ctx.moveTo(CX,CY);ctx.lineTo(sx,sy);ctx.strokeStyle=g;ctx.lineWidth=1;ctx.shadowColor="#00FF41";ctx.shadowBlur=4;ctx.stroke();ctx.shadowBlur=0;ctx.beginPath();ctx.arc(CX,CY,3,0,Math.PI*2);ctx.fillStyle="#00FF41";ctx.shadowColor="#00FF41";ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;raf.current=requestAnimationFrame(draw);};draw();return()=>cancelAnimationFrame(raf.current);},[]);
  return <canvas ref={ref} style={{display:"block"}}/>;
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   UNIFIED NAV
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const Nav = ({page, setPage, scrollY}) => {
  const scrolled = scrollY > 60;
  const isApp = page === "app";
  return (
    <motion.nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"0 5%",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",background:isApp?"rgba(2,8,18,.95)":scrolled?"rgba(2,8,18,.88)":"transparent",borderBottom:scrolled||isApp?"1px solid rgba(0,255,65,.1)":"1px solid transparent",backdropFilter:scrolled||isApp?"blur(18px)":"none",transition:"all .4s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,cursor:"none"}} onClick={()=>setPage("landing")}>
        <div style={{width:32,height:32,borderRadius:6,border:"1px solid rgba(0,255,65,.4)",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,255,65,.08)"}}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#00FF41" strokeWidth="1"/><circle cx="8" cy="8" r="3" stroke="#00FF41" strokeWidth="1" opacity=".5"/><line x1="8" y1="2" x2="8" y2="8" stroke="#00FF41" strokeWidth="1.5"/></svg>
        </div>
        <span className="f-orb" style={{color:"#00FF41",fontWeight:700,fontSize:16,letterSpacing:2}}>SENTINEL</span>
        <span className="f-mono" style={{color:"rgba(0,255,65,.4)",fontSize:9,letterSpacing:1,marginTop:2}}>v2.0</span>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {isApp ? (
          <button onClick={()=>setPage("landing")} className="f-mono" style={{background:"transparent",border:"1px solid rgba(0,255,65,.3)",color:"rgba(0,255,65,.7)",padding:"8px 18px",borderRadius:4,fontSize:11,letterSpacing:1,cursor:"none",display:"flex",alignItems:"center",gap:8,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,255,65,.7)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,255,65,.3)"}>â† BACK TO HOME</button>
        ) : (
          <>
            {["Features","How It Works","Pricing"].map(l=>(<a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="f-mono" style={{color:"rgba(200,220,238,.6)",fontSize:12,letterSpacing:1,transition:"color .2s",textDecoration:"none"}} onMouseEnter={e=>e.target.style.color="#00FF41"} onMouseLeave={e=>e.target.style.color="rgba(200,220,238,.6)"}>{l}</a>))}
            <button onClick={()=>setPage("app")} className="f-orb" style={{marginLeft:16,background:"rgba(0,255,65,.12)",border:"1px solid rgba(0,255,65,.5)",color:"#00FF41",padding:"8px 22px",borderRadius:4,fontSize:11,letterSpacing:1,cursor:"none",transition:"all .2s",boxShadow:"0 0 20px rgba(0,255,65,.1)"}} onMouseEnter={e=>{e.target.style.background="rgba(0,255,65,.22)";e.target.style.boxShadow="0 0 30px rgba(0,255,65,.25)";}} onMouseLeave={e=>{e.target.style.background="rgba(0,255,65,.12)";e.target.style.boxShadow="0 0 20px rgba(0,255,65,.1)";}}>ANALYZE EMAIL</button>
          </>
        )}
        {isApp && (
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:6,background:"rgba(0,229,255,.06)",border:"1px solid rgba(0,229,255,.18)"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#00FFA3",boxShadow:"0 0 6px #00FFA3",animation:"pulse-ring 2s ease-in-out infinite"}}/>
            <span className="f-mono" style={{fontSize:9,color:"rgba(0,255,163,.7)",letterSpacing:1}}>ONLINE</span>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   LANDING PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const LandingPage = ({mx, my, goToApp}) => (
  <div style={{position:"relative",zIndex:1}}>
    {/* Hero */}
    <section style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 5% 40px"}}>
      <div style={{flex:1,maxWidth:560}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="f-mono" style={{color:"rgba(0,255,65,.6)",fontSize:10,letterSpacing:3,marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#00FF41",display:"inline-block",animation:"blink 1.2s ease-in-out infinite"}}/>
          AI-POWERED EMAIL THREAT DETECTION
        </motion.div>
        <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.1}} className="f-orb" style={{fontSize:"clamp(36px,4.5vw,62px)",fontWeight:900,lineHeight:1.1,letterSpacing:-1,marginBottom:24}}>
          <span style={{color:"#C8DCEE"}}>DETECT THREATS</span><br/>
          <span className="shimmer-text">BEFORE THEY STRIKE</span>
        </motion.h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.2}} style={{color:"rgba(200,220,238,.65)",fontSize:16,lineHeight:1.8,marginBottom:36,maxWidth:460}}>
          Sentinel uses military-grade sonar intelligence to scan every email in real-time â€” detecting phishing, malware, spoofing, and zero-day exploits before they reach your inbox.
        </motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.3}} style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:48}}>
          <button onClick={goToApp} className="f-orb" style={{padding:"14px 32px",borderRadius:4,fontSize:12,fontWeight:700,letterSpacing:2,cursor:"none",background:"rgba(0,255,65,.14)",border:"1px solid rgba(0,255,65,.5)",color:"#00FF41",boxShadow:"0 0 30px rgba(0,255,65,.15)",transition:"all .25s"}} onMouseEnter={e=>{e.target.style.background="rgba(0,255,65,.26)";e.target.style.boxShadow="0 0 50px rgba(0,255,65,.3)";}} onMouseLeave={e=>{e.target.style.background="rgba(0,255,65,.14)";e.target.style.boxShadow="0 0 30px rgba(0,255,65,.15)";}}>START FREE TRIAL</button>
          <button onClick={goToApp} className="f-orb" style={{padding:"14px 32px",borderRadius:4,fontSize:12,fontWeight:700,letterSpacing:2,cursor:"none",background:"transparent",border:"1px solid rgba(200,220,238,.2)",color:"rgba(200,220,238,.7)",transition:"all .25s"}} onMouseEnter={e=>{e.target.style.borderColor="rgba(0,229,255,.4)";e.target.style.color="#00E5FF";}} onMouseLeave={e=>{e.target.style.borderColor="rgba(200,220,238,.2)";e.target.style.color="rgba(200,220,238,.7)";}}>VIEW LIVE DEMO</button>
        </motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6,delay:.5}} style={{display:"flex",gap:24,alignItems:"center",flexWrap:"wrap"}}>
          {["SOC2 CERTIFIED","GDPR COMPLIANT","ISO 27001","ZERO LOGS"].map(b=>(<div key={b} style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"rgba(0,255,65,.5)",fontSize:8}}>â—†</span><span className="f-mono" style={{color:"rgba(200,220,238,.4)",fontSize:9,letterSpacing:1}}>{b}</span></div>))}
        </motion.div>
      </div>
      <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{duration:.8,delay:.2}} style={{flex:1,display:"flex",justifyContent:"center",alignItems:"center",minWidth:0,overflow:"hidden"}}>
        <div style={{transform:"scale(0.72)",transformOrigin:"center center"}}><ThreatRadar mx={mx} my={my}/></div>
      </motion.div>
    </section>

    <LandingTicker/>

    {/* Stats */}
    <section style={{padding:"80px 5%"}} id="features">
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderTop:"1px solid rgba(0,255,65,.1)",borderBottom:"1px solid rgba(0,255,65,.1)",background:"rgba(0,255,65,.015)"}}>
        <Counter target={2400000000} suffix="+" label="Threats Blocked" color="#00FF41"/>
        <Counter target={99.97} suffix="%" label="Detection Rate" color="#00E5FF"/>
        <Counter target={50000000} suffix="+" label="Emails Scanned" color="#00FFA3"/>
        <Counter target={140} suffix="+" label="Threat Vectors" color="#FF6B6B"/>
      </div>
    </section>

    {/* Features */}
    <section style={{padding:"100px 5%"}}>
      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:"center",marginBottom:64}}>
        <div className="f-mono" style={{color:"rgba(0,255,65,.6)",fontSize:10,letterSpacing:3,marginBottom:12}}>â—† CAPABILITIES â—†</div>
        <h2 className="f-orb" style={{fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,color:"#C8DCEE",letterSpacing:-1}}>MILITARY-GRADE <span style={{color:"#00FF41"}}>PROTECTION</span></h2>
      </motion.div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
        <FeatureCard delay={0}   icon="â¬¡" color="#00FF41"  title="SONAR DETECTION"    desc="Our proprietary ping-wave algorithm maps your email landscape in real-time, detecting anomalies the instant they appear â€” milliseconds before delivery."/>
        <FeatureCard delay={0.1} icon="â—ˆ" color="#00E5FF"  title="ZERO-DAY DEFENSE"   desc="AI pattern-matching trained on 50B+ threat samples identifies unknown attack vectors with 99.3% accuracy, even without prior signatures."/>
        <FeatureCard delay={0.2} icon="â—†" color="#00FFA3"  title="LINK DETONATION"    desc="Every URL is detonated in an isolated sandbox environment. Our crawler follows redirects and analyzes final destinations before you ever click."/>
        <FeatureCard delay={0.3} icon="â–²" color="red"      title="THREAT LOCKDOWN"    desc="Confirmed threats are quarantined instantly with lock-bracket isolation. Admins receive real-time alerts with full forensic analysis."/>
        <FeatureCard delay={0.4} icon="â—‡" color="#00E5FF"  title="BEHAVIORAL AI"      desc="Machine learning models analyze sender behavior, timing patterns, and linguistic anomalies to detect impersonation and BEC attacks."/>
        <FeatureCard delay={0.5} icon="â¬¡" color="#00FF41"  title="CONTINUOUS RADAR"   desc="24/7 persistent threat monitoring with adaptive sensitivity. The system recalibrates detection thresholds dynamically."/>
      </div>
    </section>

    {/* How It Works */}
    <section id="how-it-works" style={{padding:"100px 5%"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center",maxWidth:1100,margin:"0 auto"}}>
        <div>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{marginBottom:48}}>
            <div className="f-mono" style={{color:"rgba(0,255,65,.6)",fontSize:10,letterSpacing:3,marginBottom:12}}>â—† HOW IT WORKS â—†</div>
            <h2 className="f-orb" style={{fontSize:"clamp(28px,3vw,40px)",fontWeight:900,color:"#C8DCEE",letterSpacing:-1,lineHeight:1.2}}>FROM INBOX TO<br/><span style={{color:"#00FF41"}}>VERDICT</span> IN 0.3ms</h2>
          </motion.div>
          <div style={{display:"flex",flexDirection:"column",gap:32}}>
            <Step delay={0.1} num="01" title="EMAIL INTERCEPTED" desc="Every incoming email is intercepted at the MX layer before delivery. Zero latency impact â€” your users never notice a delay."/>
            <Step delay={0.2} num="02" title="SONAR SCAN INITIATED" desc="Our ping-wave engine emits a detection signal across the email structure, mapping every link, attachment, header anomaly, and behavioral signature."/>
            <Step delay={0.3} num="03" title="THREATS ECHO BACK" desc="Malicious elements echo back a unique signature. The AI classifies each echo by threat type, confidence score, and severity in real-time."/>
            <Step delay={0.4} num="04" title="VERDICT DELIVERED" desc="Clean emails delivered instantly. Threats quarantined, logged with full forensics, and your security team alerted with actionable intelligence."/>
          </div>
        </div>
        <motion.div initial={{opacity:0,scale:.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.7}} style={{position:"relative"}}>
          <div className="glass-lp" style={{borderRadius:12,padding:32,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#00FF41,transparent)",opacity:.4,animation:"scan-h 3s linear infinite"}}/>
            <div className="f-mono" style={{color:"rgba(0,255,65,.5)",fontSize:9,letterSpacing:2,marginBottom:20}}>â—† LIVE ANALYSIS FEED</div>
            {[{label:"PHISHING LINK DETECTED",val:"BLOCKED",color:"#FF6060",time:"0.12ms"},{label:"SENDER VERIFIED",val:"CLEAN",color:"#00FF41",time:"0.08ms"},{label:"ATTACHMENT SANDBOXED",val:"SCANNING",color:"#FFD60A",time:"0.31ms"},{label:"HEADER SPOOFING",val:"BLOCKED",color:"#FF6060",time:"0.09ms"},{label:"URL REPUTATION CHECK",val:"CLEAN",color:"#00FF41",time:"0.15ms"},{label:"BEHAVIORAL ANALYSIS",val:"ANOMALY",color:"#FF9500",time:"0.22ms"}].map((item,i)=>(<motion.div key={i} initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(0,255,65,.06)"}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{width:5,height:5,borderRadius:"50%",background:item.color,flexShrink:0,boxShadow:`0 0 6px ${item.color}`}}/><span className="f-mono" style={{color:"rgba(200,220,238,.7)",fontSize:11}}>{item.label}</span></div><div style={{display:"flex",alignItems:"center",gap:12}}><span className="f-mono" style={{color:"rgba(200,220,238,.3)",fontSize:9}}>{item.time}</span><span className="f-mono" style={{color:item.color,fontSize:10,fontWeight:500,letterSpacing:1}}>{item.val}</span></div></motion.div>))}
            <div style={{marginTop:20,padding:"12px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}><span className="f-mono" style={{color:"rgba(0,255,65,.5)",fontSize:10}}>VERDICT:</span><span className="f-orb" style={{color:"#FF6060",fontSize:14,fontWeight:700,letterSpacing:2}}>âš  THREAT DETECTED</span></div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Testimonials */}
    <section style={{padding:"100px 5%"}}>
      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:"center",marginBottom:56}}>
        <div className="f-mono" style={{color:"rgba(0,255,65,.6)",fontSize:10,letterSpacing:3,marginBottom:12}}>â—† TRUSTED BY SECURITY TEAMS â—†</div>
        <h2 className="f-orb" style={{fontSize:"clamp(24px,3vw,38px)",fontWeight:900,color:"#C8DCEE",letterSpacing:-1}}>WHAT <span style={{color:"#00FF41"}}>DEFENDERS</span> SAY</h2>
      </motion.div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
        <Testimonial delay={0} quote="Sentinel caught a sophisticated BEC attack targeting our CFO within 80ms. The sonar radar visualization made it immediately clear exactly what we were dealing with." name="MARCUS CHEN" role="CISO" company="Meridian Financial"/>
        <Testimonial delay={0.15} quote="We replaced three legacy email security tools with Sentinel. Detection rate went from 94% to 99.97%. The false positive rate dropped by 80%. ROI was immediate." name="SARA KOVAÄŒ" role="VP Security" company="TechCore Systems"/>
        <Testimonial delay={0.3} quote="The real-time radar interface gives our SOC team situational awareness we never had before. It feels like finally being able to see the battlefield." name="ALEX OKAFOR" role="SOC Director" company="DefendNet Global"/>
      </div>
    </section>

    {/* Pricing */}
    <section id="pricing" style={{padding:"100px 5%"}}>
      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:"center",marginBottom:64}}>
        <div className="f-mono" style={{color:"rgba(0,255,65,.6)",fontSize:10,letterSpacing:3,marginBottom:12}}>â—† PRICING â—†</div>
        <h2 className="f-orb" style={{fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,color:"#C8DCEE",letterSpacing:-1}}>CHOOSE YOUR <span style={{color:"#00FF41"}}>DEFENSE TIER</span></h2>
      </motion.div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20,maxWidth:1000,margin:"0 auto"}}>
        <PricingCard delay={0} tier="SCOUT" price={29} onStart={goToApp} features={["Up to 10 mailboxes","Core threat detection","Link detonation","Email support","7-day log retention"]}/>
        <PricingCard delay={0.15} tier="SENTINEL" price={99} highlight onStart={goToApp} features={["Up to 100 mailboxes","AI behavioral analysis","Zero-day defense","Sandbox detonation","Real-time radar dashboard","Priority support","90-day log retention"]}/>
        <PricingCard delay={0.3} tier="COMMAND" price={299} onStart={goToApp} features={["Unlimited mailboxes","Full forensic suite","Custom threat signatures","SIEM integration","Dedicated SOC analyst","365-day log retention"]}/>
      </div>
    </section>

    {/* CTA */}
    <section style={{padding:"80px 5%"}}>
      <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{borderRadius:12,padding:"60px 5%",textAlign:"center",position:"relative",overflow:"hidden",background:"rgba(0,255,65,.04)",border:"1px solid rgba(0,255,65,.2)",boxShadow:"0 0 80px rgba(0,255,65,.06),inset 0 0 60px rgba(0,255,65,.02)"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(0,255,65,.5),transparent)"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(0,255,65,.5),transparent)"}}/>
        <div className="f-mono" style={{color:"rgba(0,255,65,.6)",fontSize:10,letterSpacing:3,marginBottom:16}}>â—† START TODAY â—†</div>
        <h2 className="f-orb" style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:900,lineHeight:1.1,letterSpacing:-1,marginBottom:16}}><span style={{color:"#C8DCEE"}}>YOUR INBOX IS BEING</span><br/><span className="shimmer-text">TARGETED RIGHT NOW</span></h2>
        <p style={{color:"rgba(200,220,238,.55)",fontSize:15,lineHeight:1.7,marginBottom:36,maxWidth:500,margin:"0 auto 36px"}}>Every second you wait, threats accumulate. Deploy Sentinel in under 5 minutes and start protecting your organization today.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={goToApp} className="f-orb" style={{padding:"16px 40px",borderRadius:4,fontSize:13,fontWeight:700,letterSpacing:2,cursor:"none",background:"rgba(0,255,65,.16)",border:"1px solid rgba(0,255,65,.55)",color:"#00FF41",boxShadow:"0 0 40px rgba(0,255,65,.2)",transition:"all .25s"}} onMouseEnter={e=>{e.target.style.background="rgba(0,255,65,.28)";e.target.style.boxShadow="0 0 60px rgba(0,255,65,.35)";}} onMouseLeave={e=>{e.target.style.background="rgba(0,255,65,.16)";e.target.style.boxShadow="0 0 40px rgba(0,255,65,.2)";}}>DEPLOY SENTINEL FREE</button>
          <button onClick={goToApp} className="f-orb" style={{padding:"16px 40px",borderRadius:4,fontSize:13,fontWeight:700,letterSpacing:2,cursor:"none",background:"transparent",border:"1px solid rgba(200,220,238,.2)",color:"rgba(200,220,238,.6)",transition:"all .25s"}} onMouseEnter={e=>{e.target.style.borderColor="rgba(0,229,255,.4)";e.target.style.color="#00E5FF";}} onMouseLeave={e=>{e.target.style.borderColor="rgba(200,220,238,.2)";e.target.style.color="rgba(200,220,238,.6)";}}>BOOK A DEMO</button>
        </div>
      </motion.div>
    </section>

    {/* Footer */}
    <footer style={{borderTop:"1px solid rgba(0,255,65,.1)",padding:"60px 5% 32px"}}>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:32,height:32,borderRadius:6,border:"1px solid rgba(0,255,65,.3)",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,255,65,.06)"}}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#00FF41" strokeWidth="1"/><circle cx="8" cy="8" r="3" stroke="#00FF41" strokeWidth="1" opacity=".5"/><line x1="8" y1="2" x2="8" y2="8" stroke="#00FF41" strokeWidth="1.5"/></svg></div>
            <span className="f-orb" style={{color:"#00FF41",fontWeight:700,fontSize:15,letterSpacing:2}}>SENTINEL</span>
          </div>
          <p style={{color:"rgba(200,220,238,.45)",fontSize:13,lineHeight:1.75,maxWidth:280}}>Military-grade AI email threat detection. Protecting organizations from phishing, malware, and zero-day attacks in real-time.</p>
          <div style={{marginTop:20}}><MiniRadar/></div>
        </div>
        {[{title:"PRODUCT",links:["Features","Pricing","Changelog","Roadmap","Status"]},{title:"COMPANY",links:["About","Blog","Careers","Press","Contact"]},{title:"RESOURCES",links:["Documentation","API Reference","Security","Privacy","Terms"]}].map(col=>(<div key={col.title}><div className="f-mono" style={{color:"rgba(0,255,65,.5)",fontSize:9,letterSpacing:3,marginBottom:20}}>{col.title}</div><div style={{display:"flex",flexDirection:"column",gap:12}}>{col.links.map(l=>(<a key={l} href="#" className="f-mono" style={{color:"rgba(200,220,238,.45)",fontSize:12,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#00FF41"} onMouseLeave={e=>e.target.style.color="rgba(200,220,238,.45)"}>{l}</a>))}</div></div>))}
      </div>
      <div style={{borderTop:"1px solid rgba(0,255,65,.08)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <span className="f-mono" style={{color:"rgba(200,220,238,.3)",fontSize:10,letterSpacing:1}}>Â© 2026 SENTINEL SECURITY INC. ALL RIGHTS RESERVED.</span>
        <div style={{display:"flex",gap:20}}>{["PRIVACY","TERMS","SECURITY"].map(l=>(<a key={l} href="#" className="f-mono" style={{color:"rgba(200,220,238,.3)",fontSize:9,letterSpacing:1,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="rgba(0,255,65,.6)"} onMouseLeave={e=>e.target.style.color="rgba(200,220,238,.3)"}>{l}</a>))}</div>
      </div>
    </footer>
  </div>
);

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ANALYZER APP PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const AnalyzerApp = ({mx, my}) => {
  const [tab,setTab]=useState("upload");
  const [file,setFile]=useState(null);
  const [subj,setSubj]=useState("");
  const [body,setBody]=useState("");
  const [drag,setDrag]=useState(false);
  const [focused,setFocused]=useState(false);
  const [phase,setPhase]=useState("idle");
  const [analysis, setAnalysis] = useState(EMPTY_ANALYSIS);
  const [error, setError] = useState("");
  const canScan=file||(body.trim().length>5);
  const analyze = async () => {
    if (!canScan) return;
    setError("");
    setPhase("scanning");

    try {
      let response;
      if (tab === "upload" && file) {
        const form = new FormData();
        form.append("file", file);
        response = await fetch(`${API_BASE}/analyze-email`, { method: "POST", body: form });
      } else {
        response = await fetch(`${API_BASE}/analyze-text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: subj, body }),
        });
      }

      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        const detail = typeof errPayload?.detail === "string" ? errPayload.detail : `Request failed (${response.status})`;
        throw new Error(detail);
      }

      const payload = await response.json();
      setAnalysis(mapApiResponseToView(payload));
      setPhase("result");
    } catch (e) {
      console.error("Analyze failed", e);
      setError(e?.message || "Could not analyze this email.");
      setPhase("idle");
    }
  };
  const reset=()=>{setPhase("idle");setFile(null);setBody("");setSubj("");setError("");setAnalysis(EMPTY_ANALYSIS);};
  const result = analysis || EMPTY_ANALYSIS;
  const phishScore = Math.min(100, Math.max(0, result.stats.phishKw * 25));
  const DRow=({k,v,status})=>(<div style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(0,229,255,.05)"}}><span className="f-mono" style={{fontSize:9,color:"rgba(100,140,170,.5)",letterSpacing:1.5,minWidth:60}}>{k}</span><span className="f-mono" style={{fontSize:11,color:status==="bad"?"#FF4D6D":status==="warn"?"#FFD60A":"#6899B8",flex:1,wordBreak:"break-all"}}>{v}</span>{status&&<span className="f-mono" style={{fontSize:8,padding:"2px 8px",borderRadius:4,flexShrink:0,background:status==="bad"?"rgba(255,77,109,.1)":status==="warn"?"rgba(255,214,10,.1)":"rgba(0,255,163,.1)",border:`1px solid ${status==="bad"?"rgba(255,77,109,.3)":status==="warn"?"rgba(255,214,10,.3)":"rgba(0,255,163,.3)"}`,color:status==="bad"?"#FF4D6D":status==="warn"?"#FFD60A":"#00FFA3"}}>{status==="bad"?"FAIL":status==="warn"?"WARN":"PASS"}</span>}</div>);

  return (
    <div style={{position:"relative",zIndex:10,maxWidth:920,margin:"0 auto",padding:"80px 24px 120px"}}>
      <DataTicker/>
      {phase==="scanning"&&<ScanLine/>}
      {/* Hero + Radar */}
      <section style={{textAlign:"center",padding:"20px 0 28px"}}>
        <ThreatRadar mx={mx} my={my}/>
        <motion.div initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{delay:.4,duration:.8}}>
          <div className="f-mono" style={{fontSize:10,color:"rgba(0,229,255,.4)",letterSpacing:5,marginTop:20,marginBottom:14}}>â—† AI-POWERED SECURITY ANALYSIS â—†</div>
          <h1 className="f-orb" style={{fontSize:"clamp(28px,5vw,46px)",fontWeight:900,lineHeight:1.15,letterSpacing:1}}>
            <span style={{color:"#D0E8F8"}}>AI Email Threat</span><br/>
            <span style={{background:"linear-gradient(90deg,#00E5FF 0%,#00FFA3 50%,#7C3AED 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 20px rgba(0,229,255,.4))"}}>Analyzer</span>
          </h1>
          <p className="f-syne" style={{color:"rgba(100,140,170,.55)",fontSize:14,margin:"18px auto 0",maxWidth:520,lineHeight:1.85}}>Upload or paste an email to detect <span style={{color:"rgba(0,229,255,.6)"}}>spam</span>, <span style={{color:"rgba(255,77,109,.6)"}}>phishing patterns</span>, malicious links, and suspicious behaviors using advanced AI threat intelligence.</p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginTop:24}}>
            {["Header Forensics","URL Analysis","Language AI","Attachment Scan","Domain Reputation"].map(f=>(<div key={f} className="f-mono" style={{fontSize:9,color:"rgba(0,229,255,.45)",letterSpacing:1,padding:"4px 12px",borderRadius:99,background:"rgba(0,229,255,.04)",border:"1px solid rgba(0,229,255,.1)"}}>{f}</div>))}
          </div>
        </motion.div>
      </section>

      {/* Input */}
      <AnimatePresence>
        {phase!=="result"&&(
          <motion.section initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30,scale:.97}} transition={{delay:.6,duration:.6}}>
            <div className={`glass-card ${focused?"glass-card-glow":""} anim-border-glow`} style={{padding:"28px 30px",marginBottom:20,transition:"all .3s"}}>
              {[{t:0,l:0,bt:"2px solid rgba(0,229,255,.5)",bl:"2px solid rgba(0,229,255,.5)"},{t:0,r:0,bt:"2px solid rgba(0,229,255,.5)",br:"2px solid rgba(0,229,255,.5)"},{b:0,l:0,bb:"2px solid rgba(0,229,255,.5)",bl:"2px solid rgba(0,229,255,.5)"},{b:0,r:0,bb:"2px solid rgba(0,229,255,.5)",br:"2px solid rgba(0,229,255,.5)"}].map((s,i)=>(<div key={i} style={{position:"absolute",width:16,height:16,...s}}/>))}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}><div className="f-orb" style={{fontSize:9,color:"rgba(0,229,255,.4)",letterSpacing:3}}>EMAIL INPUT</div><div className="f-mono" style={{fontSize:9,color:"rgba(100,140,170,.35)",letterSpacing:1}}>MAX 25MB Â· .EML .MSG .TXT</div></div>
              <div style={{display:"flex",background:"rgba(0,0,0,.5)",borderRadius:10,padding:4,width:"fit-content",marginBottom:24,border:"1px solid rgba(0,229,255,.07)"}}>
                {[["upload","ðŸ“Ž Upload .eml"],["paste","âœï¸ Paste Email"]].map(([id,lbl])=>(<button key={id} onClick={()=>setTab(id)} style={{padding:"9px 22px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:1,transition:"all .25s",background:tab===id?"rgba(0,229,255,.1)":"transparent",color:tab===id?"#00E5FF":"rgba(100,140,170,.4)",boxShadow:tab===id?"0 0 16px rgba(0,229,255,.2),inset 0 1px 0 rgba(0,229,255,.1)":"none"}}>{lbl}</button>))}
              </div>
              <AnimatePresence mode="wait">
                {tab==="upload"?(
                  <motion.div key="up" initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:18}} transition={{duration:.2}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)setFile(f);}} onClick={()=>document.getElementById("fi2").click()} style={{border:`1.5px dashed ${drag?"#00E5FF":file?"#00FFA3":"rgba(0,229,255,.16)"}`,borderRadius:12,padding:"50px 28px",textAlign:"center",cursor:"pointer",background:drag?"rgba(0,229,255,.04)":"rgba(0,0,0,.2)",transition:"all .3s"}}>
                    <input id="fi2" type="file" accept=".eml,.msg,.txt" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)setFile(f);}}/>
                    <div style={{fontSize:44,marginBottom:14}}>{file?"âœ…":"ðŸ“§"}</div>
                    {file?(<><div className="f-mono" style={{color:"#00FFA3",fontSize:14}}>{file.name}</div><div style={{color:"rgba(0,255,163,.4)",fontSize:12,marginTop:6}}>{(file.size/1024).toFixed(1)} KB Â· Ready for analysis</div></>):(<><div className="f-orb" style={{color:"rgba(100,140,170,.5)",fontSize:11,letterSpacing:3}}>DROP FILE HERE</div><div style={{color:"rgba(100,140,170,.25)",fontSize:12,marginTop:8}}>or click to browse â€” supports .eml, .msg, .txt</div></>)}
                  </motion.div>
                ):(
                  <motion.div key="ps" initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-18}} transition={{duration:.2}}>
                    <div style={{marginBottom:16}}><label className="f-mono" style={{display:"block",fontSize:9,color:"rgba(100,140,170,.45)",letterSpacing:2,marginBottom:8}}>SUBJECT LINE</label><input value={subj} onChange={e=>setSubj(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder="Re: Urgent â€” Verify Your Account Immediately" className="cyber-input" style={{padding:"12px 16px"}}/></div>
                    <div><label className="f-mono" style={{display:"block",fontSize:9,color:"rgba(100,140,170,.45)",letterSpacing:2,marginBottom:8}}>FULL EMAIL BODY</label><textarea value={body} onChange={e=>setBody(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder={"Paste complete email content here...\n\nInclude headers for best analysis results."} rows={9} className="cyber-input" style={{padding:"14px 16px",resize:"vertical",lineHeight:1.7}}/></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{textAlign:"center"}}>
              <AnimatePresence mode="wait">
                {phase==="scanning"?(
                  <motion.div key="scan" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}>
                    <div className="glass-card" style={{borderRadius:16,padding:"8px 56px",display:"inline-block",border:"1px solid rgba(0,229,255,.15)"}}><ScanAnim/></div>
                  </motion.div>
                ):(
                  <motion.div key="btn" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <motion.button onClick={analyze} disabled={!canScan} whileHover={canScan?{scale:1.04,y:-2}:{}} whileTap={canScan?{scale:.96}:{}} style={{padding:"17px 68px",borderRadius:10,border:"none",cursor:canScan?"pointer":"not-allowed",background:canScan?"linear-gradient(135deg,rgba(0,229,255,.16),rgba(124,58,237,.22))":"rgba(255,255,255,.02)",boxShadow:canScan?"0 0 40px rgba(0,229,255,.22),0 0 80px rgba(0,229,255,.08),inset 0 1px 0 rgba(0,229,255,.15)":"none",borderWidth:1,borderStyle:"solid",borderColor:canScan?"rgba(0,229,255,.38)":"rgba(255,255,255,.04)",transition:"all .3s",position:"relative",overflow:"hidden"}}>
                      {canScan&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(0,229,255,.06),transparent)",animation:"data-scroll 3s linear infinite"}}/>}
                      <span className="f-orb" style={{fontSize:12,letterSpacing:4,color:canScan?"#00E5FF":"rgba(100,140,170,.2)",position:"relative",zIndex:1}}>â¬¡ ANALYZE EMAIL</span>
                    </motion.button>
                    {!canScan&&<p className="f-mono" style={{color:"rgba(100,140,170,.2)",fontSize:9,letterSpacing:2,marginTop:16}}>UPLOAD OR PASTE EMAIL TO BEGIN SCAN</p>}
                    {error && <p className="f-mono" style={{ color: "#FF7B91", fontSize: 10, letterSpacing: 1, marginTop: 12 }}>{error}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {phase==="result"&&(
          <motion.section initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:.1}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:6,height:6,borderRadius:"50%",background:"#00FFA3",boxShadow:"0 0 8px #00FFA3",animation:"pulse-ring 1.5s ease-in-out infinite"}}/><span className="f-orb" style={{fontSize:9,color:"rgba(0,255,163,.6)",letterSpacing:3}}>ANALYSIS COMPLETE</span><span className="f-mono" style={{fontSize:9,color:"rgba(100,140,170,.3)",letterSpacing:1}}>Â· 0.34s</span></div>
              <button onClick={reset} className="f-mono" style={{background:"none",border:"1px solid rgba(0,229,255,.15)",borderRadius:7,color:"rgba(100,140,170,.5)",padding:"7px 16px",cursor:"pointer",fontSize:9,letterSpacing:1.5,transition:"all .2s"}} onMouseEnter={e=>{e.target.style.color="#00E5FF";e.target.style.borderColor="rgba(0,229,255,.4)";}} onMouseLeave={e=>{e.target.style.color="rgba(100,140,170,.5)";e.target.style.borderColor="rgba(0,229,255,.15)";}}>â† NEW SCAN</button>
            </motion.div>
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.15}} className="glass-card" style={{padding:"28px 32px",marginBottom:14}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:28,alignItems:"center",justifyContent:"space-between"}}>
                <Verdict v={result.verdict}/>
                <RiskGauge score={result.riskScore}/>
                <div style={{display:"flex",flexDirection:"column",gap:20,flex:1,minWidth:200}}>
                  <BarStat label="DETECTION CONFIDENCE" val={result.confidence} color="#00E5FF" delay={.3}/>
                  <BarStat label="SPAM PROBABILITY" val={result.spamProb} color="#FF4D6D" delay={.4}/>
                  <BarStat label="PHISH SCORE" val={phishScore} color="#FFD60A" delay={.5}/>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.25}} className="glass-card" style={{padding:"22px 26px",marginBottom:14}}>
              <div className="f-orb" style={{fontSize:9,color:"rgba(100,140,170,.4)",letterSpacing:3,marginBottom:16}}>ACTIVE THREAT INDICATORS</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {(result.threats.length ? result.threats : ["No strong threat indicators"]).map((t,i)=>(<Tag key={`${t}-${i}`} label={t.toUpperCase()} color={["#FF4D6D","#FFD60A","#FF4D6D","#FFD60A","#7C3AED","#FF4D6D","#FF4D6D","#FFD60A"][i % 8]} delay={.35+i*.05}/>))}
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.35}} style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:14}}>
              <StatCard icon="ðŸ”—" label="EXTRACTED LINKS" value={result.stats.links} color="#00E5FF" delay={.4}/>
              <StatCard icon="ðŸ“„" label="HTML CONTENT" value={result.stats.html ? "YES" : "NO"} color="#7C3AED" raw delay={.45}/>
              <StatCard icon="ðŸ“Ž" label="ATTACHMENTS" value={result.stats.attach} color="#FF4D6D" delay={.5}/>
              <StatCard icon="âš ï¸" label="PHISH KEYWORDS" value={result.stats.phishKw} color="#FFD60A" delay={.55}/>
            </motion.div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.45}}>
              <div className="f-orb" style={{fontSize:9,color:"rgba(100,140,170,.4)",letterSpacing:3,marginBottom:14}}>FORENSIC ANALYSIS</div>
              <Panel title="HEADER ANALYSIS" icon="ðŸ”" color="#00E5FF" delay={.5}><div style={{marginTop:10}}><DRow k="FROM" v={result.headers.from} status={result.headers.from === "N/A" ? "warn" : "pass"}/><DRow k="REPLY-TO" v={result.headers.replyTo} status={result.headers.domain === "MISMATCH" ? "warn" : "pass"}/><DRow k="SPF" v={result.headers.spf} status="warn"/><DRow k="DKIM" v={result.headers.dkim} status="warn"/><DRow k="DMARC" v={result.headers.dmarc} status="warn"/><DRow k="DOMAIN" v={result.headers.domain} status={result.headers.domain === "MISMATCH" ? "warn" : "pass"}/></div></Panel>
              <Panel title="URL ANALYSIS" icon="ðŸŒ" color="#00FFA3" delay={.55}><div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>{result.urls.map(({url,sus,type},i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,background:sus?"rgba(255,77,109,.04)":"rgba(0,255,163,.03)",border:`1px solid ${sus?"rgba(255,77,109,.15)":"rgba(0,255,163,.12)"}`}}><span style={{fontSize:12}}>{sus?"ðŸ”´":"ðŸŸ¢"}</span><span className="f-mono" style={{fontSize:11,color:sus?"#FF4D6D":"#00FFA3",flex:1,wordBreak:"break-all"}}>{url}</span><span className="f-mono" style={{fontSize:8,color:sus?"rgba(255,77,109,.6)":"rgba(0,255,163,.5)",background:sus?"rgba(255,77,109,.08)":"rgba(0,255,163,.06)",border:`1px solid ${sus?"rgba(255,77,109,.2)":"rgba(0,255,163,.15)"}`,padding:"2px 8px",borderRadius:4,flexShrink:0}}>{type}</span></div>))}</div></Panel>
              <Panel title="ATTACHMENT ANALYSIS" icon="ðŸ“Ž" color="#FF4D6D" delay={.6}>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.attach.length === 0 && (
                    <div className="f-mono" style={{ fontSize: 10, color: "rgba(100,140,170,.45)" }}>
                      No attachments detected.
                    </div>
                  )}
                  {result.attach.map((a, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 8,
                        background: a.danger ? "rgba(255,77,109,.04)" : "rgba(0,255,163,.03)",
                        border: a.danger ? "1px solid rgba(255,77,109,.16)" : "1px solid rgba(0,255,163,.16)",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{a.danger ? "âš ï¸" : "ðŸŸ¢"}</span>
                      <div style={{ flex: 1 }}>
                        <div className="f-mono" style={{ fontSize: 12, color: a.danger ? "#FF4D6D" : "#00FFA3" }}>
                          {a.name}
                        </div>
                        <div className="f-mono" style={{ fontSize: 9, color: "rgba(100,140,170,.45)", marginTop: 3 }}>
                          {a.danger ? "RISKY EXTENSION DETECTED" : "No dangerous extension detected"}
                        </div>
                      </div>
                      <span
                        className="f-mono"
                        style={{
                          fontSize: 9,
                          color: a.danger ? "#FF4D6D" : "#00FFA3",
                          background: a.danger ? "rgba(255,77,109,.1)" : "rgba(0,255,163,.1)",
                          border: a.danger ? "1px solid rgba(255,77,109,.3)" : "1px solid rgba(0,255,163,.3)",
                          padding: "3px 10px",
                          borderRadius: 4,
                        }}
                      >
                        {a.danger ? "DANGER" : "OK"}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="LANGUAGE SIGNALS" icon="ðŸ§ " color="#7C3AED" delay={.65}>
                <div style={{ marginTop: 14 }}>
                  <div className="f-mono" style={{ fontSize: 9, color: "rgba(100,140,170,.4)", letterSpacing: 2, marginBottom: 12 }}>
                    DETECTED LANGUAGE FLAGS
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(result.kw.length ? result.kw : ["No high-risk language flags"]).map((kw) => (
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
                  <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 8, background: "rgba(124,58,237,.05)", border: "1px solid rgba(124,58,237,.14)" }}>
                    <div className="f-mono" style={{ fontSize: 9, color: "rgba(124,58,237,.6)", letterSpacing: 2, marginBottom: 8 }}>
                      LANGUAGE RISK SCORE
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,.04)", borderRadius: 99, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${phishScore}%` }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        style={{ height: "100%", background: "linear-gradient(90deg,#7C3AED66,#7C3AED)", borderRadius: 99, boxShadow: "0 0 10px #7C3AED" }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      <span className="f-mono" style={{ fontSize: 8, color: "rgba(124,58,237,.4)" }}>LOW RISK</span>
                      <span className="f-mono" style={{ fontSize: 9, color: "#9B6FE0" }}>{phishScore}% SIGNAL SCORE</span>
                    </div>
                  </div>
                </div>
              </Panel>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.footer initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}} style={{textAlign:"center",marginTop:72,paddingTop:30,borderTop:"1px solid rgba(0,229,255,.05)"}}>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:20,flexWrap:"wrap"}}>{["247,832 THREATS TRACKED","99.98% UPTIME","<15ms LATENCY","AI MODEL v2.4.1"].map(s=>(<span key={s} className="f-mono" style={{fontSize:9,color:"rgba(100,140,170,.2)",letterSpacing:1}}>{s}</span>))}</div>
        <div className="f-mono" style={{fontSize:8,color:"rgba(100,140,170,.12)",marginTop:12,letterSpacing:3}}>SENTINEL AI Â· THREAT INTELLIGENCE PLATFORM Â· BUILD 2026.03</div>
      </motion.footer>
    </div>
  );
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ROOT APP
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function App() {
  const [page, setPage] = useState("landing");
  const [scrollY, setScrollY] = useState(0);
  const mx = useMotionValue(600), my = useMotionValue(400);
  const sx = useSpring(mx,{stiffness:40,damping:18});
  const sy = useSpring(my,{stiffness:40,damping:18});

  useEffect(()=>{
    const onScroll=()=>setScrollY(window.scrollY);
    const onMove=e=>{mx.set(e.clientX);my.set(e.clientY);};
    window.addEventListener("scroll",onScroll);
    window.addEventListener("mousemove",onMove);
    return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("mousemove",onMove);};
  },[]);

  const goToApp = () => { setPage("app"); window.scrollTo({top:0,behavior:"smooth"}); };
  const goHome  = () => { setPage("landing"); window.scrollTo({top:0,behavior:"smooth"}); };

  return (
    <div style={{minHeight:"100vh",position:"relative"}}>
      <GlobalStyles/>
      <AuroraBlobs/>
      <AuroraBackground mx={sx} my={sy}/>
      <Nav page={page} setPage={p=>{if(p==="landing")goHome();else goToApp();}} scrollY={scrollY}/>
      <AnimatePresence mode="wait">
        {page==="landing" ? (
          <motion.div key="landing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,x:-40}} transition={{duration:.4}}>
            <LandingPage mx={sx} my={sy} goToApp={goToApp}/>
          </motion.div>
        ) : (
          <motion.div key="app" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:40}} transition={{duration:.4}}>
            <AnalyzerApp mx={sx} my={sy}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




