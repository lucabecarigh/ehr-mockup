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
  Person: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Beaker: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>,
  LinkIcon: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  CloudUp: ({ s = 32 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  BookOpen: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Trophy: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  Target: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Layers: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  CheckSquare: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Zap: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  RotateCcw: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  ChevLeft: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
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

/* ── Trilha de Aprendizado ── */
const trilhaConditions = [
  { name:"Diabetes Tipo 2", count:28, pct:28, color:"#7C3AED" },
  { name:"Hipertensão", count:22, pct:22, color:"#9333EA" },
  { name:"DPOC", count:12, pct:12, color:"#A855F7" },
  { name:"Lombalgia crônica", count:10, pct:10, color:"#C084FC" },
  { name:"Depressão / Ansiedade", count:9, pct:9, color:"#D8B4FE" },
];
const condutas = {
  assertivas: [
    { label:"Solicitação de HbA1c em todos os DM2", pct:94 },
    { label:"Ajuste de anti-hipertensivo por meta pressórica", pct:88 },
    { label:"Rastreio de complicações renais em diabéticos", pct:82 },
    { label:"Prescrição de estatina em DM2 + dislipidemia", pct:79 },
  ],
  revisar: [
    { label:"Rastreio de neuropatia periférica (monofilamento)", pct:38, rec:"Realizar em 100% dos DM2 por visita" },
    { label:"Orientação sobre atividade física documentada", pct:44, rec:"ADA recomenda 150 min/sem – incluir no plano de cuidado" },
    { label:"Aplicação do escore SCORE2 em hipertensos > 40 anos", pct:52, rec:"ESC 2024 – aplicar em todos os pacientes com HAS" },
  ],
};
const guidelines = [
  { title:"ADA 2025 – Padrões de Cuidado em Diabetes", tag:"Novo", tagColor:"#7C3AED", desc:"Novos alvos glicêmicos para idosos e uso expandido de iSGLT2 em insuficiência cardíaca." },
  { title:"ESC 2024 – Hipertensão Arterial", tag:"Atualizado", tagColor:"#3B82F6", desc:"Estratégia de tratamento combinado inicial para HAS estágio 2; nova tabela de risco SCORE2." },
  { title:"GOLD 2025 – DPOC", tag:"Novo", tagColor:"#F59E0B", desc:"Revisão dos critérios diagnósticos e novo algoritmo de tratamento baseado em fenótipo." },
];
const quizList = [
  { id:1, title:"Diabetes Tipo 2 – Manejo clínico", questions:8, done:8, score:87, tag:"Concluído", tagColor:"#22C55E", tagBg:"#F0FDF4" },
  { id:2, title:"Hipertensão – Metas e tratamento", questions:6, done:3, score:null, tag:"Em progresso", tagColor:"#D97706", tagBg:"#FFFBEB" },
  { id:3, title:"DPOC – Diagnóstico e estadiamento", questions:10, done:0, score:null, tag:"Novo", tagColor:"#7C3AED", tagBg:"#F3F0FF" },
];
const mockQuiz = {
  title:"Hipertensão – Metas e tratamento",
  questions:[
    { q:"Qual a meta pressórica recomendada pelo ESC 2024 para pacientes com HAS de alto risco cardiovascular?", opts:["< 140/90 mmHg","< 130/80 mmHg","< 120/70 mmHg","< 135/85 mmHg"], correct:1, exp:"O ESC 2024 recomenda alvo < 130/80 mmHg para pacientes de alto risco, reduzindo o limiar anterior de 140/90 mmHg." },
    { q:"Qual combinação de anti-hipertensivos é preferida como terapia inicial em HAS estágio 2?", opts:["BRA + tiazídico","IECA + BCC","BB + diurético de alça","BCC + BB isolado"], correct:1, exp:"A combinação IECA/BRA + BCC ou IECA/BRA + tiazídico é recomendada como primeira linha para HAS estágio 2." },
    { q:"Em pacientes com HAS e DM2, qual a meta de HbA1c que equilibra benefício cardiovascular e risco de hipoglicemia?", opts:["< 6,0%","< 7,0%","< 8,0%","< 9,0%"], correct:1, exp:"HbA1c < 7,0% é o alvo padrão ADA 2025, equilibrando benefício cardiovascular e risco de hipoglicemia na maioria dos pacientes." },
  ],
};
const flashDecks = [
  { id:1, title:"DM2 – Farmacologia", cards:12, reviewed:8, color:"#7C3AED", tag:"4 pendentes", tagColor:"#D97706" },
  { id:2, title:"HAS – Metas e Classes", cards:8, reviewed:8, color:"#3B82F6", tag:"Revisado", tagColor:"#16A34A" },
  { id:3, title:"Neuropatia Diabética", cards:6, reviewed:0, color:"#F59E0B", tag:"Novo", tagColor:"#7C3AED" },
  { id:4, title:"DPOC – Estadiamento GOLD", cards:10, reviewed:5, color:"#22C55E", tag:"Em andamento", tagColor:"#D97706" },
];
const mockFlashcards = [
  { front:"Quais são os critérios diagnósticos de DM2?", back:"Glicemia de jejum ≥ 126 mg/dL em 2 ocasiões\nOU HbA1c ≥ 6,5%\nOU glicemia 2h pós-TOTG ≥ 200 mg/dL\nOU glicemia aleatória ≥ 200 mg/dL com sintomas clássicos" },
  { front:"Quando iniciar metformina no DM2?", back:"Imediatamente ao diagnóstico (se tolerada)\nAssociada a mudança de estilo de vida\nContraindicada: TFG < 30 mL/min/1,73m²\nReduzir dose se TFG entre 30-45 mL/min" },
  { front:"Quais iSGLT2 têm benefício cardiovascular comprovado em DM2?", back:"Empagliflozina (EMPA-REG OUTCOME)\nCanagliflozina (CANVAS, CREDENCE)\nDapagliflozina (DECLARE-TIMI 58)\nBenefício adicional: ↓ hospitalização por IC e progressão renal" },
  { front:"Meta de HbA1c no DM2 – adulto sem comorbidades relevantes", back:"< 7,0% (padrão ADA 2025)\nMais rigoroso (< 6,5%): jovens, curta duração de DM, sem risco de hipoglicemia\nMenos rigoroso (< 8,0%): idosos frágeis ou com expectativa de vida reduzida" },
];

const portalDocs = [
  { id:1, name:"Hemograma completo", type:"Exame", date:"20/02/2026", source:"Fleury Laboratórios", sourceType:"lab", status:"normal" },
  { id:2, name:"HbA1c – 7.1%", type:"Exame", date:"20/02/2026", source:"Fleury Laboratórios", sourceType:"lab", status:"atenção" },
  { id:3, name:"Anamnese padrão", type:"Consulta", date:"04/05/2025", source:"Dr. Luca Becari", sourceType:"doctor", status:null },
  { id:4, name:"Atestado Médico", type:"Atestado", date:"04/05/2025", source:"Dr. Luca Becari", sourceType:"doctor", status:null },
  { id:5, name:"Prescrição – Metformina 500mg", type:"Prescrição", date:"15/01/2025", source:"Dr. Luca Becari", sourceType:"doctor", status:null },
  { id:6, name:"Perfil lipídico completo", type:"Exame", date:"03/08/2024", source:"Dasa", sourceType:"lab", status:"normal" },
  { id:7, name:"Pedido de exames", type:"Pedido", date:"03/08/2024", source:"Dr. Luca Becari", sourceType:"doctor", status:null },
  { id:8, name:"ECG de repouso", type:"Exame", date:"12/06/2024", source:"Hermes Pardini", sourceType:"lab", status:"normal" },
];
const portalLabs = [
  { id:"fleury", name:"Fleury Laboratórios", abbr:"FL", connected:true, results:2, lastSync:"Hoje, 08:30", color:"#0066CC" },
  { id:"dasa", name:"Dasa", abbr:"DA", connected:true, results:1, lastSync:"03/08/2024", color:"#E63946" },
  { id:"pardini", name:"Hermes Pardini", abbr:"HP", connected:false, results:0, lastSync:null, color:"#2D6A4F" },
  { id:"einstein", name:"Albert Einstein", abbr:"AE", connected:false, results:0, lastSync:null, color:"#7C3AED" },
];

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

  // Portal do Paciente
  const [portalTab, setPortalTab] = useState("docs"); // docs | add | labs
  const [portalDocFilter, setPortalDocFilter] = useState("Todos");
  const [portalSelectedDoc, setPortalSelectedDoc] = useState(null);

  // Trilha de Aprendizado
  const [trilhaTab, setTrilhaTab] = useState("overview"); // overview | quiz | flashcards
  const [quizMode, setQuizMode] = useState(null); // null | "active" | "done"
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [flashMode, setFlashMode] = useState(null); // null | "active"
  const [activeDeck, setActiveDeck] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  const handleAnswerSelect = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setQuizAnswers(a => [...a, idx]);
  };
  const handleNextQuestion = () => {
    if (currentQuestion + 1 >= mockQuiz.questions.length) {
      setQuizMode("done");
    } else {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
    }
  };
  const handleStartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizAnswers([]);
    setQuizMode("active");
  };
  const handleOpenDeck = (deck) => {
    setActiveDeck(deck);
    setCurrentCard(0);
    setCardFlipped(false);
    setFlashMode("active");
  };

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
        <div style={{ width:24,height:1,backgroundColor:"#EBEBEB",margin:"6px 0" }} />
        <NavIcon active={page==="portal"} onClick={()=>{setPage("portal");setRightPanel(null);setPortalTab("docs");}} icon={<I.Person />} badge={false} />
        <NavIcon active={page==="trilha"} onClick={()=>{setPage("trilha");setRightPanel(null);setTrilhaTab("overview");setQuizMode(null);setFlashMode(null);}} icon={<I.BookOpen />} />
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
          <div style={{ height:1,backgroundColor:"#EBEBEB",margin:"6px 2px" }} />
          <div style={{ fontSize:10,fontWeight:700,color:"#BDBDBD",textTransform:"uppercase",letterSpacing:0.8,padding:"4px 12px 2px" }}>Ferramentas</div>
          <div onClick={()=>{setPage("portal");setPortalTab("docs");}} style={{
            display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,cursor:"pointer",marginBottom:2,
            backgroundColor:page==="portal"?"#F3F0FF":"transparent",
            color:page==="portal"?"#7C3AED":"#555",fontWeight:page==="portal"?600:500,fontSize:14,transition:"all 0.15s"
          }}><I.Person s={16}/> Portal do Paciente</div>
          <div onClick={()=>{setPage("trilha");setTrilhaTab("overview");setQuizMode(null);setFlashMode(null);}} style={{
            display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,cursor:"pointer",marginBottom:2,
            backgroundColor:page==="trilha"?"#F3F0FF":"transparent",
            color:page==="trilha"?"#7C3AED":"#555",fontWeight:page==="trilha"?600:500,fontSize:14,transition:"all 0.15s"
          }}><I.BookOpen s={16}/> Trilha de Aprendizado</div>
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
            {page === "trilha" && (
              <>
                <div style={{ fontSize:11,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Progresso</div>
                <div style={{ padding:"12px 10px",borderRadius:10,backgroundColor:"#F3F0FF",marginBottom:10 }}>
                  <div style={{ fontSize:12,fontWeight:700,color:"#7C3AED",marginBottom:6 }}>🔥 Streak: 7 dias</div>
                  <div style={{ fontSize:11,color:"#888",marginBottom:6 }}>Assertividade geral: <strong style={{color:"#22C55E"}}>82%</strong></div>
                  <div style={{ height:6,backgroundColor:"#E0D4F5",borderRadius:3 }}><div style={{ height:"100%",width:"82%",backgroundColor:"#7C3AED",borderRadius:3 }}/></div>
                </div>
                <div style={{ fontSize:11,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Flashcard decks</div>
                {flashDecks.map(d=>(
                  <div key={d.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:8,cursor:"pointer",marginBottom:2 }} onClick={()=>{setPage("trilha");setTrilhaTab("flashcards");setFlashMode(null);}}>
                    <div style={{ width:8,height:8,borderRadius:2,flexShrink:0,backgroundColor:d.color }}/>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.title}</div>
                      <div style={{ fontSize:10,color:"#999" }}>{d.reviewed}/{d.cards} revisados</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {page === "portal" && (
              <>
                <div style={{ fontSize:11,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Documentos recentes</div>
                {portalDocs.slice(0,5).map(d=>(
                  <div key={d.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:8,cursor:"pointer",marginBottom:2 }}>
                    <div style={{ width:26,height:26,borderRadius:7,flexShrink:0,backgroundColor:d.sourceType==="lab"?"#EFF6FF":"#F0EBF8",color:d.sourceType==="lab"?"#3B82F6":"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {d.sourceType==="lab"?<I.Beaker s={11}/>:<I.Doc s={11}/>}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.name}</div>
                      <div style={{ fontSize:10,color:"#999" }}>{d.date}</div>
                    </div>
                  </div>
                ))}
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
        {/* ──────── TRILHA DE APRENDIZADO ──────── */}
        {page === "trilha" && (
          <>
            {/* Header */}
            <div style={{ padding:"20px 28px 16px", backgroundColor:"#fff", borderBottom:"1px solid #EBEBEB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <h1 style={{ fontSize:24, fontWeight:700, margin:0, letterSpacing:-0.5 }}>Trilha de Aprendizado</h1>
                <p style={{ fontSize:13, color:"#888", margin:"4px 0 0" }}>Baseada na sua prática clínica real • Atualizada há 2h</p>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setRightPanel("trilhaCharcot")} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", border:"1px solid #E0E0E0", borderRadius:9, backgroundColor:"#fff", cursor:"pointer", fontSize:14, fontWeight:500, color:"#555" }}>
                  <I.Sparkle s={15}/> Pedir ao Charcot
                </button>
                <button onClick={()=>{setTrilhaTab("quiz");setQuizMode(null);}} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", border:"none", borderRadius:9, cursor:"pointer", fontSize:14, fontWeight:600, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff" }}>
                  <I.CheckSquare s={16}/> Criar quiz
                </button>
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ padding:"0 28px", backgroundColor:"#fff", borderBottom:"1px solid #EBEBEB", display:"flex" }}>
              {[
                { key:"overview", label:"Visão Geral", icon:<I.Target s={14}/> },
                { key:"quiz", label:"Quiz", icon:<I.CheckSquare s={14}/> },
                { key:"flashcards", label:"Flashcards", icon:<I.Layers s={14}/> },
              ].map(t => (
                <button key={t.key} onClick={()=>{ setTrilhaTab(t.key); if(t.key==="quiz")setQuizMode(null); if(t.key==="flashcards")setFlashMode(null); }} style={{
                  display:"flex", alignItems:"center", gap:6, padding:"13px 18px", border:"none", backgroundColor:"transparent",
                  borderBottom: trilhaTab===t.key ? "2px solid #7C3AED" : "2px solid transparent",
                  color: trilhaTab===t.key ? "#7C3AED" : "#666",
                  fontWeight: trilhaTab===t.key ? 600 : 400,
                  fontSize:14, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s"
                }}>{t.icon} {t.label}</button>
              ))}
            </div>

            <div style={{ flex:1, overflow:"auto", padding:"20px 28px" }}>

              {/* ═══ VISÃO GERAL ═══ */}
              {trilhaTab === "overview" && (
                <>
                  {/* KPI cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
                    {[
                      { l:"Casos atendidos", v:"100", sub:"últimos 6 meses", icon:<I.Users s={17}/>, cl:"#7C3AED" },
                      { l:"Assertividade geral", v:"82%", sub:"↑ 4% vs. trimestre anterior", icon:<I.Target s={17}/>, cl:"#22C55E" },
                      { l:"Flashcards revisados", v:"34", sub:"de 36 disponíveis", icon:<I.Layers s={17}/>, cl:"#3B82F6" },
                      { l:"Streak de estudo", v:"7 dias", sub:"🔥 seu recorde é 14 dias", icon:<I.Zap s={17}/>, cl:"#F59E0B" },
                    ].map((c,i) => (
                      <div key={i} style={{ backgroundColor:"#fff", borderRadius:13, padding:"18px 20px", border:"1px solid #E8E8E8", position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", top:14, right:14, width:34, height:34, borderRadius:9, backgroundColor:c.cl+"15", color:c.cl, display:"flex", alignItems:"center", justifyContent:"center" }}>{c.icon}</div>
                        <div style={{ fontSize:11, color:"#888", marginBottom:5, fontWeight:500 }}>{c.l}</div>
                        <div style={{ fontSize:26, fontWeight:700, letterSpacing:-1, marginBottom:4 }}>{c.v}</div>
                        <div style={{ fontSize:11, color:"#999" }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Condutas */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
                    {/* Assertivas */}
                    <div style={{ backgroundColor:"#fff", borderRadius:13, padding:"20px", border:"1px solid #E8E8E8" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                        <div style={{ width:30, height:30, borderRadius:8, backgroundColor:"#F0FDF4", color:"#22C55E", display:"flex", alignItems:"center", justifyContent:"center" }}><I.Target s={16}/></div>
                        <div>
                          <div style={{ fontSize:15, fontWeight:700 }}>Condutas assertivas</div>
                          <div style={{ fontSize:11, color:"#888" }}>O que você está fazendo bem</div>
                        </div>
                      </div>
                      {condutas.assertivas.map((c,i) => (
                        <div key={i} style={{ marginBottom:14 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontSize:13, color:"#333", lineHeight:1.4 }}>{c.label}</span>
                            <span style={{ fontSize:13, fontWeight:700, color:"#22C55E", flexShrink:0, marginLeft:8 }}>{c.pct}%</span>
                          </div>
                          <div style={{ height:6, backgroundColor:"#F0F0F0", borderRadius:3 }}>
                            <div style={{ height:"100%", width:`${c.pct}%`, backgroundColor:"#22C55E", borderRadius:3 }}/>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Revisar */}
                    <div style={{ backgroundColor:"#fff", borderRadius:13, padding:"20px", border:"1px solid #E8E8E8" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                        <div style={{ width:30, height:30, borderRadius:8, backgroundColor:"#FFFBEB", color:"#D97706", display:"flex", alignItems:"center", justifyContent:"center" }}><I.Alert s={16}/></div>
                        <div>
                          <div style={{ fontSize:15, fontWeight:700 }}>O que revisar</div>
                          <div style={{ fontSize:11, color:"#888" }}>Oportunidades de melhora</div>
                        </div>
                      </div>
                      {condutas.revisar.map((c,i) => (
                        <div key={i} style={{ marginBottom:14 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontSize:13, color:"#333", lineHeight:1.4 }}>{c.label}</span>
                            <span style={{ fontSize:13, fontWeight:700, color:"#F59E0B", flexShrink:0, marginLeft:8 }}>{c.pct}%</span>
                          </div>
                          <div style={{ height:6, backgroundColor:"#F0F0F0", borderRadius:3 }}>
                            <div style={{ height:"100%", width:`${c.pct}%`, backgroundColor:"#FCD34D", borderRadius:3 }}/>
                          </div>
                          <div style={{ fontSize:11, color:"#888", marginTop:4, fontStyle:"italic" }}>→ {c.rec}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condições + Diretrizes + Charcot */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:24 }}>
                    {/* Condições prevalentes */}
                    <div style={{ backgroundColor:"#fff", borderRadius:13, padding:"20px", border:"1px solid #E8E8E8" }}>
                      <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>Condições mais atendidas</div>
                      <div style={{ fontSize:12, color:"#888", marginBottom:16 }}>Últimos 6 meses</div>
                      {trilhaConditions.map((c,i) => (
                        <div key={i} style={{ marginBottom:12 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                            <span style={{ fontSize:13 }}>{c.name}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:"#555" }}>{c.count}</span>
                          </div>
                          <div style={{ height:7, backgroundColor:"#F3F0FF", borderRadius:4 }}>
                            <div style={{ height:"100%", width:`${c.pct}%`, backgroundColor:c.color, borderRadius:4 }}/>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Novas diretrizes */}
                    <div style={{ backgroundColor:"#fff", borderRadius:13, padding:"20px", border:"1px solid #E8E8E8" }}>
                      <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>Novas diretrizes</div>
                      <div style={{ fontSize:12, color:"#888", marginBottom:16 }}>Relevantes para sua prática</div>
                      {guidelines.map((g,i) => (
                        <div key={i} style={{ padding:"12px 14px", borderRadius:9, border:"1px solid #F0F0F0", marginBottom:8, cursor:"pointer" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                            <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:700, backgroundColor:g.tagColor+"18", color:g.tagColor }}>{g.tag}</span>
                          </div>
                          <div style={{ fontSize:13, fontWeight:600, marginBottom:4, lineHeight:1.3 }}>{g.title}</div>
                          <div style={{ fontSize:11, color:"#888", lineHeight:1.4 }}>{g.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* Charcot sugere */}
                    <div style={{ background:"linear-gradient(145deg,#7C3AED,#5B21B6)", borderRadius:13, padding:"20px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                        <I.Sparkle s={16}/>
                        <span style={{ fontSize:15, fontWeight:700, color:"#fff" }}>Charcot sugere</span>
                      </div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.9)", lineHeight:1.6, marginBottom:16 }}>
                        Com base na sua prática, <strong>3 condutas</strong> abaixo da meta e <strong>2 diretrizes novas</strong> relevantes foram identificadas. Quer um plano de estudo personalizado?
                      </div>
                      {["Criar quiz sobre neuropatia diabética","Gerar flashcards de HAS 2024","Revisar protocolo de monofilamento"].map((s,i) => (
                        <button key={i} onClick={()=>setRightPanel("trilhaCharcot")} style={{ width:"100%", display:"flex", alignItems:"center", gap:7, padding:"9px 12px", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, backgroundColor:"rgba(255,255,255,0.1)", cursor:"pointer", fontSize:12, color:"#fff", textAlign:"left", fontFamily:"inherit", marginBottom:6 }}>
                          <I.Sparkle s={12}/> {s}
                        </button>
                      ))}
                      <button onClick={()=>setRightPanel("trilhaCharcot")} style={{ width:"100%", marginTop:4, padding:"10px 0", border:"2px solid rgba(255,255,255,0.4)", borderRadius:9, backgroundColor:"transparent", cursor:"pointer", fontSize:13, fontWeight:600, color:"#fff", fontFamily:"inherit" }}>
                        Abrir Charcot →
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ═══ QUIZ ═══ */}
              {trilhaTab === "quiz" && (
                <>
                  {/* Lista de quizzes */}
                  {quizMode === null && (
                    <>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                        <div>
                          <div style={{ fontSize:16, fontWeight:700 }}>Seus quizzes</div>
                          <div style={{ fontSize:13, color:"#888", marginTop:2 }}>Personalizados com base na sua prática clínica real.</div>
                        </div>
                        <button onClick={()=>setRightPanel("trilhaCharcot")} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", border:"none", borderRadius:9, cursor:"pointer", fontSize:14, fontWeight:600, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff" }}>
                          <I.Sparkle s={15}/> Criar com Charcot
                        </button>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {quizList.map(q => (
                          <div key={q.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"18px 22px", backgroundColor:"#fff", borderRadius:13, border:"1px solid #E8E8E8" }}>
                            <div style={{ width:44, height:44, borderRadius:11, backgroundColor:"#F3F0FF", color:"#7C3AED", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <I.CheckSquare s={20}/>
                            </div>
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                                <span style={{ fontWeight:600, fontSize:15 }}>{q.title}</span>
                                <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, fontWeight:700, backgroundColor:q.tagBg, color:q.tagColor }}>{q.tag}</span>
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                                <span style={{ fontSize:12, color:"#888" }}>{q.done}/{q.questions} questões</span>
                                {q.score !== null && <span style={{ fontSize:12, fontWeight:700, color:"#22C55E" }}>Nota: {q.score}%</span>}
                                <div style={{ flex:1, maxWidth:120, height:5, backgroundColor:"#F0F0F0", borderRadius:3 }}>
                                  <div style={{ height:"100%", width:`${(q.done/q.questions)*100}%`, backgroundColor:q.score?"#22C55E":"#7C3AED", borderRadius:3 }}/>
                                </div>
                              </div>
                            </div>
                            <button onClick={handleStartQuiz} style={{ padding:"8px 18px", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background: q.done===q.questions ? "#F3F0FF" : "linear-gradient(135deg,#9333EA,#7C3AED)", color: q.done===q.questions ? "#7C3AED" : "#fff", fontFamily:"inherit" }}>
                              {q.done===q.questions ? <span style={{display:"flex",alignItems:"center",gap:4}}><I.RotateCcw s={13}/> Refazer</span> : q.done>0 ? "Continuar →" : "Iniciar →"}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* CTA Charcot */}
                      <div style={{ marginTop:20, padding:"20px 24px", backgroundColor:"#F9F7FF", borderRadius:13, border:"1px dashed #C4B5FD", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>Quer um quiz personalizado?</div>
                          <div style={{ fontSize:13, color:"#888" }}>O Charcot cria questões baseadas nos seus casos reais e nas diretrizes mais recentes.</div>
                        </div>
                        <button onClick={()=>setRightPanel("trilhaCharcot")} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 20px", border:"none", borderRadius:9, cursor:"pointer", fontSize:14, fontWeight:600, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff", flexShrink:0 }}>
                          <I.Sparkle s={15}/> Gerar quiz
                        </button>
                      </div>
                    </>
                  )}

                  {/* Quiz ativo */}
                  {quizMode === "active" && (
                    <div style={{ maxWidth:640, margin:"0 auto" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
                        <button onClick={()=>setQuizMode(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#666", display:"flex", padding:0 }}><I.ChevLeft s={18}/></button>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:15, fontWeight:700 }}>{mockQuiz.title}</div>
                          <div style={{ fontSize:12, color:"#888", marginTop:2 }}>Questão {currentQuestion+1} de {mockQuiz.questions.length}</div>
                        </div>
                        <span style={{ fontSize:12, fontWeight:600, color:"#7C3AED" }}>{Math.round(((currentQuestion)/(mockQuiz.questions.length))*100)}%</span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height:6, backgroundColor:"#F0F0F0", borderRadius:3, marginBottom:28 }}>
                        <div style={{ height:"100%", width:`${((currentQuestion)/(mockQuiz.questions.length))*100}%`, backgroundColor:"#7C3AED", borderRadius:3, transition:"width 0.3s" }}/>
                      </div>

                      <div style={{ backgroundColor:"#fff", borderRadius:14, padding:"28px 28px 24px", border:"1px solid #E8E8E8", marginBottom:16 }}>
                        <div style={{ fontSize:17, fontWeight:600, lineHeight:1.5, marginBottom:24, color:"#1a1a1a" }}>
                          {mockQuiz.questions[currentQuestion].q}
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                          {mockQuiz.questions[currentQuestion].opts.map((opt, idx) => {
                            const isSelected = selectedAnswer === idx;
                            const isCorrect = idx === mockQuiz.questions[currentQuestion].correct;
                            const revealed = selectedAnswer !== null;
                            let bg = "#FAFAFA", border = "1px solid #E0E0E0", color = "#333";
                            if (revealed && isCorrect) { bg="#F0FDF4"; border="2px solid #22C55E"; color="#166534"; }
                            else if (revealed && isSelected && !isCorrect) { bg="#FEF2F2"; border="2px solid #EF4444"; color="#991B1B"; }
                            return (
                              <button key={idx} onClick={()=>handleAnswerSelect(idx)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", border, borderRadius:10, backgroundColor:bg, cursor:revealed?"default":"pointer", fontSize:14, color, textAlign:"left", fontFamily:"inherit", transition:"all 0.2s" }}>
                                <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0, backgroundColor: revealed&&isCorrect?"#22C55E":revealed&&isSelected&&!isCorrect?"#EF4444":"#E8E8E8", color: revealed&&(isCorrect||(isSelected&&!isCorrect))?"#fff":"#666", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>
                                  {revealed && isCorrect ? "✓" : revealed && isSelected && !isCorrect ? "✗" : String.fromCharCode(65+idx)}
                                </div>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {selectedAnswer !== null && (
                        <>
                          <div style={{ padding:"14px 18px", backgroundColor:"#F3F0FF", borderRadius:10, border:"1px solid #DDD6FE", marginBottom:16, display:"flex", gap:10 }}>
                            <div style={{ color:"#7C3AED", flexShrink:0, marginTop:1 }}><I.Sparkle s={16}/></div>
                            <div style={{ fontSize:13, lineHeight:1.6, color:"#4C1D95" }}>
                              <strong>Charcot explica:</strong> {mockQuiz.questions[currentQuestion].exp}
                            </div>
                          </div>
                          <button onClick={handleNextQuestion} style={{ width:"100%", padding:"13px 0", border:"none", borderRadius:10, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff", fontWeight:600, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
                            {currentQuestion+1 < mockQuiz.questions.length ? "Próxima questão →" : "Ver resultado →"}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Resultado do quiz */}
                  {quizMode === "done" && (
                    <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center" }}>
                      <div style={{ fontSize:48, marginBottom:12 }}>🏆</div>
                      <div style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Quiz concluído!</div>
                      <div style={{ fontSize:14, color:"#888", marginBottom:28 }}>{mockQuiz.title}</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
                        {[
                          { l:"Acertos", v:`${quizAnswers.filter((a,i)=>a===mockQuiz.questions[i]?.correct).length}/${mockQuiz.questions.length}`, c:"#22C55E" },
                          { l:"Aproveitamento", v:`${Math.round((quizAnswers.filter((a,i)=>a===mockQuiz.questions[i]?.correct).length/mockQuiz.questions.length)*100)}%`, c:"#7C3AED" },
                          { l:"Pontuação", v:"A+", c:"#3B82F6" },
                        ].map((s,i)=>(
                          <div key={i} style={{ backgroundColor:"#fff", borderRadius:12, padding:"20px 16px", border:"1px solid #E8E8E8" }}>
                            <div style={{ fontSize:28, fontWeight:700, color:s.c, marginBottom:4 }}>{s.v}</div>
                            <div style={{ fontSize:12, color:"#888" }}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                        <button onClick={handleStartQuiz} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", border:"1px solid #E0E0E0", borderRadius:9, backgroundColor:"#fff", cursor:"pointer", fontSize:14, fontWeight:500, color:"#555", fontFamily:"inherit" }}>
                          <I.RotateCcw s={14}/> Refazer
                        </button>
                        <button onClick={()=>setQuizMode(null)} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", border:"none", borderRadius:9, cursor:"pointer", fontSize:14, fontWeight:600, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff", fontFamily:"inherit" }}>
                          Ver outros quizzes
                        </button>
                        <button onClick={()=>setRightPanel("trilhaCharcot")} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", border:"1px solid #7C3AED", borderRadius:9, backgroundColor:"#F3F0FF", cursor:"pointer", fontSize:14, fontWeight:600, color:"#7C3AED", fontFamily:"inherit" }}>
                          <I.Sparkle s={14}/> Analisar com Charcot
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ═══ FLASHCARDS ═══ */}
              {trilhaTab === "flashcards" && (
                <>
                  {/* Lista de decks */}
                  {flashMode === null && (
                    <>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                        <div>
                          <div style={{ fontSize:16, fontWeight:700 }}>Seus decks de flashcards</div>
                          <div style={{ fontSize:13, color:"#888", marginTop:2 }}>Revise conceitos-chave baseados na sua prática clínica.</div>
                        </div>
                        <button onClick={()=>setRightPanel("trilhaCharcot")} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", border:"none", borderRadius:9, cursor:"pointer", fontSize:14, fontWeight:600, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff" }}>
                          <I.Sparkle s={15}/> Criar deck
                        </button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, marginBottom:20 }}>
                        {flashDecks.map(d => (
                          <div key={d.id} style={{ backgroundColor:"#fff", borderRadius:13, padding:"20px 22px", border:"1px solid #E8E8E8", cursor:"pointer" }} onClick={()=>handleOpenDeck(d)}>
                            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
                              <div style={{ width:42, height:42, borderRadius:11, backgroundColor:d.color+"18", color:d.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                <I.Layers s={20}/>
                              </div>
                              <span style={{ fontSize:10, padding:"3px 8px", borderRadius:5, fontWeight:700, backgroundColor:d.tagColor+"18", color:d.tagColor }}>{d.tag}</span>
                            </div>
                            <div style={{ fontSize:15, fontWeight:700, marginBottom:5 }}>{d.title}</div>
                            <div style={{ fontSize:12, color:"#888", marginBottom:14 }}>{d.reviewed}/{d.cards} revisados</div>
                            <div style={{ height:6, backgroundColor:"#F0F0F0", borderRadius:3, marginBottom:14 }}>
                              <div style={{ height:"100%", width:`${Math.round((d.reviewed/d.cards)*100)}%`, backgroundColor:d.color, borderRadius:3 }}/>
                            </div>
                            <button style={{ width:"100%", padding:"9px 0", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`linear-gradient(135deg,${d.color}dd,${d.color})`, color:"#fff", fontFamily:"inherit" }}>
                              {d.reviewed===d.cards ? "Revisar novamente" : "Continuar revisão →"}
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ padding:"20px 24px", backgroundColor:"#F9F7FF", borderRadius:13, border:"1px dashed #C4B5FD", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>Criar novos flashcards</div>
                          <div style={{ fontSize:13, color:"#888" }}>O Charcot gera cartões baseados nos seus casos, nas diretrizes e nos pontos que você precisa revisar.</div>
                        </div>
                        <button onClick={()=>setRightPanel("trilhaCharcot")} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 20px", border:"none", borderRadius:9, cursor:"pointer", fontSize:14, fontWeight:600, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff", flexShrink:0 }}>
                          <I.Sparkle s={15}/> Gerar flashcards
                        </button>
                      </div>
                    </>
                  )}

                  {/* Revisão de deck */}
                  {flashMode === "active" && activeDeck && (
                    <div style={{ maxWidth:600, margin:"0 auto" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                        <button onClick={()=>{setFlashMode(null);setCardFlipped(false);}} style={{ background:"none", border:"none", cursor:"pointer", color:"#666", display:"flex", padding:0 }}><I.ChevLeft s={18}/></button>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:15, fontWeight:700 }}>{activeDeck.title}</div>
                          <div style={{ fontSize:12, color:"#888", marginTop:1 }}>Cartão {currentCard+1} de {mockFlashcards.length}</div>
                        </div>
                        <button onClick={()=>setRightPanel("trilhaCharcot")} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", border:"1px solid #E0E0E0", borderRadius:7, backgroundColor:"#fff", cursor:"pointer", fontSize:12, color:"#666" }}>
                          <I.Sparkle s={12}/> Perguntar ao Charcot
                        </button>
                      </div>

                      {/* Progress */}
                      <div style={{ height:5, backgroundColor:"#F0F0F0", borderRadius:3, marginBottom:24 }}>
                        <div style={{ height:"100%", width:`${((currentCard)/(mockFlashcards.length))*100}%`, backgroundColor:activeDeck.color, borderRadius:3, transition:"width 0.3s" }}/>
                      </div>

                      {/* Card */}
                      <div onClick={()=>setCardFlipped(f=>!f)} style={{ backgroundColor:"#fff", borderRadius:16, padding:"44px 36px", border:`2px solid ${cardFlipped ? activeDeck.color+"60" : "#E8E8E8"}`, marginBottom:20, cursor:"pointer", minHeight:220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", transition:"border 0.2s" }}>
                        {!cardFlipped ? (
                          <>
                            <div style={{ fontSize:11, fontWeight:700, color:"#999", textTransform:"uppercase", letterSpacing:1, marginBottom:18 }}>Pergunta</div>
                            <div style={{ fontSize:18, fontWeight:600, lineHeight:1.5, color:"#1a1a1a" }}>{mockFlashcards[currentCard].front}</div>
                            <div style={{ fontSize:12, color:"#BDBDBD", marginTop:20, display:"flex", alignItems:"center", gap:5 }}><I.RotateCcw s={12}/> Clique para revelar</div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize:11, fontWeight:700, color:activeDeck.color, textTransform:"uppercase", letterSpacing:1, marginBottom:18 }}>Resposta</div>
                            <div style={{ fontSize:14, lineHeight:1.7, color:"#333", whiteSpace:"pre-line" }}>{mockFlashcards[currentCard].back}</div>
                          </>
                        )}
                      </div>

                      {cardFlipped && (
                        <div style={{ display:"flex", gap:10 }}>
                          <button onClick={()=>{setCurrentCard(c=>(c+1)%mockFlashcards.length);setCardFlipped(false);}} style={{ flex:1, padding:"12px 0", border:"2px solid #FECACA", borderRadius:10, backgroundColor:"#FEF2F2", cursor:"pointer", fontSize:14, fontWeight:600, color:"#EF4444", fontFamily:"inherit" }}>
                            😕 Não lembrei
                          </button>
                          <button onClick={()=>{if(currentCard+1>=mockFlashcards.length){setFlashMode(null);setCardFlipped(false);}else{setCurrentCard(c=>c+1);setCardFlipped(false);}}} style={{ flex:1, padding:"12px 0", border:"2px solid #BBF7D0", borderRadius:10, backgroundColor:"#F0FDF4", cursor:"pointer", fontSize:14, fontWeight:600, color:"#16A34A", fontFamily:"inherit" }}>
                            ✓ Lembrei!
                          </button>
                        </div>
                      )}
                      {!cardFlipped && (
                        <button onClick={()=>setCardFlipped(true)} style={{ width:"100%", padding:"12px 0", border:"none", borderRadius:10, backgroundColor:"#F3F0FF", cursor:"pointer", fontSize:14, fontWeight:600, color:"#7C3AED", fontFamily:"inherit" }}>
                          Revelar resposta
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* ──────── PORTAL DO PACIENTE ──────── */}
        {page === "portal" && (
          <>
            {/* Header */}
            <div style={{ padding:"20px 28px 16px", backgroundColor:"#fff", borderBottom:"1px solid #EBEBEB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:52, height:52, borderRadius:14, backgroundColor:"#E0D4F5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#7C3AED" }}>CS</div>
                <div>
                  <h1 style={{ fontSize:22, fontWeight:700, margin:0, letterSpacing:-0.5 }}>Carlos Eduardo Silva</h1>
                  <p style={{ fontSize:13, color:"#888", margin:"4px 0 0" }}>58 anos • Masculino • Última consulta: 04/05/2025</p>
                  <div style={{ display:"flex", gap:5, marginTop:5 }}>
                    {["Diabetes Tipo 2","Hipertensão"].map((c,i) => (
                      <span key={i} style={{ fontSize:11, padding:"2px 8px", borderRadius:4, backgroundColor:"#F3F0FF", color:"#7C3AED", fontWeight:500 }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setRightPanel("portalCharcot")} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 20px", border:"none", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:600, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff" }}>
                <I.Sparkle s={16}/> Perguntar ao Charcot
              </button>
            </div>

            {/* Quick stats */}
            <div style={{ padding:"10px 28px", backgroundColor:"#FAFAFA", borderBottom:"1px solid #EBEBEB", display:"flex", gap:0, alignItems:"center" }}>
              {[
                { label:"Documentos", value:"8", sub:"no total" },
                { label:"Exames", value:"4", sub:"3 normais • 1 atenção" },
                { label:"Laboratórios", value:"2", sub:"conectados" },
                { label:"Última atualização", value:"Hoje", sub:"08:30" },
              ].map((s, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center" }}>
                  {i > 0 && <div style={{ width:1, height:32, backgroundColor:"#E0E0E0", margin:"0 20px" }}/>}
                  <div>
                    <div style={{ fontSize:17, fontWeight:700, letterSpacing:-0.5 }}>{s.value}</div>
                    <div style={{ fontSize:11, color:"#888" }}>{s.label} · {s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div style={{ padding:"0 28px", backgroundColor:"#fff", borderBottom:"1px solid #EBEBEB", display:"flex" }}>
              {[
                { key:"docs", label:"Meus Documentos" },
                { key:"add", label:"Adicionar documento" },
                { key:"labs", label:"Laboratórios" },
              ].map(t => (
                <button key={t.key} onClick={() => setPortalTab(t.key)} style={{
                  padding:"13px 18px", border:"none", backgroundColor:"transparent",
                  borderBottom: portalTab===t.key ? "2px solid #7C3AED" : "2px solid transparent",
                  color: portalTab===t.key ? "#7C3AED" : "#666",
                  fontWeight: portalTab===t.key ? 600 : 400,
                  fontSize:14, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s"
                }}>{t.label}</button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex:1, overflow:"auto", padding:"20px 28px" }}>

              {/* ── Meus Documentos ── */}
              {portalTab === "docs" && (
                <>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {["Todos","Exame","Prescrição","Consulta","Atestado","Pedido"].map(f => (
                        <button key={f} onClick={() => setPortalDocFilter(f)} style={{
                          padding:"6px 14px", border:`1px solid ${portalDocFilter===f?"#7C3AED":"#E0E0E0"}`,
                          borderRadius:20, backgroundColor: portalDocFilter===f ? "#F3F0FF" : "#fff",
                          color: portalDocFilter===f ? "#7C3AED" : "#666",
                          fontWeight: portalDocFilter===f ? 600 : 400,
                          fontSize:13, cursor:"pointer", fontFamily:"inherit"
                        }}>{f}</button>
                      ))}
                    </div>
                    <div style={{ fontSize:13, color:"#999" }}>{portalDocs.filter(d => portalDocFilter==="Todos" || d.type===portalDocFilter).length} documentos</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {portalDocs.filter(d => portalDocFilter==="Todos" || d.type===portalDocFilter).map(doc => (
                      <div key={doc.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px", backgroundColor:"#fff", borderRadius:12, border:"1px solid #E8E8E8" }}>
                        <div style={{ width:42, height:42, borderRadius:10, flexShrink:0, backgroundColor: doc.sourceType==="lab" ? "#EFF6FF" : "#F3F0FF", color: doc.sourceType==="lab" ? "#3B82F6" : "#7C3AED", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {doc.sourceType==="lab" ? <I.Beaker s={18}/> : <I.Doc s={18}/>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4, flexWrap:"wrap" }}>
                            <span style={{ fontWeight:600, fontSize:14 }}>{doc.name}</span>
                            <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:600,
                              backgroundColor: doc.type==="Exame"?"#EFF6FF":doc.type==="Prescrição"?"#F0FDF4":doc.type==="Atestado"?"#FFFBEB":"#F3F0FF",
                              color: doc.type==="Exame"?"#3B82F6":doc.type==="Prescrição"?"#16A34A":doc.type==="Atestado"?"#D97706":"#7C3AED"
                            }}>{doc.type}</span>
                            {doc.status && (
                              <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:600,
                                backgroundColor: doc.status==="normal" ? "#F0FDF4" : "#FFFBEB",
                                color: doc.status==="normal" ? "#16A34A" : "#D97706"
                              }}>{doc.status==="normal" ? "✓ Normal" : "⚠ Atenção"}</span>
                            )}
                          </div>
                          <div style={{ fontSize:12, color:"#999" }}>{doc.date} · {doc.source}</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <button style={{ display:"flex", alignItems:"center", gap:4, padding:"7px 12px", border:"1px solid #E0E0E0", borderRadius:8, backgroundColor:"#fff", cursor:"pointer", fontSize:12, color:"#555", fontFamily:"inherit" }}>
                            <I.Eye /> Ver
                          </button>
                          <button style={{ display:"flex", alignItems:"center", gap:4, padding:"7px 12px", border:"1px solid #E0E0E0", borderRadius:8, backgroundColor:"#fff", cursor:"pointer", fontSize:12, color:"#555", fontFamily:"inherit" }}>
                            <I.Download /> Baixar
                          </button>
                          <button onClick={() => { setPortalSelectedDoc(doc); setRightPanel("portalCharcot"); }} style={{ display:"flex", alignItems:"center", gap:4, padding:"7px 12px", border:"1px solid #7C3AED", borderRadius:8, backgroundColor:"#F3F0FF", cursor:"pointer", fontSize:12, color:"#7C3AED", fontWeight:600, fontFamily:"inherit" }}>
                            <I.Sparkle s={12}/> Charcot
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Adicionar documento ── */}
              {portalTab === "add" && (
                <div style={{ maxWidth:580, margin:"0 auto" }}>
                  <div style={{ border:"2px dashed #D0D0D0", borderRadius:14, padding:"44px 24px", textAlign:"center", backgroundColor:"#FAFAFA", marginBottom:24, cursor:"pointer" }}>
                    <div style={{ color:"#BDBDBD" }}><I.CloudUp s={42}/></div>
                    <div style={{ fontSize:16, fontWeight:600, marginTop:14, marginBottom:6, color:"#333" }}>Arraste um arquivo aqui</div>
                    <div style={{ fontSize:13, color:"#999", marginBottom:18 }}>PDF, JPG, PNG – até 20 MB</div>
                    <button style={{ padding:"8px 22px", border:"1px solid #7C3AED", borderRadius:8, backgroundColor:"#fff", color:"#7C3AED", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                      Selecionar arquivo
                    </button>
                  </div>
                  <div style={{ backgroundColor:"#fff", borderRadius:14, padding:24, border:"1px solid #E8E8E8" }}>
                    <div style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Detalhes do documento</div>
                    <div style={{ marginBottom:16 }}>
                      <label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>Nome do documento</label>
                      <input placeholder="Ex: Resultado de hemograma" style={{ width:"100%", padding:"10px 14px", border:"1px solid #E0E0E0", borderRadius:8, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                      <div>
                        <label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>Tipo</label>
                        <select style={{ width:"100%", padding:"10px 14px", border:"1px solid #E0E0E0", borderRadius:8, fontSize:14, fontFamily:"inherit", cursor:"pointer" }}>
                          <option>Exame</option><option>Prescrição</option><option>Atestado</option><option>Pedido</option><option>Consulta</option><option>Outro</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>Data do documento</label>
                        <input type="date" style={{ width:"100%", padding:"10px 14px", border:"1px solid #E0E0E0", borderRadius:8, fontSize:14, fontFamily:"inherit", cursor:"pointer" }}/>
                      </div>
                    </div>
                    <div style={{ marginBottom:24 }}>
                      <label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>Observações (opcional)</label>
                      <textarea placeholder="Contexto adicional sobre este documento..." style={{ width:"100%", minHeight:90, padding:"10px 14px", border:"1px solid #E0E0E0", borderRadius:8, fontSize:13, fontFamily:"inherit", resize:"vertical", outline:"none", lineHeight:1.5, boxSizing:"border-box" }}/>
                    </div>
                    <button style={{ width:"100%", padding:12, border:"none", borderRadius:10, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff", fontWeight:600, fontSize:15, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                      <I.Plus /> Adicionar documento
                    </button>
                  </div>
                </div>
              )}

              {/* ── Laboratórios ── */}
              {portalTab === "labs" && (
                <>
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>Laboratórios</div>
                    <div style={{ fontSize:13, color:"#888" }}>Conecte seus laboratórios para importar resultados automaticamente.</div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    {portalLabs.map(lab => (
                      <div key={lab.id} style={{ backgroundColor:"#fff", borderRadius:14, padding:"20px", border: lab.connected ? "1px solid #E8E8E8" : "1px dashed #D0D0D0" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                          <div style={{ width:46, height:46, borderRadius:12, backgroundColor:lab.color+"18", color:lab.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>{lab.abbr}</div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:15 }}>{lab.name}</div>
                            {lab.connected
                              ? <div style={{ fontSize:12, color:"#16A34A", display:"flex", alignItems:"center", gap:4, marginTop:2 }}><div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#22C55E" }}/> Conectado</div>
                              : <div style={{ fontSize:12, color:"#999", marginTop:2 }}>Não conectado</div>
                            }
                          </div>
                        </div>
                        {lab.connected && (
                          <div style={{ display:"flex", gap:10, marginBottom:14, padding:"10px 14px", backgroundColor:"#F9FAFB", borderRadius:8, border:"1px solid #EBEBEB" }}>
                            <div style={{ textAlign:"center" }}>
                              <div style={{ fontSize:18, fontWeight:700 }}>{lab.results}</div>
                              <div style={{ fontSize:11, color:"#888" }}>exames</div>
                            </div>
                            <div style={{ width:1, backgroundColor:"#E8E8E8", margin:"0 4px" }}/>
                            <div style={{ display:"flex", alignItems:"center", paddingLeft:6 }}>
                              <div style={{ fontSize:12, color:"#888" }}>Sincronizado: {lab.lastSync}</div>
                            </div>
                          </div>
                        )}
                        <div style={{ display:"flex", gap:8 }}>
                          {lab.connected ? (
                            <>
                              <button style={{ flex:1, padding:"8px 0", border:"1px solid #E0E0E0", borderRadius:8, backgroundColor:"#fff", cursor:"pointer", fontSize:13, fontWeight:500, color:"#555", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                                <I.Refresh /> Sincronizar
                              </button>
                              <button style={{ padding:"8px 14px", border:"1px solid #FECACA", borderRadius:8, backgroundColor:"#fff", cursor:"pointer", fontSize:13, color:"#EF4444", fontFamily:"inherit" }}>
                                Desconectar
                              </button>
                            </>
                          ) : (
                            <button style={{ flex:1, padding:"8px 0", border:"none", borderRadius:8, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                              <I.LinkIcon s={14}/> Conectar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
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

      {/* Trilha Charcot */}
      {rightPanel === "trilhaCharcot" && (
        <div style={{ width:400, minWidth:400, borderLeft:"1px solid #EBEBEB", backgroundColor:"#fff", display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid #EBEBEB", display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={()=>setRightPanel(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#666", display:"flex" }}><I.Close /></button>
            <div style={{ flex:1, fontSize:15, fontWeight:700 }}>Charcot – Trilha de Aprendizado</div>
            <button style={{ background:"none", border:"none", cursor:"pointer", color:"#666", display:"flex" }}><I.Refresh /></button>
          </div>

          <div style={{ padding:"8px 16px", backgroundColor:"#F9F7FF", display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#7C3AED", borderBottom:"1px solid #EDE9FE" }}>
            <I.BookOpen s={13}/> Contexto: sua prática clínica real
          </div>

          <div style={{ flex:1, overflow:"auto", padding:"20px 16px" }}>
            <div style={{ textAlign:"center", marginBottom:24, padding:"0 10px" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", backgroundColor:"#F3F0FF", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", color:"#7C3AED" }}><I.Sparkle s={24}/></div>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>O que quer aprender hoje?</div>
              <div style={{ fontSize:13, color:"#888", lineHeight:1.5 }}>Crie quizzes e flashcards personalizados ou tire dúvidas sobre suas condutas e diretrizes.</div>
            </div>

            <div style={{ fontSize:12, fontWeight:600, color:"#999", textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Criar conteúdo</div>
            {[
              "Crie um quiz sobre diabetes com base nos meus casos",
              "Gere flashcards de hipertensão conforme ESC 2024",
              "Monte um quiz de DPOC com as diretrizes GOLD 2025",
              "Crie flashcards sobre neuropatia diabética",
            ].map((s,i) => (
              <button key={i} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"10px 14px", border:"1px solid #E8E8E8", borderRadius:10, backgroundColor:"#FAFAFA", cursor:"pointer", fontSize:13, color:"#555", textAlign:"left", fontFamily:"inherit", marginBottom:8 }}>
                <I.Sparkle s={14}/> {s}
              </button>
            ))}

            <div style={{ fontSize:12, fontWeight:600, color:"#999", textTransform:"uppercase", letterSpacing:0.5, marginBottom:8, marginTop:16 }}>Analisar minha prática</div>
            {[
              "Por que meu rastreio de neuropatia está baixo?",
              "Quais diretrizes novas impactam minha prática?",
              "Analise minhas condutas dos últimos 3 meses",
              "Crie um plano de estudo semanal para mim",
            ].map((s,i) => (
              <button key={i} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"10px 14px", border:"1px solid #E8E8E8", borderRadius:10, backgroundColor:"#FAFAFA", cursor:"pointer", fontSize:13, color:"#555", textAlign:"left", fontFamily:"inherit", marginBottom:8 }}>
                <I.Target s={14}/> {s}
              </button>
            ))}
          </div>
          <ChatInput placeholder="Peça um quiz, flashcard ou análise..." />
        </div>
      )}

      {/* Portal Charcot */}
      {rightPanel === "portalCharcot" && (
        <div style={{ width:400, minWidth:400, borderLeft:"1px solid #EBEBEB", backgroundColor:"#fff", display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid #EBEBEB", display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={() => { setRightPanel(null); setPortalSelectedDoc(null); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#666", display:"flex" }}><I.Close /></button>
            <div style={{ flex:1, fontSize:15, fontWeight:700 }}>Charcot</div>
            <button style={{ background:"none", border:"none", cursor:"pointer", color:"#666", display:"flex" }}><I.Refresh /></button>
          </div>

          {portalSelectedDoc ? (
            <div style={{ padding:"10px 16px", backgroundColor:"#F3F0FF", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid #E8E0F5" }}>
              <div style={{ color:"#7C3AED" }}><I.Doc s={16}/></div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"#7C3AED", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{portalSelectedDoc.name}</div>
                <div style={{ fontSize:11, color:"#888" }}>{portalSelectedDoc.date} · {portalSelectedDoc.source}</div>
              </div>
              <button onClick={() => setPortalSelectedDoc(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#999", fontSize:18, lineHeight:1 }}>×</button>
            </div>
          ) : (
            <div style={{ padding:"8px 16px", backgroundColor:"#F0FDF4", display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#16A34A", borderBottom:"1px solid #DCFCE7" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", backgroundColor:"#22C55E" }}/> Perguntas sobre sua saúde geral
            </div>
          )}

          <div style={{ flex:1, overflow:"auto", padding:"20px 16px" }}>
            <div style={{ textAlign:"center", marginBottom:24, padding:"0 16px" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", backgroundColor:"#F3F0FF", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", color:"#7C3AED" }}><I.Sparkle s={24}/></div>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>
                {portalSelectedDoc ? "Pergunte sobre este documento" : "Como posso te ajudar?"}
              </div>
              <div style={{ fontSize:13, color:"#888", lineHeight:1.5 }}>
                {portalSelectedDoc
                  ? "Tire dúvidas sobre este resultado em linguagem simples."
                  : "Tire dúvidas sobre seus exames, medicações e saúde geral."}
              </div>
            </div>
            {(portalSelectedDoc ? [
              "O que significa este resultado?",
              "Este valor está normal para minha idade?",
              "O que devo fazer com este resultado?",
              "Isso está relacionado ao meu diabetes?",
            ] : [
              "Como estão meus últimos exames?",
              "Minhas medicações têm interações?",
              "Meu HbA1c está evoluindo bem?",
              "Quando devo marcar minha próxima consulta?",
            ]).map((s, i) => (
              <button key={i} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"10px 14px", border:"1px solid #E8E8E8", borderRadius:10, backgroundColor:"#FAFAFA", cursor:"pointer", fontSize:13, color:"#555", textAlign:"left", fontFamily:"inherit", marginBottom:8 }}>
                <I.Sparkle s={14}/> {s}
              </button>
            ))}
          </div>
          <ChatInput placeholder={portalSelectedDoc ? "Pergunte sobre este documento..." : "Pergunte sobre sua saúde..."} />
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
