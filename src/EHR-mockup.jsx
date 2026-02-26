import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

/* ═══════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════ */
const I = {
  Users: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Dashboard: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/></svg>,
  Clipboard: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>,
  Chat: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>,
  Settings: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Search: ({ c = "#999" }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Doc: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Gift: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/></svg>,
  Support: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Sparkle: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  ChevRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  TrendUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  TrendDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>,
  Alert: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
  Heart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Activity: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  Mic: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
  Print: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>,
  Share: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>,
  Pause: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  Eye: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Calendar: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Dots: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>,
  HelpCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  ArrowUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  Grid: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  Page: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Clock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Warning: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
};

const AudioWave = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 2, height: 20 }}>
    {[10,16,8,18,12,20,14,10,16,12,18,8,14,20,10].map((h, i) => (
      <div key={i} style={{ width: 2.5, height: h, backgroundColor: "#7C3AED", borderRadius: 2, opacity: 0.7 }} />
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   SHARED DATA
   ═══════════════════════════════════════════ */
const patients = [
  { id:1, name:"Carlos Eduardo Silva", age:58, gender:"M", lastVisit:"04/05/2025", consultations:3, documents:5, conditions:["Diabetes Tipo 2","Hipertensão"], avatar:"CS" },
  { id:2, name:"Maria Aparecida Santos", age:72, gender:"F", lastVisit:"28/04/2025", consultations:7, documents:12, conditions:["DPOC","ICC"], avatar:"MS" },
  { id:3, name:"João Pedro Oliveira", age:45, gender:"M", lastVisit:"20/04/2025", consultations:2, documents:3, conditions:["Lombalgia crônica"], avatar:"JO" },
  { id:4, name:"Ana Clara Ferreira", age:34, gender:"F", lastVisit:"15/04/2025", consultations:5, documents:8, conditions:["Asma","Rinite alérgica"], avatar:"AF" },
  { id:5, name:"Roberto Mendes Lima", age:67, gender:"M", lastVisit:"10/04/2025", consultations:10, documents:18, conditions:["Diabetes Tipo 2","Neuropatia","HAS"], avatar:"RL" },
  { id:6, name:"Fernanda Costa Pereira", age:29, gender:"F", lastVisit:"08/04/2025", consultations:1, documents:2, conditions:["Ansiedade"], avatar:"FP" },
  { id:7, name:"José Antônio Barbosa", age:81, gender:"M", lastVisit:"01/04/2025", consultations:15, documents:24, conditions:["Fibrilação Atrial","HAS","DM2"], avatar:"JB" },
  { id:8, name:"Luciana Martins Rocha", age:52, gender:"F", lastVisit:"28/03/2025", consultations:4, documents:6, conditions:["Hipotireoidismo","Depressão"], avatar:"LR" },
];
const patientConsultations = {
  1: [
    { date:"04/05/2025", duration:"02m 05s", docs:["Anamnese padrão","Atestado Médico"], summary:"Queixa de dor nos pés, falta de ar. Revisão de medicações." },
    { date:"15/01/2025", duration:"08m 30s", docs:["Anamnese padrão"], summary:"Retorno diabetes. Ajuste de glifagem." },
    { date:"03/08/2024", duration:"05m 22s", docs:["Anamnese padrão","Pedido de exames"], summary:"Consulta de rotina. Solicitação de HbA1c e perfil lipídico." },
  ],
};
const transcription = [
  { time:"00m 04s", text:"e aí doutor tá joia" },
  { time:"00m 08s", text:"e é isso doutor luca como é que vai tudo em paz mas rapaz eu tô com uma dor no pé" },
  { time:"00m 15s", text:"agora quando eu tô indo dormir eu quando acordo também dói aquela primeira pisada do dia assim mas eu não sei o que é que é faz uma semana já uns meses na verdade" },
  { time:"00m 26s", text:"vamos lembrar então você tem pressão alta e diabetes né" },
  { time:"00m 31s", text:"é isso eu tô eu tomo losartana hidrocortiazida e aquele lá para o glifagem né" },
  { time:"00m 38s", text:"Ah então tá bom quando que começou essa dor no pé eu acho que começou faz uns seis meses já mas começou a incomodar faz uns dois" },
  { time:"00m 49s", text:"Ah tá bom e como é que essa dor ela pulsa ela queima uma dor aqui na planta do pé sabe aqui na" },
  { time:"00m 57s", text:"sola do pé quando eu vou dar a primeira pisada do dia dói mais assim aí vai melhorando quando" },
];
const chartMonthly = [{month:"Set",v:18},{month:"Out",v:22},{month:"Nov",v:28},{month:"Dez",v:15},{month:"Jan",v:32},{month:"Fev",v:25},{month:"Mar",v:30},{month:"Abr",v:27},{month:"Mai",v:12}];
const chartConditions = [{name:"Diabetes",value:34,color:"#7C3AED"},{name:"Hipertensão",value:42,color:"#9333EA"},{name:"DPOC",value:12,color:"#A855F7"},{name:"Depressão",value:18,color:"#C084FC"},{name:"Asma",value:15,color:"#D8B4FE"},{name:"Outros",value:28,color:"#EDE9FE"}];
const chartAge = [{f:"18-30",m:8,w:12},{f:"31-45",m:15,w:18},{f:"46-60",m:22,w:20},{f:"61-75",m:18,w:14},{f:"76+",m:10,w:8}];
const chartHba1c = [{month:"Out",v:8.2},{month:"Nov",v:7.9},{month:"Dez",v:7.6},{month:"Jan",v:7.8},{month:"Fev",v:7.3},{month:"Mar",v:7.1},{month:"Abr",v:7.0},{month:"Mai",v:6.8}];
const riskStrat = [{risk:"Baixo",count:45,color:"#22C55E"},{risk:"Moderado",count:32,color:"#F59E0B"},{risk:"Alto",count:18,color:"#EF4444"},{risk:"Crítico",count:5,color:"#991B1B"}];
const anamneseModels = [{name:"Anamnese padrão",desc:"Gera um registro clínico padrão",selected:true},{name:"Atestado Médico",desc:"Modelo de atestado médico com identificação do paciente"},{name:"Avaliação Pré-Anestésica",desc:"Indicado para anestesistas"},{name:"Cardiologia",desc:"Informações de exame físico e scores cardiológicos"},{name:"Cirurgia",desc:"Atende os cirurgiões de todas as áreas"},{name:"Coloproctologia",desc:"Foco em avaliação intestinal e anorretal"}];
const docAux = [{name:"Atestado",desc:"Atestado médico de afastamento"},{name:"Compartilhar resumo",desc:"Resumo para compartilhar"},{name:"Encaminhamento",desc:"Encaminhamento a outras especialidades"},{name:"Pedido de exames",desc:"Solicitação de exames"},{name:"Prescrição",desc:"Medicamentos prescritos (receituário)"},{name:"Resumo clínico",desc:"Em linguagem leiga para o paciente"}];
const mockReport = {
  title:"Análise Populacional: Pacientes Diabéticos com HAS",
  summary:"Dos 100 pacientes ativos, 28 apresentam comorbidade Diabetes + Hipertensão. A média de HbA1c desse grupo caiu de 8.2% para 6.8% nos últimos 8 meses, indicando boa adesão ao tratamento. Entretanto, 5 pacientes mantêm HbA1c > 9% e requerem intervenção imediata.",
  alert:"3 pacientes com DM2 + HAS não realizam consulta há mais de 90 dias. Risco elevado de complicações microvasculares.",
  insight:"Pacientes que utilizam combinação Losartana + Metformina apresentam melhor controle pressórico (média 128/82 mmHg) vs. outras combinações (média 142/91 mmHg). Considere padronizar o protocolo.",
  recs:["Agendar retorno urgente para os 5 pacientes com HbA1c > 9%","Implementar rastreio de neuropatia diabética nos 28 pacientes com DM2","Considerar inclusão de ISGLT2 nos 8 pacientes com DM2 + HAS + IMC > 30","Solicitar fundo de olho para os 15 pacientes sem avaliação oftalmológica no último ano"],
};

/* ═══════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════ */
const NavIcon = ({ icon, active, onClick, badge }) => (
  <div onClick={onClick} style={{
    width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center",
    borderRadius:10, backgroundColor: active ? "#F3F0FF" : "transparent", cursor:"pointer",
    color: active ? "#7C3AED" : "#666", position:"relative", transition:"all 0.15s"
  }}>
    {icon}
    {badge && <div style={{ position:"absolute",top:4,right:4,width:8,height:8,borderRadius:"50%",backgroundColor:"#EF4444",border:"2px solid #fff" }} />}
  </div>
);

const SidebarBottom = () => (
  <div style={{ borderTop:"1px solid #EBEBEB", padding:"8px 12px" }}>
    <div style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 4px",cursor:"pointer" }}>
      <div style={{ position:"relative" }}><I.Bell /><div style={{ position:"absolute",top:-2,right:-2,width:7,height:7,backgroundColor:"#22C55E",borderRadius:"50%",border:"1.5px solid #fff" }}/></div>
    </div>
    <div style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 4px",cursor:"pointer" }}>
      <I.Gift /><span style={{ fontSize:13,color:"#333" }}>Indique e ganhe</span>
      <span style={{ fontSize:10,fontWeight:700,color:"#22C55E",backgroundColor:"#F0FDF4",padding:"2px 6px",borderRadius:4 }}>NOVO</span>
    </div>
    <div style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 4px",cursor:"pointer" }}>
      <I.Support /><span style={{ fontSize:13,color:"#333" }}>Ajuda e suporte</span>
    </div>
    <div style={{ background:"linear-gradient(135deg,#7C3AED,#9333EA)",borderRadius:10,padding:"12px 14px",marginTop:8,marginBottom:8,cursor:"pointer" }}>
      <div style={{ fontWeight:700,fontSize:13,color:"#fff" }}>Desbloquear plano PRO</div>
      <div style={{ fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2 }}>Resta 1 dia de teste</div>
    </div>
    <div style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 4px",borderTop:"1px solid #EBEBEB",cursor:"pointer" }}>
      <div style={{ width:32,height:32,borderRadius:"50%",backgroundColor:"#E0D4F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#7C3AED",position:"relative" }}>
        LB<div style={{ position:"absolute",bottom:-2,right:-2,fontSize:7,backgroundColor:"#7C3AED",color:"#fff",padding:"1px 3px",borderRadius:3,fontWeight:700 }}>TRIAL</div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:600,fontSize:13 }}>Luca Becari</div>
        <div style={{ fontSize:11,color:"#888" }}>becariluca@gmail.com</div>
      </div>
      <I.ChevRight />
    </div>
  </div>
);

const ChatInput = ({ placeholder, value, onChange }) => (
  <div style={{ padding:"12px 16px", borderTop:"1px solid #EBEBEB" }}>
    <div style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 14px",border:"1px solid #E0E0E0",borderRadius:24,backgroundColor:"#F7F7F8" }}>
      <input value={value||""} onChange={onChange} placeholder={placeholder} style={{ flex:1,border:"none",backgroundColor:"transparent",outline:"none",fontSize:13,fontFamily:"inherit" }}/>
      <div style={{ width:30,height:30,borderRadius:"50%",backgroundColor:"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
        <I.ArrowUp />
      </div>
    </div>
    <div style={{ textAlign:"center",fontSize:11,color:"#999",marginTop:6 }}>O Charcot pode cometer erros. Sempre confira as respostas.</div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function VOAApp() {
  const [page, setPage] = useState("dashboard");
  const [rightPanel, setRightPanel] = useState(null);

  // Nova Consulta
  const [consultaMode, setConsultaMode] = useState("new"); // new | active
  const [modalidade, setModalidade] = useState("presencial");
  const [docTab, setDocTab] = useState("anamneses");

  // Pacientes
  const [patSearch, setPatSearch] = useState("");
  const [selectedPats, setSelectedPats] = useState([]);
  const [expandedPat, setExpandedPat] = useState(null);
  const [patFilter, setPatFilter] = useState("");
  const [patSort, setPatSort] = useState("lastVisit");

  // Dashboard
  const [dashFilters, setDashFilters] = useState({ condition:"",ageRange:"",gender:"",riskLevel:"",period:"6m" });
  const [dashPrompt, setDashPrompt] = useState("");
  const [reportState, setReportState] = useState("config"); // config | loading | done

  const filteredPatients = useMemo(() => {
    let r = patients;
    if (patSearch) { const s = patSearch.toLowerCase(); r = r.filter(p => p.name.toLowerCase().includes(s) || p.conditions.some(c => c.toLowerCase().includes(s))); }
    if (patFilter) r = r.filter(p => p.conditions.some(c => c.toLowerCase().includes(patFilter.toLowerCase())));
    return r.sort((a,b) => patSort === "name" ? a.name.localeCompare(b.name) : patSort === "consultations" ? b.consultations - a.consultations : 0);
  }, [patSearch, patFilter, patSort]);

  const togglePat = (id) => setSelectedPats(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const showSidebar = rightPanel === null;

  const handleGenReport = () => {
    setReportState("loading");
    setTimeout(() => setReportState("done"), 2000);
  };

  return (
    <div style={{ display:"flex", height:"100vh", width:"100%", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", backgroundColor:"#F7F7F8", color:"#1a1a1a", fontSize:14, overflow:"hidden" }}>

      {/* ═══ ICON RAIL ═══ */}
      <div style={{ width:52, minWidth:52, backgroundColor:"#fff", borderRight:"1px solid #EBEBEB", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:14, gap:2 }}>
        <div style={{ marginBottom:14, cursor:"pointer" }}>
          <svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="15" fill="#7C3AED"/><text x="15" y="20" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="sans-serif">🎙</text></svg>
        </div>
        <NavIcon active={page==="dashboard"} onClick={()=>{setPage("dashboard");setRightPanel(null);}} icon={<I.Dashboard />} />
        <NavIcon active={page==="patients"} onClick={()=>{setPage("patients");setRightPanel(null);}} icon={<I.Users />} />
        <NavIcon active={page==="consulta"} onClick={()=>{setPage("consulta");setRightPanel(null);setConsultaMode("new");}} icon={<I.Clipboard />} />
        <NavIcon active={page==="charcot"} onClick={()=>{setPage("charcot");setRightPanel(null);}} icon={<I.Chat />} />
        <div style={{ flex:1 }} />
        <NavIcon icon={<I.Settings />} />
        <div style={{ width:34,height:34,borderRadius:"50%",backgroundColor:"#E0D4F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#7C3AED",marginBottom:12,cursor:"pointer",position:"relative" }}>
          LB<div style={{ position:"absolute",bottom:-2,right:-2,fontSize:6,backgroundColor:"#7C3AED",color:"#fff",padding:"1px 3px",borderRadius:3,fontWeight:700 }}>TRIAL</div>
        </div>
      </div>

      {/* ═══ SIDEBAR ═══ */}
      {showSidebar && (
        <div style={{ width:250, minWidth:250, backgroundColor:"#fff", borderRight:"1px solid #EBEBEB", display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"16px 14px 10px", display:"flex", alignItems:"center", gap:6 }}>
            <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#7C3AED"/><text x="14" y="19" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">🎙</text></svg>
            <span style={{ fontWeight:700,fontSize:20,letterSpacing:-0.5 }}>voa</span>
          </div>

          {/* Nav items */}
          <div style={{ padding:"0 10px" }}>
            {[
              { key:"dashboard", label:"Dashboard", icon:<I.Dashboard s={16}/> },
              { key:"patients", label:"Meus Pacientes", icon:<I.Users s={16}/> },
              { key:"consulta", label:"Nova Consulta", icon:<I.Clipboard s={16}/> },
              { key:"charcot", label:"Charcot IA", icon:<I.Chat s={16}/> },
            ].map(n => (
              <div key={n.key} onClick={()=>{setPage(n.key);if(n.key==="consulta")setConsultaMode("new");}} style={{
                display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,cursor:"pointer",marginBottom:2,
                backgroundColor:page===n.key?"#F3F0FF":"transparent",
                color:page===n.key?"#7C3AED":"#555",fontWeight:page===n.key?600:500,fontSize:14,transition:"all 0.15s"
              }}>{n.icon} {n.label}</div>
            ))}
          </div>

          {/* Page-specific sidebar content */}
          <div style={{ flex:1, overflow:"auto", padding:"12px 10px 0" }}>
            {page === "dashboard" && (
              <>
                <div style={{ fontSize:11,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Alertas</div>
                {[{t:"5 pacientes com HbA1c > 9%",s:"high"},{t:"3 sem consulta há 90+ dias",s:"medium"},{t:"12 exames pendentes",s:"low"}].map((a,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"9px",borderRadius:8,marginBottom:4,backgroundColor:a.s==="high"?"#FEF2F2":a.s==="medium"?"#FFFBEB":"#F0FDF4" }}>
                    <div style={{ color:a.s==="high"?"#EF4444":a.s==="medium"?"#F59E0B":"#22C55E",marginTop:1 }}><I.Alert s={14}/></div>
                    <span style={{ fontSize:12,color:"#555",lineHeight:1.4 }}>{a.t}</span>
                  </div>
                ))}
              </>
            )}
            {page === "patients" && (
              <>
                <div style={{ fontSize:11,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Recentes</div>
                {patients.slice(0,5).map(p=>(
                  <div key={p.id} onClick={()=>{setExpandedPat(expandedPat===p.id?null:p.id)}} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:8,cursor:"pointer",marginBottom:2,backgroundColor:expandedPat===p.id?"#F9F7FF":"transparent" }}>
                    <div style={{ width:26,height:26,borderRadius:"50%",flexShrink:0,backgroundColor:"#F0EBF8",color:"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700 }}>{p.avatar}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.name}</div>
                      <div style={{ fontSize:10,color:"#999" }}>{p.lastVisit}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {page === "consulta" && (
              <>
                <div style={{ fontSize:11,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Hoje</div>
                <div onClick={()=>setConsultaMode("new")} style={{ padding:"9px 10px",borderRadius:8,cursor:"pointer",backgroundColor:consultaMode==="new"?"#F3F0FF":"transparent",marginBottom:4 }}>
                  <div style={{ fontWeight:600,fontSize:13 }}>Nova Consulta</div><div style={{ fontSize:11,color:"#888",marginTop:1 }}>11:21</div>
                </div>
                <div style={{ fontSize:11,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8,marginTop:12 }}>04/05/2025</div>
                <div onClick={()=>setConsultaMode("active")} style={{ padding:"9px 10px",borderRadius:8,cursor:"pointer",backgroundColor:consultaMode==="active"?"#F3F0FF":"transparent" }}>
                  <div style={{ fontWeight:600,fontSize:13 }}>carlos</div>
                  <div style={{ fontSize:11,color:"#888",marginTop:1,display:"flex",alignItems:"center",gap:3 }}>12:44 • 02m 05s • <I.Page /> 2 • <I.Clock /> 1</div>
                </div>
              </>
            )}
            {page === "charcot" && (
              <>
                <div style={{ fontSize:11,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Hoje</div>
                <div style={{ padding:"9px 10px",borderRadius:8,cursor:"pointer" }}>
                  <div style={{ fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>Identificação de Red Flags Clíni...</div>
                  <div style={{ fontSize:11,color:"#888",marginTop:1,display:"flex",alignItems:"center",gap:3 }}>10:51 • <I.Grid /></div>
                </div>
              </>
            )}
          </div>
          <SidebarBottom />
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* ──────── DASHBOARD ──────── */}
        {page === "dashboard" && (
          <>
            <div style={{ padding:"20px 28px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",backgroundColor:"#fff",borderBottom:"1px solid #EBEBEB" }}>
              <div>
                <h1 style={{ fontSize:24,fontWeight:700,margin:0,letterSpacing:-0.5 }}>Dashboard</h1>
                <p style={{ fontSize:13,color:"#888",margin:"4px 0 0" }}>Visão geral da saúde populacional • Atualizado há 2h</p>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <select style={{ padding:"8px 14px",borderRadius:8,border:"1px solid #E0E0E0",backgroundColor:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
                  <option>Últimos 6 meses</option><option>Últimos 3 meses</option><option>Último ano</option>
                </select>
                <button onClick={()=>{ setRightPanel("dashCharcot"); setReportState("config"); }} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 18px",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600,background:"linear-gradient(135deg,#9333EA,#7C3AED)",color:"#fff" }}>
                  <I.Sparkle s={16}/> Gerar relatório com Charcot
                </button>
              </div>
            </div>
            <div style={{ flex:1,overflow:"auto",padding:"20px 28px" }}>
              {/* KPIs */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
                {[{l:"Total Pacientes",v:"100",c:"+8",up:true,icon:<I.Users s={18}/>,cl:"#7C3AED"},{l:"Consultas / Mês",v:"27",c:"+12%",up:true,icon:<I.Activity />,cl:"#3B82F6"},{l:"HbA1c Média (DM2)",v:"6.8%",c:"-0.4",up:true,icon:<I.Heart />,cl:"#22C55E"},{l:"Pacientes em Risco",v:"5",c:"+2",up:false,icon:<I.Alert />,cl:"#EF4444"}].map((card,i)=>(
                  <div key={i} style={{ backgroundColor:"#fff",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8",position:"relative",overflow:"hidden" }}>
                    <div style={{ position:"absolute",top:16,right:16,width:36,height:36,borderRadius:10,backgroundColor:card.cl+"12",color:card.cl,display:"flex",alignItems:"center",justifyContent:"center" }}>{card.icon}</div>
                    <div style={{ fontSize:12,color:"#888",marginBottom:6,fontWeight:500 }}>{card.l}</div>
                    <div style={{ fontSize:28,fontWeight:700,letterSpacing:-1,marginBottom:6 }}>{card.v}</div>
                    <div style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:card.up&&card.l!=="Pacientes em Risco"?"#22C55E":"#EF4444" }}>
                      {card.up&&card.l!=="Pacientes em Risco"?<I.TrendUp />:<I.TrendDown />}
                      <span style={{ fontWeight:600 }}>{card.c}</span><span style={{ color:"#999" }}>vs. mês anterior</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Charts Row 1 */}
              <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:24 }}>
                <div style={{ backgroundColor:"#fff",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8" }}>
                  <div style={{ fontSize:15,fontWeight:700,marginBottom:16 }}>Consultas por Mês</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartMonthly}>
                      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/><XAxis dataKey="month" tick={{fontSize:12,fill:"#999"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:12,fill:"#999"}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius:8,border:"1px solid #E8E8E8",fontSize:13}}/>
                      <Area type="monotone" dataKey="v" stroke="#7C3AED" strokeWidth={2.5} fill="url(#pg)" dot={{fill:"#7C3AED",r:4}} name="Consultas"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ backgroundColor:"#fff",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8" }}>
                  <div style={{ fontSize:15,fontWeight:700,marginBottom:12 }}>Condições Prevalentes</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart><Pie data={chartConditions} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">{chartConditions.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip contentStyle={{borderRadius:8,border:"1px solid #E8E8E8",fontSize:12}}/></PieChart>
                  </ResponsiveContainer>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:8 }}>
                    {chartConditions.map((c,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:11}}><div style={{width:8,height:8,borderRadius:2,backgroundColor:c.color}}/><span style={{color:"#666"}}>{c.name}</span><span style={{fontWeight:700,color:"#333"}}>{c.value}</span></div>))}
                  </div>
                </div>
              </div>
              {/* Charts Row 2 */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24 }}>
                <div style={{ backgroundColor:"#fff",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8" }}>
                  <div style={{ fontSize:15,fontWeight:700,marginBottom:12 }}>Pirâmide Etária</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartAge}><CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/><XAxis dataKey="f" tick={{fontSize:11,fill:"#999"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:"#999"}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius:8,fontSize:12}}/><Bar dataKey="m" fill="#7C3AED" radius={[4,4,0,0]} name="Masc"/><Bar dataKey="w" fill="#C084FC" radius={[4,4,0,0]} name="Fem"/></BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ backgroundColor:"#fff",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8" }}>
                  <div style={{ fontSize:15,fontWeight:700,marginBottom:4 }}>Evolução HbA1c Média</div>
                  <div style={{ fontSize:12,color:"#22C55E",fontWeight:600,marginBottom:12 }}>▼ Tendência de queda</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartHba1c}><CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/><XAxis dataKey="month" tick={{fontSize:11,fill:"#999"}} axisLine={false} tickLine={false}/><YAxis domain={[6,9]} tick={{fontSize:11,fill:"#999"}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius:8,fontSize:12}}/><Line type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={2.5} dot={{fill:"#22C55E",r:4}} name="HbA1c %"/></LineChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ backgroundColor:"#fff",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8" }}>
                  <div style={{ fontSize:15,fontWeight:700,marginBottom:16 }}>Estratificação de Risco</div>
                  {riskStrat.map((r,i)=>{const total=riskStrat.reduce((s,x)=>s+x.count,0);const pct=Math.round((r.count/total)*100);return(
                    <div key={i} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",backgroundColor:r.color}}/><span style={{fontSize:13,fontWeight:500}}>{r.risk}</span></div><span style={{fontSize:13,fontWeight:700}}>{r.count} <span style={{fontWeight:400,color:"#999"}}>({pct}%)</span></span></div><div style={{height:8,backgroundColor:"#F3F3F3",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,backgroundColor:r.color,borderRadius:4}}/></div></div>
                  );})}
                </div>
              </div>
              {/* CTA */}
              <div style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)",borderRadius:16,padding:"28px 32px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <div><div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:6}}>Quer insights mais profundos?</div><div style={{fontSize:14,color:"rgba(255,255,255,0.8)"}}>O Charcot analisa padrões e gera relatórios personalizados com recomendações baseadas em evidência.</div></div>
                <button onClick={()=>{setRightPanel("dashCharcot");setReportState("config");}} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 24px",border:"2px solid rgba(255,255,255,0.3)",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:700,backgroundColor:"rgba(255,255,255,0.15)",color:"#fff",flexShrink:0,fontFamily:"inherit"}}><I.Sparkle s={18}/> Abrir Charcot</button>
              </div>
            </div>
          </>
        )}

        {/* ──────── PATIENTS ──────── */}
        {page === "patients" && (
          <>
            <div style={{ padding:"20px 28px 0",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div><h1 style={{fontSize:24,fontWeight:700,margin:0,letterSpacing:-0.5}}>Meus Pacientes</h1><p style={{fontSize:13,color:"#888",margin:"4px 0 0"}}>{patients.length} pacientes cadastrados</p></div>
              <div style={{ display:"flex",gap:10 }}>
                {selectedPats.length>0&&(<button onClick={()=>setRightPanel("patCharcot")} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",border:"none",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,background:"linear-gradient(135deg,#9333EA,#7C3AED)",color:"#fff"}}><I.Sparkle s={16}/> Charcot ({selectedPats.length})</button>)}
                <button style={{display:"flex",alignItems:"center",gap:6,padding:"10px 18px",border:"1px solid #7C3AED",borderRadius:10,backgroundColor:"#fff",cursor:"pointer",fontSize:14,fontWeight:600,color:"#7C3AED"}}><I.Plus /> Novo Paciente</button>
              </div>
            </div>
            <div style={{ padding:"16px 28px",display:"flex",alignItems:"center",gap:10 }}>
              <div style={{flex:1,minWidth:240,display:"flex",alignItems:"center",gap:8,padding:"10px 14px",backgroundColor:"#fff",borderRadius:10,border:"1px solid #E0E0E0"}}>
                <I.Search /><input value={patSearch} onChange={e=>setPatSearch(e.target.value)} placeholder="Buscar por nome ou condição..." style={{flex:1,border:"none",outline:"none",fontSize:14,backgroundColor:"transparent",fontFamily:"inherit"}}/>
                {patSearch&&<button onClick={()=>setPatSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:"#999",fontSize:16}}>×</button>}
              </div>
              <select value={patFilter} onChange={e=>setPatFilter(e.target.value)} style={{padding:"10px 14px",borderRadius:10,border:"1px solid #E0E0E0",backgroundColor:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit",minWidth:170}}>
                <option value="">Todas condições</option><option value="Diabetes">Diabetes</option><option value="Hipertensão">Hipertensão</option><option value="DPOC">DPOC</option><option value="Depressão">Depressão</option>
              </select>
              <select value={patSort} onChange={e=>setPatSort(e.target.value)} style={{padding:"10px 14px",borderRadius:10,border:"1px solid #E0E0E0",backgroundColor:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                <option value="lastVisit">Última consulta</option><option value="name">Nome A-Z</option><option value="consultations">Mais consultas</option>
              </select>
            </div>
            {selectedPats.length>0&&(<div style={{margin:"0 28px 8px",padding:"8px 14px",backgroundColor:"#F3F0FF",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:13}}><span style={{color:"#7C3AED",fontWeight:600}}>{selectedPats.length} selecionado{selectedPats.length>1?"s":""}</span><button onClick={()=>setSelectedPats([])} style={{background:"none",border:"none",color:"#7C3AED",cursor:"pointer",fontSize:13,fontWeight:500}}>Limpar</button></div>)}
            <div style={{ flex:1,overflow:"auto",padding:"0 28px 20px" }}>
              <div style={{ backgroundColor:"#fff",borderRadius:12,border:"1px solid #E8E8E8",overflow:"hidden" }}>
                <div style={{display:"grid",gridTemplateColumns:"40px 1fr 55px 110px 80px 80px 110px 40px",padding:"12px 16px",backgroundColor:"#FAFAFA",borderBottom:"1px solid #EBEBEB",fontSize:11,fontWeight:600,color:"#888",textTransform:"uppercase",letterSpacing:0.3,alignItems:"center"}}>
                  <div><input type="checkbox" checked={selectedPats.length===filteredPatients.length&&filteredPatients.length>0} onChange={()=>selectedPats.length===filteredPatients.length?setSelectedPats([]):setSelectedPats(filteredPatients.map(p=>p.id))} style={{width:16,height:16,accentColor:"#7C3AED",cursor:"pointer"}}/></div>
                  <div>Paciente</div><div>Idade</div><div>Última consulta</div><div style={{textAlign:"center"}}>Consultas</div><div style={{textAlign:"center"}}>Docs</div><div>Condições</div><div></div>
                </div>
                {filteredPatients.map(p=>{const isSel=selectedPats.includes(p.id);const isExp=expandedPat===p.id;const cons=patientConsultations[p.id]||[];return(
                  <div key={p.id}>
                    <div style={{display:"grid",gridTemplateColumns:"40px 1fr 55px 110px 80px 80px 110px 40px",padding:"14px 16px",borderBottom:"1px solid #F0F0F0",alignItems:"center",cursor:"pointer",backgroundColor:isSel?"#FAFAFE":isExp?"#FDFCFF":"#fff",transition:"background 0.15s"}}>
                      <div onClick={e=>{e.stopPropagation();togglePat(p.id);}}><input type="checkbox" checked={isSel} readOnly style={{width:16,height:16,accentColor:"#7C3AED",cursor:"pointer"}}/></div>
                      <div onClick={()=>setExpandedPat(isExp?null:p.id)} style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,backgroundColor:isSel?"#7C3AED":"#F0EBF8",color:isSel?"#fff":"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{p.avatar}</div>
                        <div><div style={{fontWeight:600,fontSize:14}}>{p.name}</div><div style={{fontSize:11,color:"#999"}}>{p.gender==="M"?"Masculino":"Feminino"}</div></div>
                      </div>
                      <div onClick={()=>setExpandedPat(isExp?null:p.id)} style={{fontSize:14,color:"#555"}}>{p.age}</div>
                      <div onClick={()=>setExpandedPat(isExp?null:p.id)} style={{fontSize:13,color:"#555",display:"flex",alignItems:"center",gap:4}}><I.Calendar s={12}/> {p.lastVisit}</div>
                      <div onClick={()=>setExpandedPat(isExp?null:p.id)} style={{textAlign:"center",fontSize:14,fontWeight:600}}>{p.consultations}</div>
                      <div onClick={()=>setExpandedPat(isExp?null:p.id)} style={{textAlign:"center",fontSize:14,fontWeight:600}}>{p.documents}</div>
                      <div onClick={()=>setExpandedPat(isExp?null:p.id)} style={{display:"flex",flexWrap:"wrap",gap:3}}>{p.conditions.slice(0,2).map((c,i)=><span key={i} style={{fontSize:9,padding:"2px 6px",borderRadius:4,backgroundColor:"#F3F0FF",color:"#7C3AED",fontWeight:500,whiteSpace:"nowrap"}}>{c}</span>)}{p.conditions.length>2&&<span style={{fontSize:9,color:"#999"}}>+{p.conditions.length-2}</span>}</div>
                      <div onClick={()=>setExpandedPat(isExp?null:p.id)} style={{display:"flex",justifyContent:"center"}}><div style={{transform:isExp?"rotate(90deg)":"rotate(0)",transition:"transform 0.2s",color:"#999"}}><I.ChevRight /></div></div>
                    </div>
                    {isExp&&(<div style={{padding:"0 16px 16px 56px",backgroundColor:"#FDFCFF",borderBottom:"1px solid #E8E8E8"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,paddingTop:8}}>
                        <div style={{fontSize:13,fontWeight:600,color:"#555"}}>Histórico de consultas</div>
                        <button onClick={()=>{if(!selectedPats.includes(p.id))togglePat(p.id);setRightPanel("patCharcot");}} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 14px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,backgroundColor:"#F3F0FF",color:"#7C3AED"}}><I.Sparkle s={12}/> Perguntar ao Charcot</button>
                      </div>
                      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{p.conditions.map((c,i)=><span key={i} style={{fontSize:12,padding:"4px 10px",borderRadius:6,backgroundColor:"#F3F0FF",color:"#7C3AED",fontWeight:500}}>{c}</span>)}</div>
                      {cons.length>0?cons.map((c,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",backgroundColor:"#fff",borderRadius:8,border:"1px solid #EBEBEB",marginBottom:8}}>
                          <div style={{color:"#888",marginTop:2}}><I.Calendar s={16}/></div>
                          <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:13,fontWeight:600}}>{c.date}</span><span style={{fontSize:11,color:"#999"}}>{c.duration}</span></div><div style={{fontSize:13,color:"#555",marginBottom:6}}>{c.summary}</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{c.docs.map((d,j)=><span key={j} style={{fontSize:11,padding:"3px 8px",borderRadius:4,backgroundColor:"#F0F0F0",color:"#666",display:"flex",alignItems:"center",gap:4}}><I.Doc s={10}/> {d}</span>)}</div></div>
                          <button style={{background:"none",border:"none",cursor:"pointer",color:"#7C3AED",display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:500}}><I.Eye /> Ver</button>
                        </div>
                      )):<div style={{fontSize:13,color:"#999",padding:12,textAlign:"center"}}>Sem histórico detalhado disponível.</div>}
                    </div>)}
                  </div>
                );})}
              </div>
            </div>
          </>
        )}

        {/* ──────── CONSULTA ──────── */}
        {page === "consulta" && consultaMode === "new" && (
          <>
            <div style={{ padding:"24px 40px 0" }}><div style={{display:"flex",alignItems:"center",gap:8}}><h1 style={{fontSize:26,fontWeight:700,margin:0,letterSpacing:-0.5}}>Nova Consulta</h1><I.Edit /></div></div>
            <div style={{flex:1,display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"40px 40px"}}>
              <div style={{width:"100%",maxWidth:520,backgroundColor:"#fff",borderRadius:16,padding:32,border:"1px solid #E8E8E8",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                <div style={{marginBottom:24}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}><span style={{fontSize:14,fontWeight:600}}>Modalidade da consulta</span><I.HelpCircle /></div>
                  <div style={{display:"flex",backgroundColor:"#F7F7F8",borderRadius:10,padding:3,border:"1px solid #E8E8E8"}}>
                    {["presencial","telemedicina"].map(m=>(
                      <button key={m} onClick={()=>setModalidade(m)} style={{flex:1,padding:"10px 0",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:500,transition:"all 0.2s",backgroundColor:modalidade===m?"#fff":"transparent",color:modalidade===m?"#1a1a1a":"#999",boxShadow:modalidade===m?"0 1px 3px rgba(0,0,0,0.08)":"none",textTransform:"capitalize"}}>{m}</button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:24}}><label style={{fontSize:14,fontWeight:600,display:"block",marginBottom:8}}>Contexto do paciente</label><textarea placeholder="Preencha com informações clínicas: medicamentos, prontuários anteriores ou exames." style={{width:"100%",minHeight:120,padding:14,border:"1px solid #E0E0E0",borderRadius:10,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.5,boxSizing:"border-box"}}/></div>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",border:"1px solid #E0E0E0",borderRadius:12,marginBottom:20}}>
                  <div style={{color:"#7C3AED"}}><I.Mic /></div><AudioWave />
                  <div style={{flex:1,marginLeft:4}}><div style={{fontWeight:600,fontSize:14}}>LB Airpods</div><div style={{fontSize:12,color:"#888"}}>Captando áudio</div></div>
                  <button style={{background:"none",border:"none",color:"#7C3AED",fontWeight:600,fontSize:14,cursor:"pointer"}}>Alterar</button>
                </div>
                <button onClick={()=>setConsultaMode("active")} style={{width:"100%",padding:14,backgroundColor:"#7C3AED",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><I.Mic /> Iniciar consulta</button>
              </div>
            </div>
          </>
        )}
        {page === "consulta" && consultaMode === "active" && (
          <>
            <div style={{padding:"16px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><h1 style={{fontSize:24,fontWeight:700,margin:0,letterSpacing:-0.5}}>carlos</h1><I.Edit /></div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",border:"1px solid #E0E0E0",borderRadius:8,backgroundColor:"#fff",cursor:"pointer",fontSize:13,fontWeight:500}}><I.Print /> Assinar e imprimir</button>
                <button style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",border:"1px solid #E0E0E0",borderRadius:8,backgroundColor:"#fff",cursor:"pointer",fontSize:13,fontWeight:500}}><I.Share /> Compartilhar</button>
              </div>
            </div>
            <div style={{padding:"12px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:0}}>
                {["Informações","Contexto da consulta","Anamnese padrão","Atestado Médico"].map((t,i)=>(<button key={i} style={{padding:"10px 16px",border:"none",borderBottom:i===1?"2px solid #7C3AED":"2px solid transparent",backgroundColor:"transparent",cursor:"pointer",fontSize:14,fontWeight:i===1?600:400,color:i===1?"#7C3AED":"#666",display:"flex",alignItems:"center",gap:4}}>{t} {(i===2||i===3)&&<I.ChevDown />}</button>))}
                <button onClick={()=>setRightPanel("gerarDoc")} style={{width:28,height:28,borderRadius:"50%",border:"1px solid #E0E0E0",backgroundColor:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#666",marginLeft:4}}><I.Plus /></button>
              </div>
              <button onClick={()=>setRightPanel("consultaCharcot")} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 18px",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600,background:"linear-gradient(135deg,#9333EA,#7C3AED)",color:"#fff"}}><I.Sparkle s={16}/> Pergunte ao Charcot</button>
            </div>
            <div style={{flex:1,display:"flex",overflow:"hidden",padding:"16px 24px 0"}}>
              <div style={{flex:"0 0 45%",display:"flex",flexDirection:"column",paddingRight:12,overflow:"auto"}}>
                <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Contexto do paciente</div>
                <div style={{border:"1px dashed #D0D0D0",borderRadius:8,padding:10,textAlign:"center",color:"#888",fontSize:13,cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><I.Upload /> Adicionar arquivos</div>
                <div style={{fontSize:14,lineHeight:1.6}}>paciente hipertenso e diabetico de longa data, fumante, queixa de dor nos pes ao dormir e falta de ar</div>
              </div>
              <div style={{flex:1,display:"flex",flexDirection:"column",paddingLeft:12,borderLeft:"1px solid #EBEBEB",overflow:"auto"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div style={{fontSize:14,fontWeight:600}}>Transcrição da consulta</div>
                  <span style={{fontSize:11,fontWeight:700,color:"#7C3AED",border:"1px solid #7C3AED",borderRadius:10,padding:"2px 10px"}}>BETA</span>
                </div>
                {transcription.map((t,i)=>(<div key={i} style={{marginBottom:16}}><div style={{fontSize:12,color:"#999",marginBottom:4}}>{t.time}</div>{t.text&&<div style={{fontSize:14,lineHeight:1.5}}>{t.text}</div>}</div>))}
              </div>
            </div>
            <div style={{padding:"12px 24px",borderTop:"1px solid #EBEBEB",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:12,backgroundColor:"#fff"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,color:"#666",fontSize:13}}><I.Pause /> 02m 05s</div>
              <button style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",border:"1px solid #E0E0E0",borderRadius:8,backgroundColor:"#fff",cursor:"pointer",fontSize:13,fontWeight:500}}><I.Mic s={14}/> Retomar gravação</button>
              <button onClick={()=>setRightPanel("gerarDoc")} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600,background:"linear-gradient(135deg,#9333EA,#7C3AED)",color:"#fff"}}><I.Sparkle s={16}/> Gerar documento</button>
              <button style={{width:32,height:32,borderRadius:8,border:"1px solid #E0E0E0",backgroundColor:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><I.Dots /></button>
            </div>
          </>
        )}

        {/* ──────── CHARCOT CHAT ──────── */}
        {page === "charcot" && (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",maxWidth:640,width:"100%",padding:"0 24px"}}>
              <h1 style={{fontSize:28,fontWeight:700,margin:"0 0 32px 0",letterSpacing:-0.5,textAlign:"center"}}>Como o <span style={{color:"#7C3AED"}}>Charcot</span> pode te ajudar?</h1>
              <div style={{width:"100%",display:"flex",alignItems:"center",padding:"14px 14px 14px 20px",border:"1px solid #E0E0E0",borderRadius:28,backgroundColor:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <input placeholder="Escreva para o Charcot o que você precisa" style={{flex:1,border:"none",backgroundColor:"transparent",outline:"none",fontSize:15,fontFamily:"inherit"}}/>
                <div style={{width:36,height:36,borderRadius:"50%",backgroundColor:"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><I.ArrowUp /></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginTop:16}}>
                {["Qual o tratamento recomendado para...","Explique este diagnóstico"].map((s,i)=>(
                  <button key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 18px",border:"1px solid #E8E8E8",borderRadius:20,backgroundColor:"#fff",cursor:"pointer",fontSize:13,color:"#555",fontFamily:"inherit"}}><I.Sparkle s={14}/> {s}</button>
                ))}
              </div>
            </div>
            <div style={{position:"absolute",bottom:20,left:0,right:0,textAlign:"center",fontSize:13,color:"#999"}}>O Charcot pode cometer erros. Sempre confira as respostas.</div>
          </div>
        )}
      </div>

      {/* ═══ RIGHT PANELS ═══ */}

      {/* Consulta Charcot */}
      {rightPanel === "consultaCharcot" && (
        <div style={{width:380,minWidth:380,borderLeft:"1px solid #EBEBEB",backgroundColor:"#fff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid #EBEBEB",display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setRightPanel(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#666",display:"flex"}}><I.Close /></button>
            <div style={{flex:1,fontSize:14,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Identificação de Red Flags Clínicas...</div>
            <button style={{background:"none",border:"none",cursor:"pointer",color:"#666",display:"flex"}}><I.Refresh /></button>
          </div>
          <div style={{padding:"8px 16px",display:"flex",alignItems:"center",gap:6,backgroundColor:"#F0FDF4",fontSize:12,color:"#16A34A"}}><div style={{width:8,height:8,borderRadius:"50%",backgroundColor:"#22C55E"}}/>Este chat é referente à consulta atual</div>
          <div style={{flex:1,overflow:"auto",padding:16}}>
            <div style={{display:"flex",gap:10,marginBottom:20}}>
              <div style={{width:28,height:28,borderRadius:"50%",backgroundColor:"#E0D4F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#7C3AED",flexShrink:0}}>LB</div>
              <div><div style={{fontSize:12,fontWeight:600,color:"#888",marginBottom:4}}>Você</div><div style={{fontSize:14,lineHeight:1.5}}>Quais red flags relevantes devo checar neste caso?</div></div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{width:28,height:28,borderRadius:"50%",backgroundColor:"#22C55E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>IA</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:"#888",marginBottom:8}}>Charcot</div>
                <div style={{fontSize:16,fontWeight:700,marginBottom:12}}>Red Flags a Serem Checadas</div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>1. Red Flags Neurológicas e Vasculares</div>
                <div style={{paddingLeft:12}}>
                  <div style={{marginBottom:12,fontSize:13,lineHeight:1.6}}>○ <strong>Perda de sensibilidade protetora</strong> → risco de úlcera plantar <span style={{color:"#7C3AED",cursor:"pointer"}}>Ref. 18 Ref. 20</span></div>
                  <div style={{marginBottom:12,fontSize:13,lineHeight:1.6}}>○ <strong>Dor intensa, progressiva ou de início súbito</strong> → investigar CIDP, vasculite <span style={{color:"#7C3AED",cursor:"pointer"}}>Ref. 18 Ref. 19</span></div>
                </div>
              </div>
            </div>
          </div>
          <ChatInput placeholder="Escreva para o Charcot..." />
        </div>
      )}

      {/* Gerar Documento */}
      {rightPanel === "gerarDoc" && (
        <div style={{width:380,minWidth:380,borderLeft:"1px solid #EBEBEB",backgroundColor:"#fff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid #EBEBEB",display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setRightPanel(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#666",display:"flex"}}><I.Close /></button>
            <span style={{fontSize:18,fontWeight:700}}>Gerar documentos</span>
          </div>
          <div style={{display:"flex",borderBottom:"1px solid #EBEBEB"}}>
            {["anamneses","auxiliares"].map(t=>(<button key={t} onClick={()=>setDocTab(t)} style={{flex:1,padding:12,border:"none",backgroundColor:"transparent",borderBottom:docTab===t?"2px solid #7C3AED":"2px solid transparent",fontWeight:docTab===t?600:400,color:docTab===t?"#7C3AED":"#666",cursor:"pointer",fontSize:14,textTransform:"capitalize"}}>{t==="anamneses"?"Anamneses":"Documentos auxiliares"}</button>))}
          </div>
          <div style={{padding:"12px 20px"}}><div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",border:"1px solid #E0E0E0",borderRadius:8}}><input placeholder="Pesquisar documento" style={{flex:1,border:"none",outline:"none",fontSize:13}}/><div style={{width:28,height:28,borderRadius:6,backgroundColor:"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><I.Search c="#fff"/></div></div></div>
          <div style={{flex:1,overflow:"auto",padding:"0 20px"}}>
            {docTab==="anamneses"&&(<>
              <div style={{marginBottom:16}}><div style={{fontSize:13,fontWeight:600,color:"#666",marginBottom:4}}>Modelos criados por você</div><div style={{fontSize:12,color:"#999",marginBottom:10}}>Deseja criar um modelo?</div><button style={{width:"100%",padding:10,border:"1px solid #7C3AED",borderRadius:8,backgroundColor:"#fff",color:"#7C3AED",fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><I.Sparkle s={14}/> Criar meu modelo</button></div>
              <div style={{fontSize:13,fontWeight:600,color:"#666",marginBottom:12}}>Modelos criados pela Voa</div>
              {anamneseModels.map((m,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:12,borderRadius:8,marginBottom:4,cursor:"pointer",border:m.selected?"2px solid #7C3AED":"1px solid transparent",backgroundColor:m.selected?"#FAFAFE":"transparent"}}><div style={{color:m.selected?"#7C3AED":"#888",marginTop:2}}><I.Doc /></div><div><div style={{fontSize:14,fontWeight:600,color:m.selected?"#7C3AED":"#333"}}>{m.name}</div><div style={{fontSize:12,color:"#888",marginTop:2}}>{m.desc}</div></div></div>))}
            </>)}
            {docTab==="auxiliares"&&docAux.map((m,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:12,borderRadius:8,marginBottom:4,cursor:"pointer"}}><div style={{color:"#888",marginTop:2}}><I.Doc /></div><div><div style={{fontSize:14,fontWeight:600}}>{m.name}</div><div style={{fontSize:12,color:"#888",marginTop:2}}>{m.desc}</div></div></div>))}
          </div>
          <div style={{borderTop:"1px solid #EBEBEB",padding:"12px 20px"}}>
            <div style={{fontSize:12,color:"#999",marginBottom:8}}>Modelo selecionado:</div>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:12,backgroundColor:"#FFFBEB",borderRadius:10,border:"1px solid #FDE68A",marginBottom:12}}><I.Warning /><div><div style={{fontSize:14,fontWeight:700}}>Anamnese padrão</div><div style={{fontSize:12,color:"#888",marginTop:2}}>Atenção! Documento já existente. Será regenerado.</div></div></div>
            <button style={{width:"100%",padding:12,border:"none",borderRadius:8,background:"linear-gradient(135deg,#9333EA,#7C3AED)",color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><I.Sparkle s={16}/> Gerar novamente</button>
          </div>
        </div>
      )}

      {/* Patient Charcot */}
      {rightPanel === "patCharcot" && (
        <div style={{width:400,minWidth:400,borderLeft:"1px solid #EBEBEB",backgroundColor:"#fff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid #EBEBEB",display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setRightPanel(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#666",display:"flex"}}><I.Close /></button>
            <div style={{flex:1,fontSize:15,fontWeight:700}}>Charcot – Análise de Pacientes</div>
          </div>
          <div style={{padding:"10px 16px",backgroundColor:"#F3F0FF",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:"#7C3AED",fontWeight:600}}>Selecionados:</span>
            {patients.filter(p=>selectedPats.includes(p.id)).map(p=>(
              <span key={p.id} style={{fontSize:11,padding:"3px 8px",borderRadius:12,backgroundColor:"#7C3AED",color:"#fff",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>{p.name.split(" ")[0]}<span onClick={()=>togglePat(p.id)} style={{cursor:"pointer",marginLeft:2}}>×</span></span>
            ))}
          </div>
          <div style={{flex:1,overflow:"auto",padding:"20px 16px"}}>
            <div style={{textAlign:"center",marginBottom:24,padding:"0 20px"}}>
              <div style={{width:48,height:48,borderRadius:"50%",backgroundColor:"#F3F0FF",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#7C3AED"}}><I.Sparkle s={24}/></div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>Análise Clínica com IA</div>
              <div style={{fontSize:13,color:"#888",lineHeight:1.5}}>Pergunte sobre histórico, padrões e evolução dos pacientes.</div>
            </div>
            {["Resuma o histórico clínico","Quais exames estão pendentes?","Existem interações medicamentosas?","Sugira próximos passos de tratamento"].map((s,i)=>(
              <button key={i} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"10px 14px",border:"1px solid #E8E8E8",borderRadius:10,backgroundColor:"#FAFAFA",cursor:"pointer",fontSize:13,color:"#555",textAlign:"left",fontFamily:"inherit",marginBottom:8}}><I.Sparkle s={14}/> {s}</button>
            ))}
          </div>
          <ChatInput placeholder="Pergunte sobre seus pacientes..." />
        </div>
      )}

      {/* Dashboard Charcot */}
      {rightPanel === "dashCharcot" && (
        <div style={{width:440,minWidth:440,borderLeft:"1px solid #EBEBEB",backgroundColor:"#fff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid #EBEBEB",display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>{setRightPanel(null);setReportState("config");}} style={{background:"none",border:"none",cursor:"pointer",color:"#666",display:"flex"}}><I.Close /></button>
            <div style={{flex:1,fontSize:15,fontWeight:700}}>Relatório Charcot</div>
          </div>
          {reportState==="config"&&(
            <div style={{flex:1,overflow:"auto",padding:"20px 18px"}}>
              <div style={{textAlign:"center",marginBottom:24}}>
                <div style={{width:52,height:52,borderRadius:"50%",backgroundColor:"#F3F0FF",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#7C3AED"}}><I.Sparkle s={26}/></div>
                <div style={{fontSize:17,fontWeight:700,marginBottom:6}}>Relatório Personalizado</div>
                <div style={{fontSize:13,color:"#888",lineHeight:1.5}}>Configure filtros e descreva o que deseja analisar.</div>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Filtros da população</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  {[{l:"Condição",k:"condition",opts:["","Diabetes Tipo 2","Hipertensão","DPOC","Asma"]},{l:"Faixa etária",k:"ageRange",opts:["","18-30","31-45","46-60","61-75","76+"]}].map(f=>(
                    <div key={f.k}><label style={{fontSize:11,fontWeight:600,color:"#888",display:"block",marginBottom:4}}>{f.l}</label><select value={dashFilters[f.k]} onChange={e=>setDashFilters(p=>({...p,[f.k]:e.target.value}))} style={{width:"100%",padding:"9px 10px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:13,fontFamily:"inherit",cursor:"pointer"}}>{f.opts.map(o=><option key={o} value={o}>{o||"Todos"}</option>)}</select></div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  {[{l:"Sexo",k:"gender",opts:["","Masculino","Feminino"]},{l:"Risco",k:"riskLevel",opts:["","Baixo","Moderado","Alto","Crítico"]}].map(f=>(
                    <div key={f.k}><label style={{fontSize:11,fontWeight:600,color:"#888",display:"block",marginBottom:4}}>{f.l}</label><select value={dashFilters[f.k]} onChange={e=>setDashFilters(p=>({...p,[f.k]:e.target.value}))} style={{width:"100%",padding:"9px 10px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:13,fontFamily:"inherit",cursor:"pointer"}}>{f.opts.map(o=><option key={o} value={o}>{o||"Todos"}</option>)}</select></div>
                  ))}
                </div>
                <div><label style={{fontSize:11,fontWeight:600,color:"#888",display:"block",marginBottom:4}}>Período</label><div style={{display:"flex",gap:6}}>{["3m","6m","1a","2a"].map(p=>(<button key={p} onClick={()=>setDashFilters(f=>({...f,period:p}))} style={{flex:1,padding:8,borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,border:dashFilters.period===p?"2px solid #7C3AED":"1px solid #E0E0E0",backgroundColor:dashFilters.period===p?"#F3F0FF":"#fff",color:dashFilters.period===p?"#7C3AED":"#666",fontFamily:"inherit"}}>{p==="3m"?"3 meses":p==="6m"?"6 meses":p==="1a"?"1 ano":"2 anos"}</button>))}</div></div>
              </div>
              <div style={{marginBottom:20}}><label style={{fontSize:13,fontWeight:700,display:"block",marginBottom:8}}>O que você quer analisar?</label><textarea value={dashPrompt} onChange={e=>setDashPrompt(e.target.value)} placeholder="Ex: Analise o controle glicêmico dos pacientes diabéticos com hipertensão..." style={{width:"100%",minHeight:90,padding:12,borderRadius:10,border:"1px solid #E0E0E0",fontSize:13,fontFamily:"inherit",resize:"vertical",outline:"none",lineHeight:1.5,boxSizing:"border-box"}}/></div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:600,color:"#888",marginBottom:8}}>Sugestões</div>
                {["Quais pacientes precisam de retorno urgente?","Compare DM2 controlado vs. descontrolado","Resumo executivo da saúde populacional"].map((s,i)=>(<button key={i} onClick={()=>setDashPrompt(s)} style={{width:"100%",display:"flex",alignItems:"center",gap:6,padding:"9px 12px",border:"1px solid #E8E8E8",borderRadius:8,backgroundColor:"#FAFAFA",cursor:"pointer",fontSize:12,color:"#555",textAlign:"left",fontFamily:"inherit",marginBottom:4}}><I.Sparkle s={12}/> {s}</button>))}
              </div>
              <button onClick={handleGenReport} disabled={!dashPrompt} style={{width:"100%",padding:14,border:"none",borderRadius:12,cursor:dashPrompt?"pointer":"not-allowed",fontSize:15,fontWeight:700,color:"#fff",fontFamily:"inherit",background:dashPrompt?"linear-gradient(135deg,#9333EA,#7C3AED)":"#D4D4D4",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><I.Sparkle s={18}/> Gerar Relatório</button>
            </div>
          )}
          {reportState==="loading"&&(
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40}}>
              <div style={{width:64,height:64,borderRadius:"50%",border:"3px solid #F3F0FF",borderTopColor:"#7C3AED",animation:"spin 1s linear infinite",marginBottom:20}}/>
              <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>Analisando dados...</div>
              <div style={{fontSize:13,color:"#888",textAlign:"center",lineHeight:1.5}}>O Charcot está processando as informações para gerar seu relatório.</div>
            </div>
          )}
          {reportState==="done"&&(
            <div style={{flex:1,overflow:"auto"}}>
              <div style={{padding:"18px 18px 14px",backgroundColor:"#F9F7FF",borderBottom:"1px solid #E8E0F5"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}><div style={{fontSize:17,fontWeight:700,lineHeight:1.3,flex:1,paddingRight:10}}>{mockReport.title}</div><div style={{display:"flex",gap:6}}><button style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",border:"1px solid #E0E0E0",borderRadius:6,backgroundColor:"#fff",cursor:"pointer",fontSize:11,color:"#666"}}><I.Copy /> Copiar</button><button style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",border:"1px solid #E0E0E0",borderRadius:6,backgroundColor:"#fff",cursor:"pointer",fontSize:11,color:"#666"}}><I.Download /> PDF</button></div></div>
                <div style={{fontSize:11,color:"#999"}}>Gerado em 26/02/2026 • {dashFilters.condition||"Todas condições"} • {dashFilters.period==="6m"?"6 meses":dashFilters.period}</div>
              </div>
              <div style={{padding:18}}>
                <div style={{padding:16,backgroundColor:"#FAFAFA",borderRadius:10,border:"1px solid #E8E8E8",fontSize:13,lineHeight:1.7,marginBottom:20}}>{mockReport.summary}</div>
                <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:14,backgroundColor:"#FEF2F2",borderRadius:10,marginBottom:20,border:"1px solid #FECACA"}}><div style={{color:"#EF4444",marginTop:1}}><I.Alert /></div><div style={{fontSize:13,color:"#991B1B",lineHeight:1.5}}>{mockReport.alert}</div></div>
                <div style={{backgroundColor:"#fff",borderRadius:10,padding:16,border:"1px solid #E8E8E8",marginBottom:20}}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Evolução HbA1c – DM2 + HAS</div>
                  <div style={{fontSize:12,color:"#22C55E",fontWeight:600,marginBottom:10}}>8.2% → 6.8% em 8 meses</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={chartHba1c}><defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.15}/><stop offset="95%" stopColor="#22C55E" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/><XAxis dataKey="month" tick={{fontSize:10,fill:"#999"}} axisLine={false} tickLine={false}/><YAxis domain={[6,9]} tick={{fontSize:10,fill:"#999"}} axisLine={false} tickLine={false}/><Area type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={2} fill="url(#gg)" dot={{fill:"#22C55E",r:3}}/></AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{padding:16,backgroundColor:"#F3F0FF",borderRadius:10,borderLeft:"4px solid #7C3AED",marginBottom:20}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><I.Sparkle s={14}/><span style={{fontSize:13,fontWeight:700,color:"#7C3AED"}}>Insight</span></div><div style={{fontSize:13,lineHeight:1.6}}>{mockReport.insight}</div></div>
                <div style={{marginBottom:20}}><div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Recomendações</div>{mockReport.recs.map((r,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",backgroundColor:"#fff",borderRadius:8,border:"1px solid #E8E8E8",marginBottom:6}}><div style={{width:24,height:24,borderRadius:"50%",flexShrink:0,backgroundColor:"#F3F0FF",color:"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>{i+1}</div><div style={{fontSize:13,lineHeight:1.5}}>{r}</div></div>))}</div>
              </div>
              <ChatInput placeholder="Faça perguntas sobre este relatório..." />
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
