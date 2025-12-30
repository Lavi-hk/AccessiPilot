
import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import AnalysisReportDisplay from './components/AnalysisReportDisplay';
import { analyzeAccessibility } from './services/geminiService';
import { AnalysisState, AnalysisMode, AppError } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    report: null,
    error: null,
    imageData: null
  });
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.CAMERA);

  const setError = (error: AppError | null) => {
    setState(prev => ({ ...prev, error, isAnalyzing: false }));
  };

  const handleCapture = async (image: string) => {
    setState(prev => ({ ...prev, isAnalyzing: true, imageData: image, report: null, error: null }));
    try {
      const result = await analyzeAccessibility(image);
      
      // Check for empty content (No content detected)
      if (!result.narration || result.narration.length < 10) {
        throw new Error("NO_CONTENT");
      }
      
      setState(prev => ({ ...prev, isAnalyzing: false, report: result }));
    } catch (err: any) {
      if (err.message === "NO_CONTENT") {
        setError({
          title: "No elements found",
          message: "We couldn't identify any clear web elements or text in this image.",
          action: "Try a clearer screenshot or point the camera directly at the screen."
        });
      } else {
        setError({
          title: "Analysis encounterd an issue",
          message: "Our engine hit a temporary snag while processing this view.",
          action: "Please try capturing the screen again."
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type check
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError({
        title: "Format not supported",
        message: "We only support PNG, JPG, and WEBP images at this time.",
        action: "Please convert your file and try again."
      });
      return;
    }

    // File size check (4MB)
    if (file.size > 4 * 1024 * 1024) {
      setError({
        title: "File exceeds size limit",
        message: "This image is larger than 4MB, which is the maximum allowed for a fast audit.",
        action: "Please try a smaller file or compress your image."
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleCapture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-blue-200 shadow-md">
              A
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">AccessiPilot</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-0.5">Accessibility Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Core Engine Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12 flex flex-col lg:flex-row gap-12">
        {/* Left Side: Input Card */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Scanner Input</h2>
            <p className="text-slate-500 text-lg">Point your camera or upload a file to start the audit.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button 
                  onClick={() => setMode(AnalysisMode.CAMERA)}
                  className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === AnalysisMode.CAMERA ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Instant Scan
                </button>
                <button 
                  onClick={() => setMode(AnalysisMode.UPLOAD)}
                  className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === AnalysisMode.UPLOAD ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  File Audit
                </button>
              </div>
              <p className="text-sm text-slate-500 px-2 font-medium">
                {mode === AnalysisMode.CAMERA 
                  ? "Point your camera at a screen or device to audit in real-time."
                  : "Analyze a saved screenshot of any web interface."}
              </p>
            </div>

            {mode === AnalysisMode.CAMERA ? (
              <CameraCapture onCapture={handleCapture} isProcessing={state.isAnalyzing} onError={(err) => setError(err)} />
            ) : (
              <div className="relative group">
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition-all cursor-pointer overflow-hidden group-focus-within:ring-2 group-focus-within:ring-blue-500">
                  {state.imageData ? (
                    <img src={state.imageData} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-16 h-16 mb-4 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-slate-100">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </div>
                      <p className="text-xl font-bold text-slate-900 mb-1">Upload for Analysis</p>
                      <p className="text-slate-500 mb-3">Drag and drop or click to browse</p>
                      <div className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        PNG, JPG, or WEBP • MAX 4MB
                      </div>
                    </div>
                  )}
                  <input type="file" className="sr-only" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              Core Intelligence
            </h3>
            <ul className="space-y-4 text-blue-50">
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-black italic">!</div>
                <span className="font-medium">Scans for contrast and alt-text barriers automatically.</span>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-black italic">!</div>
                <span className="font-medium">Generates instant narrations for screen reader testing.</span>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-black italic">!</div>
                <span className="font-medium">Delivers actionable WCAG reports in milliseconds.</span>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-black italic">!</div>
                <span className="font-medium">Protects privacy with secure, no-storage processing.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Results Card */}
        <div className="w-full lg:w-1/2">
          {state.error ? (
            <div className="bg-white border-2 border-red-100 rounded-3xl p-8 shadow-sm animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{state.error.title}</h3>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">{state.error.message}</p>
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
                <span className="text-red-600 font-bold">Action:</span>
                <span className="text-red-800 font-medium">{state.error.action}</span>
              </div>
              <button 
                onClick={() => setError(null)}
                className="mt-8 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Clear error
              </button>
            </div>
          ) : (
            <>
              {!state.isAnalyzing && !state.report && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2rem] border border-slate-200 shadow-sm min-h-[500px]">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Awaiting Your First Scan</h3>
                  <p className="text-slate-500 max-w-sm text-lg leading-relaxed">
                    Capture a scene or upload an image. You’ll get a detailed report grouped by priority in under a second.
                  </p>
                </div>
              )}

              {state.isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] border border-slate-200 shadow-sm min-h-[500px]">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-[6px] border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Analyzing Interface</h3>
                  <p className="text-slate-500 text-center max-w-sm text-lg leading-relaxed">
                    Gemini is scanning for WCAG violations and generating narrations. Results will appear almost instantly.
                  </p>
                </div>
              )}

              {state.report && <AnalysisReportDisplay report={state.report} />}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center text-[10px] font-bold">A</div>
             <span className="text-slate-500 text-sm font-medium">© 2024 AccessiPilot Engine • Secured Processing</span>
          </div>
          <div className="flex gap-8 text-slate-400 text-sm font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Docs</a>
            <a href="#" className="hover:text-blue-600 transition-colors">WCAG 2.2</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
