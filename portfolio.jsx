import { useState, useEffect } from "react";

const TAGS = ["Python","React","Node.js","TypeScript","Web3","Solidity","CSS","HTML","API","DB","AI","Mobile","CLI","Game","Data","Cloud","Auth","UI/UX","AsyncIO","SQL","Docker","Telegram"];
const STATUS_OPTIONS = ["En progreso", "Completado", "En pausa"];
const STATUS_COLORS = { "En progreso": "#F59E0B", "Completado": "#10B981", "En pausa": "#94A3B8" };
const GRADIENTS = [
  "linear-gradient(135deg,#26215C 0%,#0F6E56 50%,#042C53 100%)",
  "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
  "linear-gradient(135deg,#0d0d0d 0%,#1a1a2e 50%,#2d1b69 100%)",
  "linear-gradient(135deg,#134e5e 0%,#71b280 100%)",
  "linear-gradient(135deg,#2c3e50 0%,#3498db 100%)",
  "linear-gradient(135deg,#141E30 0%,#243B55 100%)",
  "linear-gradient(135deg,#4a1942 0%,#1a1a2e 100%)",
  "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
];
const HLC = ["#534AB7","#0F6E56","#185FA5","#D85A30","#B7374A","#2D8A6E","#8B5CF6","#D97706"];
function gid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

const EMPTY_PROFILE = { name:"", title:"", bio:"", location:"", email:"", github:"", linkedin:"", website:"", skills:"", photo:"", hobbies:"" };
const HOBBY_ICONS = {"Gaming":"🎮","Música":"🎵","Lectura":"📚","Cine":"🎬","Fotografía":"📷","Viajes":"✈️","Cocina":"🍳","Deportes":"⚽","Arte":"🎨","Crypto":"₿","Fitness":"💪","Naturaleza":"🌿","Ajedrez":"♟️","Podcast":"🎙️","DIY":"🔧","Escritura":"✍️"};
const EMPTY_PROJECT = {
  title:"",badge:"",description:"",tags:[],status:"En progreso",url:"",repo:"",
  date:new Date().toISOString().split("T")[0],
  metrics:[{val:"",label:""},{val:"",label:""},{val:"",label:""},{val:"",label:""}],
  architecture:"",
  highlights:[{title:"",desc:""},{title:"",desc:""},{title:"",desc:""},{title:"",desc:""}],
  gradient:0,
};
const ALM = {
  id:"alm_seed_001",title:"ALM - Automated Liquidity Manager",badge:"DeFi / Blockchain",
  description:"Sistema completo de gestión automatizada de liquidez para Uniswap V3 desplegado en Polygon. Monitorea precios en tiempo real via WebSocket/RPC, calcula rangos óptimos usando Bandas de Bollinger, ejecuta rebalanceos con buffer zone para minimizar gas, y reinvierte comisiones automáticamente. Incluye circuit breaker de emergencia, base de datos SQLite para tracking de performance, y bot de Telegram bilingüe para control remoto desde el celular.",
  tags:["Python","Web3","AsyncIO","SQL","Telegram","API","CLI","Data"],status:"En progreso",url:"",repo:"",date:"2026-04-19",
  metrics:[{val:"82",label:"Unit tests"},{val:"24",label:"Modules"},{val:"$39",label:"Capital activo"},{val:"138%",label:"APY estimado"}],
  architecture:"Orchestrator (main.py)\n├── Price Monitor     (WebSocket/HTTP feed)\n├── Volatility Engine (Bollinger Bands)\n├── Rebalancer        (State machine + buffer)\n├── Circuit Breaker   (Crash detection)\n├── Auto-Compounder   (Fee reinvestment)\n│\n├── Blockchain Layer\n│   ├── Web3 Client   (Gas, nonce, tx signing)\n│   ├── Uniswap V3    (Mint, burn, collect, swap)\n│   └── Contract ABIs (Position Manager, Router)\n│\n├── Database Layer\n│   ├── SQLAlchemy ORM (Models, repository)\n│   └── Performance Tracker (Snapshots, metrics)\n│\n└── Telegram Bot      (Bilingual ES/EN, buttons)",
  highlights:[{title:"Rebalanceo inteligente",desc:"Buffer zone + Bollinger Bands evitan rebalanceos innecesarios"},{title:"Circuit breaker",desc:"Detiene operaciones si el precio cae >10% en 1 hora"},{title:"Cache bypass",desc:"Multi-RPC para resolver bug de cache USDT0 en Alchemy"},{title:"Control remoto",desc:"Bot Telegram bilingüe con botones para operar desde el celular"}],
  gradient:0,
};

// ===== FULL PORTFOLIO HTML EXPORT =====
function exportFullHTML(profile, projects) {
  const esc = s => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const skillsList = (profile.skills||"").split(",").map(s=>s.trim()).filter(Boolean);
  const hobbiesList = (profile.hobbies||"").split(",").map(s=>s.trim()).filter(Boolean);

  const projectCards = projects.map((p,idx) => {
    const grad = GRADIENTS[p.gradient||0];
    const sc = STATUS_COLORS[p.status]||"#888";
    const mets = (p.metrics||[]).filter(m=>m.val);
    const hls = (p.highlights||[]).filter(h=>h.title);
    const metHTML = mets.map(m=>`<div class="metric"><div class="mv">${esc(m.val)}</div><div class="ml">${esc(m.label)}</div></div>`).join("");
    const tagHTML = p.tags.map(t=>`<span class="tech">${esc(t)}</span>`).join("");
    const hlHTML = hls.map((h,i)=>`<div class="hl" style="border-left-color:${HLC[i%HLC.length]}"><div class="hl-t">${esc(h.title)}</div><div class="hl-d">${esc(h.desc)}</div></div>`).join("");
    const archHTML = p.architecture ? `<div class="tab-c" data-proj="${idx}" data-tab="1"><div class="arch">${esc(p.architecture)}</div></div>` : `<div class="tab-c" data-proj="${idx}" data-tab="1"><p class="muted">Sin arquitectura definida.</p></div>`;
    const links = [p.repo&&`<a href="${esc(p.repo)}" target="_blank">GitHub ↗</a>`,p.url&&`<a href="${esc(p.url)}" target="_blank">Demo ↗</a>`].filter(Boolean).join("");

    return `<div class="project-card">
  <div class="p-header" style="background:${grad}">
    ${p.badge?`<span class="p-badge">${esc(p.badge)}</span>`:""}
    <h3 class="p-title">${esc(p.title)}</h3>
    <div class="p-status" style="color:${sc}"><span class="sdot" style="background:${sc}"></span>${esc(p.status)}</div>
  </div>
  <div class="p-body">
    ${metHTML?`<div class="metrics" style="grid-template-columns:repeat(${Math.min(mets.length,4)},1fr)">${metHTML}</div>`:""}
    <div class="tabs" data-proj="${idx}">
      <div class="tab active" onclick="stab(${idx},0)">Overview</div>
      <div class="tab" onclick="stab(${idx},1)">Arquitectura</div>
      <div class="tab" onclick="stab(${idx},2)">Tech Stack</div>
      <div class="tab" onclick="stab(${idx},3)">Highlights</div>
    </div>
    <div class="tab-c active" data-proj="${idx}" data-tab="0"><p class="desc">${esc(p.description)||"Sin descripción."}</p></div>
    ${archHTML}
    <div class="tab-c" data-proj="${idx}" data-tab="2">${tagHTML?`<div class="tech-grid">${tagHTML}</div>`:`<p class="muted">Sin tecnologías.</p>`}</div>
    <div class="tab-c" data-proj="${idx}" data-tab="3">${hlHTML?`<div class="highlights">${hlHTML}</div>`:`<p class="muted">Sin highlights.</p>`}</div>
    ${links?`<div class="p-links">${links}</div>`:""}
  </div>
</div>`;
  }).join("\n");

  const profileSection = profile.name ? `
  <section class="about">
    <div class="about-content">
      <div class="about-text">
        ${profile.photo?`<div class="about-photo-wrap"><img src="${esc(profile.photo)}" alt="${esc(profile.name)}" class="about-photo"/></div>`:""}
        <h1 class="about-name">${esc(profile.name)}</h1>
        ${profile.title?`<p class="about-title">${esc(profile.title)}</p>`:""}
        ${profile.location?`<p class="about-location">📍 ${esc(profile.location)}</p>`:""}
        ${profile.bio?`<p class="about-bio">${esc(profile.bio)}</p>`:""}
        ${skillsList.length?`<div class="about-skills">${skillsList.map(s=>`<span class="skill-tag">${esc(s)}</span>`).join("")}</div>`:""}
        ${hobbiesList.length?`<div class="about-hobbies"><span class="about-section-label">Hobbies</span><div class="hobby-grid">${hobbiesList.map(h=>{const icon=HOBBY_ICONS[h]||"✦";return `<span class="hobby-tag">${icon} ${esc(h)}</span>`;}).join("")}</div></div>`:""}
        <div class="about-links">
          ${profile.email?`<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>`:""}
          ${profile.github?`<a href="${esc(profile.github)}" target="_blank">GitHub ↗</a>`:""}
          ${profile.linkedin?`<a href="${esc(profile.linkedin)}" target="_blank">LinkedIn ↗</a>`:""}
          ${profile.website?`<a href="${esc(profile.website)}" target="_blank">Web ↗</a>`:""}
        </div>
      </div>
    </div>
  </section>` : "";

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(profile.name||"Portfolio")} — Portfolio</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#0A0A0F;color:#E8E8ED;min-height:100vh}
::selection{background:#C084FC;color:#0A0A0F}
a{color:#C084FC;text-decoration:none}a:hover{text-decoration:underline}

/* NAV */
.nav{padding:20px 32px;border-bottom:1px solid #1A1A24;display:flex;align-items:baseline;gap:14}
.nav h2{font-family:'DM Serif Display',serif;font-size:24px;font-weight:400;letter-spacing:-0.02em}
.nav span{color:#C084FC}
.nav p{font-size:12px;color:#555568}

/* ABOUT */
.about{padding:40px 32px;max-width:900px;margin:0 auto}
.about-content{display:flex;gap:24;align-items:flex-start}
.about-text{width:100%}
.about-photo-wrap{float:right;margin:0 0 16px 24px}
.about-photo{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid #1A1A24}
.about-name{font-family:'DM Serif Display',serif;font-size:36px;letter-spacing:-0.02em;margin-bottom:4px;color:#E8E8ED}
.about-title{font-size:16px;color:#C084FC;font-weight:500;margin-bottom:6px}
.about-location{font-size:13px;color:#888;margin-bottom:16px}
.about-bio{font-size:14px;line-height:1.8;color:#AAAAB0;margin-bottom:20px;max-width:600px}
.about-skills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
.skill-tag{font-family:'JetBrains Mono',monospace;font-size:12px;padding:4px 12px;border-radius:6px;background:rgba(192,132,252,0.1);color:#C084FC;border:1px solid rgba(192,132,252,0.2)}
.about-hobbies{margin-bottom:20px}
.about-section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#555568;display:block;margin-bottom:8px}
.hobby-grid{display:flex;flex-wrap:wrap;gap:8px}
.hobby-tag{font-size:13px;padding:6px 14px;border-radius:20px;background:rgba(192,132,252,0.06);color:#AAAAB0;border:1px solid #1A1A24;display:inline-flex;align-items:center;gap:4px}
.about-links{display:flex;flex-wrap:wrap;gap:16px}
.about-links a{font-size:13px;color:#C084FC;transition:opacity 0.2s}
.about-links a:hover{opacity:0.8}

/* PROJECTS */
.projects-header{padding:32px 32px 16px;max-width:900px;margin:0 auto}
.projects-header h2{font-family:'DM Serif Display',serif;font-size:22px;color:#888;font-weight:400}
.projects{max-width:900px;margin:0 auto;padding:0 32px 60px;display:flex;flex-direction:column;gap:20px}
.project-card{background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e0e0e0}
.p-header{padding:20px 24px 14px;position:relative}
.p-badge{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:11px;padding:3px 10px;border-radius:8px;background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.85);margin-bottom:8px}
.p-title{font-size:22px;font-weight:500;color:#fff;letter-spacing:-0.3px;margin:0}
.p-status{display:flex;align-items:center;gap:5px;font-size:12px;margin-top:8px}
.sdot{width:7px;height:7px;border-radius:50%;display:inline-block;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.p-body{padding:20px 24px}
.metrics{display:grid;gap:8px;margin-bottom:16px}
.metric{background:#f5f5f0;border-radius:8px;padding:10px 12px;text-align:center}
.mv{font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:500;color:#222}
.ml{font-size:11px;color:#888;margin-top:2px}
.tabs{display:flex;border-bottom:1px solid #e0e0e0;margin-bottom:12px}
.tab{padding:8px 14px;font-size:13px;font-weight:500;color:#888;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s}
.tab.active{color:#222;border-bottom-color:#534AB7}
.tab:hover{color:#222}
.tab-c{display:none}.tab-c.active{display:block}
.desc{font-size:14px;line-height:1.7;color:#222}
.muted{font-size:14px;color:#888}
.arch{font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.8;color:#666;background:#f5f5f0;padding:12px 16px;border-radius:8px;white-space:pre;overflow-x:auto}
.tech-grid{display:flex;flex-wrap:wrap;gap:6px}
.tech{font-family:'JetBrains Mono',monospace;font-size:12px;padding:4px 10px;border-radius:8px;background:#f5f5f0;color:#666;border:1px solid #e0e0e0}
.highlights{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hl{padding:10px 12px;border-radius:8px;border-left:3px solid;background:#f5f5f0}
.hl-t{font-size:13px;font-weight:500;color:#222}.hl-d{font-size:12px;color:#888;margin-top:2px}
.p-links{margin-top:16px;padding-top:12px;border-top:1px solid #e0e0e0;display:flex;gap:16px}
.p-links a{font-size:13px;color:#185FA5}

.footer-exp{text-align:center;padding:20px;font-size:11px;color:#333340;font-family:'JetBrains Mono',monospace;border-top:1px solid #1A1A24}
@media(max-width:600px){.highlights{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,1fr)!important}.about-photo-wrap{float:none;margin:0 0 16px 0}}
</style></head><body>
<nav class="nav"><h2><span>◈</span> ${esc(profile.name||"Mi Portfolio")}</h2><p>Portfolio de desarrollos</p></nav>
${profileSection}
<div class="projects-header"><h2>${projects.length} Proyecto${projects.length!==1?"s":""}</h2></div>
<div class="projects">${projectCards}</div>
<div class="footer-exp">Generado desde Mi Portfolio</div>
<script>
function stab(p,n){
  document.querySelectorAll('.tabs[data-proj="'+p+'"] .tab').forEach((t,i)=>t.classList.toggle('active',i===n));
  document.querySelectorAll('.tab-c[data-proj="'+p+'"]').forEach((c,i)=>c.classList.toggle('active',parseInt(c.dataset.tab)===n));
}
</script></body></html>`;
}

// ===== SINGLE PROJECT HTML =====
function exportProjectHTML(p) {
  const esc = s => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const grad = GRADIENTS[p.gradient||0];
  const sc = STATUS_COLORS[p.status]||"#888";
  const mets = (p.metrics||[]).filter(m=>m.val);
  const mHTML = mets.map(m=>`<div class="metric"><div class="metric-val">${esc(m.val)}</div><div class="metric-label">${esc(m.label)}</div></div>`).join("");
  const tHTML = p.tags.map(t=>`<span class="tech">${esc(t)}</span>`).join("");
  const hHTML = (p.highlights||[]).filter(h=>h.title).map((h,i)=>`<div class="hl" style="border-color:${HLC[i%HLC.length]}"><div class="hl-title">${esc(h.title)}</div><div class="hl-desc">${esc(h.desc)}</div></div>`).join("");
  const links = [p.repo&&`<a href="${esc(p.repo)}">GitHub</a>`,p.url&&`<a href="${esc(p.url)}">Demo</a>`].filter(Boolean).join("");
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(p.title)} | Portfolio</title>
<style>@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');*{box-sizing:border-box;margin:0}body{font-family:'DM Sans',sans-serif;background:#f5f5f0;display:flex;justify-content:center;padding:2rem}.card{background:#fff;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;max-width:680px;width:100%}.header{padding:1.5rem 1.5rem 1rem;position:relative;overflow:hidden}.header::before{content:'';position:absolute;inset:0;background:${grad};opacity:0.95}.header *{position:relative;z-index:1}.badge{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.5px;padding:3px 10px;border-radius:8px;background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.85);margin-bottom:10px}.title{font-size:22px;font-weight:500;color:#fff;margin-bottom:4px;letter-spacing:-0.3px}.status-pill{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:${sc};margin-top:10px}.status-dot{width:7px;height:7px;border-radius:50%;background:${sc};animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}.body{padding:1.25rem 1.5rem}.section-label{font-size:12px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px}.desc{font-size:14px;line-height:1.7;color:#222;margin-bottom:1.25rem}.metrics{display:grid;grid-template-columns:repeat(${Math.min(mets.length,4)},1fr);gap:8px;margin-bottom:1.25rem}.metric{background:#f5f5f0;border-radius:8px;padding:10px 12px;text-align:center}.metric-val{font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:500;color:#222}.metric-label{font-size:11px;color:#888;margin-top:2px}.tech-grid{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1.25rem}.tech{font-family:'JetBrains Mono',monospace;font-size:12px;padding:4px 10px;border-radius:8px;background:#f5f5f0;color:#666;border:1px solid #e0e0e0}.arch{font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.8;color:#666;background:#f5f5f0;padding:12px 16px;border-radius:8px;margin-bottom:1.25rem;white-space:pre;overflow-x:auto}.highlights{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:1rem}.hl{padding:10px 12px;border-radius:8px;border-left:3px solid;background:#f5f5f0}.hl-title{font-size:13px;font-weight:500;color:#222}.hl-desc{font-size:12px;color:#888;margin-top:2px}.footer{padding:0.75rem 1.5rem;border-top:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center}.footer-left{font-size:12px;color:#888}.footer-links{display:flex;gap:12px}.footer-links a{font-size:12px;color:#185FA5;text-decoration:none}.footer-links a:hover{text-decoration:underline}.tabs{display:flex;gap:0;margin-bottom:1rem;border-bottom:1px solid #e0e0e0}.tab{padding:8px 16px;font-size:13px;font-weight:500;color:#888;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s}.tab.active{color:#222;border-bottom-color:#534AB7}.tab:hover{color:#222}.tab-content{display:none}.tab-content.active{display:block}</style></head><body>
<div class="card"><div class="header">${p.badge?`<div class="badge">${esc(p.badge)}</div>`:""}<div class="title">${esc(p.title)}</div><div class="status-pill"><span class="status-dot"></span> ${esc(p.status)}</div></div>
<div class="body">${mHTML?`<div class="metrics">${mHTML}</div>`:""}<div class="tabs"><div class="tab active" onclick="switchTab(0)">Overview</div><div class="tab" onclick="switchTab(1)">Arquitectura</div><div class="tab" onclick="switchTab(2)">Tech Stack</div><div class="tab" onclick="switchTab(3)">Highlights</div></div>
<div class="tab-content active" id="tc0"><div class="desc">${esc(p.description)||"Sin descripción."}</div></div>
<div class="tab-content" id="tc1">${p.architecture?`<div class="arch">${esc(p.architecture)}</div>`:`<p style="color:#888">Sin arquitectura.</p>`}</div>
<div class="tab-content" id="tc2">${tHTML?`<div class="section-label">Stack</div><div class="tech-grid">${tHTML}</div>`:`<p style="color:#888">Sin tecnologías.</p>`}</div>
<div class="tab-content" id="tc3">${hHTML?`<div class="highlights">${hHTML}</div>`:`<p style="color:#888">Sin highlights.</p>`}</div></div>
<div class="footer"><div class="footer-left">${esc(p.date)}</div><div class="footer-links">${links}</div></div></div>
<script>function switchTab(n){document.querySelectorAll('.tab').forEach((t,i)=>{t.classList.toggle('active',i===n)});document.querySelectorAll('.tab-content').forEach((c,i)=>{c.classList.toggle('active',i===n)});}</script></body></html>`;
}

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState({...EMPTY_PROFILE});
  const [view, setView] = useState("grid"); // grid|form|presentation|profile
  const [editP, setEditP] = useState(null);
  const [form, setForm] = useState({...EMPTY_PROJECT});
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [ptab, setPtab] = useState(0);
  const [profForm, setProfForm] = useState({...EMPTY_PROFILE});

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("portfolio-projects-v2");
        if (r?.value) setProjects(JSON.parse(r.value));
      } catch(e){}
      try {
        const r2 = await window.storage.get("portfolio-profile");
        if (r2?.value) { const p = JSON.parse(r2.value); setProfile(p); setProfForm(p); }
      } catch(e){}
      setLoading(false);
    })();
  }, []);

  const saveP = async u => { setProjects(u); try{await window.storage.set("portfolio-projects-v2",JSON.stringify(u))}catch(e){} };
  const saveProfile = async p => { setProfile(p); setProfForm(p); try{await window.storage.set("portfolio-profile",JSON.stringify(p))}catch(e){} };
  const notify = m => { setNotif(m); setTimeout(()=>setNotif(null),2500); };

  const handleSubmit = () => {
    if(!form.title.trim()) return;
    let u;
    if(editP){u=projects.map(p=>p.id===editP.id?{...form,id:editP.id}:p);notify("Proyecto actualizado");}
    else{u=[{...form,id:gid()},...projects];notify("Proyecto agregado");}
    saveP(u);setForm({...EMPTY_PROJECT});setEditP(null);setView("grid");
  };
  const handleDelete = id => { saveP(projects.filter(p=>p.id!==id)); notify("Eliminado"); if(view==="presentation")setView("grid"); };
  const handleEdit = p => {
    setForm({...EMPTY_PROJECT,...p,
      metrics:(p.metrics?.length===4)?p.metrics:[...(p.metrics||[]),...EMPTY_PROJECT.metrics].slice(0,4),
      highlights:(p.highlights?.length===4)?p.highlights:[...(p.highlights||[]),...EMPTY_PROJECT.highlights].slice(0,4),
    });setEditP(p);setView("form");
  };

  const dlProject = p => {
    const html = exportProjectHTML(p);
    const b = new Blob([html],{type:"text/html"});
    const u = URL.createObjectURL(b);
    const a = document.createElement("a"); a.href=u; a.download=p.title.replace(/[^a-zA-Z0-9]/g,"_")+".html";
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u);
    notify("HTML de proyecto descargado");
  };
  const dlFull = () => {
    const html = exportFullHTML(profile, projects);
    const b = new Blob([html],{type:"text/html"});
    const u = URL.createObjectURL(b);
    const a = document.createElement("a"); a.href=u; a.download="portfolio.html";
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u);
    notify("Portfolio completo descargado");
  };

  const addALM = () => {
    if(projects.find(p=>p.id===ALM.id)){notify("ALM ya agregado");return;}
    saveP([ALM,...projects]); notify("ALM agregado");
  };

  const filtered = projects.filter(p=>{
    const mf=filter==="Todos"||p.status===filter;
    const ms=!search||p.title.toLowerCase().includes(search.toLowerCase())||p.description.toLowerCase().includes(search.toLowerCase())||p.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()));
    return mf&&ms;
  });
  const stats={total:projects.length,done:projects.filter(p=>p.status==="Completado").length,prog:projects.filter(p=>p.status==="En progreso").length,pause:projects.filter(p=>p.status==="En pausa").length};
  const uM=(i,f,v)=>{const m=[...form.metrics];m[i]={...m[i],[f]:v};setForm({...form,metrics:m});};
  const uH=(i,f,v)=>{const h=[...form.highlights];h[i]={...h[i],[f]:v};setForm({...form,highlights:h});};

  if(loading) return <div style={S.loading}><div style={S.loadPulse}>◈</div><p style={S.loadText}>Cargando portfolio...</p></div>;

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}::selection{background:#C084FC;color:#0A0A0F}
        input::placeholder,textarea::placeholder{color:#555568}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes notifIn{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}
        .ci:hover{transform:translateY(-4px)!important;box-shadow:0 12px 40px rgba(192,132,252,0.12)!important;border-color:#C084FC!important}
        .ci:hover .cb{opacity:1!important}
        .hb:hover{background:rgba(192,132,252,0.15)!important;color:#C084FC!important}
        .fb:hover{border-color:#C084FC!important;color:#C084FC!important}
        .tb:hover{background:#C084FC!important;color:#0A0A0F!important}
        .sb:hover{background:rgba(192,132,252,0.1)!important}
        input:focus,textarea:focus{border-color:#C084FC!important;outline:none;box-shadow:0 0 0 3px rgba(192,132,252,0.15)}
        .gs:hover{border-color:#C084FC!important}
        .pt:hover{color:#E8E8ED!important}
        .dl:hover{background:#A855F7!important}
        .export-btn:hover{background:#C084FC!important;color:#0A0A0F!important}
      `}</style>

      {notif && <div style={S.notif}>{notif}</div>}

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.hLeft}>
          <h1 style={S.logo} onClick={()=>{setView("grid");setSel(null);}}>
            <span style={{color:"#C084FC"}}>◈</span> {profile.name || "Mi Portfolio"}
          </h1>
          <p style={S.sub}>{profile.title || "Registro de desarrollos"}</p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {view==="grid" && <>
            <button className="hb" style={S.navBtn} onClick={()=>{setProfForm({...profile});setView("profile");}}>👤 Sobre mí</button>
            <button className="export-btn" style={S.exportBtn} onClick={dlFull}>↓ Exportar portfolio</button>
            {!projects.find(p=>p.id===ALM.id)&&<button className="sb" style={S.secBtn} onClick={addALM}>+ ALM</button>}
            <button style={S.primBtn} onClick={()=>{setForm({...EMPTY_PROJECT});setEditP(null);setView("form");}}>+ Nuevo proyecto</button>
          </>}
          {view!=="grid" && <button className="hb" style={S.backBtn} onClick={()=>{setView("grid");setEditP(null);setForm({...EMPTY_PROJECT});}}>← Volver</button>}
        </div>
      </header>

      {/* ===== GRID ===== */}
      {view==="grid" && <div style={S.main}>
        {/* Profile preview */}
        {profile.name && <div style={S.profilePreview}>
          <div style={{display:"flex",alignItems:"center",gap:16,flex:1}}>
            {profile.photo && <img src={profile.photo} alt="" style={S.ppPhoto}/>}
            <div>
              <div style={S.ppName}>{profile.name}</div>
              {profile.title && <div style={S.ppTitle}>{profile.title}</div>}
              {profile.location && <div style={S.ppLoc}>📍 {profile.location}</div>}
            </div>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            {profile.hobbies && profile.hobbies.split(",").filter(h=>h.trim()).map(h=>{const t=h.trim();const icon=HOBBY_ICONS[t]||"✦";return <span key={t} style={S.hobbyPill}>{icon} {t}</span>;}) }
            {profile.email && <a href={`mailto:${profile.email}`} style={S.ppLink}>{profile.email}</a>}
            {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" style={S.ppLink}>GitHub ↗</a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={S.ppLink}>LinkedIn ↗</a>}
          </div>
        </div>}

        {/* Stats */}
        {projects.length>0 && <div style={S.statsBar}>
          {[{n:stats.total,l:"Total",c:"#E8E8ED"},{n:stats.done,l:"Completados",c:"#10B981"},{n:stats.prog,l:"En progreso",c:"#F59E0B"},{n:stats.pause,l:"En pausa",c:"#94A3B8"}].map((s,i)=>
            <React.Fragment key={i}>{i>0&&<div style={S.statDiv}/>}<div style={S.statItem}><span style={{...S.statNum,color:s.c}}>{s.n}</span><span style={S.statLbl}>{s.l}</span></div></React.Fragment>
          )}
        </div>}

        {/* Toolbar */}
        {projects.length>0 && <div style={S.toolbar}>
          <input style={S.searchInput} placeholder="Buscar proyectos..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Todos",...STATUS_OPTIONS].map(s=><button key={s} className="fb" style={{...S.filterBtn,...(filter===s?S.filterAct:{})}} onClick={()=>setFilter(s)}>{s}</button>)}
          </div>
        </div>}

        {/* Cards */}
        {filtered.length>0 ? <div style={S.grid}>
          {filtered.map((p,i)=>(
            <div key={p.id} className="ci" style={{...S.card,animation:`fadeIn 0.4s ease ${i*0.06}s both`}} onClick={()=>{setSel(p);setPtab(0);setView("presentation");}}>
              <div className="cb" style={{...S.cardBar,background:STATUS_COLORS[p.status]}}/>
              <div style={S.cardHead}>
                <div style={{display:"flex",alignItems:"center"}}>
                  <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:STATUS_COLORS[p.status],marginRight:6}}/>
                  <span style={{color:STATUS_COLORS[p.status],fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{p.status}</span>
                </div>
                <span style={S.cardDate}>{p.date}</span>
              </div>
              {p.badge && <span style={S.cardBadge}>{p.badge}</span>}
              <h3 style={S.cardTitle}>{p.title}</h3>
              <p style={S.cardDesc}>{p.description}</p>
              {p.metrics?.some(m=>m.val) && <div style={S.cardMetrics}>
                {p.metrics.filter(m=>m.val).slice(0,3).map((m,j)=><div key={j} style={S.miniMetric}><span style={S.miniVal}>{m.val}</span><span style={S.miniLbl}>{m.label}</span></div>)}
              </div>}
              {p.tags.length>0 && <div style={S.cardTags}>{p.tags.slice(0,5).map(t=><span key={t} style={S.cardTag}>{t}</span>)}{p.tags.length>5&&<span style={S.cardTag}>+{p.tags.length-5}</span>}</div>}
              <div style={S.cardFoot}>
                <button className="hb" style={S.cardAct} onClick={e=>{e.stopPropagation();handleEdit(p);}}>✎ Editar</button>
                <button className="hb" style={S.cardAct} onClick={e=>{e.stopPropagation();dlProject(p);}}>↓ HTML</button>
                <button className="hb" style={{...S.cardAct,color:"#EF4444"}} onClick={e=>{e.stopPropagation();handleDelete(p.id);}}>✕</button>
              </div>
            </div>
          ))}
        </div> : projects.length===0 ? <div style={S.empty}>
          <div style={S.emptyIcon}>◈</div>
          <h2 style={S.emptyTitle}>Tu portfolio está vacío</h2>
          <p style={S.emptyDesc}>Comenzá agregando tu primer proyecto.</p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="sb" style={S.secBtn} onClick={addALM}>+ Agregar ALM</button>
            <button style={S.primBtn} onClick={()=>{setForm({...EMPTY_PROJECT});setEditP(null);setView("form");}}>+ Nuevo proyecto</button>
          </div>
        </div> : <div style={S.empty}><p style={S.emptyDesc}>No se encontraron proyectos.</p></div>}
      </div>}

      {/* ===== PROFILE FORM ===== */}
      {view==="profile" && <div style={S.formWrap}>
        <h2 style={S.formTitle}>Sobre mí</h2>
        <p style={{fontSize:13,color:"#888",marginBottom:24,lineHeight:1.6}}>Esta información aparece en tu portfolio exportado y en el header de la app.</p>
        <div style={S.formSection}>
          <div style={S.formRow}>
            <div style={S.fGroup}><label style={S.label}>Nombre completo</label><input style={S.input} placeholder="Tu nombre" value={profForm.name} onChange={e=>setProfForm({...profForm,name:e.target.value})}/></div>
            <div style={S.fGroup}><label style={S.label}>Título / Rol</label><input style={S.input} placeholder="Ej: Full Stack Developer" value={profForm.title} onChange={e=>setProfForm({...profForm,title:e.target.value})}/></div>
          </div>
          <div style={S.fGroup}><label style={S.label}>Bio / Descripción</label><textarea style={{...S.input,minHeight:90,resize:"vertical",fontFamily:"'DM Sans',sans-serif"}} placeholder="Contá un poco sobre vos, tu experiencia, qué te apasiona..." value={profForm.bio} onChange={e=>setProfForm({...profForm,bio:e.target.value})}/></div>
          <div style={S.formRow}>
            <div style={S.fGroup}><label style={S.label}>Ubicación</label><input style={S.input} placeholder="Ej: Córdoba, Argentina" value={profForm.location} onChange={e=>setProfForm({...profForm,location:e.target.value})}/></div>
            <div style={S.fGroup}><label style={S.label}>Email de contacto</label><input style={S.input} placeholder="tu@email.com" value={profForm.email} onChange={e=>setProfForm({...profForm,email:e.target.value})}/></div>
          </div>
        </div>
        <div style={S.formSection}>
          <div style={S.formRow}>
            <div style={S.fGroup}><label style={S.label}>GitHub</label><input style={S.input} placeholder="https://github.com/..." value={profForm.github} onChange={e=>setProfForm({...profForm,github:e.target.value})}/></div>
            <div style={S.fGroup}><label style={S.label}>LinkedIn</label><input style={S.input} placeholder="https://linkedin.com/in/..." value={profForm.linkedin} onChange={e=>setProfForm({...profForm,linkedin:e.target.value})}/></div>
          </div>
          <div style={S.formRow}>
            <div style={S.fGroup}><label style={S.label}>Sitio web</label><input style={S.input} placeholder="https://..." value={profForm.website} onChange={e=>setProfForm({...profForm,website:e.target.value})}/></div>
            <div style={S.fGroup}><label style={S.label}>URL de foto</label><input style={S.input} placeholder="https://...foto.jpg" value={profForm.photo} onChange={e=>setProfForm({...profForm,photo:e.target.value})}/></div>
          </div>
        </div>
        <div style={S.formSection}>
          <div style={S.fGroup}><label style={S.label}>Skills / Tecnologías (separadas por coma)</label><input style={S.input} placeholder="Python, React, Web3, DeFi, SQL..." value={profForm.skills} onChange={e=>setProfForm({...profForm,skills:e.target.value})}/></div>
        </div>
        <div style={S.formSection}>
          <label style={S.label}>Hobbies / Intereses</label>
          <p style={{fontSize:12,color:"#555568",marginBottom:10}}>Seleccioná o escribí tus hobbies separados por coma.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
            {Object.entries(HOBBY_ICONS).map(([h,icon])=>{
              const active=(profForm.hobbies||"").split(",").map(s=>s.trim()).includes(h);
              return <button key={h} className="tb" style={{...S.tagBtn,...(active?S.hobbyBtnAct:{}),display:"inline-flex",alignItems:"center",gap:4}} onClick={()=>{
                const list=(profForm.hobbies||"").split(",").map(s=>s.trim()).filter(Boolean);
                const updated=active?list.filter(x=>x!==h):[...list,h];
                setProfForm({...profForm,hobbies:updated.join(", ")});
              }}>{icon} {h}</button>;
            })}
          </div>
          <input style={S.input} placeholder="O escribí los tuyos: Gaming, Música, Viajes..." value={profForm.hobbies} onChange={e=>setProfForm({...profForm,hobbies:e.target.value})}/>
        </div>
        <div style={S.formActions}>
          <button style={S.cancelBtn} onClick={()=>setView("grid")}>Cancelar</button>
          <button style={S.primBtn} onClick={()=>{saveProfile(profForm);notify("Perfil guardado");setView("grid");}}>Guardar perfil</button>
        </div>
      </div>}

      {/* ===== PRESENTATION ===== */}
      {view==="presentation" && sel && <div style={S.presWrap}>
        <div style={S.presCard}>
          <div style={{...S.presHeader,background:GRADIENTS[sel.gradient||0]}}>
            {sel.badge && <span style={S.presBadge}>{sel.badge}</span>}
            <h2 style={S.presTitle}>{sel.title}</h2>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:STATUS_COLORS[sel.status],marginTop:10}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:STATUS_COLORS[sel.status],display:"inline-block",animation:"pulse 2s infinite"}}/>
              {sel.status}
            </div>
          </div>
          <div style={S.presBody}>
            {sel.metrics?.some(m=>m.val) && <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(sel.metrics.filter(m=>m.val).length,4)},1fr)`,gap:8,marginBottom:20}}>
              {sel.metrics.filter(m=>m.val).map((m,i)=><div key={i} style={S.presMetric}><div style={S.presMetricVal}>{m.val}</div><div style={S.presMetricLbl}>{m.label}</div></div>)}
            </div>}
            <div style={S.presTabs}>
              {["Overview","Arquitectura","Tech Stack","Highlights"].map((t,i)=><div key={i} className="pt" style={{...S.presTab,...(ptab===i?S.presTabAct:{})}} onClick={()=>setPtab(i)}>{t}</div>)}
            </div>
            {ptab===0 && <div style={S.presText}>{sel.description||"Sin descripción."}</div>}
            {ptab===1 && (sel.architecture?<pre style={S.presArch}>{sel.architecture}</pre>:<div style={S.presText}>Sin arquitectura definida.</div>)}
            {ptab===2 && (sel.tags.length>0?<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{sel.tags.map(t=><span key={t} style={S.presTech}>{t}</span>)}</div>:<div style={S.presText}>Sin tecnologías.</div>)}
            {ptab===3 && (sel.highlights?.some(h=>h.title)?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {sel.highlights.filter(h=>h.title).map((h,i)=><div key={i} style={{padding:"10px 12px",borderRadius:8,borderLeft:`3px solid ${HLC[i%HLC.length]}`,background:"#f5f5f0"}}><div style={{fontSize:13,fontWeight:500,color:"#222"}}>{h.title}</div><div style={{fontSize:12,color:"#888",marginTop:2}}>{h.desc}</div></div>)}
            </div>:<div style={S.presText}>Sin highlights.</div>)}
          </div>
          <div style={S.presFoot}>
            <span style={{fontSize:12,color:"#888"}}>{sel.date}</span>
            <div style={{display:"flex",gap:12}}>
              {sel.repo && <a href={sel.repo} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#185FA5",textDecoration:"none"}}>GitHub</a>}
              {sel.url && <a href={sel.url} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#185FA5",textDecoration:"none"}}>Demo</a>}
            </div>
          </div>
        </div>
        <div style={S.presActions}>
          <button className="dl" style={S.downloadBtn} onClick={()=>dlProject(sel)}>↓ Descargar HTML individual</button>
          <button className="hb" style={{...S.cardAct,fontSize:13,padding:"8px 16px"}} onClick={()=>handleEdit(sel)}>✎ Editar</button>
        </div>
      </div>}

      {/* ===== PROJECT FORM ===== */}
      {view==="form" && <div style={S.formWrap}>
        <h2 style={S.formTitle}>{editP?"Editar proyecto":"Nuevo proyecto"}</h2>
        <div style={S.formSection}>
          <div style={S.formRow}>
            <div style={S.fGroup}><label style={S.label}>Nombre *</label><input style={S.input} placeholder="Ej: Dashboard de ventas" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
            <div style={S.fGroup}><label style={S.label}>Categoría / Badge</label><input style={S.input} placeholder="Ej: DeFi / Blockchain" value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}/></div>
          </div>
          <div style={S.fGroup}><label style={S.label}>Descripción</label><textarea style={{...S.input,minHeight:90,resize:"vertical",fontFamily:"'DM Sans',sans-serif"}} placeholder="¿De qué se trata?" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div style={S.formRow}>
            <div style={S.fGroup}><label style={S.label}>Fecha</label><input style={S.input} type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div style={S.fGroup}><label style={S.label}>Estado</label><div style={{display:"flex",gap:6}}>{STATUS_OPTIONS.map(s=><button key={s} style={{...S.statusBtn,...(form.status===s?{background:STATUS_COLORS[s],color:"#0A0A0F",borderColor:STATUS_COLORS[s]}:{})}} onClick={()=>setForm({...form,status:s})}>{s}</button>)}</div></div>
          </div>
        </div>
        <div style={S.formSection}>
          <label style={S.label}>Métricas (hasta 4)</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
            {form.metrics.map((m,i)=><div key={i} style={{display:"flex",gap:6}}><input style={{...S.input,flex:"0 0 80px"}} placeholder="Valor" value={m.val} onChange={e=>uM(i,"val",e.target.value)}/><input style={{...S.input,flex:1}} placeholder="Label" value={m.label} onChange={e=>uM(i,"label",e.target.value)}/></div>)}
          </div>
        </div>
        <div style={S.formSection}>
          <label style={S.label}>Tecnologías</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {TAGS.map(t=><button key={t} className="tb" style={{...S.tagBtn,...(form.tags.includes(t)?S.tagAct:{})}} onClick={()=>setForm({...form,tags:form.tags.includes(t)?form.tags.filter(x=>x!==t):[...form.tags,t]})}>{t}</button>)}
          </div>
        </div>
        <div style={S.formSection}>
          <label style={S.label}>Arquitectura (ASCII)</label>
          <textarea style={{...S.input,minHeight:100,resize:"vertical",fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:"1.8",marginTop:8}} placeholder={"App\n├── Module A\n└── Module B"} value={form.architecture} onChange={e=>setForm({...form,architecture:e.target.value})}/>
        </div>
        <div style={S.formSection}>
          <label style={S.label}>Highlights (hasta 4)</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
            {form.highlights.map((h,i)=><div key={i} style={{display:"flex",flexDirection:"column",gap:4}}><input style={S.input} placeholder="Título" value={h.title} onChange={e=>uH(i,"title",e.target.value)}/><input style={S.input} placeholder="Descripción" value={h.desc} onChange={e=>uH(i,"desc",e.target.value)}/></div>)}
          </div>
        </div>
        <div style={S.formSection}>
          <label style={S.label}>Color de header</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
            {GRADIENTS.map((g,i)=><div key={i} className="gs" style={{width:40,height:28,borderRadius:6,background:g,cursor:"pointer",border:form.gradient===i?"2px solid #C084FC":"2px solid transparent",transition:"border 0.2s"}} onClick={()=>setForm({...form,gradient:i})}/>)}
          </div>
        </div>
        <div style={S.formSection}>
          <div style={S.formRow}>
            <div style={S.fGroup}><label style={S.label}>URL</label><input style={S.input} placeholder="https://..." value={form.url} onChange={e=>setForm({...form,url:e.target.value})}/></div>
            <div style={S.fGroup}><label style={S.label}>Repositorio</label><input style={S.input} placeholder="https://github.com/..." value={form.repo} onChange={e=>setForm({...form,repo:e.target.value})}/></div>
          </div>
        </div>
        <div style={S.formActions}>
          <button style={S.cancelBtn} onClick={()=>{setView("grid");setEditP(null);setForm({...EMPTY_PROJECT});}}>Cancelar</button>
          <button style={{...S.primBtn,opacity:form.title.trim()?1:0.4,cursor:form.title.trim()?"pointer":"not-allowed"}} onClick={handleSubmit} disabled={!form.title.trim()}>{editP?"Guardar cambios":"Agregar proyecto"}</button>
        </div>
      </div>}

      {/* HOSTING INFO */}
      {view==="grid" && projects.length>0 && <div style={S.hostingBox}>
        <h4 style={{fontSize:13,fontWeight:700,color:"#C084FC",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>Publicar tu portfolio online</h4>
        <div style={{fontSize:13,color:"#888",lineHeight:1.9}}>
          <strong style={{color:"#bbb"}}>1.</strong> Hacé clic en <strong style={{color:"#C084FC"}}>↓ Exportar portfolio</strong> para descargar el HTML completo.<br/>
          <strong style={{color:"#bbb"}}>2.</strong> Creá un repositorio en GitHub (ej: <code style={S.code}>mi-portfolio</code>).<br/>
          <strong style={{color:"#bbb"}}>3.</strong> Subí el archivo como <code style={S.code}>index.html</code> al repo.<br/>
          <strong style={{color:"#bbb"}}>4.</strong> En el repo → Settings → Pages → Source: <code style={S.code}>main</code> → Save.<br/>
          <strong style={{color:"#bbb"}}>5.</strong> Tu portfolio va a estar online en <code style={S.code}>https://tu-usuario.github.io/mi-portfolio</code>
        </div>
      </div>}

      <footer style={S.footer}><span style={S.footTxt}>{projects.length} proyecto{projects.length!==1?"s":""}</span></footer>
    </div>
  );
}

const S = {
  root:{minHeight:"100vh",background:"#0A0A0F",color:"#E8E8ED",fontFamily:"'DM Sans',sans-serif"},
  loading:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0A0A0F",color:"#E8E8ED"},
  loadPulse:{fontSize:48,color:"#C084FC",animation:"pulse 1.5s ease-in-out infinite",fontFamily:"'DM Serif Display',serif"},
  loadText:{marginTop:16,color:"#888",fontSize:14},
  notif:{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#1E1E2A",color:"#C084FC",padding:"10px 24px",borderRadius:8,fontSize:13,fontWeight:600,zIndex:1000,border:"1px solid rgba(192,132,252,0.3)",animation:"notifIn 0.3s ease"},
  header:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 28px",borderBottom:"1px solid #1A1A24",flexWrap:"wrap",gap:12},
  hLeft:{display:"flex",alignItems:"baseline",gap:14,flexWrap:"wrap"},
  logo:{fontFamily:"'DM Serif Display',serif",fontSize:24,fontWeight:400,color:"#E8E8ED",cursor:"pointer",letterSpacing:"-0.02em",margin:0},
  sub:{fontSize:12,color:"#555568",margin:0},
  primBtn:{background:"#C084FC",color:"#0A0A0F",border:"none",padding:"9px 20px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"},
  secBtn:{background:"none",color:"#C084FC",border:"1px solid rgba(192,132,252,0.3)",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"},
  exportBtn:{background:"none",color:"#E8E8ED",border:"1px solid #333",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"},
  navBtn:{background:"none",border:"none",color:"#888",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",padding:"8px 12px",borderRadius:6,transition:"all 0.2s"},
  backBtn:{background:"none",border:"none",color:"#888",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",padding:"6px 12px",borderRadius:6,transition:"all 0.2s"},
  main:{padding:"20px 28px",maxWidth:1200,margin:"0 auto"},

  // Profile preview
  profilePreview:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",background:"#12121A",borderRadius:10,marginBottom:20,border:"1px solid #1A1A24",flexWrap:"wrap",gap:12},
  ppPhoto:{width:48,height:48,borderRadius:"50%",objectFit:"cover",border:"2px solid #1A1A24"},
  ppName:{fontSize:16,fontWeight:700,fontFamily:"'DM Serif Display',serif",color:"#E8E8ED"},
  ppTitle:{fontSize:12,color:"#C084FC",fontWeight:500},
  ppLoc:{fontSize:11,color:"#555568",marginTop:2},
  ppLink:{fontSize:12,color:"#C084FC",textDecoration:"none",transition:"opacity 0.2s"},
  hobbyPill:{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(192,132,252,0.06)",color:"#AAAAB0",border:"1px solid #1A1A24",display:"inline-flex",alignItems:"center",gap:3},

  statsBar:{display:"flex",alignItems:"center",gap:20,padding:"16px 24px",background:"#12121A",borderRadius:10,marginBottom:20,border:"1px solid #1A1A24",flexWrap:"wrap"},
  statItem:{display:"flex",flexDirection:"column",alignItems:"center",gap:1},
  statNum:{fontSize:24,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"},
  statLbl:{fontSize:10,color:"#555568",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600},
  statDiv:{width:1,height:32,background:"#1A1A24"},
  toolbar:{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"},
  searchInput:{flex:1,minWidth:180,background:"#12121A",border:"1px solid #1A1A24",borderRadius:8,padding:"9px 14px",color:"#E8E8ED",fontSize:13,fontFamily:"'DM Sans',sans-serif",transition:"border 0.2s"},
  filterBtn:{background:"none",border:"1px solid #1A1A24",color:"#888",padding:"7px 12px",borderRadius:6,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all 0.2s"},
  filterAct:{borderColor:"#C084FC",color:"#C084FC",background:"rgba(192,132,252,0.08)"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14},
  card:{background:"#12121A",borderRadius:10,padding:20,border:"1px solid #1A1A24",cursor:"pointer",transition:"all 0.3s ease",position:"relative",overflow:"hidden"},
  cardBar:{position:"absolute",top:0,left:0,right:0,height:2,opacity:0,transition:"opacity 0.3s"},
  cardHead:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},
  cardDate:{fontSize:11,color:"#555568",fontFamily:"'JetBrains Mono',monospace"},
  cardBadge:{display:"inline-block",fontSize:10,color:"#888",fontFamily:"'JetBrains Mono',monospace",padding:"2px 8px",borderRadius:4,background:"rgba(192,132,252,0.08)",border:"1px solid #1A1A24",marginBottom:8},
  cardTitle:{fontSize:17,fontWeight:700,marginBottom:6,fontFamily:"'DM Serif Display',serif",letterSpacing:"-0.01em",color:"#E8E8ED"},
  cardDesc:{fontSize:12,color:"#888",lineHeight:1.6,marginBottom:10,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"},
  cardMetrics:{display:"flex",gap:10,marginBottom:10},
  miniMetric:{display:"flex",flexDirection:"column",alignItems:"center"},
  miniVal:{fontSize:15,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"#C084FC"},
  miniLbl:{fontSize:9,color:"#555568",textTransform:"uppercase"},
  cardTags:{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12},
  cardTag:{fontSize:10,padding:"3px 8px",borderRadius:4,background:"rgba(192,132,252,0.1)",color:"#C084FC",fontFamily:"'JetBrains Mono',monospace",fontWeight:500},
  cardFoot:{display:"flex",gap:6,borderTop:"1px solid #1A1A24",paddingTop:12},
  cardAct:{background:"none",border:"none",color:"#888",fontSize:11,cursor:"pointer",padding:"4px 8px",borderRadius:4,fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"},
  empty:{textAlign:"center",padding:"60px 20px",animation:"slideUp 0.5s ease"},
  emptyIcon:{fontSize:56,color:"#C084FC",marginBottom:16,fontFamily:"'DM Serif Display',serif",opacity:0.6},
  emptyTitle:{fontSize:22,fontFamily:"'DM Serif Display',serif",marginBottom:8,color:"#E8E8ED"},
  emptyDesc:{color:"#555568",fontSize:13,marginBottom:24,maxWidth:400,marginLeft:"auto",marginRight:"auto",lineHeight:1.6},

  presWrap:{maxWidth:720,margin:"0 auto",padding:"28px",animation:"fadeIn 0.4s ease"},
  presCard:{background:"#fff",borderRadius:12,overflow:"hidden",border:"1px solid #e0e0e0"},
  presHeader:{padding:"24px 24px 16px"},
  presBadge:{display:"inline-block",fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:"0.5px",padding:"3px 10px",borderRadius:8,background:"rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.85)",marginBottom:10},
  presTitle:{fontSize:22,fontWeight:500,color:"#fff",letterSpacing:"-0.3px",margin:0},
  presBody:{padding:"20px 24px"},
  presMetric:{background:"#f5f5f0",borderRadius:8,padding:"10px 12px",textAlign:"center"},
  presMetricVal:{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:500,color:"#222"},
  presMetricLbl:{fontSize:11,color:"#888",marginTop:2},
  presTabs:{display:"flex",borderBottom:"1px solid #e0e0e0",marginBottom:16},
  presTab:{padding:"8px 14px",fontSize:13,fontWeight:500,color:"#888",cursor:"pointer",borderBottom:"2px solid transparent",transition:"all 0.2s"},
  presTabAct:{color:"#222",borderBottomColor:"#534AB7"},
  presText:{fontSize:14,lineHeight:1.7,color:"#222"},
  presArch:{fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.8,color:"#666",background:"#f5f5f0",padding:"12px 16px",borderRadius:8,whiteSpace:"pre",overflowX:"auto",margin:0},
  presTech:{fontFamily:"'JetBrains Mono',monospace",fontSize:12,padding:"4px 10px",borderRadius:8,background:"#f5f5f0",color:"#666",border:"1px solid #e0e0e0"},
  presFoot:{padding:"12px 24px",borderTop:"1px solid #e0e0e0",display:"flex",justifyContent:"space-between",alignItems:"center"},
  presActions:{display:"flex",gap:10,justifyContent:"center",marginTop:20,flexWrap:"wrap"},
  downloadBtn:{background:"#C084FC",color:"#0A0A0F",border:"none",padding:"12px 28px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"},

  formWrap:{maxWidth:720,margin:"0 auto",padding:"28px",animation:"fadeIn 0.3s ease"},
  formTitle:{fontSize:26,fontFamily:"'DM Serif Display',serif",marginBottom:12,color:"#E8E8ED"},
  formSection:{marginBottom:20,paddingBottom:20,borderBottom:"1px solid #1A1A24"},
  formRow:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12},
  fGroup:{display:"flex",flexDirection:"column",gap:5,marginBottom:8},
  label:{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#888"},
  input:{background:"#12121A",border:"1px solid #1A1A24",borderRadius:8,padding:"10px 12px",color:"#E8E8ED",fontSize:13,fontFamily:"'JetBrains Mono',monospace",transition:"all 0.2s"},
  tagBtn:{background:"#12121A",border:"1px solid #1A1A24",color:"#888",padding:"5px 12px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",transition:"all 0.15s"},
  tagAct:{background:"#C084FC",color:"#0A0A0F",borderColor:"#C084FC"},
  hobbyBtnAct:{background:"rgba(192,132,252,0.15)",color:"#C084FC",borderColor:"rgba(192,132,252,0.4)"},
  statusBtn:{background:"none",border:"1px solid #1A1A24",color:"#888",padding:"7px 14px",borderRadius:6,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,transition:"all 0.2s"},
  formActions:{display:"flex",justifyContent:"flex-end",gap:10,marginTop:24},
  cancelBtn:{background:"none",border:"1px solid #1A1A24",color:"#888",padding:"9px 22px",borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600},

  hostingBox:{maxWidth:1200,margin:"24px auto 0",padding:"20px 28px"},
  code:{fontFamily:"'JetBrains Mono',monospace",fontSize:12,background:"#1A1A24",padding:"2px 6px",borderRadius:4,color:"#C084FC"},

  footer:{padding:"16px 28px",borderTop:"1px solid #1A1A24",textAlign:"center"},
  footTxt:{fontSize:11,color:"#333340",fontFamily:"'JetBrains Mono',monospace"},
};
