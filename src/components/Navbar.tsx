import React, { useState } from 'react';
import { Role } from '../types';
import { RotateCcw, Menu, X, Shield, UserCheck, Layers, FilePlus } from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeView: 'home' | 'cases' | 'create' | 'detail';
  onNavigate: (view: 'home' | 'cases' | 'create') => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeView,
  onNavigate,
  onResetData,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles: { role: Role; label: string; icon: React.ReactNode }[] = [
    { role: 'Supervisor', label: 'Supervisor', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { role: 'Quality Lead', label: 'Quality Lead', icon: <Shield className="w-3.5 h-3.5" /> },
    { role: 'Ops Head', label: 'Ops Head', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-15 gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer text-left"
          >
            Abscode Quality
          </button>
          <span className="text-[11px] text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded border border-slate-200 whitespace-nowrap hidden sm:inline-block">
            Prototype — demo data
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('cases')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeView === 'cases'
                ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Cases
          </button>
          <button
            onClick={() => onNavigate('create')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer inline-flex items-center gap-1.5 ${
              activeView === 'create'
                ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <FilePlus className="w-4 h-4 text-blue-600" />
            Create 4M Request
          </button>
        </nav>

        {/* Right Zone: Role Switcher & Reset Button */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* Demo Role Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 px-2">Role:</span>
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => onRoleChange(r.role)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 ${
                  currentRole === r.role
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={`Switch demo perspective to ${r.label}`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            className="text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded hover:bg-slate-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
            title="Reset to default prototype cases"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Reset Demo</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200 truncate max-w-[120px]">
            {currentRole}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 border-t border-slate-200 bg-white space-y-4">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('cases');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              Cases Register
            </button>
            <button
              onClick={() => {
                onNavigate('create');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50/50 hover:bg-blue-50 rounded"
            >
              Create 4M Request
            </button>
          </div>

          {/* Role selector mobile */}
          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-2">Switch Demo Role:</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    onRoleChange(r.role);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 text-xs font-medium rounded text-center border transition-colors ${
                    currentRole === r.role
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span className="text-[11px] text-slate-500">Prototype — demo data</span>
            <button
              onClick={() => {
                onResetData();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
