import { useEffect, useState } from 'react';
import { invoiceService } from '../services/invoice.service';
import type { InvoiceResponse } from '../types/invoice.types';
import { FileText, Search, ArrowLeft, ChevronRight } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  PICKED_UP: 'bg-purple-100 text-purple-800',
  RETURNED: 'bg-teal-100 text-teal-800',
  CANCELLED: 'bg-red-100 text-red-800',
  OVERDUE: 'bg-orange-100 text-orange-800',
};

export function InvoicePage() {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<InvoiceResponse | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await invoiceService.getMyInvoices();
        setInvoices(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.message || 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = invoices.filter(inv =>
    !search || String(inv.orderId).includes(search),
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading invoices...</div>;

  if (selected) {
    const inv = selected;
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setSelected(null)}
                className="flex items-center gap-2 text-blue-600 hover:underline mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to invoices
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">Invoice #{inv.orderId}</h1>
              <p className="text-gray-500 text-sm">Created: {new Date(inv.createdAt).toLocaleDateString()}</p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[inv.orderStatus] || 'bg-gray-100'}`}>
              {inv.orderStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="border-t border-b py-4 mb-4">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Renter</h2>
            <p className="text-sm">{inv.renterName} - {inv.renterEmail}</p>
            {inv.renterPhone && <p className="text-sm">{inv.renterPhone}</p>}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Period: {new Date(inv.startDate).toLocaleDateString()} - {new Date(inv.endDate).toLocaleDateString()}
          </p>

          <h2 className="text-lg font-semibold mb-3">Items</h2>
          <table className="w-full text-sm mb-6">
            <thead>
            <tr className="border-b text-left">
              <th className="pb-2">Device</th>
              <th className="pb-2">Price/Day</th>
              <th className="pb-2">Days</th>
              <th className="pb-2">Deposit</th>
              <th className="pb-2 text-right">Subtotal</th>
            </tr>
            </thead>
            <tbody>
            {inv.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{item.deviceName}</td>
                <td>${item.pricePerDay.toFixed(2)}</td>
                <td>{item.rentalDays}</td>
                <td>${item.depositAmount.toFixed(2)}</td>
                <td className="text-right">${item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
            </tbody>
          </table>

          <div className="text-right text-lg font-bold mb-6">Total: ${inv.totalPrice.toFixed(2)}</div>

          {inv.payments.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-3">Payments</h2>
              <table className="w-full text-sm">
                <thead>
                <tr className="border-b text-left">
                  <th className="pb-2">Method</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
                </thead>
                <tbody>
                {inv.payments.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{p.paymentMethod}</td>
                    <td>${p.amount.toFixed(2)}</td>
                    <td>{p.status}</td>
                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
          <p className="text-gray-500 mt-1">View all your rental invoices</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm"
          />
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No invoices found</h3>
          <p className="text-gray-500 mt-1">You haven't placed any rental orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(inv => (
            <div key={inv.orderId} onClick={() => setSelected(inv)}
                 className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">Invoice #{inv.orderId}</h3>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[inv.orderStatus] || 'bg-gray-100'}`}>
                    {inv.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(inv.startDate).toLocaleDateString()} - {new Date(inv.endDate).toLocaleDateString()} &middot; {inv.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xl font-bold">${inv.totalPrice.toFixed(2)}</p>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
