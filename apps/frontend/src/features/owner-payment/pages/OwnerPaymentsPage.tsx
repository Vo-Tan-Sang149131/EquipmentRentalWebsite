import { useEffect, useState } from 'react';
import { ownerPaymentService } from '../services/owner-payment.service';
import type { OwnerPayment, OwnerPaymentStats } from '../types/owner-payment.types';
import { ArrowUpRight, CreditCard, TrendingUp, Wallet } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SUCCESS: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
};

export function OwnerPaymentsPage() {
  const [payments, setPayments] = useState<OwnerPayment[]>([]);
  const [stats, setStats] = useState<OwnerPaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [paymentsData, statsData] = await Promise.all([
          ownerPaymentService.getMyPayments(),
          ownerPaymentService.getPaymentStats(),
        ]);
        setPayments(paymentsData);
        setStats(statsData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.message || 'Failed to load payment data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading payments...</div>;

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    color: string
  }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}><Icon className="w-6 h-6 text-white" /></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500 mt-1">Track your earnings and payment transactions</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} icon={TrendingUp}
                    color="bg-green-500" />
          <StatCard title="Pending Payout" value={`$${stats.pendingPayout.toFixed(2)}`} icon={Wallet}
                    color="bg-amber-500" />
          <StatCard title="Completed" value={String(stats.completedPayments)} icon={CreditCard} color="bg-blue-500" />
          <StatCard title="Transactions" value={String(stats.totalTransactions)} icon={ArrowUpRight}
                    color="bg-indigo-500" />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 font-medium">ID</th>
            <th className="text-left px-4 py-3 font-medium">Order</th>
            <th className="text-left px-4 py-3 font-medium">Device</th>
            <th className="text-left px-4 py-3 font-medium">Renter</th>
            <th className="text-left px-4 py-3 font-medium">Amount</th>
            <th className="text-left px-4 py-3 font-medium">Method</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Date</th>
          </tr>
          </thead>
          <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-gray-400">No payment transactions found.</td>
            </tr>
          ) : (
            payments.map(p => (
              <tr key={p.paymentId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">#{p.paymentId}</td>
                <td className="px-4 py-3">#{p.orderId}</td>
                <td className="px-4 py-3">{p.deviceName}</td>
                <td className="px-4 py-3">{p.renterName}</td>
                <td className="px-4 py-3 font-medium">${p.amount.toFixed(2)}</td>
                <td className="px-4 py-3">{p.paymentMethod}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[p.status] || 'bg-gray-100'}`}>{p.status}</span>
                </td>
                <td
                  className="px-4 py-3 text-xs text-gray-500">{new Date(p.paidAt || p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
