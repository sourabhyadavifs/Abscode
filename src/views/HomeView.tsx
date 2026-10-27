import React from 'react';
import { Case4M, Role } from '../types';
import { ArrowRight, PlusCircle, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface HomeViewProps {
  cases: Case4M[];
  currentRole: Role;
  onNavigate: (view: 'cases' | 'create') => void;
  onSelectCase: (caseId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  cases,
  currentRole,
  onNavigate,
  onSelectCase,
}) => {
  // 5 most recent demo cases
  const recentCases = cases.slice(0, 5);

  const getStatusStyle = (status: Case4M['status']) => {
    switch (status) {
      case 'Pending Quality Review':
      case 'Pending Ops Approval':
      case 'Proof Review Pending':
      case 'Proof Approval Pending':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Returned for Correction':
      case 'Returned for Rework':
      case 'Proof Returned for Rework':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Awaiting Implementation Proof':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Ready for Closure':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Closed':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Hero Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-10 shadow-2xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded">
            <span>Enterprise 4M Change Management</span>
            <span>·</span>
            <span>Man · Machine · Material · Method</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
            Abscode Quality
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Record, review and close 4M changes.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
            Standardize shop floor change requests with direct camera scanning or digital entry,
            containment evaluation, structured Quality assessments, Ops Head approvals, and
            conditional implementation proofs.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('create')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Create 4M Request
            </button>
            <button
              onClick={() => onNavigate('cases')}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-md border border-slate-300 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              View Cases
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Role Testing Hint Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
            i
          </div>
          <div>
            <span className="font-semibold text-slate-800">Demo Testing Role: </span>
            <span className="text-slate-700">
              You are currently viewing as <strong className="text-slate-900">{currentRole}</strong>.
            </span>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Switch roles using the top-bar selector anytime to test full handoffs across Supervisor, Quality Lead, and Ops Head.
            </p>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 whitespace-nowrap bg-white px-3 py-1.5 rounded border border-slate-200 shrink-0">
          Prototype — demo data
        </div>
      </div>

      {/* Recent Cases Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Active 4M Cases</h2>
            <p className="text-xs text-slate-500">
              Sample manufacturing change items in various workflow states
            </p>
          </div>
          <button
            onClick={() => onNavigate('cases')}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
          >
            All cases ({cases.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Small List of Existing Demo Cases */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Machine / Line</th>
                  <th className="py-3 px-4">Part Affected</th>
                  <th className="py-3 px-4">4M Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Current Owner</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCase(c.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 tabular-nums">
                      {c.id}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{c.machineLine}</td>
                    <td className="py-3 px-4 text-slate-600">{c.partNumber}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-medium text-slate-800">{c.category}</span>
                      <span className="text-slate-400"> · </span>
                      <span className="text-slate-500">{c.reason}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getStatusStyle(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${
                          c.currentOwner === currentRole
                            ? 'text-blue-700 underline underline-offset-2'
                            : 'text-slate-700'
                        }`}
                      >
                        {c.currentOwner}
                        {c.currentOwner === currentRole && ' (You)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                        Open
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
