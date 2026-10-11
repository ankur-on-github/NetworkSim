"use client";

import React from 'react';
import { X, AlertTriangle, CheckCircle, ShieldAlert, Zap, ArrowRight } from 'lucide-react';

interface AnalysisModalProps {
  data: {
    history?: any[];
    explanation?: {
      primary_bottleneck?: string | null;
      cascade_path?: string[];
      narrative?: string;
      recommendations?: string[];
    };
  } | null;
  onClose: () => void;
}

export default function AnalysisModal({ data, onClose }: AnalysisModalProps) {
  if (!data || !data.explanation) return null;

  const { explanation } = data;
  const isBottleneck = Boolean(explanation.primary_bottleneck);
  const isCrash = explanation.narrative?.includes("CATASTROPHIC") || explanation.narrative?.includes("collapsed");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-[560px] rounded-xl border border-white/10 bg-gray-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/50 px-6 py-4">
          <div className="flex items-center gap-3">
            {isCrash ? (
              <ShieldAlert size={22} className="text-red-400" />
            ) : isBottleneck ? (
              <AlertTriangle size={22} className="text-amber-400" />
            ) : (
              <CheckCircle size={22} className="text-emerald-400" />
            )}
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-gray-100">
                Post-Simulation Diagnostic Report
              </h2>
              <p className="text-xs text-gray-400">Automated Root Cause & Remediation Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col p-6 overflow-y-auto space-y-5">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border ${
            isCrash 
              ? 'bg-red-500/10 border-red-500/30 text-red-200' 
              : isBottleneck 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {isCrash ? 'Severe Outage Detected' : isBottleneck ? 'Bottleneck Identified' : 'Optimal Resilience'}
              </span>
              {explanation.primary_bottleneck && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 border border-current font-bold">
                  {explanation.primary_bottleneck}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed font-sans text-gray-200">
              {explanation.narrative}
            </p>
          </div>

          {/* Cascade Path if available */}
          {explanation.cascade_path && explanation.cascade_path.length > 0 && (
            <div className="rounded-lg bg-black/30 border border-white/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <Zap size={14} className="text-purple-400" />
                Cascade Failure Path
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {explanation.cascade_path.map((node, i) => (
                  <React.Fragment key={node}>
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium">
                      {node}
                    </span>
                    {i < explanation.cascade_path!.length - 1 && (
                      <ArrowRight size={14} className="text-gray-500" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Prescriptive Remediation Actions ({explanation.recommendations?.length || 0})
            </h3>
            <div className="space-y-2">
              {explanation.recommendations && explanation.recommendations.length > 0 ? (
                explanation.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-sm text-gray-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{rec}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No corrective actions needed. System within baseline SLA.</p>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-white/10 bg-black/30 px-6 py-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 text-xs font-medium text-gray-200 hover:bg-white/20 transition-colors"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
