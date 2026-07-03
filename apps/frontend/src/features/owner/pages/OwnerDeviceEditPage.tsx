import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useDeviceEdit } from '../hooks/useDeviceEdit.ts';
import type { DeviceUpdatePayload } from '../types/device.types.ts';
import apiClient from '@/services/api.ts';

export default function OwnerDeviceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deviceId = id ? parseInt(id) : null;

  const {
    device,
    loading,
    saving,
    error,
    updateDevice,
    setImageAsPrimary,
    deleteImage,
    addImage,
  } = useDeviceEdit(deviceId);

  const [pricePerDay, setPricePerDay] = useState<number>(0);
  const [depositValue, setDepositValue] = useState<number>(0);
  const [uploading, setUploading] = useState(false);

  // Update form when device loads
  if (device && (pricePerDay === 0 || depositValue === 0)) {
    setPricePerDay(device.pricePerDay);
    setDepositValue(device.depositValue);
  }

  const handleSave = async () => {
    const payload: DeviceUpdatePayload = {
      pricePerDay,
      depositValue,
    };
    const success = await updateDevice(payload);
    if (success) {
      alert('Device updated successfully');
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    const success = await setImageAsPrimary(imageId);
    if (success) {
      alert('Primary image updated');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (window.confirm('Delete this image?')) {
      const success = await deleteImage(imageId);
      if (success) {
        alert('Image deleted');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const imageUrl = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }); // apiClient returns data directly
      if (typeof imageUrl === 'string') {
        await addImage(imageUrl);
        alert('Image uploaded successfully');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading device...</div>;
  }

  if (error || !device) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error || 'Device not found'}</p>
        <button onClick={() => navigate('/dashboard/inventory')} className="mt-4 text-teal-700 hover:underline">
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
      <button onClick={() => navigate('/dashboard/inventory')} className="text-teal-700 hover:underline mb-6">
        ← Back to Inventory
      </button>

      <div className="bg-white rounded shadow p-6 space-y-8">
        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">{device.productName}</h1>
          <p className="text-gray-600">Device ID: {device.id} | Serial: {device.serialNumber}</p>
          <p className="text-sm text-gray-500">Status: <span className="font-semibold">{device.status}</span></p>
        </div>

        {/* Pricing Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pricing Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price Per Day ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricePerDay}
                onChange={e => setPricePerDay(parseFloat(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deposit Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={depositValue}
                onChange={e => setDepositValue(parseFloat(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white px-6 py-2 rounded font-medium"
          >
            {saving ? 'Saving...' : 'Save Pricing'}
          </button>
        </div>

        {/* Images Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Device Images</h2>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded text-sm font-medium ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? 'Uploading...' : 'Add Image'}
              </label>
            </div>
          </div>
          {device.images.length === 0 ? (
            <p className="text-gray-500">No images uploaded yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {device.images.map(img => (
                <div key={img.id} className="border rounded overflow-hidden bg-gray-100">
                  <img src={img.imageUrl} alt="Device" className="w-full h-48 object-cover" />
                  <div className="p-3 space-y-2">
                    {img.isPrimary &&
                      <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded">Primary</span>}
                    <div className="flex gap-2 text-xs">
                      {!img.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(img.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Details */}
        <div className="space-y-4 bg-gray-50 p-4 rounded">
          <h2 className="text-lg font-semibold">Device Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Product:</p>
              <p className="font-semibold">{device.productName}</p>
            </div>
            <div>
              <p className="text-gray-600">Condition:</p>
              <p className="font-semibold">{device.conditionPercent}%</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}
      </div>
    </main>
  );
}

