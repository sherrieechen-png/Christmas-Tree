
import React, { useState } from 'react';
import { TreeMorphState } from '../types';
import { analyzeWish } from '../services/geminiService';

interface UIOverlayProps {
  morphState: TreeMorphState;
  onMorphChange: (state: TreeMorphState) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ morphState, onMorphChange }) => {
  const [wish, setWish] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wish.trim()) return;

    setIsAnalyzing(true);
    const analysis = await analyzeWish(wish);
    setResult(analysis);
    setIsAnalyzing(false);
    
    if (morphState === TreeMorphState.SCATTERED) {
      onMorphChange(TreeMorphState.TREE_SHAPE);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-16">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h2 className="text-amber-400 text-sm tracking-widest uppercase mb-2">Signature Collection</h2>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            ARIX<br />
            <span className="serif italic font-normal text-amber-200">Interactive Tree</span>
          </h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-emerald-400 text-xs tracking-tighter uppercase">Established 2024</p>
          <p className="text-white/50 text-xs">Exclusively for the Festive Season</p>
        </div>
      </div>

      {/* Middle: AI Wish Analysis Result */}
      {result && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-md pointer-events-none">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl animate-in fade-in zoom-in duration-700">
            <h3 className="text-amber-400 uppercase text-xs tracking-[0.3em] mb-4">Gemini Analysis</h3>
            <p className="text-white text-lg font-light mb-4 italic">"{result.message}"</p>
            <div className="flex justify-center gap-2">
              {result.colorPalette.map((c: string, i: number) => (
                <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer: Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 pointer-events-auto">
        <div className="w-full md:w-96 bg-black/60 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4">Cast your Christmas Wish</p>
          <form onSubmit={handleWishSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="May the stars align..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            <button 
              disabled={isAnalyzing}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-white/10 text-black font-bold px-4 py-2 rounded-xl transition-all active:scale-95 text-sm"
            >
              {isAnalyzing ? '...' : 'WISH'}
            </button>
          </form>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => onMorphChange(TreeMorphState.SCATTERED)}
            className={`px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all border ${
              morphState === TreeMorphState.SCATTERED 
              ? 'bg-amber-500 border-amber-500 text-black scale-110 shadow-[0_0_30px_rgba(245,158,11,0.4)]' 
              : 'bg-black/40 border-white/20 text-white/60 hover:border-white/40'
            }`}
          >
            Scatter
          </button>
          <button 
            onClick={() => onMorphChange(TreeMorphState.TREE_SHAPE)}
            className={`px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all border ${
              morphState === TreeMorphState.TREE_SHAPE 
              ? 'bg-amber-500 border-amber-500 text-black scale-110 shadow-[0_0_30px_rgba(245,158,11,0.4)]' 
              : 'bg-black/40 border-white/20 text-white/60 hover:border-white/40'
            }`}
          >
            Tree Form
          </button>
        </div>
      </div>
    </div>
  );
};
