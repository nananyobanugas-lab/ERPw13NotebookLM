import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SchemaView from './components/SchemaView';
import AutomationView from './components/AutomationView';
import ReportingView from './components/ReportingView';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.SCHEMA_DESIGN:
        return <SchemaView />;
      case ViewState.AUTOMATION:
        return <AutomationView />;
      case ViewState.REPORTING:
        return <ReportingView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 ml-64 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;