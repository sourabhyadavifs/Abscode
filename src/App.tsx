import React, { useState, useEffect } from 'react';
import { Case4M, Role } from './types';
import { INITIAL_CASES } from './data/seedData';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { CasesListView } from './views/CasesListView';
import { CreateRequestView } from './views/CreateRequestView';
import { CaseDetailView } from './views/CaseDetailView';

const LOCAL_STORAGE_KEY = 'abscode_quality_cases_v1';
const ROLE_STORAGE_KEY = 'abscode_quality_role_v1';

export default function App() {
  // Cases state with browser persistence
  const [cases, setCases] = useState<Case4M[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_CASES;
  });

  // Role state
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole && (savedRole === 'Supervisor' || savedRole === 'Quality Lead' || savedRole === 'Ops Head')) {
        return savedRole as Role;
      }
    } catch {
      // ignore
    }
    return 'Supervisor';
  });

  // View state
  const [activeView, setActiveView] = useState<'home' | 'cases' | 'create' | 'detail'>('home');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Sync cases to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cases));
    } catch {
      // ignore
    }
  }, [cases]);

  // Sync role to local storage
  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, currentRole);
    } catch {
      // ignore
    }
  }, [currentRole]);

  // Navigation handlers
  const handleNavigate = (view: 'home' | 'cases' | 'create') => {
    setActiveView(view);
    if (view !== 'cases') {
      setSelectedCaseId(null);
    }
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveView('detail');
  };

  const handleCaseCreated = (newCase: Case4M) => {
    setCases((prev) => [newCase, ...prev]);
  };

  const handleUpdateCase = (updatedCase: Case4M) => {
    setCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset demo data? This will restore the initial set of 5 sample 4M cases and clear any custom changes.'
      )
    ) {
      setCases(INITIAL_CASES);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSelectedCaseId(null);
      setActiveView('home');
    }
  };

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || null;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900 font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeView={activeView}
        onNavigate={handleNavigate}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        {activeView === 'home' && (
          <HomeView
            cases={cases}
            currentRole={currentRole}
            onNavigate={handleNavigate}
            onSelectCase={handleSelectCase}
          />
        )}

        {activeView === 'cases' && (
          <CasesListView
            cases={cases}
            currentRole={currentRole}
            onSelectCase={handleSelectCase}
            onCreateNew={() => setActiveView('create')}
          />
        )}

        {activeView === 'create' && (
          <CreateRequestView
            currentRole={currentRole}
            onCaseCreated={handleCaseCreated}
            onCancel={() => setActiveView('cases')}
            onViewCase={handleSelectCase}
          />
        )}

        {activeView === 'detail' && selectedCase && (
          <CaseDetailView
            currentCase={selectedCase}
            currentRole={currentRole}
            onUpdateCase={handleUpdateCase}
            onBack={() => setActiveView('cases')}
            onSwitchRole={setCurrentRole}
          />
        )}
      </main>

      {/* Enterprise Subtle Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Abscode Quality</span>
            <span>·</span>
            <span>4M Change Management</span>
            <span>·</span>
            <span className="font-mono">v1.0-prototype</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Prototype — demo data</span>
            <span>·</span>
            <span>Browser local storage session</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
