"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Clock, 
  FileText, 
  Tool, 
  Users, 
  Package, 
  AlertTriangle 
} from 'lucide-react';
import { 
  RouteOperation, 
  QualityCheckpoint,
  OperationResource,
  OperationDocument,
  MaterialInput
} from '@/types/route.types';

interface RouteOperationFormProps {
  operation: RouteOperation | null;
  parentOperationId?: string;
  workCenters: { id: string; name: string }[];
  resources: { id: string; name: string; type: string }[];
  materials: { id: string; name: string; unit: string }[];
  onSave: (operation: RouteOperation) => void;
  onCancel: () => void;
}

const RouteOperationForm: React.FC<RouteOperationFormProps> = ({
  operation,
  parentOperationId,
  workCenters,
  resources,
  materials,
  onSave,
  onCancel
}) => {
  const isNewOperation = !operation;
  const isSubOperation = !!parentOperationId;

  // Form state
  const [formData, setFormData] = useState<RouteOperation>({
    id: '',
    name: '',
    description: '',
    workCenterId: '',
    workCenterName: '',
    setupTime: 0,
    operationTime: 0,
    waitTime: 0,
    moveTime: 0,
    requiredSkills: [],
    qualityCheckpoints: [],
    status: 'draft',
    resources: [],
    documents: [],
    materialInputs: [],
    predecessorOperations: []
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data from operation prop
  useEffect(() => {
    if (operation) {
      setFormData(operation);
    } else {
      // Set default values for new operation
      setFormData({
        id: `OP-${Date.now()}`,
        name: '',
        description: '',
        workCenterId: workCenters.length > 0 ? workCenters[0].id : '',
        workCenterName: workCenters.length > 0 ? workCenters[0].name : '',
        setupTime: 0,
        operationTime: 0,
        waitTime: 0,
        moveTime: 0,
        requiredSkills: [],
        qualityCheckpoints: [],
        status: 'draft',
        resources: [],
        documents: [],
        materialInputs: [],
        predecessorOperations: parentOperationId ? [parentOperationId] : []
      });
    }
  }, [operation, parentOperationId, workCenters]);

  // Update workCenterName when workCenterId changes
  useEffect(() => {
    if (formData.workCenterId) {
      const selectedWorkCenter = workCenters.find(wc => wc.id === formData.workCenterId);
      if (selectedWorkCenter) {
        setFormData(prev => ({
          ...prev,
          workCenterName: selectedWorkCenter.name
        }));
      }
    }
  }, [formData.workCenterId, workCenters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'setupTime' || name === 'operationTime' || name === 'waitTime' || name === 'moveTime' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  // Handle required skills
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...(prev.requiredSkills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills?.filter(s => s !== skill) || []
    }));
  };

  // Handle resources
  const [newResource, setNewResource] = useState<OperationResource>({
    id: `RES-${Date.now()}`,
    resourceId: '',
    resourceName: '',
    resourceType: 'machine',
    quantity: 1,
    unit: 'szt'
  });

  const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));

    // Update resource name when resourceId changes
    if (name === 'resourceId') {
      const selectedResource = resources.find(r => r.id === value);
      if (selectedResource) {
        setNewResource(prev => ({
          ...prev,
          resourceName: selectedResource.name,
          resourceType: selectedResource.type
        }));
      }
    }
  };

  const addResource = () => {
    if (newResource.resourceId) {
      setFormData(prev => ({
        ...prev,
        resources: [...(prev.resources || []), {...newResource, id: `RES-${Date.now()}`}]
      }));
      setNewResource({
        id: `RES-${Date.now()}`,
        resourceId: '',
        resourceName: '',
        resourceType: 'machine',
        quantity: 1,
        unit: 'szt'
      });
    }
  };

  const removeResource = (resourceId: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources?.filter(r => r.id !== resourceId) || []
    }));
  };

  // Handle material inputs
  const [newMaterial, setNewMaterial] = useState<MaterialInput>({
    id: `MAT-${Date.now()}`,
    itemId: '',
    itemName: '',
    quantity: 1,
    unit: '',
    consumptionType: 'per-unit',
    scrapFactor: 0
  });

  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMaterial(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'scrapFactor' 
        ? parseFloat(value) || 0 
        : value
    }));

    // Update material name and unit when itemId changes
    if (name === 'itemId') {
      const selectedMaterial = materials.find(m => m.id === value);
      if (selectedMaterial) {
        setNewMaterial(prev => ({
          ...prev,
          itemName: selectedMaterial.name,
          unit: selectedMaterial.unit
        }));
      }
    }
  };

  const addMaterial = () => {
    if (newMaterial.itemId) {
      setFormData(prev => ({
        ...prev,
        materialInputs: [...(prev.materialInputs || []), {...newMaterial, id: `MAT-${Date.now()}`}]
      }));
      setNewMaterial({
        id: `MAT-${Date.now()}`,
        itemId: '',
        itemName: '',
        quantity: 1,
        unit: '',
        consumptionType: 'per-unit',
        scrapFactor: 0
      });
    }
  };

  const removeMaterial = (materialId: string) => {
    setFormData(prev => ({
      ...prev,
      materialInputs: prev.materialInputs?.filter(m => m.id !== materialId) || []
    }));
  };

  // Handle document attachments
  const [newDocument, setNewDocument] = useState<OperationDocument>({
    id: `DOC-${Date.now()}`,
    name: '',
    documentType: 'instruction',
    url: '',
    version: '1.0'
  });

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDocument = () => {
    if (newDocument.name) {
      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), {...newDocument, id: `DOC-${Date.now()}`}]
      }));
      setNewDocument({
        id: `DOC-${Date.now()}`,
        name: '',
        documentType: 'instruction',
        url: '',
        version: '1.0'
      });
    }
  };

  const removeDocument = (documentId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.filter(d => d.id !== documentId) || []
    }));
  };

  // Handle quality checkpoints
  const [newCheckpoint, setNewCheckpoint] = useState<QualityCheckpoint>({
    id: `QC-${Date.now()}`,
    name: '',
    description: '',
    checkType: 'visual',
    measurementUnit: '',
    minValue: 0,
    maxValue: 0,
    targetValue: 0
  });

  const handleCheckpointChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCheckpoint(prev => ({
      ...prev,
      [name]: name === 'minValue' || name === 'maxValue' || name === 'targetValue'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const addCheckpoint = () => {
    if (newCheckpoint.name) {
      setFormData(prev => ({
        ...prev,
        qualityCheckpoints: [...(prev.qualityCheckpoints || []), {...newCheckpoint, id: `QC-${Date.now()}`}]
      }));
      setNewCheckpoint({
        id: `QC-${Date.now()}`,
        name: '',
        description: '',
        checkType: 'visual',
        measurementUnit: '',
        minValue: 0,
        maxValue: 0,
        targetValue: 0
      });
    }
  };

  const removeCheckpoint = (checkpointId: string) => {
    setFormData(prev => ({
      ...prev,
      qualityCheckpoints: prev.qualityCheckpoints?.filter(qc => qc.id !== checkpointId) || []
    }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nazwa operacji jest wymagana';
    }

    if (!formData.workCenterId) {
      newErrors.workCenterId = 'Wybierz centrum robocze';
    }

    if (formData.setupTime < 0) {
      newErrors.setupTime = 'Czas przygotowania nie może być ujemny';
    }

    if (formData.operationTime <= 0) {
      newErrors.operationTime = 'Czas operacji musi być większy od zera';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {isNewOperation ? (isSubOperation ? 'Dodaj podoperację' : 'Dodaj operację') : 'Edytuj operację'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Zamknij"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Operacji
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              disabled={!isNewOperation}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nazwa Operacji <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opis Operacji
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Centrum Robocze <span className="text-red-500">*</span>
            </label>
            <select
              name="workCenterId"
              value={formData.workCenterId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.workCenterId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Wybierz centrum robocze</option>
              {workCenters.map(wc => (
                <option key={wc.id} value={wc.id}>{wc.name}</option>
              ))}
            </select>
            {errors.workCenterId && <p className="mt-1 text-sm text-red-500">{errors.workCenterId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="draft">Robocza</option>
              <option value="active">Aktywna</option>
              <option value="obsolete">Wycofana</option>
            </select>
          </div>
        </div>

        {/* Time Parameters */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <Clock size={20} className="mr-2 text-gray-500" />
            Parametry czasowe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Czas przygotowania (min) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="setupTime"
                value={formData.setupTime}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.setupTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.setupTime && <p className="mt-1 text-sm text-red-500">{errors.setupTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Czas operacji (min/szt) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="operationTime"
                value={formData.operationTime}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.operationTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.operationTime && <p className="mt-1 text-sm text-red-500">{errors.operationTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Czas oczekiwania (min)
              </label>
              <input
                type="number"
                name="waitTime"
                value={formData.waitTime || 0}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Czas przenoszenia (min)
              </label>
              <input
                type="number"
                name="moveTime"
                value={formData.moveTime || 0}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isNewOperation ? 'Dodaj' : 'Zapisz zmiany'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RouteOperationForm;