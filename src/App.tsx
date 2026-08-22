import React, { useState, useEffect, useMemo } from 'react';
import { loadInitialData, AppDataStore } from './services/dataLoader';
import { findDuplicates } from './services/dataAggregator';
import { FilterState, Facility } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthGate, logoutUser, isUserAuthenticated } from './components/AuthGate';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { SyncModal } from './components/SyncModal';
import { DuplicateModal } from './components/DuplicateModal';
import { FacilityModal } from './components/FacilityModal';
import { QuickSearchView } from './views/QuickSearchView';
import { OverviewView } from './views/OverviewView';
import { IndustryReportView } from './views/IndustryReportView';
import { WeeklyReportView } from './views/WeeklyReportView';
import { FacilityListView } from './views/FacilityListView';
import { OfficerReportView } from './views/OfficerReportView';
import { ExportView } from './views/ExportView';

export function App() {
  const [store, setStore] = useState<AppDataStore>(() => loadInitialData());
  const [activeTab, setActiveTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'quick';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState<boolean>(false);
  const [inspectingFacility, setInspectingFacility] = useState<Facility | null>(null);
  const [facilityFilterOverride, setFacilityFilterOverride] = useState<Partial<FilterState>>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isUserAuthenticated());

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn khoá hệ thống / đăng xuất?')) {
      logoutUser();
      setIsAuthenticated(false);
    }
  };

  // Sync Dark mode with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Duplicates calculation
  const duplicateGroups = useMemo(() => {
    return findDuplicates(store.facilities);
  }, [store.facilities]);

  // Drilldown handlers
  const handleSelectTeam = (teamName: string) => {
    setFacilityFilterOverride({ team: teamName });
    setActiveTab('facilities');
  };

  const handleSelectIndustry = (industryName: string) => {
    setFacilityFilterOverride({ industry: industryName });
    setActiveTab('facilities');
  };

  const handleSelectOfficer = (officerName: string) => {
    setFacilityFilterOverride({ officer: officerName });
    setActiveTab('facilities');
  };

  if (!isAuthenticated) {
    return <AuthGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
        {/* PWA Install Banner on mobile browsers */}
        <PwaInstallPrompt />

        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSync={() => setIsSyncModalOpen(true)}
          onDataLoaded={newStore => setStore(newStore)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          duplicateCount={duplicateGroups.length}
          onOpenDuplicates={() => setIsDuplicateModalOpen(true)}
          totalFacilities={store.facilities.length}
          lastUpdated={store.lastUpdated}
          onLogout={handleLogout}
        />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6">
        {activeTab === 'quick' && (
          <QuickSearchView
            facilities={store.facilities}
          />
        )}

        {activeTab === 'overview' && (
          <OverviewView
            facilities={store.facilities}
            industrySummary={store.industrySummary}
            weeklySummary={store.weeklySummary}
            onSelectTeam={handleSelectTeam}
            onSelectIndustry={handleSelectIndustry}
          />
        )}

        {activeTab === 'industry' && (
          <IndustryReportView
            industrySummary={store.industrySummary}
            onDrillDownIndustry={handleSelectIndustry}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyReportView
            weeklySummary={store.weeklySummary}
          />
        )}

        {activeTab === 'facilities' && (
          <FacilityListView
            facilities={store.facilities}
            initialFilter={facilityFilterOverride}
            onClearInitialFilter={() => setFacilityFilterOverride({})}
          />
        )}

        {activeTab === 'officers' && (
          <OfficerReportView
            facilities={store.facilities}
            onSelectOfficer={handleSelectOfficer}
          />
        )}

        {activeTab === 'export' && (
          <ExportView
            facilities={store.facilities}
            industrySummary={store.industrySummary}
            weeklySummary={store.weeklySummary}
          />
        )}
      </main>

      {/* Footer with Author and Copyright */}
      <Footer />

      {/* Sync Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncSuccess={newStore => setStore(newStore)}
        lastUpdated={store.lastUpdated}
      />

      {/* Duplicate Check Modal */}
      {isDuplicateModalOpen && (
        <DuplicateModal
          duplicates={duplicateGroups}
          onClose={() => setIsDuplicateModalOpen(false)}
          onSelectFacility={f => {
            setIsDuplicateModalOpen(false);
            setInspectingFacility(f);
          }}
        />
      )}

        {/* Inspecting Facility Modal */}
        <FacilityModal
          facility={inspectingFacility}
          onClose={() => setInspectingFacility(null)}
        />
      </div>
  );
}