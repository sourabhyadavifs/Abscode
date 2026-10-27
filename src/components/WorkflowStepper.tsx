import React from 'react';
import { Check } from 'lucide-react';
import { Case4M } from '../types';

interface WorkflowStepperProps {
  currentCase: Case4M;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ currentCase }) => {
  const { status, approval } = currentCase;
  const isProofRequired = approval?.proofRequired === true;

  // Compute step statuses: 'completed' | 'current' | 'upcoming'
  // S1: Raised
  // S2_3: Quality Review & Assessment
  // S4: Ops Approval
  // Proof: Implementation Proof (if required)
  // S5: Verify & Close

  const getStepState = (stepKey: 'S1' | 'S2_3' | 'S4' | 'PROOF' | 'S5') => {
    switch (stepKey) {
      case 'S1':
        return 'completed';

      case 'S2_3':
        if (status === 'Pending Quality Review' || status === 'Returned for Correction') {
          return 'current';
        }
        return 'completed';

      case 'S4':
        if (status === 'Pending Quality Review' || status === 'Returned for Correction') {
          return 'upcoming';
        }
        if (status === 'Pending Ops Approval' || status === 'Returned for Rework') {
          return 'current';
        }
        return 'completed';

      case 'PROOF':
        if (!isProofRequired) {
          return 'skipped';
        }
        if (
          status === 'Pending Quality Review' ||
          status === 'Returned for Correction' ||
          status === 'Pending Ops Approval' ||
          status === 'Returned for Rework'
        ) {
          return 'upcoming';
        }
        if (
          status === 'Awaiting Implementation Proof' ||
          status === 'Proof Review Pending' ||
          status === 'Proof Returned for Rework' ||
          status === 'Proof Approval Pending'
        ) {
          return 'current';
        }
        return 'completed';

      case 'S5':
        if (status === 'Closed') {
          return 'completed';
        }
        if (status === 'Ready for Closure') {
          return 'current';
        }
        // If not closed or ready for closure:
        return 'upcoming';
    }
  };

  const steps = [
    { key: 'S1' as const, label: 'S1. Raised', role: 'Supervisor' },
    { key: 'S2_3' as const, label: 'S2-S3. Quality Review', role: 'Quality Lead' },
    { key: 'S4' as const, label: 'S4. Ops Approval', role: 'Ops Head' },
    ...(isProofRequired
      ? [{ key: 'PROOF' as const, label: 'Proof & Verification', role: 'Supervisor / Quality' }]
      : []),
    { key: 'S5' as const, label: 'S5. Verify & Close', role: 'Quality / Closure' },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-3 sm:p-4">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <span className="font-semibold text-slate-800">4M Workflow Stage</span>
        <span className="text-[11px] text-slate-400">Proposed standard sequence</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        {steps.map((step, idx) => {
          const state = getStepState(step.key);
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.key}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                    state === 'completed'
                      ? 'bg-slate-900 text-white'
                      : state === 'current'
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {state === 'completed' ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-medium truncate ${
                      state === 'current'
                        ? 'text-blue-600 font-semibold'
                        : state === 'completed'
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{step.role}</p>
                </div>
              </div>

              {!isLast && (
                <div className="hidden sm:block flex-1 mx-3 h-[1px] bg-slate-200" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
