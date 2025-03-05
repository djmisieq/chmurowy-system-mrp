import React from 'react';
import { Calendar, AlertTriangle, DollarSign, RefreshCw, PieChart, MapPin } from 'lucide-react';
import { ReportDefinition, ReportType } from '../mockReports';

interface ReportSelectorProps {
  reports: ReportDefinition[];
  onSelectReport: (reportType: ReportType) => void;
}

const ReportSelector: React.FC<ReportSelectorProps> = ({ reports, onSelectReport }) => {
  // Helper function to get icon component
  const getIconComponent = (iconName: string, size: number = 24) => {
    switch (iconName) {
      case 'calendar':
        return <Calendar size={size} />;
      case 'alert-triangle':
        return <AlertTriangle size={size} />;
      case 'dollar-sign':
        return <DollarSign size={size} />;
      case 'refresh-cw':
        return <RefreshCw size={size} />;
      case 'pie-chart':
        return <PieChart size={size} />;
      case 'map-pin':
        return <MapPin size={size} />;
      default:
        return <Calendar size={size} />;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Wybierz raport
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Dostępne raporty magazynowe, które możesz wygenerować i analizować
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
        {reports.map((report) => (
          <div 
            key={report.id}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => onSelectReport(report.id)}
          >
            <div className="p-5 flex items-start">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3 text-primary-600">
                {getIconComponent(report.icon)}
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {report.name}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  {report.description}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-5 py-3 bg-gray-50 text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-primary-100 text-primary-800">
                {report.parameters.length} {report.parameters.length === 1 ? 'parametr' : 'parametry'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-4 sm:px-6 bg-blue-50 text-blue-700 text-sm border-t border-blue-200">
        <p>
          <strong>Wskazówka:</strong> Raporty magazynowe pomagają analizować stany magazynowe, identyfikować trendy oraz podejmować decyzje dotyczące zarządzania zapasami.
        </p>
      </div>
    </div>
  );
};

export default ReportSelector;