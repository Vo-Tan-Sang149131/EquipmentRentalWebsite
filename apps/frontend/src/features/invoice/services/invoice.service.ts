import apiClient from '@/services/api';
import type { InvoiceResponse } from '../types/invoice.types';

export const invoiceService = {
  getMyInvoices: (): Promise<InvoiceResponse[]> =>
    apiClient.get('/invoices/my'),

  getInvoiceByOrderId: (orderId: number): Promise<InvoiceResponse> =>
    apiClient.get(`/invoices/${orderId}`),
};
