import React, { useState } from 'react';
import { ArrowLeft, FileBarChart } from 'lucide-react';
import { reportDefinitions, ReportType, ReportParameter } from '../mockReports';

interface ReportConfigurationProps {
  reportType: ReportType;
  parameters: Record<string, any>;
  onParamChange: (paramId: string, value: any) => void;
  onGenerate: () => void;
  onCancel: () => void;
}

const ReportConfiguration: React.FC<ReportConfigurationProps> = ({
  reportType,
  parameters,
  onParamChange,
  onGenerate,
  onCancel
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Find the report definition
  const reportDef = reportDefinitions.find(def => def.id === reportType);
  if (!reportDef) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-5">
        <div className="text-center text-red-500">
          Nie znaleziono definicji raportu.
        </div>
      </div>
    );
  }
  
  // Handle parameter validation
  const validateParameters = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    reportDef.parameters.forEach(param => {
      if (param.required) {
        const value = parameters[param.id];
        
        if (value === undefined || value === null || value === '') {
          newErrors[param.id] = 'To pole jest wymagane';
        } else if (param.type === 'date_range' && (!value.from || !value.to)) {
          newErrors[param.id] = 'Wybierz zakres dat';
        } else if (param.type === 'number') {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            newErrors[param.id] = 'Podaj prawidłową wartość liczbową';
          }
        } else if (param.type === 'multi_select' && Array.isArray(value) && value.length === 0) {
          newErrors[param.id] = 'Wybierz przynajmniej jedną opcję';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle generating the report
  const handleGenerate = () => {
    if (validateParameters()) {
      onGenerate();
    }
  };
  
  // Render appropriate input for parameter type
  const renderParameterInput = (param: ReportParameter) => {
    const value = parameters[param.id];
    
    switch (param.type) {
      case 'date':
        return (
          <input
            type="date"
            id={param.id}
            value={value || ''}
            onChange={(e) => onParamChange(param.id, e.target.value)}
            className={`block w-full rounded-md border ${
              errors[param.id] ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
          />
        );
        
      case 'date_range':
        return (
          <div className="flex space-x-2">
            <div className="flex-1">
              <label htmlFor={`${param.id}-from`} className="block text-xs text-gray-500 mb-1">
                Od
              </label>
              <input
                type="date"
                id={`${param.id}-from`}
                value={(value && value.from) || ''}
                onChange={(e) => onParamChange(param.id, { ...value, from: e.target.value })}
                className={`block w-full rounded-md border ${
                  errors[param.id] ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
            </div>
            <div className="flex-1">
              <label htmlFor={`${param.id}-to`} className="block text-xs text-gray-500 mb-1">
                Do
              </label>
              <input
                type="date"
                id={`${param.id}-to`}
                value={(value && value.to) || ''}
                onChange={(e) => onParamChange(param.id, { ...value, to: e.target.value })}
                className={`block w-full rounded-md border ${
                  errors[param.id] ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
            </div>
          </div>
        );
        
      case 'select':
        return (
          <select
            id={param.id}
            value={value || ''}
            onChange={(e) => onParamChange(param.id, e.target.value)}
            className={`block w-full rounded-md border ${
              errors[param.id] ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
          >
            {param.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'multi_select':
        return (
          <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
            {param.options?.map(option => (
              <div key={option.value} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`${param.id}-${option.value}`}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      if (!newValue.includes(option.value)) {
                        newValue.push(option.value);
                      }
                    } else {
                      const index = newValue.indexOf(option.value);
                      if (index !== -1) {
                        newValue.splice(index, 1);
                      }
                    }
                    onParamChange(param.id, newValue);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor={`${param.id}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'number':
        return (
          <input
            type="number"
            id={param.id}
            value={value || ''}
            onChange={(e) => onParamChange(param.id, e.target.value === '' ? '' : Number(e.target.value))}
            min="0"
            step="1"
            className={`block w-full rounded-md border ${
              errors[param.id] ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
          />
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={param.id}
              checked={value || false}
              onChange={(e) => onParamChange(param.id, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor={param.id} className="ml-2 block text-sm text-gray-700">
              {param.name}
            </label>
          </div>
        );
        
      default:
        return (
          <input
            type="text"
            id={param.id}
            value={value || ''}
            onChange={(e) => onParamChange(param.id, e.target.value)}
            className={`block w-full rounded-md border ${
              errors[param.id] ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
          />
        );
    }
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            type="button"
            onClick={onCancel}
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {reportDef.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {reportDef.description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          {reportDef.parameters.map(param => (
            <div key={param.id} className="sm:col-span-3">
              {param.type !== 'checkbox' && (
                <label htmlFor={param.id} className="block text-sm font-medium text-gray-700">
                  {param.name} {param.required && <span className="text-red-500">*</span>}
                </label>
              )}
              <div className="mt-1">
                {renderParameterInput(param)}
                {errors[param.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[param.id]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FileBarChart size={16} className="mr-2" />
            Generuj raport
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportConfiguration;