
import React from 'react';
import { AccessiReport } from '../types';

interface AnalysisReportDisplayProps {
  report: AccessiReport;
}

const AnalysisReportDisplay: React.FC<AnalysisReportDisplayProps> = ({ report }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="mb-2">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-green-100">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Audit Finished
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Analysis Report Complete</h3>
        <p className="text-slate-500 text-lg leading-relaxed">
          Review your high-priority fixes and narrations below, organized by severity for easy implementation.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Screen Reader Context</h3>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
          <h4 className="text-[10px] font-black text-blue-600 mb-4 uppercase tracking-[0.2em]">Live Narration Script</h4>
          <p className="text-slate-800 leading-relaxed text-xl font-medium italic">
            "{report.narration}"
          </p>
          
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h4 className="text-[10px] font-black text-blue-600 mb-4 uppercase tracking-[0.2em]">Alt-Text Recommendations</h4>
            <div className="flex flex-wrap gap-3">
              {report.altText.map((alt, i) => (
                <div key={i} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 shadow-sm flex items-center gap-2">
                  <span className="text-blue-500">#</span>
                  {alt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-sm border border-red-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Priority Barrier</h3>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Identified Issue</span>
                <p className="text-2xl font-black text-slate-900 mt-1 leading-tight">{report.priorityIssue.issue}</p>
              </div>
              <div className="inline-block px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100">
                WCAG: {report.priorityIssue.wcag}
              </div>
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-3">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Technician Quick Fix</span>
              <p className="text-slate-200 text-lg font-medium leading-relaxed">{report.priorityIssue.fix}</p>
            </div>
          </div>
        </div>
      </section>

      {report.command && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">On-Demand Adjustment</h3>
          </div>
          <div className="bg-slate-900 text-slate-300 rounded-[2rem] p-8 shadow-2xl border border-slate-800 font-mono relative group">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">AccessiPilot Executable Shell</span>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                <div className="w-3 h-3 rounded-full bg-slate-800"></div>
              </div>
            </div>
            <p className="text-blue-400 text-lg select-all break-all bg-slate-800/50 p-6 rounded-2xl border border-white/5">
              {report.command}
            </p>
            <div className="absolute -bottom-3 right-8 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              Ready to execute
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AnalysisReportDisplay;
