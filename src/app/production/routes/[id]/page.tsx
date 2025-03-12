"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Save, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { ProductionRoute } from '@/types/route.types';
import RouteOperationsEditor from '@/components/production/route/RouteOperationsEditor';
import RouteMetadataForm from '@/components/production/route/RouteMetadataForm';

export default function RouteDetailPage() {
  const { id } = useParams();
  const routeId = Array.isArray(id) ? id[0] : id;
  
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<ProductionRoute | null>(null);
  const [activeTab, setActiveTab] = useState<'operations' | 'metadata'>('operations');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch the specific route from the API
        // For mock data, we'll fetch all routes and find the right one
        const response = await axios.get('/production-routes.json');
        const routes: ProductionRoute[] = response.data;
        const currentRoute = routes.find(r => r.id === routeId);
        
        if (currentRoute) {
          setRoute(currentRoute);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      } finally {
        setLoading(false);
      }
    };

    if (routeId) {
      fetchRoute();
    }
  }, [routeId]);

  const handleRouteUpdate = (updatedRoute: ProductionRoute) => {
    setSaveStatus('saving');
    
    // Simulate saving to backend
    setTimeout(() => {
      setRoute(updatedRoute);
      setSaveStatus('saved');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 800);
  };

  const handleMetadataUpdate = (updatedMetadata: Partial<ProductionRoute>) => {
    if (!route) return;
    
    setSaveStatus('saving');
    
    // Combine current route with updated metadata
    const updatedRoute = {
      ...route,
      ...updatedMetadata
    };
    
    // Simulate saving to backend
    setTimeout(() => {
      setRoute(updatedRoute);
      setSaveStatus('saved');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header with breadcrumbs and actions */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Link href="/production/routes" className="hover:text-primary-600 flex items-center">
              <ArrowLeft size={14} className="mr-1" /> Wszystkie marszruty
            </Link>
            <span className="mx-2">/</span>
            <span>{routeId}</span>
          </div>
          <h1 className="text-2xl font-bold">
            {loading ? 'Ładowanie...' : route ? route.name : 'Marszruta nie znaleziona'}
          </h1>
        </div>
        
        <div className="flex items-center">
          {saveStatus === 'saving' && (
            <span className="text-sm text-gray-500 mr-4">Zapisywanie...</span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-sm text-green-600 mr-4">Zapisano!</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-sm text-red-600 mr-4">Błąd zapisu!</span>
          )}
          
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition flex items-center"
            onClick={() => {/* Save functionality */}}
          >
            <Save size={18} className="mr-2" /> Zapisz zmiany
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('operations')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'operations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText size={18} className="inline-block mr-2 -mt-1" />
            Operacje
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'metadata'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings size={18} className="inline-block mr-2 -mt-1" />
            Metadane
          </button>
        </nav>
      </div>
      
      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : route ? (
          <>
            {activeTab === 'operations' && (
              <RouteOperationsEditor
                routeId={routeId}
                onRouteUpdate={handleRouteUpdate}
              />
            )}
            
            {activeTab === 'metadata' && (
              <RouteMetadataForm
                route={route}
                onSave={handleMetadataUpdate}
              />
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <p>Nie znaleziono marszruty o ID {routeId}</p>
          </div>
        )}
      </div>
    </div>
  );
}