"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '../../../../components/layout/MainLayout';
import { getSalesOrder } from '../../../../services/ordersService';
import { SalesOrder } from '../../../../types/orders';
import { ArrowLeft, Edit, Printer, FileText, Factory, AlertTriangle } from 'lucide-react';
import OrderStatusBadge from '../../../../components/orders/shared/OrderStatusBadge';
import PriorityBadge from '../../../../components/orders/shared/PriorityBadge';
import Link from 'next/link';

interface SalesOrderDetailPageProps {
  params: {
    id: string;
  };
}

const SalesOrderDetailPage: React.FC<SalesOrderDetailPageProps> = ({ params }) => {
  const { id } = params;
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const orderData = await getSalesOrder(id);
        setOrder(orderData);
        if (!orderData) {
          setError('Nie znaleziono zamówienia');
        }
      } catch (err) {
        console.error('Błąd podczas pobierania szczegółów zamówienia:', err);
        setError('Wystąpił błąd podczas pobierania szczegółów zamówienia. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="bg-red-50 p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-red-500 mr-2" size={24} />
            <h2 className="text-xl font-medium text-red-800">{error || 'Nie znaleziono zamówienia'}</h2>
          </div>
          <p className="text-red-600 mb-4">
            Nie udało się wczytać szczegółów zamówienia. Sprawdź poprawność adresu URL lub spróbuj ponownie później.
          </p>
          <Link href="/orders/sales" className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200">
            <ArrowLeft className="mr-2" size={16} />
            Wróć do listy zamówień
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/orders/sales" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-2">
            <ArrowLeft className="mr-1" size={16} />
            Powrót do listy zamówień
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">Zamówienie {order.orderNumber}</h2>
          <div className="flex items-center mt-1 space-x-2">
            <OrderStatusBadge status={order.status} type="sales" />
            <PriorityBadge priority={order.priority} />
          </div>
        </div>

        <div className="flex space-x-2">
          <Link 
            href={`/orders/sales/${id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 flex items-center hover:bg-gray-50"
          >
            <Edit size={16} className="mr-2" />
            Edytuj
          </Link>
          <button 
            onClick={() => {}}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 flex items-center hover:bg-gray-50"
          >
            <Printer size={16} className="mr-2" />
            Drukuj
          </button>
          <button 
            onClick={() => {}}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 flex items-center hover:bg-gray-50"
          >
            <FileText size={16} className="mr-2" />
            Generuj PDF
          </button>
          {!order.relatedProductionOrderId && (
            <button 
              onClick={() => {}}
              className="px-4 py-2 bg-blue-600 rounded-md text-white flex items-center hover:bg-blue-700"
            >
              <Factory size={16} className="mr-2" />
              Utwórz zlecenie produkcyjne
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Informacje o kliencie */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informacje o kliencie</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nazwa klienta</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Osoba kontaktowa</p>
              <p className="font-medium">{order.customerContact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Adres dostawy</p>
              <p className="font-medium">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Informacje o zamówieniu */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informacje o zamówieniu</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Numer zamówienia</p>
              <p className="font-medium">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data zamówienia</p>
              <p className="font-medium">{new Date(order.orderDate).toLocaleDateString('pl-PL')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Termin dostawy</p>
              <p className="font-medium">{new Date(order.requestedDeliveryDate).toLocaleDateString('pl-PL')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Warunki płatności</p>
              <p className="font-medium">{order.paymentTerms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status płatności</p>
              <p className="font-medium">{order.paymentStatus === 'pending' ? 'Oczekująca' : order.paymentStatus === 'partial' ? 'Częściowa' : 'Opłacona'}</p>
            </div>
          </div>
        </div>

        {/* Podsumowanie */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Podsumowanie</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Wartość zamówienia</p>
              <p className="text-xl font-semibold">{order.totalValue.toLocaleString('pl-PL')} zł</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Liczba pozycji</p>
              <p className="font-medium">{order.items.length}</p>
            </div>
            {order.relatedProductionOrderId && (
              <div>
                <p className="text-sm text-gray-500">Zlecenie produkcyjne</p>
                <Link 
                  href={`/orders/production/${order.relatedProductionOrderId}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Przejdź do zlecenia produkcyjnego
                </Link>
              </div>
            )}
            <div className="pt-2">
              <p className="text-sm text-gray-500">Data utworzenia</p>
              <p className="font-medium">{new Date(order.creationDate).toLocaleString('pl-PL')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ostatnia modyfikacja</p>
              <p className="font-medium">{new Date(order.lastModified).toLocaleString('pl-PL')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pozycje zamówienia */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pozycje zamówienia</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produkt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ilość</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena jednostkowa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wartość</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity} {item.unit || 'szt'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unitPrice.toLocaleString('pl-PL')} zł</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lineTotal.toLocaleString('pl-PL')} zł</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status ? <OrderStatusBadge status={item.status} type="sales" /> : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">Suma:</td>
                <td className="px-6 py-3 text-sm font-bold text-gray-900">{order.totalValue.toLocaleString('pl-PL')} zł</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Uwagi */}
      {order.notes && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Uwagi</h3>
          <p className="text-gray-700 whitespace-pre-line">{order.notes}</p>
        </div>
      )}

      {/* Historia zmian statusu - do implementacji w przyszłości */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Historia zmian statusu</h3>
        <p className="text-gray-500 italic">Historia zmian statusu będzie dostępna w przyszłych wersjach.</p>
      </div>
    </MainLayout>
  );
};

export default SalesOrderDetailPage;