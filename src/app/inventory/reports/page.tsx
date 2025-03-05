"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import ReportSelector from '../../../components/inventory/reports/ReportSelector';
import ReportConfiguration from '../../../components/inventory/reports/ReportConfiguration';
import ReportViewer from '../../../components/inventory/reports/ReportViewer';
import { reportDefinitions, ReportType, generateReportData } from '../../../components/inventory/mockReports';

const InventoryReportsPage = () => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [reportParams, setReportParams] = useState<Record<string, any>>({});
  const [reportData, setReportData] = useState<any>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // Wybór raportu
  const handleSelectReport = (reportType: ReportType) => {
    const reportDef = reportDefinitions.find(def => def.id === reportType);
    if (!reportDef) return;
    
    // Inicjalizuj parametry z wartościami domyślnymi
    const initialParams: Record<string, any> = {};
    reportDef.parameters.forEach(param => {
      if (param.defaultValue !== undefined) {
        initialParams[param.id] = param.defaultValue;
      }
    });
    
    setSelectedReportType(reportType);
    setReportParams(initialParams);
    setIsConfiguring(true);
    setReportData(null);
  };
  
  // Aktualizacja parametrów raportu
  const handleParamChange = (paramId: string, value: any) => {
    setReportParams(prev => ({
      ...prev,
      [paramId]: value
    }));
  };
  
  // Generowanie raportu
  const handleGenerateReport = () => {
    if (!selectedReportType) return;
    
    // Generuj dane raportu
    const data = generateReportData(selectedReportType, reportParams);
    setReportData(data);
    setIsConfiguring(false);
  };
  
  // Powrót do konfiguracji
  const handleBackToConfig = () => {
    setIsConfiguring(true);
  };
  
  // Powrót do wyboru raportu
  const handleBackToSelection = () => {
    setSelectedReportType(null);
    setReportParams({});
    setReportData(null);
    setIsConfiguring(false);
  };
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Raporty magazynowe</h2>
          <p className="mt-1 text-sm text-gray-500">Generuj i analizuj raporty magazynowe</p>
        </div>
      </div>
      
      {/* Wyświetl selektor raportów, gdy nie wybrano żadnego raportu */}
      {!selectedReportType && (
        <ReportSelector 
          reports={reportDefinitions}
          onSelectReport={handleSelectReport}
        />
      )}
      
      {/* Wyświetl konfigurację raportu, gdy wybrano raport i trwa konfiguracja */}
      {selectedReportType && isConfiguring && (
        <ReportConfiguration
          reportType={selectedReportType}
          parameters={reportParams}
          onParamChange={handleParamChange}
          onGenerate={handleGenerateReport}
          onCancel={handleBackToSelection}
        />
      )}
      
      {/* Wyświetl wyniki raportu, gdy wybrano raport i wygenerowano dane */}
      {selectedReportType && reportData && !isConfiguring && (
        <ReportViewer
          reportType={selectedReportType}
          reportData={reportData}
          onBackToConfig={handleBackToConfig}
          onNewReport={handleBackToSelection}
        />
      )}
    </MainLayout>
  );
};

export default InventoryReportsPage;