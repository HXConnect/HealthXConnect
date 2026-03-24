import { useState, useRef, useEffect, useCallback } from "react";

// ── DESIGN SYSTEM — Elevated & Sleek · Mauve · Slate · Gold ──────────────────
const COLORS = {
  bg:       "#1a1218",   // warm dark — deep plum black
  surface:  "#221820",   // slightly lifted warm dark
  card:     "#2c2028",   // warm card surface
  border:   "#4a3545",   // muted mauve border — visible & elegant
  accent:   "#c9a0c0",   // soft mauve — primary accent
  accentHot:"#e8b4e0",   // lighter mauve for hover / highlights
  gold:     "#d4a853",   // warm antique gold
  goldLight:"#f0c878",   // lighter gold for highlights
  slate:    "#8fa3b1",   // cool blue-slate — secondary
  green:    "#7ec8a4",   // muted sage green — success
  rose:     "#c4667a",   // deep rose — alerts / featured
  text:     "#f5eef5",   // warm white — primary text
  muted:    "#b8a8b8",   // light mauve-grey — secondary text, fully readable
  mutedDim: "#8a7a8a",   // dimmer muted for timestamps etc
};

const FONTS = {
  heading: "'Playfair Display', serif",   // bold sharp headers
  body:    "'Inter', sans-serif",          // clean light body
};

// ── FEATURED EMPLOYER JOBS (paid placements) ──────────────────────────────────
const FEATURED_JOBS = {
  HIM: [
    { id:"f1", title:"Remote HIM Specialist", company:"Cotiviti", location:"Remote – USA", type:"Full-Time", salary:"$58k–$74k", tags:["RHIT","ICD-10","Epic"], featured:true, url:"#" },
    { id:"f2", title:"CDI Specialist", company:"Ensemble Health Partners", location:"Remote – USA", type:"Contract", salary:"$45–$55/hr", tags:["CDI","CCDS","Documentation"], featured:true, url:"#" },
  ],
  Admin: [
    { id:"f3", title:"Revenue Cycle Manager", company:"Ensemble Health Partners", location:"Remote – USA", type:"Full-Time", salary:"$72k–$92k", tags:["RCM","Denial Mgmt","Epic"], featured:true, url:"#" },
    { id:"f4", title:"Healthcare Administrator", company:"MedStar Health", location:"Remote – USA", type:"Full-Time", salary:"$65k–$85k", tags:["Revenue Cycle","HIPAA","Operations"], featured:true, url:"#" },
  ],
  "Healthcare IT": [
    { id:"f5", title:"Healthcare IT Analyst", company:"Optum", location:"Remote – USA", type:"Full-Time", salary:"$75k–$95k", tags:["Epic","HL7","FHIR"], featured:true, url:"#" },
    { id:"f6", title:"EHR Implementation Consultant", company:"Datavant", location:"Remote – USA", type:"Contract", salary:"$80–$110/hr", tags:["Epic","Cerner","Go-Live"], featured:true, url:"#" },
  ],
};

const SEARCH_QUERIES = {
  HIM: "health information management medical coder remote",
  Admin: "healthcare administrator revenue cycle remote",
  "Healthcare IT": "healthcare IT analyst EHR Epic remote",
};

const SPACES = {
  HIM: {
    key:"HIM", label:"Health Information Management", short:"HIM", icon:"📋",
    color:"#c9a0c0", tagline:"Coding · CDI · Medical Records · ROI",
    subtitle:"Your records. Your expertise. Your space.",
    channels:[
      {id:"him-general",name:"general",icon:"💬",desc:"General HIM discussion",color:"#c9a0c0"},
      {id:"him-jobs",name:"job-postings",icon:"💼",desc:"HIM job opportunities",color:"#c9a0c0"},
      {id:"him-coding",name:"coding-tips",icon:"📋",desc:"ICD-10, CPT, coding Q&A",color:"#c9a0c0"},
      {id:"him-cdi",name:"cdi-corner",icon:"📝",desc:"CDI strategies & resources",color:"#c9a0c0"},
      {id:"him-network",name:"networking",icon:"🤝",desc:"Connect with HIM peers",color:"#c9a0c0"},
    ],
    profiles:[
      {id:1,name:"Shayla Monroe, RHIA",role:"HIM Director",org:"Nationwide Children's",connections:342,avatar:"SM",color:"#c9a0c0"},
      {id:2,name:"Marcus Johnson, RHIT",role:"Medical Coder",org:"Freelance",connections:187,avatar:"MJ",color:"#d4a853"},
      {id:3,name:"Angela Davis, CCS",role:"Inpatient Coder",org:"HCA Healthcare",connections:201,avatar:"AD",color:"#8fa3b1"},
    ],
    resources:[
      {id:1,title:"2026 ICD-10-CM Code Updates – Full Guide",type:"PDF",author:"AHIMA",downloads:1243,pro:false},
      {id:2,title:"CDI Specialist Exam Prep – Study Notes 2026",type:"PDF",author:"ACDIS",downloads:998,pro:true},
      {id:3,title:"HIM Remote Work Best Practices",type:"DOC",author:"AHIMA",downloads:544,pro:true},
    ],
    news:[
      {id:1,headline:"CMS Releases 2026 IPPS Final Rule – Key Changes for HIM Professionals",source:"CMS.gov",time:"3h ago",hot:true},
      {id:2,headline:"AHIMA Launches New Remote Coding Certification Track",source:"AHIMA",time:"1d ago",hot:false},
      {id:3,headline:"ICD-10-CM FY2026: 395 New Codes Added — Full Breakdown",source:"CMS.gov",time:"3d ago",hot:true},
    ],
    seedMsgs:{
      "him-general":[
        {id:1,user:"Shayla Monroe",avatar:"SM",color:"#c9a0c0",role:"HIM Director",text:"Welcome to the HIM space on HXConnect! This is our home 🏠📋",time:"9:00 AM",reactions:{"🎉":8}},
        {id:2,user:"Marcus Johnson",avatar:"MJ",color:"#d4a853",role:"Medical Coder",text:"Finally a space just for us. No more getting lost in general healthcare groups!",time:"9:10 AM",reactions:{"💯":6}},
      ],
      "him-coding":[
        {id:1,user:"Marcus Johnson",avatar:"MJ",color:"#d4a853",role:"Medical Coder",text:"FY2026 updates: 395 new codes, 25 revised. The diabetes combo codes got a major overhaul. Study up!",time:"9:00 AM",reactions:{"📋":12}},
      ],
    },
  },
  Admin:{
    key:"Admin", label:"Healthcare Administration", short:"Admin", icon:"🏥",
    color:"#d4a853", tagline:"Revenue Cycle · Operations · Management · Compliance",
    subtitle:"Run the business of healthcare.",
    channels:[
      {id:"admin-general",name:"general",icon:"💬",desc:"General admin discussion",color:"#d4a853"},
      {id:"admin-jobs",name:"job-postings",icon:"💼",desc:"Admin job opportunities",color:"#d4a853"},
      {id:"admin-rcm",name:"revenue-cycle",icon:"💰",desc:"Billing, coding & RCM",color:"#d4a853"},
      {id:"admin-compliance",name:"compliance",icon:"⚖️",desc:"HIPAA & regulatory updates",color:"#d4a853"},
      {id:"admin-network",name:"networking",icon:"🤝",desc:"Connect with admin peers",color:"#d4a853"},
    ],
    profiles:[
      {id:1,name:"Priya Nair, MHA",role:"Healthcare Administrator",org:"Kaiser Permanente",connections:229,avatar:"PN",color:"#d4a853"},
      {id:2,name:"Lisa Chen",role:"Revenue Cycle Manager",org:"Ensemble Health",connections:403,avatar:"LC",color:"#c9a0c0"},
      {id:3,name:"Damon Richards, MHA",role:"Practice Manager",org:"Baptist Health",connections:178,avatar:"DR",color:"#8fa3b1"},
    ],
    resources:[
      {id:1,title:"HIPAA Compliance Checklist for Remote Teams",type:"DOC",author:"HHS.gov",downloads:876,pro:false},
      {id:2,title:"Remote Healthcare Admin Salary Benchmarks 2026",type:"XLSX",author:"MGMA",downloads:712,pro:true},
      {id:3,title:"Prior Auth Denial Management Playbook",type:"PDF",author:"HFMA",downloads:634,pro:true},
    ],
    news:[
      {id:1,headline:"Study: Remote Healthcare Workers Report Higher Job Satisfaction in 2026",source:"MGMA",time:"2d ago",hot:false},
      {id:2,headline:"CMS Finalizes Prior Auth Rule — What Admins Need to Know",source:"CMS.gov",time:"1d ago",hot:true},
      {id:3,headline:"HFMA: Revenue Cycle Automation Adoption Hits 62% in 2026",source:"HFMA",time:"4d ago",hot:false},
    ],
    seedMsgs:{
      "admin-general":[
        {id:1,user:"Priya Nair",avatar:"PN",color:"#d4a853",role:"Healthcare Admin",text:"Welcome to the Healthcare Admin space! This is where operations leaders connect 🏥",time:"8:30 AM",reactions:{"🙌":7}},
        {id:2,user:"Lisa Chen",avatar:"LC",color:"#c9a0c0",role:"Revenue Cycle Manager",text:"Prior auth denials are up 18% YOY. Anyone have strategies that are working? 👀",time:"9:00 AM",reactions:{"😩":5}},
      ],
    },
  },
  "Healthcare IT":{
    key:"Healthcare IT", label:"Healthcare Information Technology", short:"Health IT", icon:"💻",
    color:"#8fa3b1", tagline:"Epic · Cerner · HL7 · FHIR · Cybersecurity · Interoperability",
    subtitle:"The infrastructure behind patient care.",
    channels:[
      {id:"hit-general",name:"general",icon:"💬",desc:"General health IT discussion",color:"#8fa3b1"},
      {id:"hit-jobs",name:"job-postings",icon:"💼",desc:"Health IT job opportunities",color:"#8fa3b1"},
      {id:"hit-ehr",name:"ehr-systems",icon:"💻",desc:"Epic, Cerner, Oracle & more",color:"#8fa3b1"},
      {id:"hit-interop",name:"interoperability",icon:"🔗",desc:"HL7, FHIR, TEFCA & data exchange",color:"#8fa3b1"},
      {id:"hit-network",name:"networking",icon:"🤝",desc:"Connect with health IT peers",color:"#8fa3b1"},
    ],
    profiles:[
      {id:1,name:"David Park",role:"Healthcare IT Architect",org:"Optum",connections:518,avatar:"DP",color:"#8fa3b1"},
      {id:2,name:"Terrence Webb",role:"CMIO",org:"Baptist Health",connections:611,avatar:"TW",color:"#8fa3b1"},
      {id:3,name:"Keisha Brown",role:"EHR Analyst",org:"Epic Systems",connections:294,avatar:"KB",color:"#c9a0c0"},
    ],
    resources:[
      {id:1,title:"Epic MyChart Patient Portal Integration Best Practices",type:"PDF",author:"Epic Systems",downloads:654,pro:false},
      {id:2,title:"FHIR R4 Implementation Guide for Developers",type:"PDF",author:"HL7 Intl.",downloads:887,pro:true},
      {id:3,title:"TEFCA Onboarding Checklist 2026",type:"DOC",author:"ONC",downloads:423,pro:true},
    ],
    news:[
      {id:1,headline:"ONC Proposes Expansion of TEFCA Nationwide Health Data Exchange",source:"HealthIT.gov",time:"6h ago",hot:true},
      {id:2,headline:"Epic Rolls Out AI-Assisted Clinical Documentation Across 300 Health Systems",source:"Epic Systems",time:"2d ago",hot:true},
      {id:3,headline:"CMS Mandates FHIR API Compliance for All Medicaid Programs by 2027",source:"CMS.gov",time:"5d ago",hot:false},
    ],
    seedMsgs:{
      "hit-general":[
        {id:1,user:"David Park",avatar:"DP",color:"#8fa3b1",role:"Healthcare IT Architect",text:"Welcome to the Health IT space! This is where builders and implementers connect 💻",time:"8:45 AM",reactions:{"🤖":6}},
        {id:2,user:"Terrence Webb",avatar:"TW",color:"#8fa3b1",role:"CMIO",text:"Just went live with TEFCA integration. Happy to share lessons learned!",time:"9:50 AM",reactions:{"🙌":8}},
      ],
    },
  },
};

const EMOJIS=["👍","❤️","🔥","🎉","💡","👏"];
function timeNow(){return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}
function initials(name){return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();}

// ── LIVE JOB FEED HOOK ────────────────────────────────────────────────────────
function useJobFeed(spaceKey) {
  const [liveJobs, setLiveJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = SEARCH_QUERIES[spaceKey];
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate 6 realistic remote job listings for "${query}" professionals as of March 2026. Return ONLY a JSON array, no markdown, no explanation. Each job object must have exactly these fields: id (string), title (string), company (string - use real healthcare companies), location (always "Remote – USA"), type ("Full-Time" or "Contract"), salary (string like "$65k–$85k" or "$45–$60/hr"), tags (array of 3 strings - relevant skills/certifications), posted (string like "1h ago", "3h ago", "1d ago", "2d ago"), url (use "#"). Make them realistic and varied.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const jobs = JSON.parse(clean);
      setLiveJobs(jobs);
      setLastUpdated(new Date());
    } catch (e) {
      setError("Could not load live jobs. Showing featured listings only.");
    } finally {
      setLoading(false);
    }
  }, [spaceKey]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  return { liveJobs, loading, lastUpdated, error, refresh: fetchJobs };
}

// ── UPGRADE MODAL ─────────────────────────────────────────────────────────────
function UpgradeModal({onClose, onUpgrade, feature}) {
  const perks = [
    {icon:"💼", text:"Apply to jobs directly"},
    {icon:"💬", text:"Full community chat access"},
    {icon:"📥", text:"Download all resources"},
    {icon:"✉️", text:"Direct messaging"},
    {icon:"⚡", text:"Early job alerts — 24hr head start"},
    {icon:"👁️", text:"See who viewed your profile"},
    {icon:"🔝", text:"Priority in search results"},
    {icon:"📊", text:"Career analytics dashboard"},
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:"linear-gradient(145deg,#231820,#2c2028)",border:`1px solid ${COLORS.gold}44`,borderRadius:20,padding:32,width:"100%",maxWidth:420,position:"relative"}} onClick={e=>e.stopPropagation()}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:200,height:2,background:`linear-gradient(90deg,transparent,${COLORS.gold},transparent)`}}/>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:36,marginBottom:10}}>⭐</div>
          <div style={{fontFamily:FONTS.heading,fontSize:18,fontWeight:900,color:COLORS.gold,marginBottom:6}}>Upgrade to Pro</div>
          <div style={{fontSize:13,color:COLORS.muted,lineHeight:1.5}}><span style={{color:"#fff",fontWeight:700}}>"{feature}"</span> is a Pro feature.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:24}}>
          {perks.map(p=>(
            <div key={p.text} style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"8px 10px",display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:14}}>{p.icon}</span>
              <span style={{fontSize:11,color:COLORS.text,fontWeight:600,lineHeight:1.3}}>{p.text}</span>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          <div style={{background:`${COLORS.gold}11`,border:`1px solid ${COLORS.gold}44`,borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
            <div style={{fontSize:11,color:COLORS.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Monthly</div>
            <div style={{fontSize:26,fontWeight:900,color:COLORS.gold}}>$9<span style={{fontSize:14}}>.99</span></div>
            <div style={{fontSize:10,color:COLORS.muted}}>per month</div>
          </div>
          <div style={{background:`${COLORS.accent}11`,border:`2px solid ${COLORS.accent}66`,borderRadius:12,padding:"14px 12px",textAlign:"center",position:"relative"}}>
            <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${COLORS.rose},${COLORS.accent})`,color:"#fff",fontSize:9,fontWeight:800,padding:"2px 10px",borderRadius:10,whiteSpace:"nowrap"}}>BEST VALUE</div>
            <div style={{fontSize:11,color:COLORS.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Annual</div>
            <div style={{fontSize:26,fontWeight:900,color:COLORS.accent}}>$99</div>
            <div style={{fontSize:10,color:COLORS.green}}>Save $21 · 2 months free</div>
          </div>
        </div>
        <button onClick={onUpgrade} style={{width:"100%",background:`linear-gradient(135deg,${COLORS.rose},${COLORS.accent})`,border:"none",color:"#fff",padding:"13px",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:800,marginBottom:10}}>Upgrade to Pro ⭐</button>
        <button onClick={onClose} style={{width:"100%",background:"transparent",border:`1px solid ${COLORS.border}`,color:COLORS.muted,padding:"10px",borderRadius:10,cursor:"pointer",fontSize:13}}>Maybe later</button>
      </div>
    </div>
  );
}

// ── JOB CARD ─────────────────────────────────────────────────────────────────
function JobCard({job, C, isPro, onUpgradeNeeded, saved, onSave, featured}) {
  const ss = {
    pill:(cl)=>({background:cl+"18",color:cl,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:700,border:`1px solid ${cl}33`}),
    tag:(cl)=>({background:cl+"15",border:`1px solid ${cl}40`,color:cl,padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700}),
    btn:(cl,o)=>({background:o?"transparent":`linear-gradient(135deg,${cl},${cl}bb)`,border:`1px solid ${cl}`,color:o?cl:"#fff",padding:"7px 15px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:700}),
  };
  return (
    <div style={{background:COLORS.card,border:`${featured?2:1}px solid ${featured?COLORS.gold+"66":COLORS.border}`,borderRadius:12,padding:18,borderLeft:`3px solid ${featured?COLORS.gold:C}`,position:"relative",overflow:"hidden"}}>
      {featured && (
        <div style={{position:"absolute",top:0,right:0,background:`linear-gradient(135deg,${COLORS.gold},${COLORS.rose})`,color:"#000",fontSize:9,fontWeight:900,padding:"3px 10px",borderRadius:"0 12px 0 8px",letterSpacing:1}}>⭐ FEATURED</div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,flexWrap:"wrap",gap:4}}>
        <span style={ss.pill(featured?COLORS.gold:C)}>{job.type}</span>
        <span style={{color:COLORS.muted,fontSize:11}}>{job.posted||"Today"}</span>
      </div>
      <div style={{fontSize:15,fontWeight:700,marginBottom:3}}>{job.title}</div>
      <div style={{color:featured?COLORS.gold:C,fontSize:12,fontWeight:600,marginBottom:8}}>{job.company}</div>
      <div style={{color:COLORS.muted,fontSize:12,marginBottom:8}}>📍 {job.location}</div>
      {job.salary&&<div style={{color:COLORS.green,fontWeight:700,fontSize:13,marginBottom:10}}>{job.salary}</div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:13}}>
        {(job.tags||[]).map(t=><span key={t} style={ss.tag(featured?COLORS.gold:C)}>{t}</span>)}
      </div>
      <div style={{display:"flex",gap:7}}>
        {isPro
          ?<button style={ss.btn(featured?COLORS.gold:C)} onClick={()=>window.open(job.url||"#","_blank")}>Apply Now →</button>
          :<button style={{...ss.btn(COLORS.gold),background:`${COLORS.gold}18`,color:COLORS.gold,fontSize:12}} onClick={()=>onUpgradeNeeded("Apply to jobs")}>⭐ Apply (Pro)</button>
        }
        <button style={ss.btn(COLORS.muted,true)} onClick={onSave}>{saved?"★ Saved":"☆ Save"}</button>
      </div>
    </div>
  );
}

// ── CATEGORY SPACE ────────────────────────────────────────────────────────────
function CategorySpace({spaceKey, onBack, isPro, onUpgradeNeeded}) {
  const space = SPACES[spaceKey];
  const C = space.color;
  const [tab, setTab] = useState("Jobs");
  const [userJobs, setUserJobs] = useState([]);
  const [profiles, setProfiles] = useState(space.profiles);
  const [connected, setConnected] = useState({});
  const [saved, setSaved] = useState({});
  const [toast, setToast] = useState(null);
  const [channel, setChannel] = useState(space.channels[0].id);
  const [messages, setMessages] = useState(space.seedMsgs||{});
  const [chatInput, setChatInput] = useState("");
  const [myName, setMyName] = useState("You");
  const [myRole, setMyRole] = useState(space.short+" Professional");
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempRole, setTempRole] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({title:"",company:"",location:"Remote – USA",type:"Full-Time",salary:"",tags:""});
  const bottomRef = useRef(null);

  const { liveJobs, loading, lastUpdated, error, refresh } = useJobFeed(spaceKey);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,channel,tab]);
  const toast2=(m)=>{setToast(m);setTimeout(()=>setToast(null),2500);};

  const sendMsg=()=>{
    if(!chatInput.trim()) return;
    if(!isPro){onUpgradeNeeded("Send messages in community chat");return;}
    setMessages(prev=>({...prev,[channel]:[...(prev[channel]||[]),{id:Date.now(),user:myName,avatar:initials(myName),color:C,role:myRole,text:chatInput.trim(),time:timeNow(),reactions:{},isOwn:true}]}));
    setChatInput("");
  };
  const react=(ch,id,emoji)=>{setMessages(prev=>({...prev,[ch]:prev[ch].map(m=>m.id===id?{...m,reactions:{...m.reactions,[emoji]:(m.reactions[emoji]||0)+1}}:m)}));};
  const postJob=()=>{
    if(!newJob.title||!newJob.company) return;
    setUserJobs([{...newJob,id:"u"+Date.now(),posted:"Just now",tags:newJob.tags.split(",").map(t=>t.trim()).filter(Boolean),featured:false},...userJobs]);
    setNewJob({title:"",company:"",location:"Remote – USA",type:"Full-Time",salary:"",tags:""});
    setShowJobForm(false);toast2("✅ Job posted!");
  };

  const ss={
    card:{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:18},
    pill:(cl)=>({background:cl+"18",color:cl,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:700,border:`1px solid ${cl}33`}),
    tag:(cl)=>({background:cl+"15",border:`1px solid ${cl}40`,color:cl,padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700}),
    btn:(cl,o)=>({background:o?"transparent":`linear-gradient(135deg,${cl},${cl}bb)`,border:`1px solid ${cl}`,color:o?cl:"#fff",padding:"7px 15px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:700}),
    av:(cl,sz=42)=>({width:sz,height:sz,borderRadius:Math.round(sz*0.27),background:`linear-gradient(135deg,${cl},${cl}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:Math.round(sz*0.33),color:"#fff",flexShrink:0}),
    inp:{width:"100%",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"9px 12px",color:COLORS.text,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:11},
    lbl:{color:COLORS.muted,fontSize:11,fontWeight:700,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"},
    sel:{width:"100%",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"9px 12px",color:COLORS.text,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:11},
    grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:15},
    modal:{position:"fixed",inset:0,background:"#000b",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20},
    modalBox:{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:15,padding:26,width:"100%",maxWidth:450},
  };

  const ProBanner=()=>!isPro?(
    <div onClick={()=>onUpgradeNeeded("Full Pro access")} style={{background:`linear-gradient(135deg,${COLORS.rose}22,${COLORS.gold}11)`,border:`1px solid ${COLORS.gold}44`,borderRadius:10,padding:"10px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
      <span style={{fontSize:18}}>⭐</span>
      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:COLORS.gold}}>You're on the Free plan</div><div style={{fontSize:11,color:COLORS.muted}}>Upgrade to Pro to apply to jobs, chat, download resources & more</div></div>
      <span style={{color:COLORS.gold,fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>Upgrade →</span>
    </div>
  ):null;

  const renderJobs=()=>{
    const featured = FEATURED_JOBS[spaceKey] || [];
    const allJobs = [...userJobs, ...liveJobs];
    const totalCount = featured.length + allJobs.length;
    return(
      <div>
        <ProBanner/>
        {!isPro&&<div style={{background:`${COLORS.accent}11`,border:`1px solid ${COLORS.accent}33`,borderRadius:10,padding:"10px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:9}}>
          <span>⚡</span><span style={{fontSize:12,color:COLORS.accent,fontWeight:700}}>Pro members get job alerts 24hrs early. <span style={{textDecoration:"underline",cursor:"pointer"}} onClick={()=>onUpgradeNeeded("Early job alerts")}>Upgrade to get ahead →</span></span>
        </div>}

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:20,fontWeight:800,marginBottom:3}}>{space.icon} {space.short} Job Board</div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <div style={{color:COLORS.muted,fontSize:13}}>{loading?"Loading live jobs...":error?error:`${totalCount} remote openings`}</div>
              {lastUpdated&&!loading&&<div style={{background:COLORS.green+"18",border:`1px solid ${COLORS.green}33`,color:COLORS.green,padding:"2px 9px",borderRadius:10,fontSize:10,fontWeight:700}}>🔄 Updated {lastUpdated.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{...ss.btn(COLORS.muted,true),fontSize:12}} onClick={refresh} disabled={loading}>{loading?"⟳ Loading...":"🔄 Refresh Jobs"}</button>
            <button style={ss.btn(C)} onClick={()=>setShowJobForm(true)}>+ Post a Job</button>
          </div>
        </div>

        {/* Featured Jobs */}
        {featured.length>0&&(
          <div style={{marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,${COLORS.gold}44,transparent)`}}/>
              <span style={{fontSize:10,fontWeight:800,color:COLORS.gold,letterSpacing:2,textTransform:"uppercase"}}>⭐ Featured Partners</span>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,transparent,${COLORS.gold}44)`}}/>
            </div>
            <div style={ss.grid}>
              {featured.map(job=>(
                <JobCard key={job.id} job={job} C={C} isPro={isPro} onUpgradeNeeded={onUpgradeNeeded} saved={saved[job.id]} onSave={()=>{setSaved(s=>({...s,[job.id]:!s[job.id]}));toast2(saved[job.id]?"Removed":"Saved!");}} featured={true}/>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
          <div style={{height:1,flex:1,background:COLORS.border}}/>
          <span style={{fontSize:10,fontWeight:700,color:COLORS.muted,letterSpacing:2,textTransform:"uppercase"}}>🔄 Live Job Feed</span>
          <div style={{height:1,flex:1,background:COLORS.border}}/>
        </div>

        {/* Live Jobs */}
        {loading?(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:15}}>
            {[1,2,3,4,5,6].map(i=>(
              <div key={i} style={{...ss.card,height:200}}>
                <div style={{background:COLORS.border,borderRadius:6,height:12,width:"60%",marginBottom:12,animation:"pulse 1.5s infinite"}}/>
                <div style={{background:COLORS.border,borderRadius:6,height:16,width:"80%",marginBottom:8}}/>
                <div style={{background:COLORS.border,borderRadius:6,height:12,width:"50%",marginBottom:16}}/>
                <div style={{display:"flex",gap:6}}>{[1,2,3].map(j=><div key={j} style={{background:COLORS.border,borderRadius:8,height:20,width:50}}/>)}</div>
              </div>
            ))}
          </div>
        ):(
          <div style={ss.grid}>
            {allJobs.length>0
              ?allJobs.map(job=>(
                <JobCard key={job.id} job={job} C={C} isPro={isPro} onUpgradeNeeded={onUpgradeNeeded} saved={saved[job.id]} onSave={()=>{setSaved(s=>({...s,[job.id]:!s[job.id]}));toast2(saved[job.id]?"Removed":"Saved!");}} featured={false}/>
              ))
              :<div style={{gridColumn:"1/-1",textAlign:"center",padding:"40px",color:COLORS.muted}}>
                <div style={{fontSize:32,marginBottom:12}}>🔄</div>
                <div style={{fontWeight:700,marginBottom:6}}>No live jobs loaded yet</div>
                <button style={ss.btn(C)} onClick={refresh}>Load Live Jobs</button>
              </div>
            }
          </div>
        )}

        {error&&<div style={{textAlign:"center",padding:"20px",color:COLORS.rose,fontSize:13,marginTop:10}}>⚠️ {error}</div>}
      </div>
    );
  };

  const MENTORS = {
    HIM:[
      {id:"m1",name:"Shayla Monroe, RHIA",role:"HIM Director",org:"Nationwide Children's",avatar:"SM",color:"#c9a0c0",topics:["Leadership","Career Growth","Certifications"],exp:"12 years",availability:"Weekends",mentees:4,bio:"Happy to help coders transition into HIM leadership and management roles."},
      {id:"m2",name:"Marcus Johnson, RHIT",role:"Medical Coder",org:"Freelance",avatar:"MJ",color:"#d4a853",topics:["Remote Work","Certifications","Coding Tips"],exp:"7 years",availability:"Evenings",mentees:2,bio:"I went fully remote 3 years ago. Let me show you how to make that transition."},
      {id:"m3",name:"Angela Davis, CCS",role:"Inpatient Coder",org:"HCA Healthcare",avatar:"AD",color:"#c9a0c0",topics:["ICD-10","CDI","Career Growth"],exp:"9 years",availability:"Flexible",mentees:3,bio:"Specializing in helping new coders pass their CCS and get into inpatient roles."},
    ],
    Admin:[
      {id:"m4",name:"Priya Nair, MHA",role:"Healthcare Administrator",org:"Kaiser Permanente",avatar:"PN",color:"#7ec8a4",topics:["Leadership","Revenue Cycle","Career Growth"],exp:"11 years",availability:"Weekends",mentees:3,bio:"I can help you navigate from admin support roles into healthcare management."},
      {id:"m5",name:"Lisa Chen",role:"Revenue Cycle Manager",org:"Ensemble Health",avatar:"LC",color:"#c9a0c0",topics:["Remote Work","Revenue Cycle","Denials"],exp:"8 years",availability:"Evenings",mentees:5,bio:"Revenue cycle specialist focused on denial management and remote career building."},
    ],
    "Healthcare IT":[
      {id:"m6",name:"David Park",role:"Healthcare IT Architect",org:"Optum",avatar:"DP",color:"#8fa3b1",topics:["Epic","Leadership","Career Growth"],exp:"14 years",availability:"Weekends",mentees:6,bio:"I can help you break into health IT from a clinical or admin background."},
      {id:"m7",name:"Terrence Webb",role:"CMIO",org:"Baptist Health",avatar:"TW",color:"#8fa3b1",topics:["Leadership","FHIR","Career Growth"],exp:"16 years",availability:"Flexible",mentees:2,bio:"Executive mentorship for health IT professionals looking to move into C-suite."},
    ],
  };

  const MENTEE_REQUESTS = {
    HIM:[
      {id:"r1",name:"Tanya Brooks",avatar:"TB",color:"#c9a0c0",role:"New Grad",seeking:"Coding mentor",topics:["Certifications","Career Growth"],message:"Just graduated and looking for guidance on getting my first HIM role remotely."},
      {id:"r2",name:"Darius King",avatar:"DK",color:"#d4a853",role:"Medical Records Clerk",seeking:"Career transition mentor",topics:["Remote Work","ICD-10"],message:"Trying to transition from medical records into a remote coding role. Need guidance."},
    ],
    Admin:[
      {id:"r3",name:"Kezia Thomas",avatar:"KT",color:"#7ec8a4",role:"Front Desk Coordinator",seeking:"Revenue cycle mentor",topics:["Revenue Cycle","Career Growth"],message:"Looking to move into revenue cycle management. Need a mentor who has done it."},
    ],
    "Healthcare IT":[
      {id:"r4",name:"Jordan Mills",avatar:"JM",color:"#8fa3b1",role:"IT Support Specialist",seeking:"Health IT transition mentor",topics:["Epic","Career Growth"],message:"I work in general IT and want to break into healthcare IT specifically. Any guidance welcome."},
    ],
  };

  const [networkTab, setNetworkTab] = useState("Connect");
  const [mentorFilter, setMentorFilter] = useState("All");
  const [menteeFilter, setMenteeFilter] = useState("All");
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [showMenteeForm, setShowMenteeForm] = useState(false);
  const [mentorForm, setMentorForm] = useState({bio:"",topics:"",availability:""});
  const [menteeForm, setMenteeForm] = useState({seeking:"",topics:"",message:""});
  const TOPICS = ["Career Growth","Certifications","Remote Work","Leadership","ICD-10","Revenue Cycle","Epic","FHIR","CDI"];

  const renderNetwork=()=>{
    const mentors = MENTORS[spaceKey]||[];
    const requests = MENTEE_REQUESTS[spaceKey]||[];
    const filteredMentors = mentorFilter==="All" ? mentors : mentors.filter(m=>m.topics.includes(mentorFilter));
    const filteredRequests = menteeFilter==="All" ? requests : requests.filter(r=>r.topics.includes(menteeFilter));

    return(
      <div>
        <ProBanner/>
        {/* Profile views nudge */}
        <div onClick={()=>onUpgradeNeeded("See who viewed your profile")} style={{...ss.card,border:`1px solid ${COLORS.gold}44`,marginBottom:20,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
          <span style={{fontSize:20}}>👁️</span>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}><span style={{color:COLORS.gold}}>3 people</span> viewed your profile this week</div><div style={{fontSize:11,color:COLORS.muted}}>Upgrade to Pro to see who they are</div></div>
          <span style={{color:COLORS.gold,fontSize:12,fontWeight:700}}>See who →</span>
        </div>

        {/* Network sub tabs */}
        <div style={{display:"flex",gap:8,marginBottom:24,borderBottom:`1px solid ${COLORS.border}`,paddingBottom:0}}>
          {["Connect","🤝 Mentors","🙋 Mentees"].map(t=>(
            <button key={t} onClick={()=>setNetworkTab(t)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${networkTab===t?C:"transparent"}`,color:networkTab===t?C:"#a0b4cc",padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:700,marginBottom:-1,transition:"all 0.2s"}}>{t}</button>
          ))}
        </div>

        {/* CONNECT TAB */}
        {networkTab==="Connect"&&(
          <div>
            <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>👥 {space.short} Network</div>
            <div style={{color:COLORS.muted,fontSize:13,marginBottom:22}}>Connect with fellow {space.short} professionals</div>
            <div style={ss.grid}>
              {profiles.map(p=>(
                <div key={p.id} style={ss.card}>
                  <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:13}}>
                    <div style={ss.av(p.color)}>{p.avatar}</div>
                    <div><div style={{fontWeight:700,fontSize:14}}>{p.name}</div><div style={{color:COLORS.muted,fontSize:12}}>{p.role}</div>{p.org&&<div style={{color:C,fontSize:11,fontWeight:600}}>{p.org}</div>}</div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
                    <span style={ss.pill(C)}>{space.short}</span>
                    <span style={{color:COLORS.muted,fontSize:12}}>{p.connections} connections</span>
                  </div>
                  <div style={{display:"flex",gap:7}}>
                    <button style={ss.btn(connected[p.id]?COLORS.muted:C,connected[p.id])} onClick={()=>{setConnected(c=>({...c,[p.id]:!c[p.id]}));toast2(connected[p.id]?"Removed":`Connected with ${p.name.split(" ")[0]}!`);}}>{connected[p.id]?"✓ Connected":"+ Connect"}</button>
                    {isPro?<button style={ss.btn(COLORS.slate,true)} onClick={()=>toast2("Opening DM...")}>✉️ DM</button>:<button style={{...ss.btn(COLORS.gold,true),fontSize:11}} onClick={()=>onUpgradeNeeded("Direct messaging")}>⭐ DM</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENTORS TAB */}
        {networkTab==="🤝 Mentors"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontSize:18,fontWeight:800,marginBottom:3}}>🤝 Find a Mentor</div>
                <div style={{color:COLORS.muted,fontSize:13,marginBottom:16}}>Browse {space.short} professionals who are open to mentoring</div>
              </div>
              <button style={ss.btn(C)} onClick={()=>setShowMentorForm(true)}>+ Become a Mentor</button>
            </div>
            {/* Topic filters */}
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:22}}>
              {["All",...TOPICS].map(t=>(
                <button key={t} onClick={()=>setMentorFilter(t)} style={{background:mentorFilter===t?C+"22":"transparent",border:`1px solid ${mentorFilter===t?C:COLORS.border}`,color:mentorFilter===t?C:"#a0b4cc",padding:"4px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600}}>{t}</button>
              ))}
            </div>
            <div style={ss.grid}>
              {filteredMentors.map(m=>(
                <div key={m.id} style={{...ss.card,borderTop:`3px solid ${C}`}}>
                  <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:12}}>
                    <div style={ss.av(m.color)}>{m.avatar}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:14}}>{m.name}</div>
                      <div style={{color:COLORS.muted,fontSize:12}}>{m.role}</div>
                      <div style={{color:C,fontSize:11,fontWeight:600}}>{m.org}</div>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:COLORS.muted,lineHeight:1.5,marginBottom:12,fontStyle:"italic"}}>"{m.bio}"</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                    {m.topics.map(t=><span key={t} style={ss.tag(C)}>{t}</span>)}
                  </div>
                  <div style={{display:"flex",gap:12,marginBottom:14,fontSize:12,color:COLORS.muted}}>
                    <span>⏱ {m.availability}</span>
                    <span>👥 {m.mentees} mentees</span>
                    <span>📅 {m.exp} exp</span>
                  </div>
                  <div style={{display:"flex",gap:7}}>
                    <button style={ss.btn(C)} onClick={()=>toast2(`Session request sent to ${m.name.split(" ")[0]}! ✅`)}>📅 Request Session</button>
                    {isPro
                      ?<button style={ss.btn(COLORS.slate,true)} onClick={()=>toast2("Opening DM...")}>✉️ Message</button>
                      :<button style={{...ss.btn(COLORS.gold,true),fontSize:11}} onClick={()=>onUpgradeNeeded("Message a mentor directly")}>⭐ Message</button>
                    }
                  </div>
                </div>
              ))}
              {filteredMentors.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:40,color:COLORS.muted}}><div style={{fontSize:28,marginBottom:10}}>🔍</div><div>No mentors found for this topic yet</div></div>}
            </div>
          </div>
        )}

        {/* MENTEES TAB */}
        {networkTab==="🙋 Mentees"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontSize:18,fontWeight:800,marginBottom:3}}>🙋 Mentee Requests</div>
                <div style={{color:COLORS.muted,fontSize:13,marginBottom:16}}>Professionals looking for a mentor in {space.short}</div>
              </div>
              <button style={ss.btn(COLORS.slate)} onClick={()=>setShowMenteeForm(true)}>+ Request a Mentor</button>
            </div>
            {/* Topic filters */}
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:22}}>
              {["All",...TOPICS].map(t=>(
                <button key={t} onClick={()=>setMenteeFilter(t)} style={{background:menteeFilter===t?COLORS.slate+"22":"transparent",border:`1px solid ${menteeFilter===t?COLORS.slate:COLORS.border}`,color:menteeFilter===t?COLORS.slate:"#a0b4cc",padding:"4px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600}}>{t}</button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {filteredRequests.map(r=>(
                <div key={r.id} style={{...ss.card,display:"flex",alignItems:"flex-start",gap:14,borderLeft:`3px solid ${COLORS.slate}`}}>
                  <div style={ss.av(r.color,44)}>{r.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{r.name}</div>
                    <div style={{color:COLORS.muted,fontSize:12,marginBottom:8}}>{r.role} · Looking for: <span style={{color:COLORS.slate,fontWeight:600}}>{r.seeking}</span></div>
                    <div style={{fontSize:13,color:COLORS.text,lineHeight:1.5,marginBottom:10,fontStyle:"italic"}}>"{r.message}"</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                      {r.topics.map(t=><span key={t} style={ss.tag(COLORS.slate)}>{t}</span>)}
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      <button style={ss.btn(COLORS.slate)} onClick={()=>toast2(`You offered to mentor ${r.name.split(" ")[0]}! ✅`)}>🤝 Offer to Mentor</button>
                      {isPro
                        ?<button style={ss.btn(COLORS.slate,true)} onClick={()=>toast2("Opening DM...")}>✉️ Message</button>
                        :<button style={{...ss.btn(COLORS.gold,true),fontSize:11}} onClick={()=>onUpgradeNeeded("Message a mentee directly")}>⭐ Message</button>
                      }
                    </div>
                  </div>
                </div>
              ))}
              {filteredRequests.length===0&&<div style={{textAlign:"center",padding:40,color:COLORS.muted}}><div style={{fontSize:28,marginBottom:10}}>🙋</div><div>No mentee requests for this topic yet</div></div>}
            </div>
          </div>
        )}

        {/* BECOME A MENTOR MODAL */}
        {showMentorForm&&(
          <div style={ss.modal} onClick={()=>setShowMentorForm(false)}>
            <div style={ss.modalBox} onClick={e=>e.stopPropagation()}>
              <div style={{fontWeight:800,fontSize:17,marginBottom:4}}>🤝 Become a Mentor</div>
              <div style={{color:COLORS.muted,fontSize:13,marginBottom:18}}>Share your experience with the {space.short} community</div>
              <label style={ss.lbl}>Your Bio</label>
              <input style={ss.inp} placeholder="What can you help people with?" value={mentorForm.bio} onChange={e=>setMentorForm(f=>({...f,bio:e.target.value}))}/>
              <label style={ss.lbl}>Topics (comma separated)</label>
              <input style={ss.inp} placeholder="e.g. Career Growth, Remote Work, ICD-10" value={mentorForm.topics} onChange={e=>setMentorForm(f=>({...f,topics:e.target.value}))}/>
              <label style={ss.lbl}>Availability</label>
              <select style={ss.sel} value={mentorForm.availability} onChange={e=>setMentorForm(f=>({...f,availability:e.target.value}))}>
                <option value="">Select availability</option>
                <option>Weekends</option><option>Evenings</option><option>Flexible</option><option>Weekdays</option>
              </select>
              <div style={{display:"flex",gap:9}}>
                <button style={ss.btn(C)} onClick={()=>{setShowMentorForm(false);toast2("🎉 You are now listed as a mentor!");}}>Submit</button>
                <button style={ss.btn(COLORS.muted,true)} onClick={()=>setShowMentorForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* REQUEST A MENTOR MODAL */}
        {showMenteeForm&&(
          <div style={ss.modal} onClick={()=>setShowMenteeForm(false)}>
            <div style={ss.modalBox} onClick={e=>e.stopPropagation()}>
              <div style={{fontWeight:800,fontSize:17,marginBottom:4}}>🙋 Request a Mentor</div>
              <div style={{color:COLORS.muted,fontSize:13,marginBottom:18}}>Tell the community what kind of guidance you are looking for</div>
              <label style={ss.lbl}>What are you looking for?</label>
              <input style={ss.inp} placeholder="e.g. Career transition mentor, Coding mentor" value={menteeForm.seeking} onChange={e=>setMenteeForm(f=>({...f,seeking:e.target.value}))}/>
              <label style={ss.lbl}>Topics (comma separated)</label>
              <input style={ss.inp} placeholder="e.g. Remote Work, Certifications" value={menteeForm.topics} onChange={e=>setMenteeForm(f=>({...f,topics:e.target.value}))}/>
              <label style={ss.lbl}>Your Message</label>
              <input style={ss.inp} placeholder="Tell mentors a little about your situation" value={menteeForm.message} onChange={e=>setMenteeForm(f=>({...f,message:e.target.value}))}/>
              <div style={{display:"flex",gap:9}}>
                <button style={ss.btn(COLORS.slate)} onClick={()=>{setShowMenteeForm(false);toast2("🎉 Mentee request posted!");}}>Post Request</button>
                <button style={ss.btn(COLORS.muted,true)} onClick={()=>setShowMenteeForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderChat=()=>{
    const ch=space.channels.find(c=>c.id===channel)||space.channels[0];
    const msgs=messages[channel]||[];
    return(
      <div style={{display:"flex",height:"calc(100vh - 220px)",borderRadius:13,overflow:"hidden",border:`1px solid ${COLORS.border}`}}>
        <div style={{width:200,background:"#1e1520",borderRight:`1px solid ${COLORS.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"12px 12px 8px",borderBottom:`1px solid ${COLORS.border}`}}>
            <div style={{fontSize:11,fontWeight:800,color:C}}>{space.icon} {space.short.toUpperCase()}</div>
            <div style={{fontSize:10,color:COLORS.muted,marginTop:1}}>Community Chat</div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"6px 5px"}}>
            {space.channels.map(c=>(
              <div key={c.id} onClick={()=>setChannel(c.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",borderRadius:6,cursor:"pointer",background:channel===c.id?C+"18":"transparent",color:channel===c.id?C:COLORS.muted,fontWeight:channel===c.id?700:500,fontSize:12,marginBottom:1}}>
                <span>{c.icon}</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}># {c.name}</span>
              </div>
            ))}
          </div>
          <div style={{padding:8,borderTop:`1px solid ${COLORS.border}`}}>
            <div onClick={()=>{setTempName(myName);setTempRole(myRole);setShowNameModal(true);}} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:"5px 7px",borderRadius:7,background:COLORS.card}}>
              <div style={ss.av(C,26)}>{initials(myName)}</div>
              <div><div style={{fontSize:10,fontWeight:700}}>{myName}</div><div style={{fontSize:9,color:COLORS.muted}}>{isPro?"⭐ Pro":"Free"}</div></div>
            </div>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",background:COLORS.surface,minWidth:0}}>
          <div style={{padding:"10px 16px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",gap:8}}>
            <span>{ch.icon}</span>
            <div><div style={{fontWeight:700,fontSize:13}}># {ch.name}</div><div style={{fontSize:11,color:COLORS.muted}}>{ch.desc}</div></div>
            {!isPro&&<div onClick={()=>onUpgradeNeeded("Send messages in community chat")} style={{marginLeft:"auto",background:`${COLORS.gold}18`,border:`1px solid ${COLORS.gold}44`,color:COLORS.gold,padding:"3px 10px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer"}}>⭐ Upgrade to chat</div>}
          </div>
          {!isPro&&<div style={{background:`${COLORS.gold}0a`,borderBottom:`1px solid ${COLORS.gold}22`,padding:"8px 16px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13}}>🔒</span>
            <span style={{fontSize:12,color:COLORS.muted}}>Read-only. <span style={{color:COLORS.gold,cursor:"pointer",fontWeight:700}} onClick={()=>onUpgradeNeeded("Send messages")}>Upgrade to Pro to join the conversation →</span></span>
          </div>}
          <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:2}}>
            {msgs.map((m,i)=>{
              const showHdr=i===0||msgs[i-1].user!==m.user;
              return(
                <div key={m.id} style={{display:"flex",gap:8,alignItems:"flex-start",marginTop:showHdr?10:1}}>
                  {showHdr?<div style={ss.av(m.color,30)}>{m.avatar}</div>:<div style={{width:30,flexShrink:0}}/>}
                  <div style={{flex:1,minWidth:0}}>
                    {showHdr&&<div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:3}}><span style={{fontWeight:700,fontSize:12,color:m.color}}>{m.user}</span><span style={{fontSize:10,color:COLORS.muted}}>{m.role}</span><span style={{fontSize:10,color:COLORS.muted,marginLeft:"auto"}}>{m.time}</span></div>}
                    <div style={{background:m.isOwn?C+"15":COLORS.card,border:`1px solid ${m.isOwn?C+"33":COLORS.border}`,borderRadius:"4px 10px 10px 10px",padding:"6px 10px",fontSize:13,lineHeight:1.5,display:"inline-block",maxWidth:"85%"}}>{m.text}</div>
                    {Object.keys(m.reactions||{}).length>0&&<div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>{Object.entries(m.reactions).map(([e,cnt])=><button key={e} onClick={()=>react(channel,m.id,e)} style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"2px 6px",fontSize:11,cursor:"pointer",color:COLORS.text}}>{e} {cnt}</button>)}</div>}
                    <div style={{display:"flex",gap:2,marginTop:2}}>{EMOJIS.map(e=><button key={e} onClick={()=>react(channel,m.id,e)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:11,opacity:0.2,padding:"0 2px"}} onMouseEnter={ev=>ev.target.style.opacity=1} onMouseLeave={ev=>ev.target.style.opacity=0.2}>{e}</button>)}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef}/>
          </div>
          <div style={{padding:"8px 12px",borderTop:`1px solid ${COLORS.border}`,display:"flex",gap:8,alignItems:"center"}}>
            <div style={ss.av(C,28)}>{initials(myName)}</div>
            <div style={{flex:1,background:COLORS.card,border:`1px solid ${isPro?COLORS.border:COLORS.gold+"33"}`,borderRadius:8,display:"flex",alignItems:"center",padding:"0 10px",gap:7}} onClick={!isPro?()=>onUpgradeNeeded("Send messages in community chat"):undefined}>
              {isPro
                ?<input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendMsg())} placeholder={`Message #${ch.name}...`} style={{flex:1,background:"transparent",border:"none",outline:"none",color:COLORS.text,fontSize:12,padding:"10px 0"}}/>
                :<span style={{flex:1,fontSize:12,color:COLORS.gold+"88",padding:"10px 0",cursor:"pointer"}}>⭐ Upgrade to Pro to send messages...</span>
              }
              <button onClick={sendMsg} style={{background:`linear-gradient(135deg,${C},${C}99)`,border:"none",borderRadius:6,width:28,height:28,cursor:"pointer",color:"#fff",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>➤</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResources=()=>(
    <div>
      <ProBanner/>
      <div style={{fontSize:20,fontWeight:800,marginBottom:4}}>📚 {space.short} Resources</div>
      <div style={{color:COLORS.muted,fontSize:13,marginBottom:22}}>Guides, templates & reference docs</div>
      {space.resources.map(r=>(
        <div key={r.id} style={{...ss.card,display:"flex",alignItems:"center",gap:13,marginBottom:11,opacity:r.pro&&!isPro?0.75:1}}>
          <div style={{width:40,height:40,borderRadius:9,background:(r.pro&&!isPro?COLORS.gold:C)+"22",border:`1px solid ${r.pro&&!isPro?COLORS.gold:C}44`,display:"flex",alignItems:"center",justifyContent:"center",color:r.pro&&!isPro?COLORS.gold:C,fontWeight:800,fontSize:r.pro&&!isPro?16:10,flexShrink:0}}>{r.pro&&!isPro?"🔒":r.type}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{r.title}{r.pro&&<span style={{background:`${COLORS.gold}22`,color:COLORS.gold,fontSize:10,fontWeight:800,padding:"1px 7px",borderRadius:8,marginLeft:8,border:`1px solid ${COLORS.gold}44`}}>PRO</span>}</div>
            <div style={{display:"flex",gap:8}}><span style={{color:COLORS.muted,fontSize:12}}>by {r.author}</span><span style={{color:COLORS.muted,fontSize:11}}>↓ {r.downloads.toLocaleString()}</span></div>
          </div>
          {r.pro&&!isPro?<button style={{...ss.btn(COLORS.gold),background:`${COLORS.gold}18`,color:COLORS.gold,fontSize:12}} onClick={()=>onUpgradeNeeded("Download Pro resources")}>⭐ Pro Only</button>:<button style={ss.btn(C)} onClick={()=>toast2("Downloading...")}>Download</button>}
        </div>
      ))}
    </div>
  );

  const renderNews=()=>(
    <div>
      <div style={{fontSize:20,fontWeight:800,marginBottom:4}}>📰 {space.short} News</div>
      <div style={{color:COLORS.muted,fontSize:13,marginBottom:22}}>Latest updates for {space.label}</div>
      {space.news.map(n=>(
        <div key={n.id} style={{...ss.card,display:"flex",alignItems:"flex-start",gap:13,marginBottom:11}}>
          <div style={{width:40,height:40,borderRadius:9,background:C+"22",border:`1px solid ${C}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{space.icon}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>{n.hot&&<span style={ss.pill(COLORS.rose)}>🔥 Trending</span>}<span style={{color:COLORS.muted,fontSize:11}}>{n.time}</span></div>
            <div style={{fontWeight:700,fontSize:13,lineHeight:1.4,marginBottom:3}}>{n.headline}</div>
            <div style={{color:COLORS.muted,fontSize:12}}>Source: {n.source}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const TABS=["Jobs","Network","💬 Chat","Resources","News"];
  const tabMap={"Jobs":renderJobs,"Network":renderNetwork,"💬 Chat":renderChat,"Resources":renderResources,"News":renderNews};

  return(
    <div style={{minHeight:"100vh",background:COLORS.bg,fontFamily:FONTS.body,color:COLORS.text}}>
      <div style={{background:"linear-gradient(135deg,#1a1218,#221820)",borderBottom:`1px solid ${C}33`,padding:"20px 28px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
          <button onClick={onBack} style={{background:"transparent",border:`1px solid ${COLORS.border}`,color:COLORS.muted,padding:"5px 12px",borderRadius:7,cursor:"pointer",fontSize:12}}>← Back</button>
          {!isPro&&<button onClick={()=>onUpgradeNeeded("Full Pro access")} style={{background:`linear-gradient(135deg,${COLORS.rose},${COLORS.accent})`,border:"none",color:"#fff",padding:"7px 18px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:800}}>⭐ Upgrade to Pro — $9.99/mo</button>}
          {isPro&&<div style={{background:`${COLORS.gold}18`,border:`1px solid ${COLORS.gold}44`,color:COLORS.gold,padding:"5px 14px",borderRadius:8,fontSize:12,fontWeight:800}}>⭐ Pro Member</div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:13,background:C+"22",border:`2px solid ${C}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{space.icon}</div>
          <div>
            <div style={{fontSize:22,fontWeight:900,color:C}}>{space.label}</div>
            <div style={{fontSize:13,color:COLORS.muted,marginTop:2}}>{space.subtitle}</div>
            <div style={{fontSize:11,color:COLORS.muted,marginTop:3}}>{space.tagline}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:5,marginTop:18,flexWrap:"wrap"}}>
          {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{background:tab===t?C+"22":"transparent",border:`1px solid ${tab===t?C:COLORS.border}`,color:tab===t?C:"#a0b4cc",padding:"6px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>{t}</button>)}
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:tab==="💬 Chat"?"20px 20px 0":"28px 20px"}}>
        {tabMap[tab]()}
      </div>
      {showNameModal&&<div style={ss.modal} onClick={()=>setShowNameModal(false)}><div style={ss.modalBox} onClick={e=>e.stopPropagation()}><div style={{fontWeight:800,fontSize:17,marginBottom:16}}>Your Chat Identity</div><label style={ss.lbl}>Display Name</label><input style={ss.inp} value={tempName} onChange={e=>setTempName(e.target.value)}/><label style={ss.lbl}>Role</label><input style={ss.inp} value={tempRole} onChange={e=>setTempRole(e.target.value)}/><div style={{display:"flex",gap:9}}><button style={ss.btn(C)} onClick={()=>{if(tempName.trim()){setMyName(tempName.trim());setMyRole(tempRole.trim()||myRole);}setShowNameModal(false);toast2("✅ Updated!");}}>Save</button><button style={ss.btn(COLORS.muted,true)} onClick={()=>setShowNameModal(false)}>Cancel</button></div></div></div>}
      {showJobForm&&<div style={ss.modal} onClick={()=>setShowJobForm(false)}><div style={ss.modalBox} onClick={e=>e.stopPropagation()}><div style={{fontWeight:800,fontSize:17,marginBottom:16}}>Post a {space.short} Job</div>{[["Job Title","title","e.g. Remote HIM Specialist"],["Company","company","e.g. Cotiviti"],["Salary","salary","e.g. $60k–$80k"]].map(([l,k,ph])=><div key={k}><label style={ss.lbl}>{l}</label><input style={ss.inp} placeholder={ph} value={newJob[k]} onChange={e=>setNewJob(j=>({...j,[k]:e.target.value}))}/></div>)}<label style={ss.lbl}>Type</label><select style={ss.sel} value={newJob.type} onChange={e=>setNewJob(j=>({...j,type:e.target.value}))}><option>Full-Time</option><option>Part-Time</option><option>Contract</option></select><label style={ss.lbl}>Tags (comma separated)</label><input style={ss.inp} placeholder="e.g. RHIT, Epic, CDI" value={newJob.tags} onChange={e=>setNewJob(j=>({...j,tags:e.target.value}))}/><div style={{display:"flex",gap:9}}><button style={ss.btn(C)} onClick={postJob}>Post Job</button><button style={ss.btn(COLORS.muted,true)} onClick={()=>setShowJobForm(false)}>Cancel</button></div></div></div>}
      {toast&&<div style={{position:"fixed",bottom:26,left:"50%",transform:"translateX(-50%)",background:COLORS.green+"22",border:`1px solid ${COLORS.green}`,color:COLORS.green,padding:"9px 22px",borderRadius:10,fontSize:13,fontWeight:700,zIndex:300}}>{toast}</div>}
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function Onboarding({onComplete}){
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [specialty,setSpecialty]=useState("");
  const [role,setRole]=useState("");
  const steps=[
    {num:1,label:"Your Name",q:"What should we call you?",sub:"This will show on your profile and in community chat"},
    {num:2,label:"Your Specialty",q:"Which space fits you best?",sub:"You can explore all spaces but we'll personalize your experience"},
    {num:3,label:"Your Role",q:"What is your current role?",sub:"Help others in the community know what you do"},
  ];
  const specialties=[
    {key:"HIM",label:"Health Information Management",icon:"📋",color:"#c9a0c0",ex:"Coder, CDI Specialist, HIM Director"},
    {key:"Admin",label:"Healthcare Administration",icon:"🏥",color:"#7ec8a4",ex:"Administrator, Revenue Cycle, Compliance"},
    {key:"Healthcare IT",label:"Healthcare Information Technology",icon:"💻",color:"#8fa3b1",ex:"IT Analyst, EHR Consultant, CMIO"},
  ];
  const canNext=(step===0&&name.trim())||(step===1&&specialty)||(step===2&&role.trim());
  const finish=()=>onComplete({name:name.trim(),specialty,role:role.trim()});

  return(
    <div style={{position:"fixed",inset:0,background:COLORS.bg,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:FONTS.body}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      {/* Glow bg */}
      <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:400,height:400,background:`radial-gradient(circle,${COLORS.accent}08,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:480,position:"relative",zIndex:1}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:FONTS.heading,fontSize:28,fontWeight:900,marginBottom:4}}>
            <span style={{color:"#fff"}}>H</span><span style={{color:COLORS.rose,textShadow:`0 0 16px ${COLORS.rose}66`}}>X</span><span style={{color:COLORS.accent,textShadow:`0 0 16px ${COLORS.accent}55`}}>Connect</span>
          </div>
          <div style={{fontSize:11,color:COLORS.rose,fontWeight:700,letterSpacing:1}}>🖤 Black Woman Owned</div>
        </div>

        {/* Progress bar */}
        <div style={{display:"flex",gap:6,marginBottom:32}}>
          {steps.map((s,i)=>(
            <div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=step?`linear-gradient(90deg,${COLORS.rose},${COLORS.accent})`:COLORS.border,transition:"background 0.3s"}}/>
          ))}
        </div>

        {/* Step card */}
        <div style={{background:"linear-gradient(145deg,#231820,#2c2028)",border:`1px solid ${COLORS.border}`,borderRadius:20,padding:36}}>
          <div style={{fontSize:10,letterSpacing:3,color:COLORS.muted,textTransform:"uppercase",marginBottom:12}}>Step {step+1} of {steps.length} · {steps[step].label}</div>
          <div style={{fontSize:22,fontWeight:800,marginBottom:6,lineHeight:1.3}}>{steps[step].q}</div>
          <div style={{fontSize:13,color:COLORS.muted,marginBottom:28}}>{steps[step].sub}</div>

          {step===0&&(
            <input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&canNext&&setStep(1)} placeholder="e.g. Jas Smith, RHIA" style={{width:"100%",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"13px 16px",color:COLORS.text,fontSize:16,outline:"none",boxSizing:"border-box",fontFamily:FONTS.body}}/>
          )}

          {step===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {specialties.map(s=>(
                <div key={s.key} onClick={()=>setSpecialty(s.key)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:12,border:`2px solid ${specialty===s.key?s.color:COLORS.border}`,background:specialty===s.key?s.color+"15":COLORS.card,cursor:"pointer",transition:"all 0.2s"}}>
                  <span style={{fontSize:24}}>{s.icon}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:specialty===s.key?s.color:COLORS.text}}>{s.label}</div>
                    <div style={{fontSize:11,color:COLORS.muted,marginTop:2}}>{s.ex}</div>
                  </div>
                  {specialty===s.key&&<span style={{marginLeft:"auto",color:s.color,fontSize:18}}>✓</span>}
                </div>
              ))}
            </div>
          )}

          {step===2&&(
            <div>
              <input autoFocus value={role} onChange={e=>setRole(e.target.value)} onKeyDown={e=>e.key==="Enter"&&canNext&&finish()} placeholder="e.g. CDI Specialist, HIM Director" style={{width:"100%",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"13px 16px",color:COLORS.text,fontSize:16,outline:"none",boxSizing:"border-box",fontFamily:FONTS.body,marginBottom:16}}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {["Medical Coder","CDI Specialist","HIM Director","Healthcare Admin","Revenue Cycle Manager","EHR Analyst","Health IT Consultant","Compliance Officer","Practice Manager","CMIO"].map(r=>(
                  <span key={r} onClick={()=>setRole(r)} style={{background:role===r?COLORS.accent+"22":COLORS.card,border:`1px solid ${role===r?COLORS.accent:COLORS.border}`,color:role===r?COLORS.accent:COLORS.muted,padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer"}}>{r}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:10,marginTop:28}}>
            {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{background:"transparent",border:`1px solid ${COLORS.border}`,color:COLORS.muted,padding:"11px 20px",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700}}>← Back</button>}
            <button onClick={()=>step<2?setStep(s=>s+1):finish()} disabled={!canNext} style={{flex:1,background:canNext?`linear-gradient(135deg,${COLORS.rose},${COLORS.accent})`:`${COLORS.border}`,border:"none",color:canNext?"#fff":COLORS.muted,padding:"13px",borderRadius:10,cursor:canNext?"pointer":"default",fontSize:15,fontWeight:800,transition:"all 0.2s"}}>
              {step<2?"Continue →":"Let's Go 🚀"}
            </button>
          </div>
        </div>

        <div style={{textAlign:"center",marginTop:16,fontSize:11,color:COLORS.muted}}>No credit card required · Free to join · Launch March 27th 🖤</div>
      </div>
    </div>
  );
}

// ── FOUNDER PAGE ──────────────────────────────────────────────────────────────
function FounderPage({onBack}){
  const stats=[
    {n:"10+",l:"Years in Healthcare"},
    {n:"3",l:"Professional Spaces"},
    {n:"Atrium",l:"Current Employer"},
    {n:"Mar 27",l:"Official Launch"},
  ];
  const timeline=[
    {year:"2015",text:"Started my healthcare journey in Clinical & Administrative Support across hospitals, clinics, and long-term care facilities in Charlotte, NC — building hands-on experience in clinical workflows, chart documentation, HIPAA compliance, and EHR systems including Epic."},
    {year:"2018",text:"Stepped into a formal administrative leadership role as Administrative Office Coordinator at Novant Health — overseeing patient registration, medical records coordination, and HIPAA-aligned data entry for a high-volume healthcare office."},
    {year:"2023",text:"Joined Atrium Health as Medical Records Operations Lead — conducting audits, training staff on HIM best practices, and managing electronic documentation workflows using Epic, OnBase, and Solarity. Also pursuing a B.S. in Healthcare Administration with a minor in HIM at Capella University."},
    {year:"2026",text:"Built HXConnect — the platform our community always deserved. A Black woman owned professional network for HIM, Healthcare Admin and Healthcare IT professionals. Built from lived experience. Built for us. 🖤"},
  ];
  return(
    <div style={{background:COLORS.bg,minHeight:"100vh",fontFamily:FONTS.body,color:COLORS.text}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1a1218,#221820)",borderBottom:`1px solid ${COLORS.border}`,padding:"0 24px",display:"flex",alignItems:"center",height:58,position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"transparent",border:`1px solid ${COLORS.border}`,color:COLORS.muted,padding:"5px 14px",borderRadius:8,cursor:"pointer",fontSize:13,marginRight:16}}>← Back</button>
        <div style={{fontFamily:FONTS.heading,fontSize:15,fontWeight:900}}><span style={{color:"#fff"}}>H</span><span style={{color:COLORS.rose}}>X</span><span style={{color:COLORS.accent}}>Connect</span></div>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"50px 24px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:56,position:"relative"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:300,height:300,background:`radial-gradient(circle,${COLORS.rose}0a,transparent 70%)`,pointerEvents:"none"}}/>
          {/* Avatar */}
          <div style={{width:100,height:100,borderRadius:"50%",background:`linear-gradient(135deg,${COLORS.rose},${COLORS.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 20px",boxShadow:`0 0 40px ${COLORS.rose}44`,border:`3px solid ${COLORS.rose}66`}}>🖤</div>
          <div style={{fontSize:11,letterSpacing:3,color:COLORS.rose,textTransform:"uppercase",marginBottom:10,fontWeight:700}}>Founder & CEO</div>
          <div style={{fontSize:34,fontWeight:900,marginBottom:8,letterSpacing:"-0.5px"}}>Jasmine Stevenson</div>
          <div style={{fontSize:15,color:COLORS.muted,marginBottom:16}}>Medical Records Operations Lead · Atrium Health · Charlotte, NC</div>
          <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{background:`${COLORS.rose}18`,border:`1px solid ${COLORS.rose}44`,color:COLORS.rose,padding:"4px 14px",borderRadius:20,fontSize:12,fontWeight:700}}>🖤 Black Woman Owned</span>
            <span style={{background:`${COLORS.accent}18`,border:`1px solid ${COLORS.accent}44`,color:COLORS.accent,padding:"4px 14px",borderRadius:20,fontSize:12,fontWeight:700}}>📱 @jas.Melanin</span>
            <span style={{background:`${COLORS.green}18`,border:`1px solid ${COLORS.green}44`,color:COLORS.green,padding:"4px 14px",borderRadius:20,fontSize:12,fontWeight:700}}>📋 HIM Operations Lead</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:48}}>
          {stats.map(s=>(
            <div key={s.l} style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"16px 14px",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900,color:COLORS.accent,letterSpacing:"-1px"}}>{s.n}</div>
              <div style={{fontSize:11,color:COLORS.muted,marginTop:3,lineHeight:1.3}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Story paragraph */}
        <div style={{background:"linear-gradient(145deg,#231820,#2c2028)",border:`1px solid ${COLORS.border}`,borderRadius:18,padding:32,marginBottom:32}}>
          <div style={{fontSize:11,letterSpacing:3,color:COLORS.accent,textTransform:"uppercase",marginBottom:16,fontWeight:700}}>My Story</div>
          <div style={{fontSize:15,lineHeight:1.9,color:COLORS.muted}}>
            I have been working in healthcare for over 10 years across clinical support, healthcare administration, and health information management. I currently work as a <span style={{color:COLORS.accent,fontWeight:700}}>Medical Records Operations Lead</span> and I have held roles at 2 major hospitals here in Charlotte, NC. I work daily with Epic, OnBase, HIPAA compliance and documentation workflows so I know this field inside and out.
            <br/><br/>
            I built HXConnect because I lived the problem. There was no real space for people like us. No dedicated platform for HIM professionals, healthcare admins and healthcare IT people to find remote jobs, network and actually talk to each other. LinkedIn is too broad. GroupMe does its best. So I stopped waiting for somebody else to build it and built it myself. <span style={{color:COLORS.rose,fontWeight:700}}>As a Black woman in this field that is exactly the kind of energy I had to carry to get here and it is the same energy behind this platform.</span> Built from lived experience. Built by us. For us. 🖤
          </div>
        </div>

        {/* TikTok CTA */}
        <div style={{background:`linear-gradient(135deg,${COLORS.rose}18,${COLORS.accent}0a)`,border:`1px solid ${COLORS.rose}44`,borderRadius:16,padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,marginBottom:4}}>📱 Follow the Journey</div>
            <div style={{color:COLORS.muted,fontSize:13}}>Remote jobs, career tips & behind the scenes of building HXConnect</div>
            <div style={{color:COLORS.accent,fontWeight:700,fontSize:14,marginTop:6}}>@jas.Melanin on TikTok</div>
          </div>
          <button onClick={()=>window.open("https://tiktok.com/@jas.melanin","_blank")} style={{background:`linear-gradient(135deg,${COLORS.rose},${COLORS.accent})`,border:"none",color:"#fff",padding:"11px 24px",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:800}}>Follow @jas.Melanin →</button>
        </div>
      </div>
    </div>
  );
}

// ── SEARCH BAR COMPONENT ──────────────────────────────────────────────────────
function GlobalSearch({onSelectSpace,onClose}){
  const [q,setQ]=useState("");
  const allJobs=Object.entries(FEATURED_JOBS).flatMap(([space,jobs])=>jobs.map(j=>({...j,space})));
  const filtered=q.trim().length>1?allJobs.filter(j=>[j.title,j.company,...(j.tags||[])].join(" ").toLowerCase().includes(q.toLowerCase())):[];
  const spaceMatches=q.trim().length>1?Object.values(SPACES).filter(s=>[s.label,s.short,s.tagline].join(" ").toLowerCase().includes(q.toLowerCase())):[];
  const spaceColors={"HIM":"#c9a0c0","Admin":"#7ec8a4","Healthcare IT":"#8fa3b1"};
  return(
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:400,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"80px 20px 20px"}} onClick={onClose}>
      <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:16,width:"100%",maxWidth:560,overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:`1px solid ${COLORS.border}`}}>
          <span style={{fontSize:18,color:COLORS.muted}}>🔍</span>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search jobs, companies, specialties..." style={{flex:1,background:"transparent",border:"none",outline:"none",color:COLORS.text,fontSize:15,fontFamily:FONTS.body}}/>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:COLORS.muted,cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        {q.trim().length>1&&(
          <div style={{maxHeight:400,overflowY:"auto"}}>
            {spaceMatches.length>0&&(
              <div>
                <div style={{padding:"10px 18px 6px",fontSize:10,letterSpacing:2,color:COLORS.muted,textTransform:"uppercase",fontWeight:700}}>Spaces</div>
                {spaceMatches.map(sp=>(
                  <div key={sp.key} onClick={()=>{onSelectSpace(sp.key);onClose();}} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 18px",cursor:"pointer",borderBottom:`1px solid ${COLORS.border}`}} onMouseEnter={e=>e.currentTarget.style.background=COLORS.card} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontSize:20}}>{sp.icon}</span>
                    <div><div style={{fontWeight:700,fontSize:14,color:spaceColors[sp.key]||COLORS.accent}}>{sp.label}</div><div style={{fontSize:11,color:COLORS.muted}}>{sp.tagline}</div></div>
                    <span style={{marginLeft:"auto",color:COLORS.muted,fontSize:13}}>→</span>
                  </div>
                ))}
              </div>
            )}
            {filtered.length>0&&(
              <div>
                <div style={{padding:"10px 18px 6px",fontSize:10,letterSpacing:2,color:COLORS.muted,textTransform:"uppercase",fontWeight:700}}>Featured Jobs</div>
                {filtered.map(job=>(
                  <div key={job.id} onClick={()=>{onSelectSpace(job.space);onClose();}} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 18px",cursor:"pointer",borderBottom:`1px solid ${COLORS.border}`}} onMouseEnter={e=>e.currentTarget.style.background=COLORS.card} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontSize:18}}>💼</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13}}>{job.title}</div>
                      <div style={{fontSize:11,color:COLORS.muted}}>{job.company} · {job.salary}</div>
                    </div>
                    <span style={{background:(spaceColors[job.space]||COLORS.accent)+"18",color:spaceColors[job.space]||COLORS.accent,padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:700}}>{job.space}</span>
                  </div>
                ))}
              </div>
            )}
            {filtered.length===0&&spaceMatches.length===0&&(
              <div style={{padding:"30px",textAlign:"center",color:COLORS.muted}}>
                <div style={{fontSize:28,marginBottom:10}}>🔍</div>
                <div style={{fontWeight:700,marginBottom:4}}>No results for "{q}"</div>
                <div style={{fontSize:12}}>Try searching for a job title, company, or specialty</div>
              </div>
            )}
          </div>
        )}
        {q.trim().length<=1&&(
          <div style={{padding:"16px 18px"}}>
            <div style={{fontSize:11,letterSpacing:2,color:COLORS.muted,textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Browse Spaces</div>
            {Object.values(SPACES).map(sp=>(
              <div key={sp.key} onClick={()=>{onSelectSpace(sp.key);onClose();}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,cursor:"pointer",marginBottom:6}} onMouseEnter={e=>e.currentTarget.style.background=COLORS.card} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontSize:18}}>{sp.icon}</span>
                <span style={{fontWeight:600,fontSize:13,color:spaceColors[sp.key]||COLORS.accent}}>{sp.label}</span>
                <span style={{marginLeft:"auto",color:COLORS.muted,fontSize:12}}>{sp.jobs?.length||4} jobs →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const [hasOnboarded,setHasOnboarded]=useState(false);
  const [user,setUser]=useState(null);
  const [activeSpace,setActiveSpace]=useState(null);
  const [showFounder,setShowFounder]=useState(false);
  const [showSearch,setShowSearch]=useState(false);
  const [isPro,setIsPro]=useState(false);
  const [upgradeFeature,setUpgradeFeature]=useState(null);
  const [toast,setToast]=useState(null);
  const toast2=(m)=>{setToast(m);setTimeout(()=>setToast(null),2500);};
  const handleUpgrade=()=>{setIsPro(true);setUpgradeFeature(null);toast2("🎉 Welcome to Pro! All features unlocked.");};
  const handleOnboardComplete=(data)=>{setUser(data);setHasOnboarded(true);};

  // Keyboard shortcut for search
  useEffect(()=>{
    const handler=(e)=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setShowSearch(true);}if(e.key==="Escape")setShowSearch(false);};
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[]);

  if(!hasOnboarded) return <Onboarding onComplete={handleOnboardComplete}/>;
  if(showFounder) return <FounderPage onBack={()=>setShowFounder(false)}/>;
  if(activeSpace) return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      <CategorySpace spaceKey={activeSpace} onBack={()=>setActiveSpace(null)} isPro={isPro} onUpgradeNeeded={setUpgradeFeature}/>
      {upgradeFeature&&<UpgradeModal feature={upgradeFeature} onClose={()=>setUpgradeFeature(null)} onUpgrade={handleUpgrade}/>}
      {showSearch&&<GlobalSearch onSelectSpace={setActiveSpace} onClose={()=>setShowSearch(false)}/>}
      {toast&&<div style={{position:"fixed",bottom:26,left:"50%",transform:"translateX(-50%)",background:COLORS.green+"22",border:`1px solid ${COLORS.green}`,color:COLORS.green,padding:"9px 22px",borderRadius:10,fontSize:13,fontWeight:700,zIndex:400}}>{toast}</div>}
    </>
  );

  const Logo=()=>(
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:36,height:36,background:"#1e1520",border:`2px solid ${COLORS.accent}`,borderRadius:9,display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,padding:8,boxShadow:`0 0 14px ${COLORS.accent}44`,flexShrink:0,position:"relative"}}>
        <span style={{background:COLORS.accent,borderRadius:2,boxShadow:`0 0 5px ${COLORS.accent}99`}}></span><span style={{background:COLORS.accent+"44",borderRadius:2}}></span>
        <span style={{background:COLORS.accent+"44",borderRadius:2}}></span><span style={{background:COLORS.accent,borderRadius:2,boxShadow:`0 0 5px ${COLORS.accent}99`}}></span>
        <span style={{position:"absolute",bottom:3,right:5,fontSize:7,fontWeight:900,color:COLORS.rose,fontFamily:FONTS.heading,lineHeight:1}}>X</span>
      </div>
      <div>
        <div style={{fontFamily:FONTS.heading,fontSize:16,fontWeight:900,lineHeight:1}}><span style={{color:"#fff"}}>H</span><span style={{color:COLORS.rose}}>X</span><span style={{color:COLORS.accent}}>Connect</span></div>
        <div style={{fontSize:8,letterSpacing:2,color:COLORS.muted,textTransform:"uppercase",marginTop:1}}>Professional Network</div>
      </div>
    </div>
  );

  return(
    <div style={{background:COLORS.bg,minHeight:"100vh",fontFamily:FONTS.body,color:COLORS.text}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      <header style={{background:"linear-gradient(135deg,#1a1218,#221820)",borderBottom:`1px solid ${COLORS.border}`,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:100,boxShadow:`0 0 30px ${COLORS.accent}11`}}>
        <Logo/>
        {/* Search bar */}
        <div onClick={()=>setShowSearch(true)} style={{flex:1,maxWidth:320,margin:"0 20px",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:9,padding:"7px 14px",display:"flex",alignItems:"center",gap:9,cursor:"pointer",transition:"border-color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=COLORS.accent+"66"} onMouseLeave={e=>e.currentTarget.style.borderColor=COLORS.border}>
          <span style={{color:COLORS.muted,fontSize:14}}>🔍</span>
          <span style={{color:COLORS.muted,fontSize:13,flex:1}}>Search jobs, companies, specialties...</span>
          <span style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,color:COLORS.muted,padding:"1px 6px",borderRadius:5,fontSize:10}}>⌘K</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setShowFounder(true)} style={{background:"transparent",border:`1px solid ${COLORS.border}`,color:COLORS.muted,padding:"5px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>About</button>
          {user&&<div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${COLORS.rose},${COLORS.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#fff",flexShrink:0}}>{initials(user.name||"You")}</div>}
          {isPro
            ?<div style={{background:`${COLORS.gold}18`,border:`1px solid ${COLORS.gold}44`,color:COLORS.gold,padding:"5px 12px",borderRadius:8,fontSize:12,fontWeight:800}}>⭐ Pro</div>
            :<button onClick={()=>setUpgradeFeature("Full Pro access")} style={{background:`linear-gradient(135deg,${COLORS.rose},${COLORS.accent})`,border:"none",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:800}}>⭐ Go Pro</button>
          }
        </div>
      </header>

      <div style={{maxWidth:900,margin:"0 auto",padding:"50px 24px 40px",textAlign:"center"}}>
        {/* Personalized greeting */}
        {user&&(
          <div style={{fontSize:14,color:COLORS.muted,marginBottom:12}}>
            👋 Welcome back, <span style={{color:COLORS.accent,fontWeight:700}}>{user.name}</span>
            {user.specialty&&<span> · <span style={{color:SPACES[user.specialty]?.color||COLORS.accent}}>{SPACES[user.specialty]?.short||user.specialty}</span></span>}
          </div>
        )}
        <div style={{fontFamily:FONTS.heading,fontSize:40,fontWeight:900,lineHeight:1.1,marginBottom:12}}><span style={{color:"#fff"}}>H</span><span style={{color:COLORS.rose,textShadow:`0 0 20px ${COLORS.rose}66`}}>X</span><span style={{color:COLORS.accent,textShadow:`0 0 20px ${COLORS.accent}55`}}>Connect</span></div>
        <div style={{fontSize:15,color:COLORS.muted,maxWidth:520,margin:"0 auto 8px",lineHeight:1.6}}>Where Healthcare Pros Connect</div>
        <div style={{fontSize:12,color:COLORS.rose,fontWeight:700,marginBottom:46,cursor:"pointer"}} onClick={()=>setShowFounder(true)}>🖤 Black Woman Owned · Meet the Founder →</div>

        {/* Space cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:22,maxWidth:900,margin:"0 auto"}}>
          {Object.values(SPACES).map(sp=>(
            <div key={sp.key} onClick={()=>setActiveSpace(sp.key)} style={{background:`linear-gradient(145deg,${COLORS.card},${sp.color}0a)`,border:`1px solid ${sp.color}${user?.specialty===sp.key?"99":"44"}`,borderRadius:18,padding:"32px 26px",cursor:"pointer",transition:"transform 0.2s,border-color 0.2s",textAlign:"left",position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=sp.color+"99";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=sp.color+(user?.specialty===sp.key?"99":"44");}}>
              {user?.specialty===sp.key&&<div style={{position:"absolute",top:12,right:12,background:sp.color+"22",border:`1px solid ${sp.color}44`,color:sp.color,fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:8,letterSpacing:1}}>YOUR SPACE</div>}
              <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:`radial-gradient(circle,${sp.color}0f 0%,transparent 70%)`,borderRadius:"0 18px 0 0"}}/>
              <div style={{fontSize:36,marginBottom:14}}>{sp.icon}</div>
              <div style={{fontSize:18,fontWeight:800,color:sp.color,marginBottom:6}}>{sp.label}</div>
              <div style={{fontSize:12,color:COLORS.muted,marginBottom:14,lineHeight:1.5}}>{sp.subtitle}</div>
              <div style={{fontSize:11,color:"#a0b4cc",marginBottom:20}}>{sp.tagline}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
                {["Jobs","Network","Chat","Resources","News"].map(f=><span key={f} style={{background:sp.color+"15",color:sp.color,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600,border:`1px solid ${sp.color}33`}}>{f}</span>)}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:COLORS.green,boxShadow:`0 0 6px ${COLORS.green}`}}/>
                <span style={{fontSize:12,color:COLORS.muted}}>Live job feed · Updated daily</span>
                <span style={{color:sp.color,fontSize:18,marginLeft:"auto"}}>→</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:40,background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,marginBottom:4}}>💬 Compliance Collective — Community Chat</div>
            <div style={{color:COLORS.muted,fontSize:13}}>All professionals together — main chat, networking, job postings & compliance</div>
          </div>
          <button onClick={()=>toast2("Community chat coming at full launch! 🚀")} style={{background:`linear-gradient(135deg,${COLORS.rose},${COLORS.accent})`,border:"none",color:"#fff",padding:"10px 22px",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:700}}>Join the Community →</button>
        </div>
      </div>

      {showSearch&&<GlobalSearch onSelectSpace={setActiveSpace} onClose={()=>setShowSearch(false)}/>}
      {upgradeFeature&&<UpgradeModal feature={upgradeFeature} onClose={()=>setUpgradeFeature(null)} onUpgrade={handleUpgrade}/>}
      {toast&&<div style={{position:"fixed",bottom:26,left:"50%",transform:"translateX(-50%)",background:COLORS.green+"22",border:`1px solid ${COLORS.green}`,color:COLORS.green,padding:"9px 22px",borderRadius:10,fontSize:13,fontWeight:700,zIndex:300}}>{toast}</div>}
    </div>
  );
}
