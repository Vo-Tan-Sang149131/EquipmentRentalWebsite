import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { Brand } from '../types/admin.types';
import SortableTable from '@/shared_components/ui/SortableTable.tsx';
import type { TableColumn } from '@/shared_components/ui/SortableTable.tsx';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<Partial<Brand> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await adminService.getBrands();
      setBrands(response as unknown as Brand[]);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand?.name || !editingBrand?.slug) return;

    try {
      await adminService.saveBrand(editingBrand);
      setIsModalOpen(false);
      setEditingBrand(null);
      fetchBrands();
    } catch (err) {
      console.error(err);
      alert('Failed to save brand');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await adminService.deleteBrand(id);
      fetchBrands();
    } catch (err) {
      console.error(err);
      alert('Failed to delete brand');
    }
  };

  const columns: TableColumn<Brand>[] = [
    { key: 'id', header: 'ID', sortable: true, width: '70px' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'slug', header: 'Slug', sortable: true },
    {
      key: 'id',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingBrand(row);
              setIsModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Brands</h1>
        <button
          onClick={() => {
            setEditingBrand({ name: '', slug: '' });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Brand
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <SortableTable
          columns={columns}
          data={brands}
          rowKey="id"
          isLoading={loading}
          emptyMessage="No brands found."
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingBrand?.id ? 'Edit Brand' : 'Add New Brand'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editingBrand?.name || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={editingBrand?.slug || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, slug: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
