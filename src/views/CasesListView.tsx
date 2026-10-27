import React, { useState, useMemo } from 'react';
import { Case4M, ChangeCategory, Role } from '../types';
import { Search, PlusCircle, Filter, ArrowRight, UserCheck } from 'lucide-react';

interface CasesListViewProps {
  cases: Case4M[];
  currentRole: Role;
  onSelectCase: (caseId: string) => void;
  onCreateNew: () => void;
}

export const CasesListView: React.FC<CasesListViewProps> = ({
  cases,
  currentRole,
  onSelectCase,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'my-tasks' | 'active' | 'closed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const myTaskCount = useMemo(() => {
    return cases.filter((c) => c.currentOwner === currentRole && c.status !== 'Closed').length;
  }, [cases, currentRole]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Tab filter
      if (filterTab === 'my-tasks') {
        if (c.currentOwner !== currentRole || c.status === 'Closed') return false;
      } else if (filterTab === 'active') {
        if (c.status === 'Closed') return false;
      } else if (filterTab === 'closed') {
        if (c.status !== 'Closed') return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && c.category !== categoryFilter) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = c.id.toLowerCase().includes(query);
        const matchesMachine = c.machineLine.toLowerCase().includes(query);
        const matchesPart = c.partNumber.toLowerCase().includes(query);
        const matchesReporter = c.reporterName.toLowerCase().includes(query);
        const matchesReason = c.reason.toLowerCase().includes(query);
        const matchesDesc = c.description.toLowerCase().includes(query);
        return (
          matchesId || matchesMachine || matchesPart || matchesReporter || matchesReason || matchesDesc
        );
      }

      return true;
    });
  }, [cases, filterTab, categoryFilter, searchTerm, currentRole]);

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
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            4M Cases Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time track and manage 4M shop-floor modifications through resolution.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Create 4M Request
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Functional Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Cases ({cases.length})
            </button>
            <button
              onClick={() => setFilterTab('my-tasks')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 ${
                filterTab === 'my-tasks'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>My Tasks ({currentRole})</span>
              {myTaskCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {myTaskCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterTab('active')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filterTab === 'active'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterTab('closed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filterTab === 'closed'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Closed
            </button>
          </div>

          {/* Search & Category Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, machine, part..."
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All 4M</option>
              <option value="Man">Man</option>
              <option value="Machine">Machine</option>
              <option value="Material">Material</option>
              <option value="Method">Method</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        {filteredCases.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-800">No matching cases found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no cases matching the selected filters or search query.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterTab('all');
                setCategoryFilter('all');
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-md"
            >
              Clear filters
            </button>
          </div>
        ) : (
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
                  <th className="py-3 px-4">Submission</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((c) => {
                  const isActionableForMe =
                    c.currentOwner === currentRole && c.status !== 'Closed';

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCase(c.id)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        isActionableForMe ? 'bg-blue-50/20' : ''
                      }`}
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
                              ? 'text-blue-700 font-semibold'
                              : 'text-slate-700'
                          }`}
                        >
                          {c.currentOwner}
                          {c.currentOwner === currentRole && ' ★'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 capitalize">
                        {c.entryMethod === 'physical' ? 'Paper scan' : 'Digital'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`text-xs font-medium inline-flex items-center gap-1 ${
                            isActionableForMe
                              ? 'text-blue-600 font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {isActionableForMe ? 'Take Action' : 'View'}
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>Showing {filteredCases.length} of {cases.length} total demo cases</span>
        <span>Prototype — demo data</span>
      </div>
    </div>
  );
};
