import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

/* ═══════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════ */
const I = {
  Users: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Dashboard: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /></svg>,
  Clipboard: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg>,
  Chat: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>,
  Settings: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
  Search: ({ c = "#999" }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Doc: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" /></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>,
  Gift: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /></svg>,
  Support: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  Sparkle: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>,
  Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
  ChevRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>,
  ChevDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>,
  TrendUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
  TrendDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>,
  Alert: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
  Heart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>,
  Activity: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  Mic: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>,
  Print: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>,
  Share: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>,
  Pause: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="4" height="16" x="6" y="4" /><rect width="4" height="16" x="14" y="4" /></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>,
  Eye: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  Calendar: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>,
  Dots: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>,
  HelpCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>,
  ArrowUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>,
  Grid: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>,
  Page: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" /></svg>,
  Clock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  Warning: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
  Person: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Beaker: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" /></svg>,
  LinkIcon: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
  CloudUp: ({ s = 32 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>,
  BookOpen: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
  Trophy: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>,
  Target: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  Layers: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  CheckSquare: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  Zap: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  RotateCcw: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>,
  ChevLeft: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>,
  Star: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  Lock: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  CheckCircle: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  Briefcase: ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  DollarSign: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  BarChart3: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M13 17V9" /><path d="M18 17V5" /><path d="M8 17v-3" /></svg>,
  Percent: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>,
  Smile: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" /></svg>,
};

const AudioWave = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 2, height: 20 }}>
    {[10, 16, 8, 18, 12, 20, 14, 10, 16, 12, 18, 8, 14, 20, 10].map((h, i) => (
      <div key={i} style={{ width: 2.5, height: h, backgroundColor: "#1A8A8A", borderRadius: 2, opacity: 0.7 }} />
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   SHARED DATA
   ═══════════════════════════════════════════ */
const patients = [
  { id: 1, name: "Carlos Eduardo Silva", age: 58, gender: "M", lastVisit: "04/05/2025", consultations: 3, documents: 5, conditions: ["Diabetes Tipo 2", "Hipertensão"], avatar: "CS" },
  { id: 2, name: "Maria Aparecida Santos", age: 72, gender: "F", lastVisit: "28/04/2025", consultations: 7, documents: 12, conditions: ["DPOC", "ICC"], avatar: "MS" },
  { id: 3, name: "João Pedro Oliveira", age: 45, gender: "M", lastVisit: "20/04/2025", consultations: 2, documents: 3, conditions: ["Lombalgia crônica"], avatar: "JO" },
  { id: 4, name: "Ana Clara Ferreira", age: 34, gender: "F", lastVisit: "15/04/2025", consultations: 5, documents: 8, conditions: ["Asma", "Rinite alérgica"], avatar: "AF" },
  { id: 5, name: "Roberto Mendes Lima", age: 67, gender: "M", lastVisit: "10/04/2025", consultations: 10, documents: 18, conditions: ["Diabetes Tipo 2", "Neuropatia", "HAS"], avatar: "RL" },
  { id: 6, name: "Fernanda Costa Pereira", age: 29, gender: "F", lastVisit: "08/04/2025", consultations: 1, documents: 2, conditions: ["Ansiedade"], avatar: "FP" },
  { id: 7, name: "José Antônio Barbosa", age: 81, gender: "M", lastVisit: "01/04/2025", consultations: 15, documents: 24, conditions: ["Fibrilação Atrial", "HAS", "DM2"], avatar: "JB" },
  { id: 8, name: "Luciana Martins Rocha", age: 52, gender: "F", lastVisit: "28/03/2025", consultations: 4, documents: 6, conditions: ["Hipotireoidismo", "Depressão"], avatar: "LR" },
];
const patientConsultations = {
  1: [
    { date: "04/05/2025", duration: "02m 05s", docs: ["Anamnese padrão", "Atestado Médico"], summary: "Queixa de dor nos pés, falta de ar. Revisão de medicações." },
    { date: "15/01/2025", duration: "08m 30s", docs: ["Anamnese padrão"], summary: "Retorno diabetes. Ajuste de glifagem." },
    { date: "03/08/2024", duration: "05m 22s", docs: ["Anamnese padrão", "Pedido de exames"], summary: "Consulta de rotina. Solicitação de HbA1c e perfil lipídico." },
  ],
};
const transcription = [
  { time: "00m 04s", text: "e aí doutor tá joia" },
  { time: "00m 08s", text: "e é isso doutor luca como é que vai tudo em paz mas rapaz eu tô com uma dor no pé" },
  { time: "00m 15s", text: "agora quando eu tô indo dormir eu quando acordo também dói aquela primeira pisada do dia assim mas eu não sei o que é que é faz uma semana já uns meses na verdade" },
  { time: "00m 26s", text: "vamos lembrar então você tem pressão alta e diabetes né" },
  { time: "00m 31s", text: "é isso eu tô eu tomo losartana hidrocortiazida e aquele lá para o glifagem né" },
  { time: "00m 38s", text: "Ah então tá bom quando que começou essa dor no pé eu acho que começou faz uns seis meses já mas começou a incomodar faz uns dois" },
  { time: "00m 49s", text: "Ah tá bom e como é que essa dor ela pulsa ela queima uma dor aqui na planta do pé sabe aqui na" },
  { time: "00m 57s", text: "sola do pé quando eu vou dar a primeira pisada do dia dói mais assim aí vai melhorando quando" },
];
const chartMonthly = [{ month: "Set", v: 18 }, { month: "Out", v: 22 }, { month: "Nov", v: 28 }, { month: "Dez", v: 15 }, { month: "Jan", v: 32 }, { month: "Fev", v: 25 }, { month: "Mar", v: 30 }, { month: "Abr", v: 27 }, { month: "Mai", v: 12 }];
const chartConditions = [{ name: "Diabetes", value: 34, color: "#1A8A8A" }, { name: "Hipertensão", value: 42, color: "#2BA89E" }, { name: "DPOC", value: 12, color: "#3DBFB0" }, { name: "Depressão", value: 18, color: "#6ECFB8" }, { name: "Asma", value: 15, color: "#A3E0C4" }, { name: "Outros", value: 28, color: "#E0F5EF" }];
const chartAge = [{ f: "18-30", m: 8, w: 12 }, { f: "31-45", m: 15, w: 18 }, { f: "46-60", m: 22, w: 20 }, { f: "61-75", m: 18, w: 14 }, { f: "76+", m: 10, w: 8 }];
const chartHba1c = [{ month: "Out", v: 8.2 }, { month: "Nov", v: 7.9 }, { month: "Dez", v: 7.6 }, { month: "Jan", v: 7.8 }, { month: "Fev", v: 7.3 }, { month: "Mar", v: 7.1 }, { month: "Abr", v: 7.0 }, { month: "Mai", v: 6.8 }];
const riskStrat = [{ risk: "Baixo", count: 45, color: "#22C55E" }, { risk: "Moderado", count: 32, color: "#F59E0B" }, { risk: "Alto", count: 18, color: "#EF4444" }, { risk: "Crítico", count: 5, color: "#991B1B" }];
const anamneseModels = [{ name: "Anamnese padrão", desc: "Gera um registro clínico padrão", selected: true }, { name: "Atestado Médico", desc: "Modelo de atestado médico com identificação do paciente" }, { name: "Avaliação Pré-Anestésica", desc: "Indicado para anestesistas" }, { name: "Cardiologia", desc: "Informações de exame físico e scores cardiológicos" }, { name: "Cirurgia", desc: "Atende os cirurgiões de todas as áreas" }, { name: "Coloproctologia", desc: "Foco em avaliação intestinal e anorretal" }];
const docAux = [{ name: "Atestado", desc: "Atestado médico de afastamento" }, { name: "Compartilhar resumo", desc: "Resumo para compartilhar" }, { name: "Encaminhamento", desc: "Encaminhamento a outras especialidades" }, { name: "Pedido de exames", desc: "Solicitação de exames" }, { name: "Prescrição", desc: "Medicamentos prescritos (receituário)" }, { name: "Resumo clínico", desc: "Em linguagem leiga para o paciente" }];
const mockReport = {
  title: "Análise Populacional: Pacientes Diabéticos com HAS",
  summary: "Dos 100 pacientes ativos, 28 apresentam comorbidade Diabetes + Hipertensão. A média de HbA1c desse grupo caiu de 8.2% para 6.8% nos últimos 8 meses, indicando boa adesão ao tratamento. Entretanto, 5 pacientes mantêm HbA1c > 9% e requerem intervenção imediata.",
  alert: "3 pacientes com DM2 + HAS não realizam consulta há mais de 90 dias. Risco elevado de complicações microvasculares.",
  insight: "Pacientes que utilizam combinação Losartana + Metformina apresentam melhor controle pressórico (média 128/82 mmHg) vs. outras combinações (média 142/91 mmHg). Considere padronizar o protocolo.",
  recs: ["Agendar retorno urgente para os 5 pacientes com HbA1c > 9%", "Implementar rastreio de neuropatia diabética nos 28 pacientes com DM2", "Considerar inclusão de ISGLT2 nos 8 pacientes com DM2 + HAS + IMC > 30", "Solicitar fundo de olho para os 15 pacientes sem avaliação oftalmológica no último ano"],
};

/* ── Trilha do Médico ── */
const trilhaConditions = [
  { name: "Diabetes Tipo 2", count: 28, pct: 28, color: "#1A8A8A" },
  { name: "Hipertensão", count: 22, pct: 22, color: "#2BA89E" },
  { name: "DPOC", count: 12, pct: 12, color: "#3DBFB0" },
  { name: "Lombalgia crônica", count: 10, pct: 10, color: "#6ECFB8" },
  { name: "Depressão / Ansiedade", count: 9, pct: 9, color: "#A3E0C4" },
];
const condutas = {
  assertivas: [
    { label: "Solicitação de HbA1c em todos os DM2", pct: 94 },
    { label: "Ajuste de anti-hipertensivo por meta pressórica", pct: 88 },
    { label: "Rastreio de complicações renais em diabéticos", pct: 82 },
    { label: "Prescrição de estatina em DM2 + dislipidemia", pct: 79 },
  ],
  revisar: [
    { label: "Rastreio de neuropatia periférica (monofilamento)", pct: 38, rec: "Realizar em 100% dos DM2 por visita" },
    { label: "Orientação sobre atividade física documentada", pct: 44, rec: "ADA recomenda 150 min/sem – incluir no plano de cuidado" },
    { label: "Aplicação do escore SCORE2 em hipertensos > 40 anos", pct: 52, rec: "ESC 2024 – aplicar em todos os pacientes com HAS" },
  ],
};
const guidelines = [
  { title: "ADA 2025 – Padrões de Cuidado em Diabetes", tag: "Novo", tagColor: "#1A8A8A", desc: "Novos alvos glicêmicos para idosos e uso expandido de iSGLT2 em insuficiência cardíaca." },
  { title: "ESC 2024 – Hipertensão Arterial", tag: "Atualizado", tagColor: "#3B82F6", desc: "Estratégia de tratamento combinado inicial para HAS estágio 2; nova tabela de risco SCORE2." },
  { title: "GOLD 2025 – DPOC", tag: "Novo", tagColor: "#F59E0B", desc: "Revisão dos critérios diagnósticos e novo algoritmo de tratamento baseado em fenótipo." },
];
const quizList = [
  { id: 1, title: "Diabetes Tipo 2 – Manejo clínico", questions: 8, done: 8, score: 87, tag: "Concluído", tagColor: "#22C55E", tagBg: "#F0FDF4" },
  { id: 2, title: "Hipertensão – Metas e tratamento", questions: 6, done: 3, score: null, tag: "Em progresso", tagColor: "#D97706", tagBg: "#FFFBEB" },
  { id: 3, title: "DPOC – Diagnóstico e estadiamento", questions: 10, done: 0, score: null, tag: "Novo", tagColor: "#1A8A8A", tagBg: "#E8F7F2" },
];
const mockQuiz = {
  title: "Hipertensão – Metas e tratamento",
  questions: [
    { q: "Qual a meta pressórica recomendada pelo ESC 2024 para pacientes com HAS de alto risco cardiovascular?", opts: ["< 140/90 mmHg", "< 130/80 mmHg", "< 120/70 mmHg", "< 135/85 mmHg"], correct: 1, exp: "O ESC 2024 recomenda alvo < 130/80 mmHg para pacientes de alto risco, reduzindo o limiar anterior de 140/90 mmHg." },
    { q: "Qual combinação de anti-hipertensivos é preferida como terapia inicial em HAS estágio 2?", opts: ["BRA + tiazídico", "IECA + BCC", "BB + diurético de alça", "BCC + BB isolado"], correct: 1, exp: "A combinação IECA/BRA + BCC ou IECA/BRA + tiazídico é recomendada como primeira linha para HAS estágio 2." },
    { q: "Em pacientes com HAS e DM2, qual a meta de HbA1c que equilibra benefício cardiovascular e risco de hipoglicemia?", opts: ["< 6,0%", "< 7,0%", "< 8,0%", "< 9,0%"], correct: 1, exp: "HbA1c < 7,0% é o alvo padrão ADA 2025, equilibrando benefício cardiovascular e risco de hipoglicemia na maioria dos pacientes." },
  ],
};
const flashDecks = [
  { id: 1, title: "DM2 – Farmacologia", cards: 12, reviewed: 8, color: "#1A8A8A", tag: "4 pendentes", tagColor: "#D97706" },
  { id: 2, title: "HAS – Metas e Classes", cards: 8, reviewed: 8, color: "#3B82F6", tag: "Revisado", tagColor: "#16A34A" },
  { id: 3, title: "Neuropatia Diabética", cards: 6, reviewed: 0, color: "#F59E0B", tag: "Novo", tagColor: "#1A8A8A" },
  { id: 4, title: "DPOC – Estadiamento GOLD", cards: 10, reviewed: 5, color: "#22C55E", tag: "Em andamento", tagColor: "#D97706" },
];
const mockFlashcards = [
  { front: "Quais são os critérios diagnósticos de DM2?", back: "Glicemia de jejum ≥ 126 mg/dL em 2 ocasiões\nOU HbA1c ≥ 6,5%\nOU glicemia 2h pós-TOTG ≥ 200 mg/dL\nOU glicemia aleatória ≥ 200 mg/dL com sintomas clássicos" },
  { front: "Quando iniciar metformina no DM2?", back: "Imediatamente ao diagnóstico (se tolerada)\nAssociada a mudança de estilo de vida\nContraindicada: TFG < 30 mL/min/1,73m²\nReduzir dose se TFG entre 30-45 mL/min" },
  { front: "Quais iSGLT2 têm benefício cardiovascular comprovado em DM2?", back: "Empagliflozina (EMPA-REG OUTCOME)\nCanagliflozina (CANVAS, CREDENCE)\nDapagliflozina (DECLARE-TIMI 58)\nBenefício adicional: ↓ hospitalização por IC e progressão renal" },
  { front: "Meta de HbA1c no DM2 – adulto sem comorbidades relevantes", back: "< 7,0% (padrão ADA 2025)\nMais rigoroso (< 6,5%): jovens, curta duração de DM, sem risco de hipoglicemia\nMenos rigoroso (< 8,0%): idosos frágeis ou com expectativa de vida reduzida" },
];

/* ── Trilha do Paciente ── */
const patTrilhaTopics = [
  { id: 1, emoji: "🩺", title: "Entendendo o Diabetes", desc: "Saiba o que é o diabetes e como ele afeta seu corpo.", lições: 5, done: 3, color: "#1A8A8A", colorBg: "#E8F7F2", xp: 150, tag: "Em andamento", tagColor: "#D97706" },
  { id: 2, emoji: "💊", title: "Suas Medicações", desc: "Aprenda sobre a Metformina e seus outros medicamentos.", lições: 4, done: 4, color: "#22C55E", colorBg: "#F0FDF4", xp: 100, tag: "Concluído", tagColor: "#16A34A" },
  { id: 3, emoji: "❤️", title: "Pressão Arterial em Dia", desc: "Entenda a hipertensão e como controlar sua pressão.", lições: 5, done: 2, color: "#EF4444", colorBg: "#FEF2F2", xp: 120, tag: "Em andamento", tagColor: "#D97706" },
  { id: 4, emoji: "🏃", title: "Vida Ativa", desc: "Como a atividade física ajuda no diabetes e na pressão.", lições: 4, done: 1, color: "#3B82F6", colorBg: "#EFF6FF", xp: 130, tag: "Iniciado", tagColor: "#3B82F6" },
  { id: 5, emoji: "🥗", title: "Alimentação Saudável", desc: "Aprenda a comer bem vivendo com diabetes.", lições: 6, done: 0, color: "#F59E0B", colorBg: "#FFFBEB", xp: 140, tag: "Disponível no Nível 4", tagColor: "#D97706", locked: true },
];
const patTrilhaAchievements = [
  { emoji: "🔥", title: "7 dias seguidos", desc: "Estudou 7 dias em sequência", unlocked: true, date: "23/02/2026" },
  { emoji: "🏆", title: "Primeiro quiz feito", desc: "Completou o primeiro quiz da trilha", unlocked: true, date: "18/02/2026" },
  { emoji: "💊", title: "Especialista em medicações", desc: "Completou o módulo de medicações", unlocked: true, date: "15/02/2026" },
  { emoji: "🎯", title: "100% no quiz de diabetes", desc: "Acertou todas as questões do quiz de diabetes", unlocked: false, date: null },
  { emoji: "🏃", title: "Vida Ativa", desc: "Complete o módulo de atividade física", unlocked: false, date: null },
  { emoji: "⭐", title: "Explorador da Saúde", desc: "Alcance o Nível 4", unlocked: false, date: null },
  { emoji: "🤝", title: "Paciente Engajado", desc: "Use o ClinBot por 5 dias seguidos", unlocked: false, date: null },
  { emoji: "💪", title: "Mestre do Glicêmico", desc: "Mantenha HbA1c abaixo de 7% por 3 meses seguidos", unlocked: false, date: null },
];
const patTrilhaQuizList = [
  { id: 1, title: "Diabetes: O Básico", questions: 3, done: 3, score: 80, tag: "Concluído", tagColor: "#16A34A", tagBg: "#F0FDF4", emoji: "🩺" },
  { id: 2, title: "Suas Medicações", questions: 4, done: 0, score: null, tag: "Novo", tagColor: "#1A8A8A", tagBg: "#E8F7F2", emoji: "💊" },
  { id: 3, title: "Pressão Alta: Fatos e Mitos", questions: 4, done: 0, score: null, tag: "Novo", tagColor: "#1A8A8A", tagBg: "#E8F7F2", emoji: "❤️" },
];
const patMockQuiz = {
  title: "Diabetes: O Básico",
  questions: [
    { q: "O que é a HbA1c que seu médico sempre mede?", opts: ["Uma vitamina importante", "Uma medida do açúcar no sangue nos últimos 3 meses", "Um exame de pressão", "Um teste de colesterol"], correct: 1, exp: "A HbA1c mostra como estava o açúcar no seu sangue nos últimos 3 meses. Quanto menor, melhor! O seu está em 7,1% — ótima evolução!" },
    { q: "Por que é importante tomar Metformina todos os dias?", opts: ["Só tomar quando sentir mal", "Para ajudar o organismo a usar o açúcar corretamente", "Para baixar a pressão", "Para dormir melhor"], correct: 1, exp: "A Metformina ajuda seu corpo a usar o açúcar de forma mais eficiente. Tomar no horário certo, todo dia, faz toda a diferença no controle do diabetes." },
    { q: "Qual destes aumenta mais rapidamente o açúcar no sangue?", opts: ["Feijão cozido", "Frango grelhado", "Refrigerante", "Ovo mexido"], correct: 2, exp: "Bebidas açucaradas como refrigerantes sobem rapidamente o açúcar no sangue. Prefira água, chás sem açúcar ou suco natural sem adição." },
  ],
};

const portalDocs = [
  { id: 1, name: "Hemograma completo", type: "Exame", date: "20/02/2026", source: "Fleury Laboratórios", sourceType: "lab", status: "normal" },
  { id: 2, name: "HbA1c – 7.1%", type: "Exame", date: "20/02/2026", source: "Fleury Laboratórios", sourceType: "lab", status: "atenção" },
  { id: 3, name: "Anamnese padrão", type: "Consulta", date: "04/05/2025", source: "Dr. Luca Becari", sourceType: "doctor", status: null },
  { id: 4, name: "Atestado Médico", type: "Atestado", date: "04/05/2025", source: "Dr. Luca Becari", sourceType: "doctor", status: null },
  { id: 5, name: "Prescrição – Metformina 500mg", type: "Prescrição", date: "15/01/2025", source: "Dr. Luca Becari", sourceType: "doctor", status: null },
  { id: 6, name: "Perfil lipídico completo", type: "Exame", date: "03/08/2024", source: "Dasa", sourceType: "lab", status: "normal" },
  { id: 7, name: "Pedido de exames", type: "Pedido", date: "03/08/2024", source: "Dr. Luca Becari", sourceType: "doctor", status: null },
  { id: 8, name: "ECG de repouso", type: "Exame", date: "12/06/2024", source: "Hermes Pardini", sourceType: "lab", status: "normal" },
];
const portalLabs = [
  { id: "fleury", name: "Fleury Laboratórios", abbr: "FL", connected: true, results: 2, lastSync: "Hoje, 08:30", color: "#0066CC" },
  { id: "dasa", name: "Dasa", abbr: "DA", connected: true, results: 1, lastSync: "03/08/2024", color: "#E63946" },
  { id: "pardini", name: "Hermes Pardini", abbr: "HP", connected: false, results: 0, lastSync: null, color: "#2D6A4F" },
  { id: "einstein", name: "Albert Einstein", abbr: "AE", connected: false, results: 0, lastSync: null, color: "#1A8A8A" },
];

const patientBriefs = {
  1: {
    summary: "Carlos vem evoluindo bem no controle glicêmico — a HbA1c caiu para 7.1% no último exame. Porém, na última consulta, ele trouxe uma queixa nova de dor na planta dos pés que vem piorando há 6 meses, com padrão que pode sugerir tanto fasciite plantar quanto neuropatia diabética. Ainda não foi feito rastreio formal de neuropatia periférica e o fundo de olho está atrasado há mais de 1 ano. Ele toma Metformina, Losartana e Hidroclorotiazida — vale considerar se não seria hora de introduzir um iSGLT2 dado o perfil cardiorrenal.",
    meds: ["Metformina 500mg 2x/dia", "Losartana 50mg 1x/dia", "Hidroclorotiazida 25mg 1x/dia"],
    pending: [
      { type: "exam", label: "Fundo de olho não realizado há 14 meses", severity: "high" },
      { type: "screening", label: "Rastreio de neuropatia periférica pendente", severity: "high" },
      { type: "exam", label: "Perfil lipídico — solicitar atualização", severity: "medium" },
    ],
    lastInsight: "Queixa de dor nos pés (planta, ao pisar) há ~6 meses, piorando. Padrão compatível com fasciite plantar ou neuropatia diabética. Revisão de medicações realizada.",
    risks: ["Neuropatia não rastreada", "DM2 + HAS sem iSGLT2", "Sem avaliação oftalmológica recente"],
    suggestedTopics: ["Exame dos pés (monofilamento + diapasão)", "Avaliar indicação de iSGLT2", "Solicitar fundo de olho", "Reforçar adesão à atividade física"],
  },
  2: {
    summary: "D. Maria está estável tanto na DPOC quanto na ICC — classe funcional NYHA II mantida. Teve uma exacerbação leve no inverno passado que resolveu com ajuste do inalatório, sem internação. O ponto de atenção agora é que a espirometria de controle está vencida há 8 meses e não temos registro recente da vacinação pneumocócica. Importante monitorar o peso nessa consulta — ganho rápido pode sinalizar descompensação da ICC.",
    meds: ["Formoterol/Budesonida 12/400mcg 2x/dia", "Furosemida 40mg 1x/dia", "Carvedilol 6.25mg 2x/dia", "Enalapril 10mg 2x/dia"],
    pending: [
      { type: "exam", label: "Espirometria vencida há 8 meses", severity: "high" },
      { type: "vaccine", label: "Vacina pneumocócica — verificar status", severity: "medium" },
    ],
    lastInsight: "Paciente com exacerbação leve no inverno, controlada com corticoide inalatório. Classe funcional NYHA II estável.",
    risks: ["Risco de exacerbação sazonal", "ICC descompensação — monitorar peso"],
    suggestedTopics: ["Solicitar espirometria de controle", "Verificar vacinação", "Avaliar peso e sinais de congestão"],
  },
  3: {
    summary: "João Pedro veio com lombalgia mecânica há 2 consultas, sem irradiação e sem sinais de alarme. Foi orientado fisioterapia e fortalecimento lombar, mas o retorno de 30 dias não foi agendado. O risco principal aqui é a cronificação — se ele não aderiu à reabilitação, talvez seja hora de investigar com imagem. Paciente jovem, sem outras comorbidades, perfil de boa resposta se bem conduzido.",
    meds: ["Dipirona 500mg SOS", "Ciclobenzaprina 10mg à noite"],
    pending: [
      { type: "followup", label: "Retorno em 30 dias não agendado", severity: "medium" },
    ],
    lastInsight: "Lombalgia mecânica sem irradiação. Orientado fisioterapia e exercícios de fortalecimento lombar.",
    risks: ["Cronificação sem reabilitação adequada"],
    suggestedTopics: ["Avaliar adesão à fisioterapia", "Pesquisar sinais de alarme", "Considerar imagem se sem melhora"],
  },
  4: {
    summary: "Ana Clara tem asma bem controlada com budesonida inalatória e rinite alérgica persistente que responde bem à fexofenadina. Boa adesão ao tratamento e sem crises recentes. A espirometria anual de controle precisa ser agendada, mas sem urgência. Vale revisar a técnica inalatória nessa consulta e perguntar sobre exposição a gatilhos ambientais no domicílio — poeira, mofo, pelos de animais.",
    meds: ["Budesonida 200mcg 2x/dia", "Salbutamol SOS", "Fexofenadina 180mg 1x/dia"],
    pending: [
      { type: "exam", label: "Espirometria de controle anual — agendar", severity: "low" },
    ],
    lastInsight: "Asma sob controle com corticoide inalatório. Rinite alérgica persistente, respondendo bem ao anti-histamínico.",
    risks: ["Subdiagnóstico de gatilhos ambientais"],
    suggestedTopics: ["Revisar técnica inalatória", "Avaliar controle de ambiente domiciliar"],
  },
  5: {
    summary: "Roberto é um paciente complexo — DM2 com neuropatia periférica e HAS, já com 10 consultas. A HbA1c está subindo (8.4% no último exame), e ele relatou dificuldade em manter a dieta. Usa 6 medicamentos incluindo pregabalina para a neuropatia, com melhora parcial. Nunca fez microalbuminúria e o último ECG tem 18 meses. É urgente intensificar o tratamento — considerar iSGLT2 ou GLP-1 — e rastrear nefropatia. Paciente que precisa de uma conversa franca sobre adesão.",
    meds: ["Metformina 850mg 3x/dia", "Glicazida 60mg 1x/dia", "Losartana 100mg 1x/dia", "Anlodipino 5mg 1x/dia", "Pregabalina 75mg 2x/dia", "AAS 100mg 1x/dia"],
    pending: [
      { type: "exam", label: "HbA1c acima da meta (8.4%) — ajuste terapêutico urgente", severity: "high" },
      { type: "exam", label: "Microalbuminúria — solicitar", severity: "high" },
      { type: "screening", label: "ECG de controle — último há 18 meses", severity: "medium" },
    ],
    lastInsight: "Paciente com neuropatia periférica em uso de pregabalina com melhora parcial. HbA1c subindo nas últimas 2 dosagens — baixa adesão dietética relatada.",
    risks: ["HbA1c fora da meta", "Nefropatia diabética não rastreada", "Polifarmácia — 6 medicamentos"],
    suggestedTopics: ["Intensificar tratamento — considerar iSGLT2 ou GLP-1", "Solicitar microalbuminúria", "Reforçar orientação dietética", "Solicitar ECG"],
  },
  6: {
    summary: "Fernanda iniciou escitalopram 10mg na primeira consulta, há cerca de 30 dias. Foi orientada sobre o período de latência de 2-4 semanas e possíveis efeitos colaterais iniciais (náusea, cefaleia). Essa será a consulta de reavaliação — importante aplicar uma escala de ansiedade, perguntar sobre efeitos adversos e avaliar se a resposta foi adequada. Considerar associar psicoterapia caso ainda não tenha iniciado. Atenção redobrada: período inicial de ISRS requer monitoramento de ideação.",
    meds: ["Escitalopram 10mg 1x/dia"],
    pending: [
      { type: "followup", label: "Retorno em 30 dias para avaliar resposta ao ISRS", severity: "medium" },
    ],
    lastInsight: "Início de escitalopram 10mg. Orientada sobre período de latência de 2-4 semanas e possíveis efeitos colaterais iniciais.",
    risks: ["Período inicial de ISRS — monitorar ideação suicida"],
    suggestedTopics: ["Avaliar resposta ao escitalopram", "Perguntar sobre efeitos colaterais", "Avaliar necessidade de psicoterapia associada"],
  },
  7: {
    summary: "Seu José é o paciente mais complexo da carteira — 81 anos, FA crônica anticoagulada com rivaroxabana, HAS e DM2. CHA₂DS₂-VASc = 5. Na última consulta, a metformina foi ajustada por TFG limítrofe, o que também levanta a questão de reavaliar a dose da rivaroxabana. São 5 medicamentos e risco alto de queda — nunca foi feito rastreio formal de fragilidade. A função renal precisa de controle (último há 6 meses). Paciente que merece uma revisão cuidadosa de polifarmácia e risco de eventos adversos.",
    meds: ["Rivaroxabana 20mg 1x/dia", "Bisoprolol 5mg 1x/dia", "Losartana 50mg 1x/dia", "Metformina 500mg 2x/dia", "Atorvastatina 40mg 1x/dia"],
    pending: [
      { type: "exam", label: "INR — verificar se anticoagulação adequada", severity: "high" },
      { type: "screening", label: "Avaliação de função renal — último há 6 meses", severity: "medium" },
      { type: "screening", label: "Rastreio de fragilidade — não realizado", severity: "medium" },
    ],
    lastInsight: "FA com resposta ventricular controlada com bisoprolol. Anticoagulado com rivaroxabana. Ajuste recente de metformina por TFG limítrofe.",
    risks: ["Risco tromboembólico elevado", "TFG limítrofe — ajuste de doses", "Polifarmácia + risco de queda"],
    suggestedTopics: ["Avaliar TFG e ajustar rivaroxabana se necessário", "Pesquisar risco de queda", "Solicitar ecocardiograma se não recente"],
  },
  8: {
    summary: "Luciana está em boa evolução — o hipotireoidismo está controlado com levotiroxina e o TSH normalizou na última dosagem. A depressão está em remissão parcial com sertralina 100mg. Nesta consulta, vale discutir o plano de manutenção: quanto tempo manter a sertralina antes de considerar desmame. Aplicar o PHQ-9 para documentar o grau de remissão. O TSH de controle já pode ser solicitado (último há 5 meses).",
    meds: ["Levotiroxina 75mcg 1x/dia", "Sertralina 100mg 1x/dia"],
    pending: [
      { type: "exam", label: "TSH de controle — solicitar (último há 5 meses)", severity: "low" },
    ],
    lastInsight: "Hipotireoidismo com TSH normalizado na última dosagem. Depressão em remissão parcial com sertralina 100mg — avaliação de manutenção.",
    risks: ["Depressão — avaliar necessidade de manutenção vs. desmame"],
    suggestedTopics: ["Solicitar TSH de controle", "Aplicar PHQ-9 para avaliar remissão", "Discutir plano de manutenção da sertralina"],
  },
};

/* ── Dados do Gestor (UBS/ESF) ── */
const gestorIndicadoresPrevine = [
  { id: 1, label: "Pré-natal (6+ consultas)", meta: 60, real: 72, icon: "🤰" },
  { id: 2, label: "Citopatológico (mulheres 25-64a)", meta: 40, real: 35, icon: "🩺" },
  { id: 3, label: "Vacinação infantil em dia", meta: 95, real: 88, icon: "💉" },
  { id: 4, label: "Hipertensão — PA controlada", meta: 50, real: 62, icon: "❤️" },
  { id: 5, label: "Diabetes — HbA1c < 7%", meta: 50, real: 45, icon: "🩸" },
  { id: 6, label: "Saúde bucal (1ª consulta)", meta: 30, real: 38, icon: "🦷" },
  { id: 7, label: "Cadastro e-SUS atualizado", meta: 80, real: 91, icon: "📋" },
];
const gestorAtendimentosChart = [
  { month: "Set", agendada: 320, espontanea: 180, visita: 95 },
  { month: "Out", agendada: 345, espontanea: 195, visita: 102 },
  { month: "Nov", agendada: 380, espontanea: 210, visita: 110 },
  { month: "Dez", agendada: 290, espontanea: 240, visita: 85 },
  { month: "Jan", agendada: 410, espontanea: 225, visita: 118 },
  { month: "Fev", agendada: 395, espontanea: 205, visita: 125 },
  { month: "Mar", agendada: 420, espontanea: 230, visita: 130 },
];
const gestorICSAB = [
  { condicao: "Hipertensão", internacoes: 18, prev: 24, color: "#EF4444" },
  { condicao: "Diabetes", internacoes: 12, prev: 16, color: "#F59E0B" },
  { condicao: "Asma/DPOC", internacoes: 8, prev: 11, color: "#3B82F6" },
  { condicao: "Pneumonia", internacoes: 6, prev: 9, color: "#8B5CF6" },
  { condicao: "Gastroenterite", internacoes: 4, prev: 5, color: "#22C55E" },
  { condicao: "Infecção urinária", internacoes: 3, prev: 4, color: "#EC4899" },
];
const gestorVacinacao = [
  { vacina: "BCG", cobertura: 97, meta: 95 },
  { vacina: "Penta", cobertura: 89, meta: 95 },
  { vacina: "VIP/VOP", cobertura: 91, meta: 95 },
  { vacina: "Tríplice Viral", cobertura: 85, meta: 95 },
  { vacina: "Pneumo 10", cobertura: 92, meta: 95 },
  { vacina: "Influenza (idosos)", cobertura: 78, meta: 90 },
];
const gestorEquipesESF = [
  { id: 1, nome: "ESF Jardim Esperança", area: "Microárea 1-6", medico: "Dr. Luca Becari", enfermeiro: "Enf. Carla Souza", acs: 6, populacao: 3200, cobertura: 94, consultas: 342, status: "Completa", statusColor: "#22C55E" },
  { id: 2, nome: "ESF Vila Nova", area: "Microárea 7-12", medico: "Dra. Priscila Lima", enfermeiro: "Enf. Roberto Dias", acs: 5, populacao: 2800, cobertura: 88, consultas: 298, status: "Completa", statusColor: "#22C55E" },
  { id: 3, nome: "ESF Centro", area: "Microárea 13-17", medico: "Dr. Marcos Alves", enfermeiro: "Enf. Juliana Costa", acs: 4, populacao: 3500, cobertura: 76, consultas: 315, status: "Incompleta", statusColor: "#F59E0B" },
  { id: 4, nome: "ESF Boa Vista", area: "Microárea 18-23", medico: "Dra. Fernanda Reis", enfermeiro: "Enf. Paulo Mendes", acs: 6, populacao: 3347, cobertura: 97, consultas: 329, status: "Completa", statusColor: "#22C55E" },
];
const gestorAgendaUBS = [
  { hora: "07:00", paciente: "Maria da Conceição Silva", profissional: "Dr. Luca Becari", tipo: "Pré-natal", status: "Confirmado", statusColor: "#22C55E", statusBg: "#F0FDF4" },
  { hora: "07:30", paciente: "José Antônio Ferreira", profissional: "Enf. Carla Souza", tipo: "Hiperdia", status: "Confirmado", statusColor: "#22C55E", statusBg: "#F0FDF4" },
  { hora: "08:00", paciente: "Ana Paula Oliveira", profissional: "Dr. Luca Becari", tipo: "Puericultura", status: "Aguardando", statusColor: "#F59E0B", statusBg: "#FFFBEB" },
  { hora: "08:30", paciente: "Francisco das Chagas", profissional: "Enf. Carla Souza", tipo: "Curativo", status: "Em atendimento", statusColor: "#3B82F6", statusBg: "#EFF6FF" },
  { hora: "09:00", paciente: "Demanda espontânea", profissional: "Dr. Luca Becari", tipo: "Acolhimento", status: "Reservado", statusColor: "#8B5CF6", statusBg: "#F5F3FF" },
  { hora: "09:30", paciente: "Rosa Maria Santos", profissional: "Dr. Luca Becari", tipo: "Saúde Mental", status: "Confirmado", statusColor: "#22C55E", statusBg: "#F0FDF4" },
  { hora: "10:00", paciente: "Visita domiciliar — Micro 3", profissional: "ACS Luciana", tipo: "VD Acamado", status: "Agendado", statusColor: "#1A8A8A", statusBg: "#E8F7F2" },
  { hora: "14:00", paciente: "Grupo Hiperdia", profissional: "Equipe ESF", tipo: "Atividade coletiva", status: "Confirmado", statusColor: "#22C55E", statusBg: "#F0FDF4" },
];
const gestorRepasse = [
  { month: "Set", pab: 45200, previne: 28400 }, { month: "Out", pab: 45200, previne: 31200 },
  { month: "Nov", pab: 45200, previne: 33800 }, { month: "Dez", pab: 45200, previne: 30100 },
  { month: "Jan", pab: 48500, previne: 35600 }, { month: "Fev", pab: 48500, previne: 37200 },
  { month: "Mar", pab: 48500, previne: 38900 },
];

/* ── Dados Medicina Ocupacional ── */
const ocupEmpresas = [
  { id: 1, name: "TechBrasil Ltda", cnpj: "12.345.678/0001-90", ramo: "Tecnologia", funcionarios: 85, risco: 1, pcmsoVigencia: "12/2026", status: "Em dia", statusColor: "#22C55E", avatar: "TB" },
  { id: 2, name: "Construmax Engenharia", cnpj: "23.456.789/0001-01", ramo: "Construção Civil", funcionarios: 142, risco: 3, pcmsoVigencia: "06/2026", status: "Em dia", statusColor: "#22C55E", avatar: "CE" },
  { id: 3, name: "Indústria Química Apex", cnpj: "34.567.890/0001-12", ramo: "Indústria Química", funcionarios: 67, risco: 4, pcmsoVigencia: "03/2026", status: "Vencendo", statusColor: "#F59E0B", avatar: "QA" },
  { id: 4, name: "Logística Rápida S.A.", cnpj: "45.678.901/0001-23", ramo: "Transporte/Logística", funcionarios: 210, risco: 2, pcmsoVigencia: "09/2026", status: "Em dia", statusColor: "#22C55E", avatar: "LR" },
  { id: 5, name: "Alimentos BomSabor", cnpj: "56.789.012/0001-34", ramo: "Indústria Alimentícia", funcionarios: 95, risco: 2, pcmsoVigencia: "01/2026", status: "Vencido", statusColor: "#EF4444", avatar: "AB" },
];
const ocupFuncionarios = [
  { id: 1, empresaId: 2, empresa: "Construmax Engenharia", name: "Marcos Vinícius Souza", cargo: "Pedreiro", setor: "Obra Externa", riscos: ["Ruído", "Ergonômico", "Queda"], ultimoASO: "15/09/2025", proximoASO: "15/03/2026", status: "Próximo", statusColor: "#F59E0B", statusBg: "#FFFBEB", avatar: "MS" },
  { id: 2, empresaId: 1, empresa: "TechBrasil Ltda", name: "Juliana Almeida Costa", cargo: "Desenvolvedora", setor: "TI", riscos: ["Ergonômico"], ultimoASO: "20/01/2026", proximoASO: "20/01/2027", status: "Em dia", statusColor: "#22C55E", statusBg: "#F0FDF4", avatar: "JC" },
  { id: 3, empresaId: 3, empresa: "Indústria Química Apex", name: "Ricardo Santos Lima", cargo: "Operador de Produção", setor: "Linha de Produção", riscos: ["Químico", "Ruído", "Biológico"], ultimoASO: "10/06/2025", proximoASO: "10/12/2025", status: "Vencido", statusColor: "#EF4444", statusBg: "#FEF2F2", avatar: "RL" },
  { id: 4, empresaId: 4, empresa: "Logística Rápida S.A.", name: "Carlos Alberto Mendes", cargo: "Motorista", setor: "Frota", riscos: ["Ergonômico", "Acidente"], ultimoASO: "05/11/2025", proximoASO: "05/05/2026", status: "Em dia", statusColor: "#22C55E", statusBg: "#F0FDF4", avatar: "CM" },
  { id: 5, empresaId: 2, empresa: "Construmax Engenharia", name: "Anderson Pereira Silva", cargo: "Eletricista", setor: "Manutenção", riscos: ["Elétrico", "Queda", "Ruído"], ultimoASO: "28/08/2025", proximoASO: "28/02/2026", status: "Vencido", statusColor: "#EF4444", statusBg: "#FEF2F2", avatar: "AS" },
  { id: 6, empresaId: 5, empresa: "Alimentos BomSabor", name: "Patrícia Oliveira Ramos", cargo: "Auxiliar de Produção", setor: "Embalagem", riscos: ["Ergonômico", "Biológico"], ultimoASO: "12/12/2025", proximoASO: "12/06/2026", status: "Em dia", statusColor: "#22C55E", statusBg: "#F0FDF4", avatar: "PR" },
  { id: 7, empresaId: 3, empresa: "Indústria Química Apex", name: "Fernando Gomes Ribeiro", cargo: "Técnico de Segurança", setor: "SESMT", riscos: ["Químico", "Ruído"], ultimoASO: "01/02/2026", proximoASO: "01/08/2026", status: "Em dia", statusColor: "#22C55E", statusBg: "#F0FDF4", avatar: "FR" },
  { id: 8, empresaId: 4, empresa: "Logística Rápida S.A.", name: "Luciana Ferreira Dias", cargo: "Conferente", setor: "Armazém", riscos: ["Ergonômico", "Acidente"], ultimoASO: "18/10/2025", proximoASO: "18/04/2026", status: "Próximo", statusColor: "#F59E0B", statusBg: "#FFFBEB", avatar: "LD" },
];
const ocupExamesTipos = ["Admissional", "Periódico", "Retorno ao trabalho", "Mudança de função", "Demissional"];
const ocupAgendaHoje = [
  { hora: "08:00", funcionario: "Marcos Vinícius Souza", empresa: "Construmax Engenharia", tipo: "Periódico", status: "Aguardando", statusColor: "#F59E0B", statusBg: "#FFFBEB" },
  { hora: "08:45", funcionario: "Anderson Pereira Silva", empresa: "Construmax Engenharia", tipo: "Periódico", status: "Em atendimento", statusColor: "#3B82F6", statusBg: "#EFF6FF" },
  { hora: "09:30", funcionario: "Novo colaborador", empresa: "TechBrasil Ltda", tipo: "Admissional", status: "Confirmado", statusColor: "#22C55E", statusBg: "#F0FDF4" },
  { hora: "10:15", funcionario: "Ricardo Santos Lima", empresa: "Ind. Química Apex", tipo: "Periódico", status: "Confirmado", statusColor: "#22C55E", statusBg: "#F0FDF4" },
  { hora: "11:00", funcionario: "Maria José Santos", empresa: "Alimentos BomSabor", tipo: "Retorno ao trabalho", status: "Confirmado", statusColor: "#22C55E", statusBg: "#F0FDF4" },
  { hora: "14:00", funcionario: "Pedro Henrique Alves", empresa: "Logística Rápida S.A.", tipo: "Demissional", status: "Não confirmado", statusColor: "#EF4444", statusBg: "#FEF2F2" },
];
const ocupExamesChart = [
  { month: "Set", v: 38 }, { month: "Out", v: 45 }, { month: "Nov", v: 52 },
  { month: "Dez", v: 28 }, { month: "Jan", v: 61 }, { month: "Fev", v: 55 },
  { month: "Mar", v: 48 },
];
const ocupRiscoChart = [
  { name: "Ergonômico", value: 35, color: "#1A8A8A" },
  { name: "Ruído", value: 25, color: "#2BA89E" },
  { name: "Químico", value: 18, color: "#F59E0B" },
  { name: "Acidente", value: 14, color: "#EF4444" },
  { name: "Biológico", value: 8, color: "#3B82F6" },
];

/* ═══════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════ */
const NavIcon = ({ icon, active, onClick, badge }) => (
  <div onClick={onClick} style={{
    width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 10, backgroundColor: active ? "#E8F7F2" : "transparent", cursor: "pointer",
    color: active ? "#1A8A8A" : "#666", position: "relative", transition: "all 0.15s"
  }}>
    {icon}
    {badge && <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", backgroundColor: "#EF4444", border: "2px solid #fff" }} />}
  </div>
);

const SidebarBottom = () => (
  <div style={{ borderTop: "1px solid #EBEBEB", padding: "8px 12px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", cursor: "pointer" }}>
      <div style={{ position: "relative" }}><I.Bell /><div style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, backgroundColor: "#22C55E", borderRadius: "50%", border: "1.5px solid #fff" }} /></div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", cursor: "pointer" }}>
      <I.Gift /><span style={{ fontSize: 13, color: "#333" }}>Indique e ganhe</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#22C55E", backgroundColor: "#F0FDF4", padding: "2px 6px", borderRadius: 4 }}>NOVO</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", cursor: "pointer" }}>
      <I.Support /><span style={{ fontSize: 13, color: "#333" }}>Ajuda e suporte</span>
    </div>
    <div style={{ background: "linear-gradient(135deg,#1A8A8A,#2BA89E)", borderRadius: 10, padding: "12px 14px", marginTop: 8, marginBottom: 8, cursor: "pointer" }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>Desbloquear plano PRO</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Resta 1 dia de teste</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", borderTop: "1px solid #EBEBEB", cursor: "pointer" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#CCF0E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#1A8A8A", position: "relative" }}>
        LB<div style={{ position: "absolute", bottom: -2, right: -2, fontSize: 7, backgroundColor: "#1A8A8A", color: "#fff", padding: "1px 3px", borderRadius: 3, fontWeight: 700 }}>TRIAL</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>Luca Becari</div>
        <div style={{ fontSize: 11, color: "#888" }}>becariluca@gmail.com</div>
      </div>
      <I.ChevRight />
    </div>
  </div>
);

const ChatInput = ({ placeholder, value, onChange }) => (
  <div style={{ padding: "12px 16px", borderTop: "1px solid #EBEBEB" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: 24, backgroundColor: "#F7F7F8" }}>
      <input value={value || ""} onChange={onChange} placeholder={placeholder} style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", fontSize: 13, fontFamily: "inherit" }} />
      <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <I.ArrowUp />
      </div>
    </div>
    <div style={{ textAlign: "center", fontSize: 11, color: "#999", marginTop: 6 }}>O ClinBot pode cometer erros. Sempre confira as respostas.</div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function MedComVcApp() {
  const [page, setPage] = useState("dashboard");
  const [rightPanel, setRightPanel] = useState(null);

  // Nova Consulta
  const [consultaMode, setConsultaMode] = useState("new"); // new | active
  const [modalidade, setModalidade] = useState("presencial");
  const [docTab, setDocTab] = useState("anamneses");
  const [consultaPat, setConsultaPat] = useState(null); // patient id selected for consultation

  // Pacientes
  const [patSearch, setPatSearch] = useState("");
  const [selectedPats, setSelectedPats] = useState([]);
  const [expandedPat, setExpandedPat] = useState(null);
  const [patFilter, setPatFilter] = useState("");
  const [patSort, setPatSort] = useState("lastVisit");

  // Dashboard
  const [dashFilters, setDashFilters] = useState({ condition: "", ageRange: "", gender: "", riskLevel: "", period: "6m" });
  const [dashPrompt, setDashPrompt] = useState("");
  const [reportState, setReportState] = useState("config"); // config | loading | done

  // Portal do Paciente
  const [portalTab, setPortalTab] = useState("docs"); // docs | add | labs
  const [portalDocFilter, setPortalDocFilter] = useState("Todos");
  const [portalSelectedDoc, setPortalSelectedDoc] = useState(null);

  // Trilha do Médico
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

  // Trilha do Paciente
  const [patTrilhaTab, setPatTrilhaTab] = useState("aprender"); // aprender | quiz | conquistas
  const [patQuizMode, setPatQuizMode] = useState(null); // null | "active" | "done"
  const [patCurrentQ, setPatCurrentQ] = useState(0);
  const [patSelectedAnswer, setPatSelectedAnswer] = useState(null);
  const [patQuizAnswers, setPatQuizAnswers] = useState([]);

  const handlePatAnswerSelect = (idx) => {
    if (patSelectedAnswer !== null) return;
    setPatSelectedAnswer(idx);
    setPatQuizAnswers(a => [...a, idx]);
  };
  const handlePatNextQuestion = () => {
    if (patCurrentQ + 1 >= patMockQuiz.questions.length) {
      setPatQuizMode("done");
    } else {
      setPatCurrentQ(q => q + 1);
      setPatSelectedAnswer(null);
    }
  };
  const handlePatStartQuiz = () => {
    setPatCurrentQ(0);
    setPatSelectedAnswer(null);
    setPatQuizAnswers([]);
    setPatQuizMode("active");
  };

  const filteredPatients = useMemo(() => {
    let r = patients;
    if (patSearch) { const s = patSearch.toLowerCase(); r = r.filter(p => p.name.toLowerCase().includes(s) || p.conditions.some(c => c.toLowerCase().includes(s))); }
    if (patFilter) r = r.filter(p => p.conditions.some(c => c.toLowerCase().includes(patFilter.toLowerCase())));
    return r.sort((a, b) => patSort === "name" ? a.name.localeCompare(b.name) : patSort === "consultations" ? b.consultations - a.consultations : 0);
  }, [patSearch, patFilter, patSort]);

  // Medicina Ocupacional
  const [ocupTab, setOcupTab] = useState("dashboard"); // dashboard | empresas | funcionarios | aso
  const [ocupEmpresaFilter, setOcupEmpresaFilter] = useState("");
  const [ocupSearch, setOcupSearch] = useState("");
  const [ocupAsoTipo, setOcupAsoTipo] = useState("");
  const [ocupAsoResult, setOcupAsoResult] = useState("");

  const filteredOcupFunc = useMemo(() => {
    let r = ocupFuncionarios;
    if (ocupSearch) { const s = ocupSearch.toLowerCase(); r = r.filter(f => f.name.toLowerCase().includes(s) || f.cargo.toLowerCase().includes(s)); }
    if (ocupEmpresaFilter) r = r.filter(f => f.empresaId === Number(ocupEmpresaFilter));
    return r;
  }, [ocupSearch, ocupEmpresaFilter]);

  const togglePat = (id) => setSelectedPats(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const showSidebar = rightPanel === null;

  const handleGenReport = () => {
    setReportState("loading");
    setTimeout(() => setReportState("done"), 2000);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", backgroundColor: "#F7F7F8", color: "#1a1a1a", fontSize: 14, overflow: "hidden" }}>

      {/* ═══ ICON RAIL ═══ */}
      <div style={{ width: 52, minWidth: 52, backgroundColor: "#fff", borderRight: "1px solid #EBEBEB", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, gap: 2 }}>
        <div style={{ marginBottom: 14, cursor: "pointer" }}>
          <svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="15" fill="#1A8A8A" /><text x="15" y="20" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="sans-serif">🎙</text></svg>
        </div>
        <NavIcon active={page === "dashboard"} onClick={() => { setPage("dashboard"); setRightPanel(null); }} icon={<I.Dashboard />} />
        <NavIcon active={page === "patients"} onClick={() => { setPage("patients"); setRightPanel(null); }} icon={<I.Users />} />
        <NavIcon active={page === "consulta"} onClick={() => { setPage("consulta"); setRightPanel(null); setConsultaMode("new"); }} icon={<I.Clipboard />} />
        <NavIcon active={page === "clinbot"} onClick={() => { setPage("clinbot"); setRightPanel(null); }} icon={<I.Chat />} />
        <NavIcon active={page === "gestor"} onClick={() => { setPage("gestor"); setRightPanel(null); }} icon={<I.Briefcase />} />
        <NavIcon active={page === "ocupacional"} onClick={() => { setPage("ocupacional"); setRightPanel(null); setOcupTab("dashboard"); }} icon={<I.CheckSquare />} />
        <div style={{ width: 24, height: 1, backgroundColor: "#EBEBEB", margin: "6px 0" }} />
        <NavIcon active={page === "portal"} onClick={() => { setPage("portal"); setRightPanel(null); setPortalTab("docs"); }} icon={<I.Person />} badge={false} />
        <NavIcon active={page === "trilha"} onClick={() => { setPage("trilha"); setRightPanel(null); setTrilhaTab("overview"); setQuizMode(null); setFlashMode(null); }} icon={<I.BookOpen />} />
        <NavIcon active={page === "patTrilha"} onClick={() => { setPage("patTrilha"); setRightPanel(null); setPatTrilhaTab("aprender"); setPatQuizMode(null); }} icon={<I.Star />} />
        <div style={{ flex: 1 }} />
        <NavIcon icon={<I.Settings />} />
        <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#CCF0E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1A8A8A", marginBottom: 12, cursor: "pointer", position: "relative" }}>
          LB<div style={{ position: "absolute", bottom: -2, right: -2, fontSize: 6, backgroundColor: "#1A8A8A", color: "#fff", padding: "1px 3px", borderRadius: 3, fontWeight: 700 }}>TRIAL</div>
        </div>
      </div>

      {/* ═══ SIDEBAR ═══ */}
      {showSidebar && (
        <div style={{ width: 250, minWidth: 250, backgroundColor: "#fff", borderRight: "1px solid #EBEBEB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 14px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#1A8A8A" /><text x="14" y="19" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">🎙</text></svg>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>Med.Com.Vc</span>
          </div>

          {/* Nav items */}
          <div style={{ padding: "0 10px" }}>
            {[
              { key: "dashboard", label: "Dashboard", icon: <I.Dashboard s={16} /> },
              { key: "patients", label: "Meus Pacientes", icon: <I.Users s={16} /> },
              { key: "consulta", label: "Nova Consulta", icon: <I.Clipboard s={16} /> },
              { key: "clinbot", label: "ClinBot IA", icon: <I.Chat s={16} /> },
              { key: "gestor", label: "Gestão", icon: <I.Briefcase s={16} /> },
              { key: "ocupacional", label: "Med. Ocupacional", icon: <I.CheckSquare s={16} /> },
            ].map(n => (
              <div key={n.key} onClick={() => { setPage(n.key); if (n.key === "consulta") setConsultaMode("new"); }} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2,
                backgroundColor: page === n.key ? (n.key === "ocupacional" ? "#FFF7ED" : "#E8F7F2") : "transparent",
                color: page === n.key ? (n.key === "ocupacional" ? "#C2410C" : "#1A8A8A") : "#555", fontWeight: page === n.key ? 600 : 500, fontSize: 14, transition: "all 0.15s"
              }}>{n.icon} {n.label}</div>
            ))}
            <div style={{ height: 1, backgroundColor: "#EBEBEB", margin: "6px 2px" }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: "#BDBDBD", textTransform: "uppercase", letterSpacing: 0.8, padding: "4px 12px 2px" }}>Ferramentas</div>
            <div onClick={() => { setPage("portal"); setPortalTab("docs"); }} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2,
              backgroundColor: page === "portal" ? "#E8F7F2" : "transparent",
              color: page === "portal" ? "#1A8A8A" : "#555", fontWeight: page === "portal" ? 600 : 500, fontSize: 14, transition: "all 0.15s"
            }}><I.Person s={16} /> Portal do Paciente</div>
            <div onClick={() => { setPage("trilha"); setTrilhaTab("overview"); setQuizMode(null); setFlashMode(null); }} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2,
              backgroundColor: page === "trilha" ? "#E8F7F2" : "transparent",
              color: page === "trilha" ? "#1A8A8A" : "#555", fontWeight: page === "trilha" ? 600 : 500, fontSize: 14, transition: "all 0.15s"
            }}><I.BookOpen s={16} /> Trilha do Médico</div>
            <div onClick={() => { setPage("patTrilha"); setPatTrilhaTab("aprender"); setPatQuizMode(null); }} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2,
              backgroundColor: page === "patTrilha" ? "#FFFBEB" : "transparent",
              color: page === "patTrilha" ? "#D97706" : "#555", fontWeight: page === "patTrilha" ? 600 : 500, fontSize: 14, transition: "all 0.15s"
            }}><I.Star s={16} /> Trilha do Paciente</div>
          </div>

          {/* Page-specific sidebar content */}
          <div style={{ flex: 1, overflow: "auto", padding: "12px 10px 0" }}>
            {page === "dashboard" && (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Alertas</div>
                {[{ t: "5 pacientes com HbA1c > 9%", s: "high" }, { t: "3 sem consulta há 90+ dias", s: "medium" }, { t: "12 exames pendentes", s: "low" }].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px", borderRadius: 8, marginBottom: 4, backgroundColor: a.s === "high" ? "#FEF2F2" : a.s === "medium" ? "#FFFBEB" : "#F0FDF4" }}>
                    <div style={{ color: a.s === "high" ? "#EF4444" : a.s === "medium" ? "#F59E0B" : "#22C55E", marginTop: 1 }}><I.Alert s={14} /></div>
                    <span style={{ fontSize: 12, color: "#555", lineHeight: 1.4 }}>{a.t}</span>
                  </div>
                ))}
              </>
            )}
            {page === "patients" && (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Recentes</div>
                {patients.slice(0, 5).map(p => (
                  <div key={p.id} onClick={() => { setExpandedPat(expandedPat === p.id ? null : p.id) }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 2, backgroundColor: expandedPat === p.id ? "#F9F7FF" : "transparent" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, backgroundColor: "#E5F4EE", color: "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{p.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: "#999" }}>{p.lastVisit}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {page === "consulta" && (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Hoje</div>
                <div onClick={() => setConsultaMode("new")} style={{ padding: "9px 10px", borderRadius: 8, cursor: "pointer", backgroundColor: consultaMode === "new" ? "#E8F7F2" : "transparent", marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Nova Consulta</div><div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>11:21</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginTop: 12 }}>04/05/2025</div>
                <div onClick={() => setConsultaMode("active")} style={{ padding: "9px 10px", borderRadius: 8, cursor: "pointer", backgroundColor: consultaMode === "active" ? "#E8F7F2" : "transparent" }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>carlos</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 1, display: "flex", alignItems: "center", gap: 3 }}>12:44 • 02m 05s • <I.Page /> 2 • <I.Clock /> 1</div>
                </div>
              </>
            )}
            {page === "clinbot" && (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Hoje</div>
                <div style={{ padding: "9px 10px", borderRadius: 8, cursor: "pointer" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Identificação de Red Flags Clíni...</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 1, display: "flex", alignItems: "center", gap: 3 }}>10:51 • <I.Grid /></div>
                </div>
              </>
            )}
            {page === "trilha" && (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Progresso</div>
                <div style={{ padding: "12px 10px", borderRadius: 10, backgroundColor: "#E8F7F2", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1A8A8A", marginBottom: 6 }}>🔥 Streak: 7 dias</div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Assertividade geral: <strong style={{ color: "#22C55E" }}>82%</strong></div>
                  <div style={{ height: 6, backgroundColor: "#CCF0E0", borderRadius: 3 }}><div style={{ height: "100%", width: "82%", backgroundColor: "#1A8A8A", borderRadius: 3 }} /></div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Flashcard decks</div>
                {flashDecks.map(d => (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 2 }} onClick={() => { setPage("trilha"); setTrilhaTab("flashcards"); setFlashMode(null); }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, flexShrink: 0, backgroundColor: d.color }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</div>
                      <div style={{ fontSize: 10, color: "#999" }}>{d.reviewed}/{d.cards} revisados</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {page === "patTrilha" && (
              <>
                <div style={{ padding: "12px 10px", borderRadius: 10, background: "linear-gradient(135deg,#FEF3C722,#FDE68A33)", border: "1px solid #FDE68A", marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#D97706", marginBottom: 2 }}>⭐ Nível 3 · Explorador da Saúde</div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>850 / 1000 XP para o próximo nível</div>
                  <div style={{ height: 6, backgroundColor: "#FDE68A", borderRadius: 3 }}><div style={{ height: "100%", width: "85%", background: "linear-gradient(90deg,#F59E0B,#FBBF24)", borderRadius: 3 }} /></div>
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", backgroundColor: "#FFF7ED", borderRadius: 8 }}>
                    <div style={{ fontSize: 14 }}>🔥</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706" }}>7 dias</div>
                    <div style={{ fontSize: 10, color: "#999" }}>streak</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", backgroundColor: "#E8F7F2", borderRadius: 8 }}>
                    <div style={{ fontSize: 14 }}>🏆</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1A8A8A" }}>3</div>
                    <div style={{ fontSize: 10, color: "#999" }}>conquistas</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", backgroundColor: "#F0FDF4", borderRadius: 8 }}>
                    <div style={{ fontSize: 14 }}>✅</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#22C55E" }}>2</div>
                    <div style={{ fontSize: 10, color: "#999" }}>módulos</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Em andamento</div>
                {patTrilhaTopics.filter(t => !t.locked && t.done > 0 && t.done < t.lições).map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 2 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, backgroundColor: t.colorBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{t.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                      <div style={{ fontSize: 10, color: "#999" }}>{t.done}/{t.lições} lições</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {page === "portal" && (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Documentos recentes</div>
                {portalDocs.slice(0, 5).map(d => (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 2 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, backgroundColor: d.sourceType === "lab" ? "#EFF6FF" : "#E5F4EE", color: d.sourceType === "lab" ? "#3B82F6" : "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {d.sourceType === "lab" ? <I.Beaker s={11} /> : <I.Doc s={11} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: "#999" }}>{d.date}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {page === "gestor" && (
              <>
                <div style={{ padding: "12px 10px", borderRadius: 10, background: "linear-gradient(135deg,#E8F7F222,#D1FAE533)", border: "1px solid #BBF7D0", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1A8A8A", marginBottom: 6 }}>📊 Previne Brasil</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ flex: 1, textAlign: "center", padding: "6px 4px", backgroundColor: "#F0FDF4", borderRadius: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#22C55E" }}>5</div>
                      <div style={{ fontSize: 9, color: "#888" }}>Atingidas</div>
                    </div>
                    <div style={{ flex: 1, textAlign: "center", padding: "6px 4px", backgroundColor: "#FEF2F2", borderRadius: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#EF4444" }}>2</div>
                      <div style={{ fontSize: 9, color: "#888" }}>Abaixo</div>
                    </div>
                    <div style={{ flex: 1, textAlign: "center", padding: "6px 4px", backgroundColor: "#EFF6FF", borderRadius: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#3B82F6" }}>89%</div>
                      <div style={{ fontSize: 9, color: "#888" }}>Cobertura</div>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Alertas Saúde Pública</div>
                {[{ t: "Campanha Influenza — cobertura 78% (meta 90%)", s: "high" }, { t: "3 gestantes com pré-natal incompleto", s: "high" }, { t: "ICSAB Hipertensão: 18 internações (↓25%)", s: "medium" }, { t: "ESF Centro — equipe incompleta (falta ACS)", s: "medium" }, { t: "Tríplice Viral abaixo da meta (85%)", s: "high" }].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px", borderRadius: 8, marginBottom: 4, backgroundColor: a.s === "high" ? "#FEF2F2" : "#FFFBEB" }}>
                    <div style={{ color: a.s === "high" ? "#EF4444" : "#F59E0B", marginTop: 1 }}><I.Alert s={14} /></div>
                    <span style={{ fontSize: 12, color: "#555", lineHeight: 1.4 }}>{a.t}</span>
                  </div>
                ))}
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginTop: 14 }}>Equipes ESF</div>
                {gestorEquipesESF.map(e => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 2 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, backgroundColor: "#E5F4EE", color: "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700 }}>{e.nome.split(" ").pop().slice(0, 2).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.nome}</div>
                      <div style={{ fontSize: 10, color: "#999" }}>{e.populacao.toLocaleString("pt-BR")} hab • {e.cobertura}%</div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: e.statusColor, flexShrink: 0 }} />
                  </div>
                ))}
              </>
            )}
            {page === "ocupacional" && (
              <>
                <div style={{ padding: "12px 10px", borderRadius: 10, background: "linear-gradient(135deg,#FFF7ED22,#FED7AA33)", border: "1px solid #FED7AA", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#C2410C", marginBottom: 6 }}>📋 Conformidade PCMSO</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ flex: 1, textAlign: "center", padding: "6px 4px", backgroundColor: "#F0FDF4", borderRadius: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#22C55E" }}>3</div>
                      <div style={{ fontSize: 9, color: "#888" }}>Em dia</div>
                    </div>
                    <div style={{ flex: 1, textAlign: "center", padding: "6px 4px", backgroundColor: "#FFFBEB", borderRadius: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B" }}>1</div>
                      <div style={{ fontSize: 9, color: "#888" }}>Vencendo</div>
                    </div>
                    <div style={{ flex: 1, textAlign: "center", padding: "6px 4px", backgroundColor: "#FEF2F2", borderRadius: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#EF4444" }}>1</div>
                      <div style={{ fontSize: 9, color: "#888" }}>Vencido</div>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Alertas</div>
                {[{ t: "2 ASOs vencidos — ação urgente", s: "high" }, { t: "PCMSO Alimentos BomSabor vencido", s: "high" }, { t: "2 exames próximos do vencimento", s: "medium" }, { t: "Ind. Química Apex — PCMSO vencendo", s: "medium" }].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px", borderRadius: 8, marginBottom: 4, backgroundColor: a.s === "high" ? "#FEF2F2" : "#FFFBEB" }}>
                    <div style={{ color: a.s === "high" ? "#EF4444" : "#F59E0B", marginTop: 1 }}><I.Alert s={14} /></div>
                    <span style={{ fontSize: 12, color: "#555", lineHeight: 1.4 }}>{a.t}</span>
                  </div>
                ))}
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginTop: 14 }}>Empresas</div>
                {ocupEmpresas.map(e => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 2 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, backgroundColor: "#FFF7ED", color: "#C2410C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{e.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
                      <div style={{ fontSize: 10, color: "#999" }}>{e.funcionarios} func. • GR {e.risco}</div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: e.statusColor, flexShrink: 0 }} />
                  </div>
                ))}
              </>
            )}
          </div>
          <SidebarBottom />
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* ──────── DASHBOARD ──────── */}
        {page === "dashboard" && (
          <>
            <div style={{ padding: "20px 28px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB" }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Dashboard</h1>
                <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Visão geral da saúde populacional • Atualizado há 2h</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <select style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #E0E0E0", backgroundColor: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  <option>Últimos 6 meses</option><option>Últimos 3 meses</option><option>Último ano</option>
                </select>
                <button onClick={() => { setRightPanel("dashClinBot"); setReportState("config"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}>
                  <I.Sparkle s={16} /> Gerar relatório com ClinBot
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>
              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                {[{ l: "Total Pacientes", v: "100", c: "+8", up: true, icon: <I.Users s={18} />, cl: "#1A8A8A" }, { l: "Consultas / Mês", v: "27", c: "+12%", up: true, icon: <I.Activity />, cl: "#3B82F6" }, { l: "HbA1c Média (DM2)", v: "6.8%", c: "-0.4", up: true, icon: <I.Heart />, cl: "#22C55E" }, { l: "Pacientes em Risco", v: "5", c: "+2", up: false, icon: <I.Alert />, cl: "#EF4444" }].map((card, i) => (
                  <div key={i} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: 10, backgroundColor: card.cl + "12", color: card.cl, display: "flex", alignItems: "center", justifyContent: "center" }}>{card.icon}</div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 500 }}>{card.l}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1, marginBottom: 6 }}>{card.v}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: card.up && card.l !== "Pacientes em Risco" ? "#22C55E" : "#EF4444" }}>
                      {card.up && card.l !== "Pacientes em Risco" ? <I.TrendUp /> : <I.TrendDown />}
                      <span style={{ fontWeight: 600 }}>{card.c}</span><span style={{ color: "#999" }}>vs. mês anterior</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Charts Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Consultas por Mês</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartMonthly}>
                      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1A8A8A" stopOpacity={0.15} /><stop offset="95%" stopColor="#1A8A8A" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" /><XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8E8E8", fontSize: 13 }} />
                      <Area type="monotone" dataKey="v" stroke="#1A8A8A" strokeWidth={2.5} fill="url(#pg)" dot={{ fill: "#1A8A8A", r: 4 }} name="Consultas" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Condições Prevalentes</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart><Pie data={chartConditions} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">{chartConditions.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8E8E8", fontSize: 12 }} /></PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {chartConditions.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}><div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: c.color }} /><span style={{ color: "#666" }}>{c.name}</span><span style={{ fontWeight: 700, color: "#333" }}>{c.value}</span></div>))}
                  </div>
                </div>
              </div>
              {/* Charts Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Pirâmide Etária</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartAge}><CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" /><XAxis dataKey="f" tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /><Bar dataKey="m" fill="#1A8A8A" radius={[4, 4, 0, 0]} name="Masc" /><Bar dataKey="w" fill="#6ECFB8" radius={[4, 4, 0, 0]} name="Fem" /></BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Evolução HbA1c Média</div>
                  <div style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, marginBottom: 12 }}>▼ Tendência de queda</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartHba1c}><CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" /><XAxis dataKey="month" tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} /><YAxis domain={[6, 9]} tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /><Line type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={2.5} dot={{ fill: "#22C55E", r: 4 }} name="HbA1c %" /></LineChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Estratificação de Risco</div>
                  {riskStrat.map((r, i) => {
                    const total = riskStrat.reduce((s, x) => s + x.count, 0); const pct = Math.round((r.count / total) * 100); return (
                      <div key={i} style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: r.color }} /><span style={{ fontSize: 13, fontWeight: 500 }}>{r.risk}</span></div><span style={{ fontSize: 13, fontWeight: 700 }}>{r.count} <span style={{ fontWeight: 400, color: "#999" }}>({pct}%)</span></span></div><div style={{ height: 8, backgroundColor: "#F3F3F3", borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, backgroundColor: r.color, borderRadius: 4 }} /></div></div>
                    );
                  })}
                </div>
              </div>
              {/* CTA */}
              <div style={{ background: "linear-gradient(135deg,#1A8A8A,#147070)", borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Quer insights mais profundos?</div><div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>O ClinBot analisa padrões e gera relatórios personalizados com recomendações baseadas em evidência.</div></div>
                <button onClick={() => { setRightPanel("dashClinBot"); setReportState("config"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", flexShrink: 0, fontFamily: "inherit" }}><I.Sparkle s={18} /> Abrir ClinBot</button>
              </div>
            </div>
          </>
        )}

        {/* ──────── PATIENTS ──────── */}
        {page === "patients" && (
          <>
            <div style={{ padding: "20px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div><h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Meus Pacientes</h1><p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>{patients.length} pacientes cadastrados</p></div>
              <div style={{ display: "flex", gap: 10 }}>
                {selectedPats.length > 0 && (<button onClick={() => setRightPanel("patClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}><I.Sparkle s={16} /> ClinBot ({selectedPats.length})</button>)}
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "1px solid #1A8A8A", borderRadius: 10, backgroundColor: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#1A8A8A" }}><I.Plus /> Novo Paciente</button>
              </div>
            </div>
            <div style={{ padding: "16px 28px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 240, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", backgroundColor: "#fff", borderRadius: 10, border: "1px solid #E0E0E0" }}>
                <I.Search /><input value={patSearch} onChange={e => setPatSearch(e.target.value)} placeholder="Buscar por nome ou condição..." style={{ flex: 1, border: "none", outline: "none", fontSize: 14, backgroundColor: "transparent", fontFamily: "inherit" }} />
                {patSearch && <button onClick={() => setPatSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 16 }}>×</button>}
              </div>
              <select value={patFilter} onChange={e => setPatFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #E0E0E0", backgroundColor: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit", minWidth: 170 }}>
                <option value="">Todas condições</option><option value="Diabetes">Diabetes</option><option value="Hipertensão">Hipertensão</option><option value="DPOC">DPOC</option><option value="Depressão">Depressão</option>
              </select>
              <select value={patSort} onChange={e => setPatSort(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #E0E0E0", backgroundColor: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                <option value="lastVisit">Última consulta</option><option value="name">Nome A-Z</option><option value="consultations">Mais consultas</option>
              </select>
            </div>
            {selectedPats.length > 0 && (<div style={{ margin: "0 28px 8px", padding: "8px 14px", backgroundColor: "#E8F7F2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "#1A8A8A", fontWeight: 600 }}>{selectedPats.length} selecionado{selectedPats.length > 1 ? "s" : ""}</span><button onClick={() => setSelectedPats([])} style={{ background: "none", border: "none", color: "#1A8A8A", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Limpar</button></div>)}
            <div style={{ flex: 1, overflow: "auto", padding: "0 28px 20px" }}>
              <div style={{ backgroundColor: "#fff", borderRadius: 12, border: "1px solid #E8E8E8", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 55px 100px 65px 65px 1fr 40px", padding: "12px 16px", backgroundColor: "#FAFAFA", borderBottom: "1px solid #EBEBEB", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.3, alignItems: "center" }}>
                  <div><input type="checkbox" checked={selectedPats.length === filteredPatients.length && filteredPatients.length > 0} onChange={() => selectedPats.length === filteredPatients.length ? setSelectedPats([]) : setSelectedPats(filteredPatients.map(p => p.id))} style={{ width: 16, height: 16, accentColor: "#1A8A8A", cursor: "pointer" }} /></div>
                  <div>Paciente</div><div>Idade</div><div>Última consulta</div><div style={{ textAlign: "center" }}>Consultas</div><div style={{ textAlign: "center" }}>Docs</div><div>AI Brief</div><div></div>
                </div>
                {filteredPatients.map(p => {
                  const isSel = selectedPats.includes(p.id); const isExp = expandedPat === p.id; const cons = patientConsultations[p.id] || []; const brief = patientBriefs[p.id]; return (
                    <div key={p.id}>
                      <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 55px 100px 65px 65px 1fr 40px", padding: "14px 16px", borderBottom: "1px solid #F0F0F0", alignItems: "center", cursor: "pointer", backgroundColor: isSel ? "#FAFAFE" : isExp ? "#FDFCFF" : "#fff", transition: "background 0.15s" }}>
                        <div onClick={e => { e.stopPropagation(); togglePat(p.id); }}><input type="checkbox" checked={isSel} readOnly style={{ width: 16, height: 16, accentColor: "#1A8A8A", cursor: "pointer" }} /></div>
                        <div onClick={() => setExpandedPat(isExp ? null : p.id)} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, backgroundColor: isSel ? "#1A8A8A" : "#E5F4EE", color: isSel ? "#fff" : "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{p.avatar}</div>
                          <div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div><div style={{ fontSize: 11, color: "#999" }}>{p.gender === "M" ? "Masculino" : "Feminino"}</div></div>
                        </div>
                        <div onClick={() => setExpandedPat(isExp ? null : p.id)} style={{ fontSize: 14, color: "#555" }}>{p.age}</div>
                        <div onClick={() => setExpandedPat(isExp ? null : p.id)} style={{ fontSize: 13, color: "#555", display: "flex", alignItems: "center", gap: 4 }}><I.Calendar s={12} /> {p.lastVisit}</div>
                        <div onClick={() => setExpandedPat(isExp ? null : p.id)} style={{ textAlign: "center", fontSize: 14, fontWeight: 600 }}>{p.consultations}</div>
                        <div onClick={() => setExpandedPat(isExp ? null : p.id)} style={{ textAlign: "center", fontSize: 14, fontWeight: 600 }}>{p.documents}</div>
                        <div onClick={() => setExpandedPat(isExp ? null : p.id)} style={{ fontSize: 11, color: "#666", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{brief ? <><I.Sparkle s={10} /> {brief.summary}</> : <span style={{ color: "#CCC" }}>—</span>}</div>
                        <div onClick={() => setExpandedPat(isExp ? null : p.id)} style={{ display: "flex", justifyContent: "center" }}><div style={{ transform: isExp ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s", color: "#999" }}><I.ChevRight /></div></div>
                      </div>
                      {isExp && (<div style={{ padding: "0 16px 16px 56px", backgroundColor: "#FDFCFF", borderBottom: "1px solid #E8E8E8" }}>
                        {/* AI Brief card */}
                        {brief && (
                          <div style={{ padding: "14px 16px", backgroundColor: "#E8F7F2", borderRadius: 10, border: "1px solid #B8E5D5", marginBottom: 14, marginTop: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><I.Sparkle s={14} /><span style={{ fontSize: 13, fontWeight: 700, color: "#1A8A8A" }}>AI Brief</span><span style={{ fontSize: 10, color: "#888", marginLeft: 4 }}>Atualizado há 2h</span></div>
                            <div style={{ fontSize: 13, color: "#333", lineHeight: 1.5, marginBottom: 10 }}>{brief.summary}</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>{brief.pending.filter(pp => pp.severity === "high").map((pp, i) => <span key={i} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, backgroundColor: "#FEF2F2", color: "#EF4444", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>⚠ {pp.label}</span>)}</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{brief.risks.map((r, i) => <span key={i} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, backgroundColor: "#FFFBEB", color: "#D97706", fontWeight: 500 }}>{r}</span>)}</div>
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingTop: brief ? 0 : 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Histórico de consultas</div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => { if (!selectedPats.includes(p.id)) togglePat(p.id); setRightPanel("patClinBot"); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", border: "1px solid #E0E0E0", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, backgroundColor: "#fff", color: "#555" }}><I.Sparkle s={12} /> Perguntar ao ClinBot</button>
                            <button onClick={() => { setConsultaPat(p.id); setPage("consulta"); setConsultaMode("new"); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}><I.Clipboard s={12} /> Iniciar Consulta</button>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>{p.conditions.map((c, i) => <span key={i} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, backgroundColor: "#E8F7F2", color: "#1A8A8A", fontWeight: 500 }}>{c}</span>)}</div>
                        {cons.length > 0 ? cons.map((c, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", backgroundColor: "#fff", borderRadius: 8, border: "1px solid #EBEBEB", marginBottom: 8 }}>
                            <div style={{ color: "#888", marginTop: 2 }}><I.Calendar s={16} /></div>
                            <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 600 }}>{c.date}</span><span style={{ fontSize: 11, color: "#999" }}>{c.duration}</span></div><div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>{c.summary}</div><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{c.docs.map((d, j) => <span key={j} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, backgroundColor: "#F0F0F0", color: "#666", display: "flex", alignItems: "center", gap: 4 }}><I.Doc s={10} /> {d}</span>)}</div></div>
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#1A8A8A", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500 }}><I.Eye /> Ver</button>
                          </div>
                        )) : <div style={{ fontSize: 13, color: "#999", padding: 12, textAlign: "center" }}>Sem histórico detalhado disponível.</div>}
                      </div>)}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ──────── CONSULTA ──────── */}
        {page === "consulta" && consultaMode === "new" && (
          <>
            <div style={{ padding: "24px 40px 0" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Nova Consulta</h1><I.Edit /></div></div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 40px" }}>
              <div style={{ width: "100%", maxWidth: 520, backgroundColor: "#fff", borderRadius: 16, padding: 32, border: "1px solid #E8E8E8", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                {/* Patient selector */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 8 }}>Paciente <span style={{ color: "#EF4444" }}>*</span></label>
                  <select value={consultaPat || ""} onChange={e => { const v = e.target.value ? Number(e.target.value) : null; setConsultaPat(v); }} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: consultaPat ? "1px solid #1A8A8A" : "1px solid #E0E0E0", backgroundColor: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit", color: consultaPat ? "#1a1a1a" : "#999", appearance: "auto", boxSizing: "border-box" }}>
                    <option value="">Selecionar paciente...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.age} anos, {p.gender === "M" ? "Masc" : "Fem"}</option>)}
                  </select>
                  {consultaPat && patientBriefs[consultaPat] && (() => {
                    const bp = patientBriefs[consultaPat]; const pat = patients.find(pp => pp.id === consultaPat); return (
                      <div style={{ marginTop: 12, padding: "16px", backgroundColor: "#E8F7F2", borderRadius: 12, border: "1px solid #B8E5D5" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "#1A8A8A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{pat?.avatar}</div>
                          <div><div style={{ fontWeight: 600, fontSize: 14 }}>{pat?.name}</div><div style={{ fontSize: 11, color: "#888" }}>{pat?.age} anos · {pat?.conditions?.join(", ")}</div></div>
                          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "#1A8A8A", backgroundColor: "#CCF0E0", padding: "3px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 3 }}><I.Sparkle s={10} /> AI Brief</span>
                        </div>
                        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.7, marginBottom: 12 }}>{bp.summary}</div>
                        {bp.pending.length > 0 && <div style={{ marginBottom: 10 }}><div style={{ fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Pendências</div><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{bp.pending.map((pp, i) => <span key={i} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, backgroundColor: pp.severity === "high" ? "#FEF2F2" : pp.severity === "medium" ? "#FFFBEB" : "#F0F0F0", color: pp.severity === "high" ? "#EF4444" : pp.severity === "medium" ? "#D97706" : "#666", fontWeight: 600 }}>{pp.severity === "high" ? "🔴" : pp.severity === "medium" ? "🟡" : "🟢"} {pp.label}</span>)}</div></div>}
                        {bp.risks.length > 0 && <div style={{ marginBottom: 10 }}><div style={{ fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Riscos</div><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{bp.risks.map((r, i) => <span key={i} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, backgroundColor: "#FFFBEB", color: "#D97706", fontWeight: 500 }}>{r}</span>)}</div></div>}
                        {bp.suggestedTopics.length > 0 && <div><div style={{ fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Sugestões para esta consulta</div><div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{bp.suggestedTopics.map((t, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#333" }}><span style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: "#CCF0E0", color: "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>{t}</div>)}</div></div>}
                      </div>
                    );
                  })()}
                </div>
                <div style={{ marginBottom: 24 }}><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}><span style={{ fontSize: 14, fontWeight: 600 }}>Modalidade da consulta</span><I.HelpCircle /></div>
                  <div style={{ display: "flex", backgroundColor: "#F7F7F8", borderRadius: 10, padding: 3, border: "1px solid #E8E8E8" }}>
                    {["presencial", "telemedicina"].map(m => (
                      <button key={m} onClick={() => setModalidade(m)} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.2s", backgroundColor: modalidade === m ? "#fff" : "transparent", color: modalidade === m ? "#1a1a1a" : "#999", boxShadow: modalidade === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none", textTransform: "capitalize" }}>{m}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}><label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 8 }}>Algum contexto desde a última consulta?</label><textarea placeholder="Preencha com informações clínicas, comentários, percepções, conversas via WhatsApp..." style={{ width: "100%", minHeight: 120, padding: 14, border: "1px solid #E0E0E0", borderRadius: 10, fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }} /></div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border: "1px solid #E0E0E0", borderRadius: 12, marginBottom: 20 }}>
                  <div style={{ color: "#1A8A8A" }}><I.Mic /></div><AudioWave />
                  <div style={{ flex: 1, marginLeft: 4 }}><div style={{ fontWeight: 600, fontSize: 14 }}>LB Airpods</div><div style={{ fontSize: 12, color: "#888" }}>Captando áudio</div></div>
                  <button style={{ background: "none", border: "none", color: "#1A8A8A", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Alterar</button>
                </div>
                <button onClick={() => { if (consultaPat) { setConsultaMode("active"); } }} disabled={!consultaPat} style={{ width: "100%", padding: 14, backgroundColor: consultaPat ? "#1A8A8A" : "#D4D4D4", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: consultaPat ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><I.Mic /> Iniciar consulta</button>
              </div>
            </div>
          </>
        )}
        {page === "consulta" && consultaMode === "active" && (
          <>
            <div style={{ padding: "16px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>carlos</h1><I.Edit /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid #E0E0E0", borderRadius: 8, backgroundColor: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}><I.Print /> Assinar e imprimir</button>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid #E0E0E0", borderRadius: 8, backgroundColor: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}><I.Share /> Compartilhar</button>
              </div>
            </div>
            <div style={{ padding: "12px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                {["Informações", "Contexto da consulta", "Anamnese padrão", "Atestado Médico"].map((t, i) => (<button key={i} style={{ padding: "10px 16px", border: "none", borderBottom: i === 1 ? "2px solid #1A8A8A" : "2px solid transparent", backgroundColor: "transparent", cursor: "pointer", fontSize: 14, fontWeight: i === 1 ? 600 : 400, color: i === 1 ? "#1A8A8A" : "#666", display: "flex", alignItems: "center", gap: 4 }}>{t} {(i === 2 || i === 3) && <I.ChevDown />}</button>))}
                <button onClick={() => setRightPanel("gerarDoc")} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #E0E0E0", backgroundColor: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", marginLeft: 4 }}><I.Plus /></button>
              </div>
              <button onClick={() => setRightPanel("consultaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}><I.Sparkle s={16} /> Pergunte ao ClinBot</button>
            </div>
            <div style={{ flex: 1, display: "flex", overflow: "hidden", padding: "16px 24px 0" }}>
              <div style={{ flex: "0 0 45%", display: "flex", flexDirection: "column", paddingRight: 12, overflow: "auto" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Contexto do paciente</div>
                <div style={{ border: "1px dashed #D0D0D0", borderRadius: 8, padding: 10, textAlign: "center", color: "#888", fontSize: 13, cursor: "pointer", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><I.Upload /> Adicionar arquivos</div>
                {consultaPat && patientBriefs[consultaPat] && (
                  <div style={{ padding: "12px 14px", backgroundColor: "#E8F7F2", borderRadius: 10, border: "1px solid #B8E5D5", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><I.Sparkle s={12} /><span style={{ fontSize: 11, fontWeight: 700, color: "#1A8A8A" }}>AI Brief</span></div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: "#333" }}>{patientBriefs[consultaPat].summary}</div>
                  </div>
                )}
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Contexto adicional</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>paciente hipertenso e diabetico de longa data, fumante, queixa de dor nos pes ao dormir e falta de ar</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingLeft: 12, borderLeft: "1px solid #EBEBEB", overflow: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Transcrição da consulta</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#1A8A8A", border: "1px solid #1A8A8A", borderRadius: 10, padding: "2px 10px" }}>BETA</span>
                </div>
                {transcription.map((t, i) => (<div key={i} style={{ marginBottom: 16 }}><div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>{t.time}</div>{t.text && <div style={{ fontSize: 14, lineHeight: 1.5 }}>{t.text}</div>}</div>))}
              </div>
            </div>
            <div style={{ padding: "12px 24px", borderTop: "1px solid #EBEBEB", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, backgroundColor: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#666", fontSize: 13 }}><I.Pause /> 02m 05s</div>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid #E0E0E0", borderRadius: 8, backgroundColor: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}><I.Mic s={14} /> Retomar gravação</button>
              <button onClick={() => setRightPanel("gerarDoc")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}><I.Sparkle s={16} /> Gerar documento</button>
              <button style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #E0E0E0", backgroundColor: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.Dots /></button>
            </div>
          </>
        )}

        {/* ──────── CLINBOT CHAT ──────── */}
        {page === "clinbot" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 640, width: "100%", padding: "0 24px" }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 32px 0", letterSpacing: -0.5, textAlign: "center" }}>Como o <span style={{ color: "#1A8A8A" }}>ClinBot</span> pode te ajudar?</h1>
              <div style={{ width: "100%", display: "flex", alignItems: "center", padding: "14px 14px 14px 20px", border: "1px solid #E0E0E0", borderRadius: 28, backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <input placeholder="Escreva para o ClinBot o que você precisa" style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", fontSize: 15, fontFamily: "inherit" }} />
                <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><I.ArrowUp /></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
                {["Qual o tratamento recomendado para...", "Explique este diagnóstico"].map((s, i) => (
                  <button key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "1px solid #E8E8E8", borderRadius: 20, backgroundColor: "#fff", cursor: "pointer", fontSize: 13, color: "#555", fontFamily: "inherit" }}><I.Sparkle s={14} /> {s}</button>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontSize: 13, color: "#999" }}>O ClinBot pode cometer erros. Sempre confira as respostas.</div>
          </div>
        )}
        {/* ──────── TRILHA DE APRENDIZADO ──────── */}
        {page === "trilha" && (
          <>
            {/* Header */}
            <div style={{ padding: "20px 28px 16px", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Trilha do Médico</h1>
                <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Baseada na sua prática clínica real • Atualizada há 2h</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setRightPanel("trilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "1px solid #E0E0E0", borderRadius: 9, backgroundColor: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#555" }}>
                  <I.Sparkle s={15} /> Pedir ao ClinBot
                </button>
                <button onClick={() => { setTrilhaTab("quiz"); setQuizMode(null); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}>
                  <I.CheckSquare s={16} /> Criar quiz
                </button>
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ padding: "0 28px", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB", display: "flex" }}>
              {[
                { key: "overview", label: "Visão Geral", icon: <I.Target s={14} /> },
                { key: "quiz", label: "Quiz", icon: <I.CheckSquare s={14} /> },
                { key: "flashcards", label: "Flashcards", icon: <I.Layers s={14} /> },
              ].map(t => (
                <button key={t.key} onClick={() => { setTrilhaTab(t.key); if (t.key === "quiz") setQuizMode(null); if (t.key === "flashcards") setFlashMode(null); }} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "13px 18px", border: "none", backgroundColor: "transparent",
                  borderBottom: trilhaTab === t.key ? "2px solid #1A8A8A" : "2px solid transparent",
                  color: trilhaTab === t.key ? "#1A8A8A" : "#666",
                  fontWeight: trilhaTab === t.key ? 600 : 400,
                  fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
                }}>{t.icon} {t.label}</button>
              ))}
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>

              {/* ═══ VISÃO GERAL ═══ */}
              {trilhaTab === "overview" && (
                <>
                  {/* KPI cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
                    {[
                      { l: "Casos atendidos", v: "100", sub: "últimos 6 meses", icon: <I.Users s={17} />, cl: "#1A8A8A" },
                      { l: "Assertividade geral", v: "82%", sub: "↑ 4% vs. trimestre anterior", icon: <I.Target s={17} />, cl: "#22C55E" },
                      { l: "Flashcards revisados", v: "34", sub: "de 36 disponíveis", icon: <I.Layers s={17} />, cl: "#3B82F6" },
                      { l: "Streak de estudo", v: "7 dias", sub: "🔥 seu recorde é 14 dias", icon: <I.Zap s={17} />, cl: "#F59E0B" },
                    ].map((c, i) => (
                      <div key={i} style={{ backgroundColor: "#fff", borderRadius: 13, padding: "18px 20px", border: "1px solid #E8E8E8", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 9, backgroundColor: c.cl + "15", color: c.cl, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 5, fontWeight: 500 }}>{c.l}</div>
                        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -1, marginBottom: 4 }}>{c.v}</div>
                        <div style={{ fontSize: 11, color: "#999" }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Condutas */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    {/* Assertivas */}
                    <div style={{ backgroundColor: "#fff", borderRadius: 13, padding: "20px", border: "1px solid #E8E8E8" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: "#F0FDF4", color: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center" }}><I.Target s={16} /></div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>Condutas assertivas</div>
                          <div style={{ fontSize: 11, color: "#888" }}>O que você está fazendo bem</div>
                        </div>
                      </div>
                      {condutas.assertivas.map((c, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 13, color: "#333", lineHeight: 1.4 }}>{c.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#22C55E", flexShrink: 0, marginLeft: 8 }}>{c.pct}%</span>
                          </div>
                          <div style={{ height: 6, backgroundColor: "#F0F0F0", borderRadius: 3 }}>
                            <div style={{ height: "100%", width: `${c.pct}%`, backgroundColor: "#22C55E", borderRadius: 3 }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Revisar */}
                    <div style={{ backgroundColor: "#fff", borderRadius: 13, padding: "20px", border: "1px solid #E8E8E8" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}><I.Alert s={16} /></div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>O que revisar</div>
                          <div style={{ fontSize: 11, color: "#888" }}>Oportunidades de melhora</div>
                        </div>
                      </div>
                      {condutas.revisar.map((c, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 13, color: "#333", lineHeight: 1.4 }}>{c.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B", flexShrink: 0, marginLeft: 8 }}>{c.pct}%</span>
                          </div>
                          <div style={{ height: 6, backgroundColor: "#F0F0F0", borderRadius: 3 }}>
                            <div style={{ height: "100%", width: `${c.pct}%`, backgroundColor: "#FCD34D", borderRadius: 3 }} />
                          </div>
                          <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontStyle: "italic" }}>→ {c.rec}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condições + Diretrizes + ClinBot */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                    {/* Condições prevalentes */}
                    <div style={{ backgroundColor: "#fff", borderRadius: 13, padding: "20px", border: "1px solid #E8E8E8" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Condições mais atendidas</div>
                      <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Últimos 6 meses</div>
                      {trilhaConditions.map((c, i) => (
                        <div key={i} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 13 }}>{c.name}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>{c.count}</span>
                          </div>
                          <div style={{ height: 7, backgroundColor: "#E8F7F2", borderRadius: 4 }}>
                            <div style={{ height: "100%", width: `${c.pct}%`, backgroundColor: c.color, borderRadius: 4 }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Novas diretrizes */}
                    <div style={{ backgroundColor: "#fff", borderRadius: 13, padding: "20px", border: "1px solid #E8E8E8" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Novas diretrizes</div>
                      <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Relevantes para sua prática</div>
                      {guidelines.map((g, i) => (
                        <div key={i} style={{ padding: "12px 14px", borderRadius: 9, border: "1px solid #F0F0F0", marginBottom: 8, cursor: "pointer" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 700, backgroundColor: g.tagColor + "18", color: g.tagColor }}>{g.tag}</span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{g.title}</div>
                          <div style={{ fontSize: 11, color: "#888", lineHeight: 1.4 }}>{g.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* ClinBot sugere */}
                    <div style={{ background: "linear-gradient(145deg,#1A8A8A,#147070)", borderRadius: 13, padding: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <I.Sparkle s={16} />
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>ClinBot sugere</span>
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: 16 }}>
                        Com base na sua prática, <strong>3 condutas</strong> abaixo da meta e <strong>2 diretrizes novas</strong> relevantes foram identificadas. Quer um plano de estudo personalizado?
                      </div>
                      {["Criar quiz sobre neuropatia diabética", "Gerar flashcards de HAS 2024", "Revisar protocolo de monofilamento"].map((s, i) => (
                        <button key={i} onClick={() => setRightPanel("trilhaClinBot")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "9px 12px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)", cursor: "pointer", fontSize: 12, color: "#fff", textAlign: "left", fontFamily: "inherit", marginBottom: 6 }}>
                          <I.Sparkle s={12} /> {s}
                        </button>
                      ))}
                      <button onClick={() => setRightPanel("trilhaClinBot")} style={{ width: "100%", marginTop: 4, padding: "10px 0", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 9, backgroundColor: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "inherit" }}>
                        Abrir ClinBot →
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
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700 }}>Seus quizzes</div>
                          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>Personalizados com base na sua prática clínica real.</div>
                        </div>
                        <button onClick={() => setRightPanel("trilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}>
                          <I.Sparkle s={15} /> Criar com ClinBot
                        </button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {quizList.map(q => (
                          <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", backgroundColor: "#fff", borderRadius: 13, border: "1px solid #E8E8E8" }}>
                            <div style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: "#E8F7F2", color: "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <I.CheckSquare s={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                                <span style={{ fontWeight: 600, fontSize: 15 }}>{q.title}</span>
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 700, backgroundColor: q.tagBg, color: q.tagColor }}>{q.tag}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 12, color: "#888" }}>{q.done}/{q.questions} questões</span>
                                {q.score !== null && <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E" }}>Nota: {q.score}%</span>}
                                <div style={{ flex: 1, maxWidth: 120, height: 5, backgroundColor: "#F0F0F0", borderRadius: 3 }}>
                                  <div style={{ height: "100%", width: `${(q.done / q.questions) * 100}%`, backgroundColor: q.score ? "#22C55E" : "#1A8A8A", borderRadius: 3 }} />
                                </div>
                              </div>
                            </div>
                            <button onClick={handleStartQuiz} style={{ padding: "8px 18px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, background: q.done === q.questions ? "#E8F7F2" : "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: q.done === q.questions ? "#1A8A8A" : "#fff", fontFamily: "inherit" }}>
                              {q.done === q.questions ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}><I.RotateCcw s={13} /> Refazer</span> : q.done > 0 ? "Continuar →" : "Iniciar →"}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* CTA ClinBot */}
                      <div style={{ marginTop: 20, padding: "20px 24px", backgroundColor: "#F9F7FF", borderRadius: 13, border: "1px dashed #C4B5FD", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Quer um quiz personalizado?</div>
                          <div style={{ fontSize: 13, color: "#888" }}>O ClinBot cria questões baseadas nos seus casos reais e nas diretrizes mais recentes.</div>
                        </div>
                        <button onClick={() => setRightPanel("trilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff", flexShrink: 0 }}>
                          <I.Sparkle s={15} /> Gerar quiz
                        </button>
                      </div>
                    </>
                  )}

                  {/* Quiz ativo */}
                  {quizMode === "active" && (
                    <div style={{ maxWidth: 640, margin: "0 auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                        <button onClick={() => setQuizMode(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex", padding: 0 }}><I.ChevLeft s={18} /></button>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{mockQuiz.title}</div>
                          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Questão {currentQuestion + 1} de {mockQuiz.questions.length}</div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1A8A8A" }}>{Math.round(((currentQuestion) / (mockQuiz.questions.length)) * 100)}%</span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: 6, backgroundColor: "#F0F0F0", borderRadius: 3, marginBottom: 28 }}>
                        <div style={{ height: "100%", width: `${((currentQuestion) / (mockQuiz.questions.length)) * 100}%`, backgroundColor: "#1A8A8A", borderRadius: 3, transition: "width 0.3s" }} />
                      </div>

                      <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "28px 28px 24px", border: "1px solid #E8E8E8", marginBottom: 16 }}>
                        <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5, marginBottom: 24, color: "#1a1a1a" }}>
                          {mockQuiz.questions[currentQuestion].q}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {mockQuiz.questions[currentQuestion].opts.map((opt, idx) => {
                            const isSelected = selectedAnswer === idx;
                            const isCorrect = idx === mockQuiz.questions[currentQuestion].correct;
                            const revealed = selectedAnswer !== null;
                            let bg = "#FAFAFA", border = "1px solid #E0E0E0", color = "#333";
                            if (revealed && isCorrect) { bg = "#F0FDF4"; border = "2px solid #22C55E"; color = "#166534"; }
                            else if (revealed && isSelected && !isCorrect) { bg = "#FEF2F2"; border = "2px solid #EF4444"; color = "#991B1B"; }
                            return (
                              <button key={idx} onClick={() => handleAnswerSelect(idx)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border, borderRadius: 10, backgroundColor: bg, cursor: revealed ? "default" : "pointer", fontSize: 14, color, textAlign: "left", fontFamily: "inherit", transition: "all 0.2s" }}>
                                <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, backgroundColor: revealed && isCorrect ? "#22C55E" : revealed && isSelected && !isCorrect ? "#EF4444" : "#E8E8E8", color: revealed && (isCorrect || (isSelected && !isCorrect)) ? "#fff" : "#666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                                  {revealed && isCorrect ? "✓" : revealed && isSelected && !isCorrect ? "✗" : String.fromCharCode(65 + idx)}
                                </div>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {selectedAnswer !== null && (
                        <>
                          <div style={{ padding: "14px 18px", backgroundColor: "#E8F7F2", borderRadius: 10, border: "1px solid #B8E5D5", marginBottom: 16, display: "flex", gap: 10 }}>
                            <div style={{ color: "#1A8A8A", flexShrink: 0, marginTop: 1 }}><I.Sparkle s={16} /></div>
                            <div style={{ fontSize: 13, lineHeight: 1.6, color: "#4C1D95" }}>
                              <strong>ClinBot explica:</strong> {mockQuiz.questions[currentQuestion].exp}
                            </div>
                          </div>
                          <button onClick={handleNextQuestion} style={{ width: "100%", padding: "13px 0", border: "none", borderRadius: 10, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
                            {currentQuestion + 1 < mockQuiz.questions.length ? "Próxima questão →" : "Ver resultado →"}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Resultado do quiz */}
                  {quizMode === "done" && (
                    <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
                      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Quiz concluído!</div>
                      <div style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>{mockQuiz.title}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
                        {[
                          { l: "Acertos", v: `${quizAnswers.filter((a, i) => a === mockQuiz.questions[i]?.correct).length}/${mockQuiz.questions.length}`, c: "#22C55E" },
                          { l: "Aproveitamento", v: `${Math.round((quizAnswers.filter((a, i) => a === mockQuiz.questions[i]?.correct).length / mockQuiz.questions.length) * 100)}%`, c: "#1A8A8A" },
                          { l: "Pontuação", v: "A+", c: "#3B82F6" },
                        ].map((s, i) => (
                          <div key={i} style={{ backgroundColor: "#fff", borderRadius: 12, padding: "20px 16px", border: "1px solid #E8E8E8" }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: s.c, marginBottom: 4 }}>{s.v}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                        <button onClick={handleStartQuiz} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", border: "1px solid #E0E0E0", borderRadius: 9, backgroundColor: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#555", fontFamily: "inherit" }}>
                          <I.RotateCcw s={14} /> Refazer
                        </button>
                        <button onClick={() => setQuizMode(null)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff", fontFamily: "inherit" }}>
                          Ver outros quizzes
                        </button>
                        <button onClick={() => setRightPanel("trilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", border: "1px solid #1A8A8A", borderRadius: 9, backgroundColor: "#E8F7F2", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#1A8A8A", fontFamily: "inherit" }}>
                          <I.Sparkle s={14} /> Analisar com ClinBot
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
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700 }}>Seus decks de flashcards</div>
                          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>Revise conceitos-chave baseados na sua prática clínica.</div>
                        </div>
                        <button onClick={() => setRightPanel("trilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}>
                          <I.Sparkle s={15} /> Criar deck
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 20 }}>
                        {flashDecks.map(d => (
                          <div key={d.id} style={{ backgroundColor: "#fff", borderRadius: 13, padding: "20px 22px", border: "1px solid #E8E8E8", cursor: "pointer" }} onClick={() => handleOpenDeck(d)}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                              <div style={{ width: 42, height: 42, borderRadius: 11, backgroundColor: d.color + "18", color: d.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <I.Layers s={20} />
                              </div>
                              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, fontWeight: 700, backgroundColor: d.tagColor + "18", color: d.tagColor }}>{d.tag}</span>
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{d.title}</div>
                            <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>{d.reviewed}/{d.cards} revisados</div>
                            <div style={{ height: 6, backgroundColor: "#F0F0F0", borderRadius: 3, marginBottom: 14 }}>
                              <div style={{ height: "100%", width: `${Math.round((d.reviewed / d.cards) * 100)}%`, backgroundColor: d.color, borderRadius: 3 }} />
                            </div>
                            <button style={{ width: "100%", padding: "9px 0", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, background: `linear-gradient(135deg,${d.color}dd,${d.color})`, color: "#fff", fontFamily: "inherit" }}>
                              {d.reviewed === d.cards ? "Revisar novamente" : "Continuar revisão →"}
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ padding: "20px 24px", backgroundColor: "#F9F7FF", borderRadius: 13, border: "1px dashed #C4B5FD", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Criar novos flashcards</div>
                          <div style={{ fontSize: 13, color: "#888" }}>O ClinBot gera cartões baseados nos seus casos, nas diretrizes e nos pontos que você precisa revisar.</div>
                        </div>
                        <button onClick={() => setRightPanel("trilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff", flexShrink: 0 }}>
                          <I.Sparkle s={15} /> Gerar flashcards
                        </button>
                      </div>
                    </>
                  )}

                  {/* Revisão de deck */}
                  {flashMode === "active" && activeDeck && (
                    <div style={{ maxWidth: 600, margin: "0 auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <button onClick={() => { setFlashMode(null); setCardFlipped(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex", padding: 0 }}><I.ChevLeft s={18} /></button>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{activeDeck.title}</div>
                          <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>Cartão {currentCard + 1} de {mockFlashcards.length}</div>
                        </div>
                        <button onClick={() => setRightPanel("trilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #E0E0E0", borderRadius: 7, backgroundColor: "#fff", cursor: "pointer", fontSize: 12, color: "#666" }}>
                          <I.Sparkle s={12} /> Perguntar ao ClinBot
                        </button>
                      </div>

                      {/* Progress */}
                      <div style={{ height: 5, backgroundColor: "#F0F0F0", borderRadius: 3, marginBottom: 24 }}>
                        <div style={{ height: "100%", width: `${((currentCard) / (mockFlashcards.length)) * 100}%`, backgroundColor: activeDeck.color, borderRadius: 3, transition: "width 0.3s" }} />
                      </div>

                      {/* Card */}
                      <div onClick={() => setCardFlipped(f => !f)} style={{ backgroundColor: "#fff", borderRadius: 16, padding: "44px 36px", border: `2px solid ${cardFlipped ? activeDeck.color + "60" : "#E8E8E8"}`, marginBottom: 20, cursor: "pointer", minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "border 0.2s" }}>
                        {!cardFlipped ? (
                          <>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 18 }}>Pergunta</div>
                            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, color: "#1a1a1a" }}>{mockFlashcards[currentCard].front}</div>
                            <div style={{ fontSize: 12, color: "#BDBDBD", marginTop: 20, display: "flex", alignItems: "center", gap: 5 }}><I.RotateCcw s={12} /> Clique para revelar</div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: 11, fontWeight: 700, color: activeDeck.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 18 }}>Resposta</div>
                            <div style={{ fontSize: 14, lineHeight: 1.7, color: "#333", whiteSpace: "pre-line" }}>{mockFlashcards[currentCard].back}</div>
                          </>
                        )}
                      </div>

                      {cardFlipped && (
                        <div style={{ display: "flex", gap: 10 }}>
                          <button onClick={() => { setCurrentCard(c => (c + 1) % mockFlashcards.length); setCardFlipped(false); }} style={{ flex: 1, padding: "12px 0", border: "2px solid #FECACA", borderRadius: 10, backgroundColor: "#FEF2F2", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#EF4444", fontFamily: "inherit" }}>
                            😕 Não lembrei
                          </button>
                          <button onClick={() => { if (currentCard + 1 >= mockFlashcards.length) { setFlashMode(null); setCardFlipped(false); } else { setCurrentCard(c => c + 1); setCardFlipped(false); } }} style={{ flex: 1, padding: "12px 0", border: "2px solid #BBF7D0", borderRadius: 10, backgroundColor: "#F0FDF4", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#16A34A", fontFamily: "inherit" }}>
                            ✓ Lembrei!
                          </button>
                        </div>
                      )}
                      {!cardFlipped && (
                        <button onClick={() => setCardFlipped(true)} style={{ width: "100%", padding: "12px 0", border: "none", borderRadius: 10, backgroundColor: "#E8F7F2", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#1A8A8A", fontFamily: "inherit" }}>
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
            <div style={{ padding: "20px 28px 16px", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: "#CCF0E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#1A8A8A" }}>CS</div>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Carlos Eduardo Silva</h1>
                  <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>58 anos • Masculino • Última consulta: 04/05/2025</p>
                  <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
                    {["Diabetes Tipo 2", "Hipertensão"].map((c, i) => (
                      <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, backgroundColor: "#E8F7F2", color: "#1A8A8A", fontWeight: 500 }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setRightPanel("portalClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}>
                <I.Sparkle s={16} /> Perguntar ao ClinBot
              </button>
            </div>

            {/* Quick stats */}
            <div style={{ padding: "10px 28px", backgroundColor: "#FAFAFA", borderBottom: "1px solid #EBEBEB", display: "flex", gap: 0, alignItems: "center" }}>
              {[
                { label: "Documentos", value: "8", sub: "no total" },
                { label: "Exames", value: "4", sub: "3 normais • 1 atenção" },
                { label: "Laboratórios", value: "2", sub: "conectados" },
                { label: "Última atualização", value: "Hoje", sub: "08:30" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && <div style={{ width: 1, height: 32, backgroundColor: "#E0E0E0", margin: "0 20px" }} />}
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.5 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{s.label} · {s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div style={{ padding: "0 28px", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB", display: "flex" }}>
              {[
                { key: "docs", label: "Meus Documentos" },
                { key: "add", label: "Adicionar documento" },
                { key: "labs", label: "Laboratórios" },
              ].map(t => (
                <button key={t.key} onClick={() => setPortalTab(t.key)} style={{
                  padding: "13px 18px", border: "none", backgroundColor: "transparent",
                  borderBottom: portalTab === t.key ? "2px solid #1A8A8A" : "2px solid transparent",
                  color: portalTab === t.key ? "#1A8A8A" : "#666",
                  fontWeight: portalTab === t.key ? 600 : 400,
                  fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
                }}>{t.label}</button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>

              {/* ── Meus Documentos ── */}
              {portalTab === "docs" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {["Todos", "Exame", "Prescrição", "Consulta", "Atestado", "Pedido"].map(f => (
                        <button key={f} onClick={() => setPortalDocFilter(f)} style={{
                          padding: "6px 14px", border: `1px solid ${portalDocFilter === f ? "#1A8A8A" : "#E0E0E0"}`,
                          borderRadius: 20, backgroundColor: portalDocFilter === f ? "#E8F7F2" : "#fff",
                          color: portalDocFilter === f ? "#1A8A8A" : "#666",
                          fontWeight: portalDocFilter === f ? 600 : 400,
                          fontSize: 13, cursor: "pointer", fontFamily: "inherit"
                        }}>{f}</button>
                      ))}
                    </div>
                    <div style={{ fontSize: 13, color: "#999" }}>{portalDocs.filter(d => portalDocFilter === "Todos" || d.type === portalDocFilter).length} documentos</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {portalDocs.filter(d => portalDocFilter === "Todos" || d.type === portalDocFilter).map(doc => (
                      <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", backgroundColor: "#fff", borderRadius: 12, border: "1px solid #E8E8E8" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, backgroundColor: doc.sourceType === "lab" ? "#EFF6FF" : "#E8F7F2", color: doc.sourceType === "lab" ? "#3B82F6" : "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {doc.sourceType === "lab" ? <I.Beaker s={18} /> : <I.Doc s={18} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</span>
                            <span style={{
                              fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 600,
                              backgroundColor: doc.type === "Exame" ? "#EFF6FF" : doc.type === "Prescrição" ? "#F0FDF4" : doc.type === "Atestado" ? "#FFFBEB" : "#E8F7F2",
                              color: doc.type === "Exame" ? "#3B82F6" : doc.type === "Prescrição" ? "#16A34A" : doc.type === "Atestado" ? "#D97706" : "#1A8A8A"
                            }}>{doc.type}</span>
                            {doc.status && (
                              <span style={{
                                fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 600,
                                backgroundColor: doc.status === "normal" ? "#F0FDF4" : "#FFFBEB",
                                color: doc.status === "normal" ? "#16A34A" : "#D97706"
                              }}>{doc.status === "normal" ? "✓ Normal" : "⚠ Atenção"}</span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: "#999" }}>{doc.date} · {doc.source}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", border: "1px solid #E0E0E0", borderRadius: 8, backgroundColor: "#fff", cursor: "pointer", fontSize: 12, color: "#555", fontFamily: "inherit" }}>
                            <I.Eye /> Ver
                          </button>
                          <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", border: "1px solid #E0E0E0", borderRadius: 8, backgroundColor: "#fff", cursor: "pointer", fontSize: 12, color: "#555", fontFamily: "inherit" }}>
                            <I.Download /> Baixar
                          </button>
                          <button onClick={() => { setPortalSelectedDoc(doc); setRightPanel("portalClinBot"); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", border: "1px solid #1A8A8A", borderRadius: 8, backgroundColor: "#E8F7F2", cursor: "pointer", fontSize: 12, color: "#1A8A8A", fontWeight: 600, fontFamily: "inherit" }}>
                            <I.Sparkle s={12} /> ClinBot
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Adicionar documento ── */}
              {portalTab === "add" && (
                <div style={{ maxWidth: 580, margin: "0 auto" }}>
                  <div style={{ border: "2px dashed #D0D0D0", borderRadius: 14, padding: "44px 24px", textAlign: "center", backgroundColor: "#FAFAFA", marginBottom: 24, cursor: "pointer" }}>
                    <div style={{ color: "#BDBDBD" }}><I.CloudUp s={42} /></div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14, marginBottom: 6, color: "#333" }}>Arraste um arquivo aqui</div>
                    <div style={{ fontSize: 13, color: "#999", marginBottom: 18 }}>PDF, JPG, PNG – até 20 MB</div>
                    <button style={{ padding: "8px 22px", border: "1px solid #1A8A8A", borderRadius: 8, backgroundColor: "#fff", color: "#1A8A8A", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                      Selecionar arquivo
                    </button>
                  </div>
                  <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E8E8E8" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Detalhes do documento</div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Nome do documento</label>
                      <input placeholder="Ex: Resultado de hemograma" style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Tipo</label>
                        <select style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>
                          <option>Exame</option><option>Prescrição</option><option>Atestado</option><option>Pedido</option><option>Consulta</option><option>Outro</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Data do documento</label>
                        <input type="date" style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", cursor: "pointer" }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Observações (opcional)</label>
                      <textarea placeholder="Contexto adicional sobre este documento..." style={{ width: "100%", minHeight: 90, padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.5, boxSizing: "border-box" }} />
                    </div>
                    <button style={{ width: "100%", padding: 12, border: "none", borderRadius: 10, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <I.Plus /> Adicionar documento
                    </button>
                  </div>
                </div>
              )}

              {/* ── Laboratórios ── */}
              {portalTab === "labs" && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Laboratórios</div>
                    <div style={{ fontSize: 13, color: "#888" }}>Conecte seus laboratórios para importar resultados automaticamente.</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {portalLabs.map(lab => (
                      <div key={lab.id} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: lab.connected ? "1px solid #E8E8E8" : "1px dashed #D0D0D0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: lab.color + "18", color: lab.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{lab.abbr}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{lab.name}</div>
                            {lab.connected
                              ? <div style={{ fontSize: 12, color: "#16A34A", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22C55E" }} /> Conectado</div>
                              : <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Não conectado</div>
                            }
                          </div>
                        </div>
                        {lab.connected && (
                          <div style={{ display: "flex", gap: 10, marginBottom: 14, padding: "10px 14px", backgroundColor: "#F9FAFB", borderRadius: 8, border: "1px solid #EBEBEB" }}>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 18, fontWeight: 700 }}>{lab.results}</div>
                              <div style={{ fontSize: 11, color: "#888" }}>exames</div>
                            </div>
                            <div style={{ width: 1, backgroundColor: "#E8E8E8", margin: "0 4px" }} />
                            <div style={{ display: "flex", alignItems: "center", paddingLeft: 6 }}>
                              <div style={{ fontSize: 12, color: "#888" }}>Sincronizado: {lab.lastSync}</div>
                            </div>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 8 }}>
                          {lab.connected ? (
                            <>
                              <button style={{ flex: 1, padding: "8px 0", border: "1px solid #E0E0E0", borderRadius: 8, backgroundColor: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                <I.Refresh /> Sincronizar
                              </button>
                              <button style={{ padding: "8px 14px", border: "1px solid #FECACA", borderRadius: 8, backgroundColor: "#fff", cursor: "pointer", fontSize: 13, color: "#EF4444", fontFamily: "inherit" }}>
                                Desconectar
                              </button>
                            </>
                          ) : (
                            <button style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                              <I.LinkIcon s={14} /> Conectar
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

        {/* ──────── TRILHA DO PACIENTE ──────── */}
        {page === "patTrilha" && (
          <>
            {/* Header */}
            <div style={{ padding: "20px 28px 16px", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Olá, Carlos! 👋</h1>
                  <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Continue sua trilha de saúde pessoal</p>
                </div>
                <button onClick={() => setRightPanel("patTrilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff" }}>
                  <I.Sparkle s={16} /> Perguntar ao ClinBot
                </button>
              </div>
              {/* Level + XP bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 24, background: "linear-gradient(135deg,#F59E0B,#FBBF24)", color: "#fff", flexShrink: 0 }}>
                  <span style={{ fontSize: 14 }}>⭐</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Nível 3</span>
                  <span style={{ fontSize: 12, opacity: 0.85 }}>· Explorador da Saúde</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  <div style={{ flex: 1, height: 10, backgroundColor: "#F3F3F3", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "85%", background: "linear-gradient(90deg,#F59E0B,#FBBF24)", borderRadius: 6 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#D97706", whiteSpace: "nowrap" }}>850 / 1000 XP</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, backgroundColor: "#FFF7ED", border: "1px solid #FDE68A" }}>
                  <span style={{ fontSize: 16 }}>🔥</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#D97706" }}>7</span>
                  <span style={{ fontSize: 12, color: "#888" }}>dias</span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ padding: "10px 28px", backgroundColor: "#FAFAFA", borderBottom: "1px solid #EBEBEB", display: "flex", gap: 0, alignItems: "center" }}>
              {[
                { label: "Módulos concluídos", value: "2", sub: "de 4 iniciados" },
                { label: "Quizzes feitos", value: "1", sub: "80% de aproveitamento" },
                { label: "Conquistas", value: "3", sub: "desbloqueadas" },
                { label: "Sequência atual", value: "7 dias 🔥", sub: "recorde pessoal!" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && <div style={{ width: 1, height: 32, backgroundColor: "#E0E0E0", margin: "0 20px" }} />}
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.5 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{s.label} · {s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div style={{ padding: "0 28px", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB", display: "flex" }}>
              {[
                { key: "aprender", label: "📚 Aprender" },
                { key: "quiz", label: "🎯 Quiz" },
                { key: "conquistas", label: "🏆 Conquistas" },
              ].map(t => (
                <button key={t.key} onClick={() => setPatTrilhaTab(t.key)} style={{
                  padding: "13px 18px", border: "none", backgroundColor: "transparent",
                  borderBottom: patTrilhaTab === t.key ? "2px solid #F59E0B" : "2px solid transparent",
                  color: patTrilhaTab === t.key ? "#D97706" : "#666",
                  fontWeight: patTrilhaTab === t.key ? 600 : 400,
                  fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
                }}>{t.label}</button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>

              {/* ═══ APRENDER ═══ */}
              {patTrilhaTab === "aprender" && (
                <>
                  {/* Featured card */}
                  <div style={{ background: "linear-gradient(135deg,#1A8A8A,#147070)", borderRadius: 16, padding: "24px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -16, right: 16, fontSize: 72, opacity: 0.12, lineHeight: 1 }}>🩺</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Plano de hoje</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Continue: Entendendo o Diabetes</div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>Lição 4 de 5 · +50 XP ao concluir · ~5 min</div>
                    <div style={{ height: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 4, marginBottom: 18 }}>
                      <div style={{ height: "100%", width: "60%", backgroundColor: "#FBBF24", borderRadius: 4 }} />
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit" }}>
                      ▶ Continuar lição
                    </button>
                  </div>

                  {/* Topics grid */}
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Seus módulos de aprendizado</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                    {patTrilhaTopics.map(t => {
                      const pct = Math.round((t.done / t.lições) * 100);
                      return (
                        <div key={t.id} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: t.locked ? "1px dashed #D0D0D0" : "1px solid #E8E8E8", cursor: t.locked ? "default" : "pointer", opacity: t.locked ? 0.65 : 1, position: "relative" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                            <div style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: t.colorBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{t.emoji}</div>
                            <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, fontWeight: 700, backgroundColor: t.locked ? "#F0F0F0" : t.tagColor + "20", color: t.locked ? "#999" : t.tagColor }}>
                              {t.locked ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}><I.Lock s={10} /> {t.tag}</span> : t.tag}
                            </span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{t.title}</div>
                          <div style={{ fontSize: 12, color: "#888", marginBottom: 14, lineHeight: 1.4 }}>{t.desc}</div>
                          {!t.locked ? (
                            <>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <span style={{ fontSize: 12, color: "#999" }}>{t.done}/{t.lições} lições</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{pct}%</span>
                              </div>
                              <div style={{ height: 6, backgroundColor: "#F0F0F0", borderRadius: 3, marginBottom: 14 }}>
                                <div style={{ height: "100%", width: `${pct}%`, backgroundColor: t.color, borderRadius: 3 }} />
                              </div>
                              <button style={{ width: "100%", padding: "9px 0", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, backgroundColor: pct === 100 ? t.colorBg : t.color, color: pct === 100 ? t.color : "#fff", fontFamily: "inherit" }}>
                                {pct === 100 ? "✓ Revisar" : pct === 0 ? "Começar →" : "Continuar →"}
                              </button>
                            </>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", backgroundColor: "#F5F5F5", borderRadius: 8 }}>
                              <I.Lock s={13} /><span style={{ fontSize: 12, color: "#999" }}>Desbloqueie no Nível 4</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* ClinBot sugere */}
                  <div style={{ background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", borderRadius: 14, padding: "20px 24px", border: "1px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>💡 ClinBot sugere</div>
                      <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.4 }}>Seu HbA1c melhorou de 8,2% para 7,1%! Que tal aprender sobre alimentação para continuar essa tendência?</div>
                    </div>
                    <button onClick={() => setRightPanel("patTrilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600, backgroundColor: "#F59E0B", color: "#fff", flexShrink: 0, fontFamily: "inherit", marginLeft: 16 }}>
                      <I.Sparkle s={14} /> Perguntar
                    </button>
                  </div>
                </>
              )}

              {/* ═══ QUIZ ═══ */}
              {patTrilhaTab === "quiz" && (
                <>
                  {patQuizMode === null && (
                    <>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>🎯 Quizzes de saúde</div>
                        <div style={{ fontSize: 13, color: "#888" }}>Teste o que você aprendeu sobre suas condições de saúde, de um jeito divertido.</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {patTrilhaQuizList.map(q => (
                          <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", backgroundColor: "#fff", borderRadius: 13, border: "1px solid #E8E8E8" }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{q.emoji}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <span style={{ fontWeight: 600, fontSize: 15 }}>{q.title}</span>
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 700, backgroundColor: q.tagBg, color: q.tagColor }}>{q.tag}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 12, color: "#888" }}>{q.questions} perguntas</span>
                                {q.score !== null && <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E" }}>✓ Nota: {q.score}%</span>}
                              </div>
                            </div>
                            <button onClick={handlePatStartQuiz} style={{ padding: "9px 20px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600, background: q.done === q.questions ? "#FFF7ED" : "linear-gradient(135deg,#F59E0B,#FBBF24)", color: q.done === q.questions ? "#D97706" : "#fff", fontFamily: "inherit", flexShrink: 0 }}>
                              {q.done === q.questions ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}><I.RotateCcw s={13} /> Refazer</span> : "Jogar →"}
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: 20, padding: "20px 24px", backgroundColor: "#FFF7ED", borderRadius: 13, border: "1px dashed #FDE68A", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Quer aprender mais?</div>
                          <div style={{ fontSize: 13, color: "#888" }}>O ClinBot pode explicar qualquer dúvida sobre diabetes, pressão ou medicamentos em linguagem simples.</div>
                        </div>
                        <button onClick={() => setRightPanel("patTrilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600, backgroundColor: "#F59E0B", color: "#fff", flexShrink: 0, fontFamily: "inherit", marginLeft: 16 }}>
                          <I.Sparkle s={14} /> Perguntar
                        </button>
                      </div>
                    </>
                  )}

                  {patQuizMode === "active" && (
                    <div style={{ maxWidth: 620, margin: "0 auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <button onClick={() => setPatQuizMode(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex", padding: 0 }}><I.ChevLeft s={18} /></button>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{patMockQuiz.title}</div>
                          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Pergunta {patCurrentQ + 1} de {patMockQuiz.questions.length}</div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B", backgroundColor: "#FFF7ED", padding: "4px 10px", borderRadius: 12 }}>+{patCurrentQ * 20} XP</span>
                      </div>
                      <div style={{ height: 10, backgroundColor: "#F0F0F0", borderRadius: 6, marginBottom: 28, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(patCurrentQ / patMockQuiz.questions.length) * 100}%`, background: "linear-gradient(90deg,#F59E0B,#FBBF24)", borderRadius: 6, transition: "width 0.3s" }} />
                      </div>

                      <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "28px", border: "1px solid #E8E8E8", marginBottom: 16 }}>
                        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginBottom: 24, color: "#1a1a1a" }}>
                          {patMockQuiz.questions[patCurrentQ].q}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {patMockQuiz.questions[patCurrentQ].opts.map((opt, idx) => {
                            const isSelected = patSelectedAnswer === idx;
                            const isCorrect = idx === patMockQuiz.questions[patCurrentQ].correct;
                            const revealed = patSelectedAnswer !== null;
                            let bg = "#FAFAFA", border = "1px solid #E0E0E0", color = "#333";
                            if (revealed && isCorrect) { bg = "#F0FDF4"; border = "2px solid #22C55E"; color = "#166534"; }
                            else if (revealed && isSelected && !isCorrect) { bg = "#FEF2F2"; border = "2px solid #EF4444"; color = "#991B1B"; }
                            return (
                              <button key={idx} onClick={() => handlePatAnswerSelect(idx)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", border, borderRadius: 12, backgroundColor: bg, cursor: revealed ? "default" : "pointer", fontSize: 14, color, textAlign: "left", fontFamily: "inherit", transition: "all 0.2s" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, backgroundColor: revealed && isCorrect ? "#22C55E" : revealed && isSelected && !isCorrect ? "#EF4444" : "#EDEDED", color: revealed && (isCorrect || (isSelected && !isCorrect)) ? "#fff" : "#666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                                  {revealed && isCorrect ? "✓" : revealed && isSelected && !isCorrect ? "✗" : String.fromCharCode(65 + idx)}
                                </div>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {patSelectedAnswer !== null && (
                        <>
                          <div style={{ padding: "14px 18px", backgroundColor: "#FFF7ED", borderRadius: 10, border: "1px solid #FDE68A", marginBottom: 16, display: "flex", gap: 10 }}>
                            <div style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }}><I.Sparkle s={16} /></div>
                            <div style={{ fontSize: 13, lineHeight: 1.6, color: "#92400E" }}>
                              <strong>ClinBot explica:</strong> {patMockQuiz.questions[patCurrentQ].exp}
                            </div>
                          </div>
                          <button onClick={handlePatNextQuestion} style={{ width: "100%", padding: "14px 0", border: "none", borderRadius: 12, background: "linear-gradient(135deg,#F59E0B,#FBBF24)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>
                            {patCurrentQ + 1 < patMockQuiz.questions.length ? "Próxima pergunta →" : "Ver resultado 🎉"}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {patQuizMode === "done" && (
                    <div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
                      <div style={{ fontSize: 72, marginBottom: 12 }}>🎉</div>
                      <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Arrasou no quiz!</div>
                      <div style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>{patMockQuiz.title}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                        {[
                          { l: "Acertos", v: `${patQuizAnswers.filter((a, i) => a === patMockQuiz.questions[i]?.correct).length}/${patMockQuiz.questions.length}`, c: "#22C55E", emoji: "✅" },
                          { l: "Aproveitamento", v: `${Math.round((patQuizAnswers.filter((a, i) => a === patMockQuiz.questions[i]?.correct).length / patMockQuiz.questions.length) * 100)}%`, c: "#F59E0B", emoji: "⭐" },
                          { l: "XP ganho", v: `+${patQuizAnswers.filter((a, i) => a === patMockQuiz.questions[i]?.correct).length * 20} XP`, c: "#1A8A8A", emoji: "✨" },
                        ].map((s, i) => (
                          <div key={i} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px 14px", border: "1px solid #E8E8E8" }}>
                            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.emoji}</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: s.c, marginBottom: 4 }}>{s.v}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: "16px 20px", backgroundColor: "#FFF7ED", borderRadius: 12, border: "2px solid #FDE68A", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 36 }}>🏆</div>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#D97706" }}>Conquista desbloqueada!</div>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>Primeiro quiz feito</div>
                          <div style={{ fontSize: 12, color: "#888" }}>+100 XP bônus adicionados</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                        <button onClick={handlePatStartQuiz} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", border: "1px solid #E0E0E0", borderRadius: 10, backgroundColor: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#555", fontFamily: "inherit" }}>
                          <I.RotateCcw s={14} /> Refazer
                        </button>
                        <button onClick={() => setPatQuizMode(null)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#F59E0B,#FBBF24)", color: "#fff", fontFamily: "inherit" }}>
                          Outros quizzes 🎯
                        </button>
                        <button onClick={() => setRightPanel("patTrilhaClinBot")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", border: "1px solid #FDE68A", borderRadius: 10, backgroundColor: "#FFF7ED", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#D97706", fontFamily: "inherit" }}>
                          <I.Sparkle s={14} /> Perguntar ao ClinBot
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ═══ CONQUISTAS ═══ */}
              {patTrilhaTab === "conquistas" && (
                <>
                  {/* Level hero card */}
                  <div style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", borderRadius: 18, padding: "28px 32px", marginBottom: 28, display: "flex", alignItems: "center", gap: 20, overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: 0.08, lineHeight: 1 }}>⭐</div>
                    <div style={{ width: 76, height: 76, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, flexShrink: 0 }}>⭐</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: 4 }}>Carlos Eduardo Silva</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Nível 3 · Explorador da Saúde</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 8, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: "85%", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600, whiteSpace: "nowrap" }}>850 / 1000 XP</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>🔥 7</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>dias seguidos</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>Conquistas</div>
                    <span style={{ fontSize: 13, color: "#888" }}>3 de 8 desbloqueadas</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {patTrilhaAchievements.map((a, i) => (
                      <div key={i} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: a.unlocked ? "2px solid #FDE68A" : "1px solid #E8E8E8", opacity: a.unlocked ? 1 : 0.5, position: "relative", overflow: "hidden" }}>
                        {a.unlocked && <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 32px 32px 0", borderColor: `transparent #F59E0B transparent transparent` }} />}
                        <div style={{ fontSize: 38, marginBottom: 12 }}>{a.unlocked ? a.emoji : "🔒"}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: a.unlocked ? "#1a1a1a" : "#888" }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: "#999", lineHeight: 1.4, marginBottom: a.unlocked && a.date ? 8 : 0 }}>{a.desc}</div>
                        {a.unlocked && a.date && (
                          <div style={{ fontSize: 11, color: "#D97706", fontWeight: 600 }}>✓ {a.date}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ──────── GESTOR ──────── */}
        {page === "gestor" && (
          <>
            <div style={{ padding: "20px 28px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB" }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Gestão UBS / ESF</h1>
                <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Secretaria Municipal de Saúde • Previne Brasil • Março 2026</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <select style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #E0E0E0", backgroundColor: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  <option>UBS Jardim Esperança</option><option>UBS Vila Nova</option><option>UBS Centro</option><option>Todas as UBS</option>
                </select>
                <select style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #E0E0E0", backgroundColor: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  <option>Março 2026</option><option>Fevereiro 2026</option><option>Janeiro 2026</option><option>Q1 2026</option>
                </select>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff" }}>
                  <I.Sparkle s={16} /> Relatório Previne
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>
              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { l: "População Cadastrada", v: "12.847", c: "+324", up: true, icon: <I.Users s={18} />, cl: "#1A8A8A" },
                  { l: "Consultas no Mês", v: "1.284", c: "+12%", up: true, icon: <I.Clipboard s={18} />, cl: "#3B82F6" },
                  { l: "Cobertura ESF", v: "89%", c: "+3%", up: true, icon: <I.CheckSquare s={18} />, cl: "#22C55E" },
                  { l: "ICSAB (internações evitáveis)", v: "-18%", c: "↓ 12 int.", up: true, icon: <I.TrendDown />, cl: "#8B5CF6" },
                ].map((card, i) => (
                  <div key={i} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: 10, backgroundColor: card.cl + "12", color: card.cl, display: "flex", alignItems: "center", justifyContent: "center" }}>{card.icon}</div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 500 }}>{card.l}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1, marginBottom: 6 }}>{card.v}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#22C55E" }}>
                      <I.TrendUp /><span style={{ fontWeight: 600 }}>{card.c}</span><span style={{ color: "#999" }}>vs. mês anterior</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── INDICADORES PREVINE BRASIL ── */}
              <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "24px", border: "1px solid #E8E8E8", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Indicadores Previne Brasil</div>
                    <div style={{ fontSize: 12, color: "#888" }}>Desempenho nos 7 indicadores de pagamento por performance • Competência Mar/2026</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#888" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#22C55E", display: "inline-block" }} /> Atingida</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#EF4444", display: "inline-block" }} /> Abaixo</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {gestorIndicadoresPrevine.map(ind => {
                    const atingiu = ind.real >= ind.meta;
                    const pct = Math.min(ind.real, 100);
                    return (
                      <div key={ind.id} style={{ display: "grid", gridTemplateColumns: "24px 1fr 60px 60px", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 16 }}>{ind.icon}</span>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{ind.label}</span>
                            <span style={{ fontSize: 11, color: "#999" }}>Meta: {ind.meta}%</span>
                          </div>
                          <div style={{ height: 8, backgroundColor: "#F0F0F0", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${ind.meta}%`, borderRight: "2px dashed #CCC" }} />
                            <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, backgroundColor: atingiu ? "#22C55E" : "#EF4444", transition: "width 0.5s ease" }} />
                          </div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: atingiu ? "#22C55E" : "#EF4444", textAlign: "right" }}>{ind.real}%</div>
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, backgroundColor: atingiu ? "#F0FDF4" : "#FEF2F2", color: atingiu ? "#22C55E" : "#EF4444" }}>{atingiu ? "✓ Meta" : "✗ Abaixo"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Charts Row */}
              <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 24 }}>
                {/* Atendimentos por tipo */}
                <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Atendimentos por Mês</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={gestorAtendimentosChart}>
                      <defs>
                        <linearGradient id="gAgend" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1A8A8A" stopOpacity={0.12} /><stop offset="95%" stopColor="#1A8A8A" stopOpacity={0} /></linearGradient>
                        <linearGradient id="gEspont" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.12} /><stop offset="95%" stopColor="#F59E0B" stopOpacity={0} /></linearGradient>
                        <linearGradient id="gVisita" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.12} /><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" /><XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8E8E8", fontSize: 12 }} />
                      <Area type="monotone" dataKey="agendada" stackId="1" stroke="#1A8A8A" strokeWidth={2} fill="url(#gAgend)" name="Agendada" />
                      <Area type="monotone" dataKey="espontanea" stackId="1" stroke="#F59E0B" strokeWidth={2} fill="url(#gEspont)" name="Demanda Espontânea" />
                      <Area type="monotone" dataKey="visita" stackId="1" stroke="#8B5CF6" strokeWidth={2} fill="url(#gVisita)" name="Visita Domiciliar" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 16, marginTop: 8, justifyContent: "center" }}>
                    {[{ n: "Agendada", c: "#1A8A8A" }, { n: "Demanda Espontânea", c: "#F59E0B" }, { n: "Visita Domiciliar", c: "#8B5CF6" }].map((l, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}><div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: l.c }} /><span style={{ color: "#666" }}>{l.n}</span></div>))}
                  </div>
                </div>

                {/* ICSAB */}
                <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>ICSAB — Internações Evitáveis</div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>Internações por Condições Sensíveis à AB • Atual vs. Anterior</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {gestorICSAB.map((c, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>{c.condicao}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: c.internacoes < c.prev ? "#22C55E" : "#EF4444" }}>{c.internacoes} <span style={{ fontSize: 10, fontWeight: 400, color: "#999" }}>/ {c.prev} ant.</span></span>
                        </div>
                        <div style={{ display: "flex", gap: 4, height: 8 }}>
                          <div style={{ height: "100%", flex: c.internacoes, borderRadius: 4, backgroundColor: c.color + "CC" }} />
                          <div style={{ height: "100%", flex: c.prev - c.internacoes > 0 ? c.prev - c.internacoes : 0, borderRadius: 4, backgroundColor: c.color + "22" }} />
                          <div style={{ height: "100%", flex: Math.max(0, 30 - c.prev), borderRadius: 4, backgroundColor: "#F7F7F8" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, padding: "10px 12px", backgroundColor: "#F0FDF4", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <I.TrendDown /><span style={{ fontSize: 12, color: "#166534", fontWeight: 600 }}>Redução de 18% nas ICSAB vs. trimestre anterior</span>
                  </div>
                </div>
              </div>

              {/* Equipes ESF */}
              <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Equipes de Saúde da Família</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{gestorEquipesESF.length} equipes • {gestorEquipesESF.reduce((s, e) => s + e.populacao, 0).toLocaleString("pt-BR")} pessoas cobertas</div>
                </div>
                <div style={{ borderRadius: 10, border: "1px solid #E8E8E8", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 80px 80px 90px 80px 90px", padding: "12px 16px", backgroundColor: "#FAFAFA", borderBottom: "1px solid #EBEBEB", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.3, alignItems: "center" }}>
                    <div>Equipe</div><div>Médico</div><div>Enfermeiro</div><div style={{ textAlign: "center" }}>ACS</div><div style={{ textAlign: "center" }}>Pop.</div><div style={{ textAlign: "center" }}>Cobertura</div><div style={{ textAlign: "center" }}>Consult.</div><div style={{ textAlign: "center" }}>Status</div>
                  </div>
                  {gestorEquipesESF.map(e => (
                    <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 80px 80px 90px 80px 90px", padding: "14px 16px", borderBottom: "1px solid #F0F0F0", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{e.nome}</div>
                        <div style={{ fontSize: 11, color: "#999" }}>{e.area}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.medico.replace("Dr. ", "").replace("Dra. ", "")}</div>
                      <div style={{ fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.enfermeiro.replace("Enf. ", "")}</div>
                      <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600 }}>{e.acs}</div>
                      <div style={{ textAlign: "center", fontSize: 13, fontWeight: 600 }}>{e.populacao.toLocaleString("pt-BR")}</div>
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: e.cobertura >= 90 ? "#22C55E" : e.cobertura >= 80 ? "#F59E0B" : "#EF4444" }}>{e.cobertura}%</span>
                      </div>
                      <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600 }}>{e.consultas}</div>
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 6, backgroundColor: e.status === "Completa" ? "#F0FDF4" : "#FFFBEB", color: e.statusColor }}>{e.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agenda UBS + Cobertura Vacinal */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {/* Agenda da UBS */}
                <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Agenda da UBS — Hoje</div>
                    <div style={{ fontSize: 12, color: "#888" }}>05/03/2026 • {gestorAgendaUBS.length} atendimentos</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {gestorAgendaUBS.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: "1px solid #F0F0F0" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1A8A8A", minWidth: 42 }}>{a.hora}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.paciente}</div>
                          <div style={{ fontSize: 11, color: "#999" }}>{a.profissional} • {a.tipo}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, backgroundColor: a.statusBg, color: a.statusColor, whiteSpace: "nowrap" }}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cobertura Vacinal */}
                <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Cobertura Vacinal</div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>Cobertura atual vs. meta PNI • Linha tracejada = meta</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {gestorVacinacao.map((v, i) => {
                      const atingiu = v.cobertura >= v.meta;
                      return (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>{v.vacina}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: atingiu ? "#22C55E" : "#EF4444" }}>{v.cobertura}%</span>
                          </div>
                          <div style={{ height: 8, backgroundColor: "#F0F0F0", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                            <div style={{ position: "absolute", left: `${v.meta}%`, top: 0, height: "100%", width: 2, backgroundColor: "#999", opacity: 0.4 }} />
                            <div style={{ height: "100%", width: `${v.cobertura}%`, borderRadius: 4, backgroundColor: atingiu ? "#22C55E" : "#EF4444", transition: "width 0.5s ease" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: "#999", display: "flex", gap: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 3, backgroundColor: "#22C55E", borderRadius: 2, display: "inline-block" }} /> ≥ Meta</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 3, backgroundColor: "#EF4444", borderRadius: 2, display: "inline-block" }} /> Abaixo da meta</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 1, height: 8, backgroundColor: "#999", display: "inline-block" }} /> Meta PNI</span>
                  </div>
                </div>
              </div>

              {/* Repasse Federal */}
              <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8", marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Repasse Federal — PAB + Previne Brasil</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={gestorRepasse}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={v => [`R$ ${v.toLocaleString("pt-BR")}`, ""]} />
                    <Bar dataKey="pab" fill="#1A8A8A" radius={[4, 4, 0, 0]} name="PAB Fixo" />
                    <Bar dataKey="previne" fill="#22C55E" radius={[4, 4, 0, 0]} name="Previne (Performance)" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
                  <div style={{ padding: "12px", backgroundColor: "#E8F7F2", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>PAB Fixo (mensal)</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1A8A8A" }}>R$ 48.5k</div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#F0FDF4", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Previne (performance)</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#22C55E" }}>R$ 38.9k</div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#EFF6FF", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Total repasse Mar</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6" }}>R$ 87.4k</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div style={{ background: "linear-gradient(135deg,#1A8A8A,#147070)", borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Relatório para Secretaria de Saúde</div><div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>O ClinBot consolida indicadores Previne Brasil, ICSAB, cobertura vacinal e produtividade das equipes ESF em um relatório executivo para o secretário de saúde e prefeito.</div></div>
                <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", flexShrink: 0, fontFamily: "inherit" }}><I.Sparkle s={18} /> Gerar Relatório</button>
              </div>
            </div>
          </>
        )}

        {/* ──────── MEDICINA OCUPACIONAL ──────── */}
        {page === "ocupacional" && (
          <>
            <div style={{ padding: "20px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB" }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Medicina Ocupacional</h1>
                <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Gestão de saúde ocupacional • NR-7 / PCMSO • {ocupEmpresas.reduce((s, e) => s + e.funcionarios, 0)} funcionários</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", border: "1px solid #E0E0E0", borderRadius: 8, backgroundColor: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#555", fontFamily: "inherit" }}><I.Download /> Exportar</button>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg,#EA580C,#C2410C)", color: "#fff" }}><I.Plus /> Nova Empresa</button>
              </div>
            </div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, padding: "0 28px", backgroundColor: "#fff", borderBottom: "1px solid #EBEBEB" }}>
              {[{ key: "dashboard", label: "Dashboard" }, { key: "empresas", label: "Empresas" }, { key: "funcionarios", label: "Funcionários" }, { key: "aso", label: "Emitir ASO" }].map(t => (
                <div key={t.key} onClick={() => setOcupTab(t.key)} style={{ padding: "12px 20px", cursor: "pointer", fontSize: 13, fontWeight: ocupTab === t.key ? 700 : 500, color: ocupTab === t.key ? "#C2410C" : "#888", borderBottom: ocupTab === t.key ? "2px solid #C2410C" : "2px solid transparent", transition: "all 0.15s" }}>{t.label}</div>
              ))}
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>

              {/* ── TAB: DASHBOARD ── */}
              {ocupTab === "dashboard" && (
                <>
                  {/* KPIs */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                    {[
                      { l: "Total Funcionários", v: ocupEmpresas.reduce((s, e) => s + e.funcionarios, 0).toString(), c: "+24", up: true, icon: <I.Users s={18} />, cl: "#C2410C" },
                      { l: "Exames no Mês", v: "48", c: "+15%", up: true, icon: <I.Clipboard s={18} />, cl: "#3B82F6" },
                      { l: "Conformidade PCMSO", v: "80%", c: "+5%", up: true, icon: <I.CheckSquare s={18} />, cl: "#22C55E" },
                      { l: "ASOs Vencidos", v: "2", c: "+1", up: false, icon: <I.Alert s={18} />, cl: "#EF4444" },
                    ].map((card, i) => (
                      <div key={i} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: 10, backgroundColor: card.cl + "12", color: card.cl, display: "flex", alignItems: "center", justifyContent: "center" }}>{card.icon}</div>
                        <div style={{ fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 500 }}>{card.l}</div>
                        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1, marginBottom: 6 }}>{card.v}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: card.up && card.l !== "ASOs Vencidos" ? "#22C55E" : "#EF4444" }}>
                          {card.up && card.l !== "ASOs Vencidos" ? <I.TrendUp /> : <I.TrendDown />}
                          <span style={{ fontWeight: 600 }}>{card.c}</span><span style={{ color: "#999" }}>vs. mês anterior</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
                    <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Exames por Mês</div>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={ocupExamesChart}>
                          <defs><linearGradient id="gocup" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EA580C" stopOpacity={0.15} /><stop offset="95%" stopColor="#EA580C" stopOpacity={0} /></linearGradient></defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" /><XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8E8E8", fontSize: 13 }} />
                          <Area type="monotone" dataKey="v" stroke="#EA580C" strokeWidth={2.5} fill="url(#gocup)" dot={{ fill: "#EA580C", r: 4 }} name="Exames" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Riscos Ocupacionais</div>
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart><Pie data={ocupRiscoChart} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">{ocupRiscoChart.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8E8E8", fontSize: 12 }} /></PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {ocupRiscoChart.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}><div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: c.color }} /><span style={{ color: "#666" }}>{c.name}</span><span style={{ fontWeight: 700, color: "#333" }}>{c.value}%</span></div>))}
                      </div>
                    </div>
                  </div>

                  {/* Agenda de Exames Hoje */}
                  <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8", marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>Agenda de Exames — Hoje</div>
                      <div style={{ fontSize: 12, color: "#888" }}>05/03/2026 • {ocupAgendaHoje.length} exames</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {ocupAgendaHoje.map((a, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: "1px solid #F0F0F0", backgroundColor: "#fff" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#C2410C", minWidth: 42 }}>{a.hora}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.funcionario}</div>
                            <div style={{ fontSize: 11, color: "#999" }}>{a.empresa} • {a.tipo}</div>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, backgroundColor: a.statusBg, color: a.statusColor, whiteSpace: "nowrap" }}>{a.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NR-7 Compliance Banner */}
                  <div style={{ background: "linear-gradient(135deg,#EA580C,#C2410C)", borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div><div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Relatório de conformidade NR-7</div><div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Gere um relatório completo de conformidade PCMSO, ASOs pendentes e exposição a riscos por empresa.</div></div>
                    <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", flexShrink: 0, fontFamily: "inherit" }}><I.Sparkle s={18} /> Gerar Relatório</button>
                  </div>
                </>
              )}

              {/* ── TAB: EMPRESAS ── */}
              {ocupTab === "empresas" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                    {ocupEmpresas.map(e => (
                      <div key={e.id} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 16, right: 16 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, backgroundColor: e.status === "Em dia" ? "#F0FDF4" : e.status === "Vencendo" ? "#FFFBEB" : "#FEF2F2", color: e.statusColor }}>{e.status}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#FFF7ED", color: "#C2410C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>{e.avatar}</div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>{e.name}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>{e.cnpj}</div>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                          <div style={{ padding: "10px", backgroundColor: "#F7F7F8", borderRadius: 8 }}>
                            <div style={{ fontSize: 10, color: "#888", marginBottom: 2, textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.3 }}>Ramo</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{e.ramo}</div>
                          </div>
                          <div style={{ padding: "10px", backgroundColor: "#F7F7F8", borderRadius: 8 }}>
                            <div style={{ fontSize: 10, color: "#888", marginBottom: 2, textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.3 }}>GR (NR-4)</div>
                            <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: e.risco <= 1 ? "#22C55E" : e.risco <= 2 ? "#F59E0B" : e.risco <= 3 ? "#EA580C" : "#EF4444" }} />
                              Grau {e.risco}
                            </div>
                          </div>
                          <div style={{ padding: "10px", backgroundColor: "#F7F7F8", borderRadius: 8 }}>
                            <div style={{ fontSize: 10, color: "#888", marginBottom: 2, textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.3 }}>Funcionários</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{e.funcionarios}</div>
                          </div>
                          <div style={{ padding: "10px", backgroundColor: "#F7F7F8", borderRadius: 8 }}>
                            <div style={{ fontSize: 10, color: "#888", marginBottom: 2, textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.3 }}>PCMSO Vigência</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: e.status === "Vencido" ? "#EF4444" : "#333" }}>{e.pcmsoVigencia}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={{ flex: 1, padding: "8px", border: "1px solid #E0E0E0", borderRadius: 8, backgroundColor: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#555", fontFamily: "inherit" }}>Ver detalhes</button>
                          <button style={{ flex: 1, padding: "8px", border: "none", borderRadius: 8, backgroundColor: "#FFF7ED", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#C2410C", fontFamily: "inherit" }}>Gerenciar PCMSO</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── TAB: FUNCIONÁRIOS ── */}
              {ocupTab === "funcionarios" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ flex: 1, minWidth: 240, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", backgroundColor: "#fff", borderRadius: 10, border: "1px solid #E0E0E0" }}>
                      <I.Search /><input value={ocupSearch} onChange={e => setOcupSearch(e.target.value)} placeholder="Buscar por nome ou cargo..." style={{ flex: 1, border: "none", outline: "none", fontSize: 14, backgroundColor: "transparent", fontFamily: "inherit" }} />
                      {ocupSearch && <button onClick={() => setOcupSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 16 }}>×</button>}
                    </div>
                    <select value={ocupEmpresaFilter} onChange={e => setOcupEmpresaFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #E0E0E0", backgroundColor: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit", minWidth: 200 }}>
                      <option value="">Todas empresas</option>
                      {ocupEmpresas.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                  <div style={{ backgroundColor: "#fff", borderRadius: 12, border: "1px solid #E8E8E8", overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px 1fr 100px 100px 90px", padding: "12px 16px", backgroundColor: "#FAFAFA", borderBottom: "1px solid #EBEBEB", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.3, alignItems: "center" }}>
                      <div>Funcionário</div><div>Empresa</div><div>Cargo</div><div>Riscos</div><div>Último ASO</div><div>Próximo ASO</div><div style={{ textAlign: "center" }}>Status</div>
                    </div>
                    {filteredOcupFunc.map(f => (
                      <div key={f.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px 1fr 100px 100px 90px", padding: "14px 16px", borderBottom: "1px solid #F0F0F0", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, backgroundColor: "#FFF7ED", color: "#C2410C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{f.avatar}</div>
                          <div><div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div><div style={{ fontSize: 11, color: "#999" }}>{f.setor}</div></div>
                        </div>
                        <div style={{ fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.empresa}</div>
                        <div style={{ fontSize: 13, color: "#555" }}>{f.cargo}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {f.riscos.map((r, i) => <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, backgroundColor: r === "Químico" ? "#FFFBEB" : r === "Ruído" ? "#EFF6FF" : r === "Biológico" ? "#F0FDF4" : r === "Elétrico" ? "#FEF2F2" : "#F7F7F8", color: r === "Químico" ? "#D97706" : r === "Ruído" ? "#3B82F6" : r === "Biológico" ? "#22C55E" : r === "Elétrico" ? "#EF4444" : "#888" }}>{r}</span>)}
                        </div>
                        <div style={{ fontSize: 12, color: "#555" }}>{f.ultimoASO}</div>
                        <div style={{ fontSize: 12, color: f.status === "Vencido" ? "#EF4444" : "#555", fontWeight: f.status === "Vencido" ? 600 : 400 }}>{f.proximoASO}</div>
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, backgroundColor: f.statusBg, color: f.statusColor }}>{f.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── TAB: EMITIR ASO ── */}
              {ocupTab === "aso" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
                    {/* ASO Form */}
                    <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "24px", border: "1px solid #E8E8E8" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Emitir ASO</div>
                      <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Atestado de Saúde Ocupacional — NR-7</div>

                      {/* Funcionário */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.3 }}>Funcionário</label>
                        <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E0E0E0", backgroundColor: "#F7F7F8", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>
                          <option value="">Selecione o funcionário...</option>
                          {ocupFuncionarios.map(f => <option key={f.id} value={f.id}>{f.name} — {f.empresa} ({f.cargo})</option>)}
                        </select>
                      </div>

                      {/* Tipo de Exame */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.3 }}>Tipo de Exame</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {ocupExamesTipos.map(t => (
                            <button key={t} onClick={() => setOcupAsoTipo(t)} style={{ padding: "8px 16px", borderRadius: 8, border: ocupAsoTipo === t ? "2px solid #C2410C" : "1px solid #E0E0E0", backgroundColor: ocupAsoTipo === t ? "#FFF7ED" : "#fff", cursor: "pointer", fontSize: 13, fontWeight: ocupAsoTipo === t ? 700 : 500, color: ocupAsoTipo === t ? "#C2410C" : "#555", fontFamily: "inherit", transition: "all 0.15s" }}>{t}</button>
                          ))}
                        </div>
                      </div>

                      {/* Riscos Ocupacionais */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.3 }}>Riscos Ocupacionais Identificados</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {["Ruído", "Químico", "Biológico", "Ergonômico", "Elétrico", "Queda", "Vibração", "Calor", "Radiação"].map(r => (
                            <div key={r} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px solid #E0E0E0", backgroundColor: "#F7F7F8", cursor: "pointer", fontSize: 12 }}>
                              <input type="checkbox" style={{ accentColor: "#C2410C", width: 14, height: 14, cursor: "pointer" }} /> {r}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exames Complementares */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.3 }}>Exames Complementares Realizados</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {["Audiometria", "Espirometria", "Acuidade Visual", "EAS", "Hemograma", "Glicemia", "ECG", "Raio-X Tórax"].map(ex => (
                            <div key={ex} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px solid #E0E0E0", backgroundColor: "#fff", cursor: "pointer", fontSize: 12 }}>
                              <input type="checkbox" style={{ accentColor: "#C2410C", width: 14, height: 14, cursor: "pointer" }} /> {ex}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resultado */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.3 }}>Resultado</label>
                        <div style={{ display: "flex", gap: 10 }}>
                          {[{ v: "Apto", c: "#22C55E", bg: "#F0FDF4" }, { v: "Apto com restrições", c: "#F59E0B", bg: "#FFFBEB" }, { v: "Inapto", c: "#EF4444", bg: "#FEF2F2" }].map(r => (
                            <button key={r.v} onClick={() => setOcupAsoResult(r.v)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: ocupAsoResult === r.v ? `2px solid ${r.c}` : "1px solid #E0E0E0", backgroundColor: ocupAsoResult === r.v ? r.bg : "#fff", cursor: "pointer", fontSize: 14, fontWeight: ocupAsoResult === r.v ? 700 : 500, color: ocupAsoResult === r.v ? r.c : "#555", fontFamily: "inherit", transition: "all 0.15s" }}>{r.v}</button>
                          ))}
                        </div>
                      </div>

                      {/* CID e Observações */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.3 }}>Observações / CID (se aplicável)</label>
                        <textarea placeholder="Observações clínicas, restrições ou CID relevante..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E0E0E0", backgroundColor: "#F7F7F8", fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 80 }} />
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 10 }}>
                        <button style={{ flex: 1, padding: "12px", border: "1px solid #E0E0E0", borderRadius: 10, backgroundColor: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#555", fontFamily: "inherit" }}><I.Eye /> Pré-visualizar</button>
                        <button style={{ flex: 1, padding: "12px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg,#EA580C,#C2410C)", color: "#fff", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><I.Doc s={16} /> Emitir ASO</button>
                      </div>
                    </div>

                    {/* AI Sidebar */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* ClinBot suggestion */}
                      <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}><I.Sparkle s={16} /><span style={{ fontSize: 14, fontWeight: 700, color: "#C2410C" }}>ClinBot — Sugestão IA</span></div>
                        <div style={{ padding: "14px", backgroundColor: "#FFF7ED", borderRadius: 10, border: "1px solid #FED7AA", marginBottom: 12 }}>
                          <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
                            Baseado nos <strong>riscos identificados</strong> para este setor e cargo, os seguintes exames complementares são recomendados:
                          </div>
                          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                            {[{ exam: "Audiometria tonal", reason: "Exposição a ruído > 80dB (NR-15)" }, { exam: "Espirometria", reason: "Exposição a agentes químicos inaláveis" }, { exam: "Acuidade visual", reason: "Trabalho em altura — NR-35" }].map((s, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", backgroundColor: "#fff", borderRadius: 6, border: "1px solid #FED7AA" }}>
                                <div style={{ color: "#EA580C", marginTop: 2, flexShrink: 0 }}><I.CheckCircle s={14} /></div>
                                <div><div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{s.exam}</div><div style={{ fontSize: 11, color: "#888" }}>{s.reason}</div></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: "#999", lineHeight: 1.5 }}>💡 O ClinBot analisa o PPRA/PGR da empresa e a função do trabalhador para sugerir exames complementares conforme a NR-7.</div>
                      </div>

                      {/* Quick stats */}
                      <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8E8E8" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Resumo do Dia</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {[{ l: "ASOs emitidos hoje", v: "3" }, { l: "Admissionais pendentes", v: "2" }, { l: "Periódicos vencendo esta semana", v: "4" }, { l: "Demissionais agendados", v: "1" }].map((s, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", backgroundColor: "#F7F7F8", borderRadius: 6 }}>
                              <span style={{ fontSize: 12, color: "#666" }}>{s.l}</span>
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>{s.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </>
        )}

      </div>

      {/* ═══ RIGHT PANELS ═══ */}

      {/* Consulta ClinBot */}
      {rightPanel === "consultaClinBot" && (
        <div style={{ width: 380, minWidth: 380, borderLeft: "1px solid #EBEBEB", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setRightPanel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Close /></button>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Identificação de Red Flags Clínicas...</div>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Refresh /></button>
          </div>
          <div style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, backgroundColor: "#F0FDF4", fontSize: 12, color: "#16A34A" }}><div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22C55E" }} />Este chat é referente à consulta atual</div>
          <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#CCF0E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#1A8A8A", flexShrink: 0 }}>LB</div>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 4 }}>Você</div><div style={{ fontSize: 14, lineHeight: 1.5 }}>Quais red flags relevantes devo checar neste caso?</div></div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>IA</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8 }}>ClinBot</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Red Flags a Serem Checadas</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>1. Red Flags Neurológicas e Vasculares</div>
                <div style={{ paddingLeft: 12 }}>
                  <div style={{ marginBottom: 12, fontSize: 13, lineHeight: 1.6 }}>○ <strong>Perda de sensibilidade protetora</strong> → risco de úlcera plantar <span style={{ color: "#1A8A8A", cursor: "pointer" }}>Ref. 18 Ref. 20</span></div>
                  <div style={{ marginBottom: 12, fontSize: 13, lineHeight: 1.6 }}>○ <strong>Dor intensa, progressiva ou de início súbito</strong> → investigar CIDP, vasculite <span style={{ color: "#1A8A8A", cursor: "pointer" }}>Ref. 18 Ref. 19</span></div>
                </div>
              </div>
            </div>
          </div>
          <ChatInput placeholder="Escreva para o ClinBot..." />
        </div>
      )}

      {/* Gerar Documento */}
      {rightPanel === "gerarDoc" && (
        <div style={{ width: 380, minWidth: 380, borderLeft: "1px solid #EBEBEB", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setRightPanel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Close /></button>
            <span style={{ fontSize: 18, fontWeight: 700 }}>Gerar documentos</span>
          </div>
          <div style={{ display: "flex", borderBottom: "1px solid #EBEBEB" }}>
            {["anamneses", "auxiliares"].map(t => (<button key={t} onClick={() => setDocTab(t)} style={{ flex: 1, padding: 12, border: "none", backgroundColor: "transparent", borderBottom: docTab === t ? "2px solid #1A8A8A" : "2px solid transparent", fontWeight: docTab === t ? 600 : 400, color: docTab === t ? "#1A8A8A" : "#666", cursor: "pointer", fontSize: 14, textTransform: "capitalize" }}>{t === "anamneses" ? "Anamneses" : "Documentos auxiliares"}</button>))}
          </div>
          <div style={{ padding: "12px 20px" }}><div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: 8 }}><input placeholder="Pesquisar documento" style={{ flex: 1, border: "none", outline: "none", fontSize: 13 }} /><div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><I.Search c="#fff" /></div></div></div>
          <div style={{ flex: 1, overflow: "auto", padding: "0 20px" }}>
            {docTab === "anamneses" && (<>
              <div style={{ marginBottom: 16 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#666", marginBottom: 4 }}>Modelos criados por você</div><div style={{ fontSize: 12, color: "#999", marginBottom: 10 }}>Deseja criar um modelo?</div><button style={{ width: "100%", padding: 10, border: "1px solid #1A8A8A", borderRadius: 8, backgroundColor: "#fff", color: "#1A8A8A", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><I.Sparkle s={14} /> Criar meu modelo</button></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#666", marginBottom: 12 }}>Modelos criados pela Med.Com.Vc</div>
              {anamneseModels.map((m, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 8, marginBottom: 4, cursor: "pointer", border: m.selected ? "2px solid #1A8A8A" : "1px solid transparent", backgroundColor: m.selected ? "#FAFAFE" : "transparent" }}><div style={{ color: m.selected ? "#1A8A8A" : "#888", marginTop: 2 }}><I.Doc /></div><div><div style={{ fontSize: 14, fontWeight: 600, color: m.selected ? "#1A8A8A" : "#333" }}>{m.name}</div><div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{m.desc}</div></div></div>))}
            </>)}
            {docTab === "auxiliares" && docAux.map((m, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 8, marginBottom: 4, cursor: "pointer" }}><div style={{ color: "#888", marginTop: 2 }}><I.Doc /></div><div><div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{m.desc}</div></div></div>))}
          </div>
          <div style={{ borderTop: "1px solid #EBEBEB", padding: "12px 20px" }}>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>Modelo selecionado:</div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, backgroundColor: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A", marginBottom: 12 }}><I.Warning /><div><div style={{ fontSize: 14, fontWeight: 700 }}>Anamnese padrão</div><div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Atenção! Documento já existente. Será regenerado.</div></div></div>
            <button style={{ width: "100%", padding: 12, border: "none", borderRadius: 8, background: "linear-gradient(135deg,#2BA89E,#1A8A8A)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><I.Sparkle s={16} /> Gerar novamente</button>
          </div>
        </div>
      )}

      {/* Patient ClinBot */}
      {rightPanel === "patClinBot" && (
        <div style={{ width: 400, minWidth: 400, borderLeft: "1px solid #EBEBEB", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setRightPanel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Close /></button>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 700 }}>ClinBot – Análise de Pacientes</div>
          </div>
          <div style={{ padding: "10px 16px", backgroundColor: "#E8F7F2", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#1A8A8A", fontWeight: 600 }}>Selecionados:</span>
            {patients.filter(p => selectedPats.includes(p.id)).map(p => (
              <span key={p.id} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 12, backgroundColor: "#1A8A8A", color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>{p.name.split(" ")[0]}<span onClick={() => togglePat(p.id)} style={{ cursor: "pointer", marginLeft: 2 }}>×</span></span>
            ))}
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "20px 16px" }}>
            <div style={{ textAlign: "center", marginBottom: 24, padding: "0 20px" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#E8F7F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#1A8A8A" }}><I.Sparkle s={24} /></div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Análise Clínica com IA</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>Pergunte sobre histórico, padrões e evolução dos pacientes.</div>
            </div>
            {["Resuma o histórico clínico", "Quais exames estão pendentes?", "Existem interações medicamentosas?", "Sugira próximos passos de tratamento"].map((s, i) => (
              <button key={i} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid #E8E8E8", borderRadius: 10, backgroundColor: "#FAFAFA", cursor: "pointer", fontSize: 13, color: "#555", textAlign: "left", fontFamily: "inherit", marginBottom: 8 }}><I.Sparkle s={14} /> {s}</button>
            ))}
          </div>
          <ChatInput placeholder="Pergunte sobre seus pacientes..." />
        </div>
      )}

      {/* Dashboard ClinBot */}
      {rightPanel === "dashClinBot" && (
        <div style={{ width: 440, minWidth: 440, borderLeft: "1px solid #EBEBEB", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { setRightPanel(null); setReportState("config"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Close /></button>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 700 }}>Relatório ClinBot</div>
          </div>
          {reportState === "config" && (
            <div style={{ flex: 1, overflow: "auto", padding: "20px 18px" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "#E8F7F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#1A8A8A" }}><I.Sparkle s={26} /></div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Relatório Personalizado</div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>Configure filtros e descreva o que deseja analisar.</div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Filtros da população</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[{ l: "Condição", k: "condition", opts: ["", "Diabetes Tipo 2", "Hipertensão", "DPOC", "Asma"] }, { l: "Faixa etária", k: "ageRange", opts: ["", "18-30", "31-45", "46-60", "61-75", "76+"] }].map(f => (
                    <div key={f.k}><label style={{ fontSize: 11, fontWeight: 600, color: "#888", display: "block", marginBottom: 4 }}>{f.l}</label><select value={dashFilters[f.k]} onChange={e => setDashFilters(p => ({ ...p, [f.k]: e.target.value }))} style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #E0E0E0", fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}>{f.opts.map(o => <option key={o} value={o}>{o || "Todos"}</option>)}</select></div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[{ l: "Sexo", k: "gender", opts: ["", "Masculino", "Feminino"] }, { l: "Risco", k: "riskLevel", opts: ["", "Baixo", "Moderado", "Alto", "Crítico"] }].map(f => (
                    <div key={f.k}><label style={{ fontSize: 11, fontWeight: 600, color: "#888", display: "block", marginBottom: 4 }}>{f.l}</label><select value={dashFilters[f.k]} onChange={e => setDashFilters(p => ({ ...p, [f.k]: e.target.value }))} style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #E0E0E0", fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}>{f.opts.map(o => <option key={o} value={o}>{o || "Todos"}</option>)}</select></div>
                  ))}
                </div>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: "#888", display: "block", marginBottom: 4 }}>Período</label><div style={{ display: "flex", gap: 6 }}>{["3m", "6m", "1a", "2a"].map(p => (<button key={p} onClick={() => setDashFilters(f => ({ ...f, period: p }))} style={{ flex: 1, padding: 8, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, border: dashFilters.period === p ? "2px solid #1A8A8A" : "1px solid #E0E0E0", backgroundColor: dashFilters.period === p ? "#E8F7F2" : "#fff", color: dashFilters.period === p ? "#1A8A8A" : "#666", fontFamily: "inherit" }}>{p === "3m" ? "3 meses" : p === "6m" ? "6 meses" : p === "1a" ? "1 ano" : "2 anos"}</button>))}</div></div>
              </div>
              <div style={{ marginBottom: 20 }}><label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>O que você quer analisar?</label><textarea value={dashPrompt} onChange={e => setDashPrompt(e.target.value)} placeholder="Ex: Analise o controle glicêmico dos pacientes diabéticos com hipertensão..." style={{ width: "100%", minHeight: 90, padding: 12, borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.5, boxSizing: "border-box" }} /></div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8 }}>Sugestões</div>
                {["Quais pacientes precisam de retorno urgente?", "Compare DM2 controlado vs. descontrolado", "Resumo executivo da saúde populacional"].map((s, i) => (<button key={i} onClick={() => setDashPrompt(s)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, padding: "9px 12px", border: "1px solid #E8E8E8", borderRadius: 8, backgroundColor: "#FAFAFA", cursor: "pointer", fontSize: 12, color: "#555", textAlign: "left", fontFamily: "inherit", marginBottom: 4 }}><I.Sparkle s={12} /> {s}</button>))}
              </div>
              <button onClick={handleGenReport} disabled={!dashPrompt} style={{ width: "100%", padding: 14, border: "none", borderRadius: 12, cursor: dashPrompt ? "pointer" : "not-allowed", fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "inherit", background: dashPrompt ? "linear-gradient(135deg,#2BA89E,#1A8A8A)" : "#D4D4D4", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><I.Sparkle s={18} /> Gerar Relatório</button>
            </div>
          )}
          {reportState === "loading" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid #E8F7F2", borderTopColor: "#1A8A8A", animation: "spin 1s linear infinite", marginBottom: 20 }} />
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Analisando dados...</div>
              <div style={{ fontSize: 13, color: "#888", textAlign: "center", lineHeight: 1.5 }}>O ClinBot está processando as informações para gerar seu relatório.</div>
            </div>
          )}
          {reportState === "done" && (
            <div style={{ flex: 1, overflow: "auto" }}>
              <div style={{ padding: "18px 18px 14px", backgroundColor: "#F9F7FF", borderBottom: "1px solid #D0EDE2" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}><div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, flex: 1, paddingRight: 10 }}>{mockReport.title}</div><div style={{ display: "flex", gap: 6 }}><button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", border: "1px solid #E0E0E0", borderRadius: 6, backgroundColor: "#fff", cursor: "pointer", fontSize: 11, color: "#666" }}><I.Copy /> Copiar</button><button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", border: "1px solid #E0E0E0", borderRadius: 6, backgroundColor: "#fff", cursor: "pointer", fontSize: 11, color: "#666" }}><I.Download /> PDF</button></div></div>
                <div style={{ fontSize: 11, color: "#999" }}>Gerado em 26/02/2026 • {dashFilters.condition || "Todas condições"} • {dashFilters.period === "6m" ? "6 meses" : dashFilters.period}</div>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ padding: 16, backgroundColor: "#FAFAFA", borderRadius: 10, border: "1px solid #E8E8E8", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>{mockReport.summary}</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 14, backgroundColor: "#FEF2F2", borderRadius: 10, marginBottom: 20, border: "1px solid #FECACA" }}><div style={{ color: "#EF4444", marginTop: 1 }}><I.Alert /></div><div style={{ fontSize: 13, color: "#991B1B", lineHeight: 1.5 }}>{mockReport.alert}</div></div>
                <div style={{ backgroundColor: "#fff", borderRadius: 10, padding: 16, border: "1px solid #E8E8E8", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Evolução HbA1c – DM2 + HAS</div>
                  <div style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, marginBottom: 10 }}>8.2% → 6.8% em 8 meses</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={chartHba1c}><defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" /><XAxis dataKey="month" tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} /><YAxis domain={[6, 9]} tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} /><Area type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={2} fill="url(#gg)" dot={{ fill: "#22C55E", r: 3 }} /></AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ padding: 16, backgroundColor: "#E8F7F2", borderRadius: 10, borderLeft: "4px solid #1A8A8A", marginBottom: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><I.Sparkle s={14} /><span style={{ fontSize: 13, fontWeight: 700, color: "#1A8A8A" }}>Insight</span></div><div style={{ fontSize: 13, lineHeight: 1.6 }}>{mockReport.insight}</div></div>
                <div style={{ marginBottom: 20 }}><div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Recomendações</div>{mockReport.recs.map((r, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", backgroundColor: "#fff", borderRadius: 8, border: "1px solid #E8E8E8", marginBottom: 6 }}><div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, backgroundColor: "#E8F7F2", color: "#1A8A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{i + 1}</div><div style={{ fontSize: 13, lineHeight: 1.5 }}>{r}</div></div>))}</div>
              </div>
              <ChatInput placeholder="Faça perguntas sobre este relatório..." />
            </div>
          )}
        </div>
      )}

      {/* Trilha ClinBot */}
      {rightPanel === "trilhaClinBot" && (
        <div style={{ width: 400, minWidth: 400, borderLeft: "1px solid #EBEBEB", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setRightPanel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Close /></button>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 700 }}>ClinBot – Trilha do Médico</div>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Refresh /></button>
          </div>

          <div style={{ padding: "8px 16px", backgroundColor: "#F9F7FF", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#1A8A8A", borderBottom: "1px solid #E0F5EF" }}>
            <I.BookOpen s={13} /> Contexto: sua prática clínica real
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "20px 16px" }}>
            <div style={{ textAlign: "center", marginBottom: 24, padding: "0 10px" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#E8F7F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#1A8A8A" }}><I.Sparkle s={24} /></div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>O que quer aprender hoje?</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>Crie quizzes e flashcards personalizados ou tire dúvidas sobre suas condutas e diretrizes.</div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Criar conteúdo</div>
            {[
              "Crie um quiz sobre diabetes com base nos meus casos",
              "Gere flashcards de hipertensão conforme ESC 2024",
              "Monte um quiz de DPOC com as diretrizes GOLD 2025",
              "Crie flashcards sobre neuropatia diabética",
            ].map((s, i) => (
              <button key={i} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid #E8E8E8", borderRadius: 10, backgroundColor: "#FAFAFA", cursor: "pointer", fontSize: 13, color: "#555", textAlign: "left", fontFamily: "inherit", marginBottom: 8 }}>
                <I.Sparkle s={14} /> {s}
              </button>
            ))}

            <div style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginTop: 16 }}>Analisar minha prática</div>
            {[
              "Por que meu rastreio de neuropatia está baixo?",
              "Quais diretrizes novas impactam minha prática?",
              "Analise minhas condutas dos últimos 3 meses",
              "Crie um plano de estudo semanal para mim",
            ].map((s, i) => (
              <button key={i} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid #E8E8E8", borderRadius: 10, backgroundColor: "#FAFAFA", cursor: "pointer", fontSize: 13, color: "#555", textAlign: "left", fontFamily: "inherit", marginBottom: 8 }}>
                <I.Target s={14} /> {s}
              </button>
            ))}
          </div>
          <ChatInput placeholder="Peça um quiz, flashcard ou análise..." />
        </div>
      )}

      {/* Portal ClinBot */}
      {rightPanel === "portalClinBot" && (
        <div style={{ width: 400, minWidth: 400, borderLeft: "1px solid #EBEBEB", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { setRightPanel(null); setPortalSelectedDoc(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Close /></button>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 700 }}>ClinBot</div>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Refresh /></button>
          </div>

          {portalSelectedDoc ? (
            <div style={{ padding: "10px 16px", backgroundColor: "#E8F7F2", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #D0EDE2" }}>
              <div style={{ color: "#1A8A8A" }}><I.Doc s={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1A8A8A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{portalSelectedDoc.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{portalSelectedDoc.date} · {portalSelectedDoc.source}</div>
              </div>
              <button onClick={() => setPortalSelectedDoc(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
          ) : (
            <div style={{ padding: "8px 16px", backgroundColor: "#F0FDF4", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#16A34A", borderBottom: "1px solid #DCFCE7" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22C55E" }} /> Perguntas sobre sua saúde geral
            </div>
          )}

          <div style={{ flex: 1, overflow: "auto", padding: "20px 16px" }}>
            <div style={{ textAlign: "center", marginBottom: 24, padding: "0 16px" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#E8F7F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#1A8A8A" }}><I.Sparkle s={24} /></div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                {portalSelectedDoc ? "Pergunte sobre este documento" : "Como posso te ajudar?"}
              </div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>
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
              <button key={i} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid #E8E8E8", borderRadius: 10, backgroundColor: "#FAFAFA", cursor: "pointer", fontSize: 13, color: "#555", textAlign: "left", fontFamily: "inherit", marginBottom: 8 }}>
                <I.Sparkle s={14} /> {s}
              </button>
            ))}
          </div>
          <ChatInput placeholder={portalSelectedDoc ? "Pergunte sobre este documento..." : "Pergunte sobre sua saúde..."} />
        </div>
      )}

      {/* Patient Trail ClinBot */}
      {rightPanel === "patTrilhaClinBot" && (
        <div style={{ width: 400, minWidth: 400, borderLeft: "1px solid #EBEBEB", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setRightPanel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Close /></button>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 700 }}>ClinBot – Seu Assistente de Saúde</div>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}><I.Refresh /></button>
          </div>

          <div style={{ padding: "8px 16px", backgroundColor: "#FFF7ED", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#D97706", borderBottom: "1px solid #FDE68A" }}>
            <span>⭐</span> Nível 3 · 850 XP · <span>🔥</span> 7 dias de streak
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "20px 16px" }}>
            <div style={{ textAlign: "center", marginBottom: 24, padding: "0 10px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B,#FBBF24)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 28 }}>🤖</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Olá, Carlos! 👋</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>Estou aqui para explicar qualquer coisa sobre sua saúde de um jeito simples e claro!</div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Sobre seu aprendizado</div>
            {[
              "Me explique o que é HbA1c de um jeito simples",
              "Por que preciso tomar Metformina todos os dias?",
              "Como a alimentação afeta meu diabetes?",
              "Qual é o ideal de pressão para mim?",
            ].map((s, i) => (
              <button key={i} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid #FDE68A", borderRadius: 10, backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: 13, color: "#92400E", textAlign: "left", fontFamily: "inherit", marginBottom: 8 }}>
                💡 {s}
              </button>
            ))}

            <div style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginTop: 16 }}>Sobre minha saúde</div>
            {[
              "Meus últimos exames estão bons?",
              "Como estou me saindo no controle do diabetes?",
              "Tenho algum sinal de alerta que preciso conhecer?",
              "Me dê dicas práticas para o dia a dia",
            ].map((s, i) => (
              <button key={i} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid #E8E8E8", borderRadius: 10, backgroundColor: "#FAFAFA", cursor: "pointer", fontSize: 13, color: "#555", textAlign: "left", fontFamily: "inherit", marginBottom: 8 }}>
                <I.Heart /> {s}
              </button>
            ))}
          </div>
          <ChatInput placeholder="Pergunte qualquer coisa sobre sua saúde..." />
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
