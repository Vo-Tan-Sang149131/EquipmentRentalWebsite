import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { IssueReport } from '../types/admin.types';
import SortableTable from '@/shared_components/ui/SortableTable.tsx';
import type { TableColumn } from '@/shared_components/ui/SortableTable.tsx';

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await adminService.getIssues();
      setIssues(response as unknown as IssueReport[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await adminService.updateIssueStatus(id, status);
      fetchIssues();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const columns: TableColumn<IssueReport>[] = [
    { key: 'id', header: 'ID', sortable: true, width: '70px' },
    { key: 'title', header: 'Title' },
    { key: 'description', header: 'Description' },
    { key: 'reporterUsername', header: 'Reporter' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          val === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            val === 'RESOLVED' ? 'bg-green-100 text-green-800' :
              val === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
        }`}>
          {val as string}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_, row) => (
        <select
          className="text-xs border rounded p-1"
          value={row.status}
          onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Issue Reports</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <SortableTable
          columns={columns}
          data={issues}
          rowKey="id"
          isLoading={loading}
          emptyMessage="No issues found."
        />
      </div>
    </div>
  );
}
