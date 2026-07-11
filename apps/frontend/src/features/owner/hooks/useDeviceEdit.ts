import { useEffect, useState } from 'react';
import { deviceService } from '../services/deviceService.ts';
import type { DeviceForEdit, DeviceUpdatePayload } from '../types/device.types.ts';

interface UseDeviceEditState {
  device: DeviceForEdit | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export function useDeviceEdit(deviceId: number | null) {
  const [state, setState] = useState<UseDeviceEditState>({
    device: null,
    loading: true,
    saving: false,
    error: null,
  });

  // Fetch device detail on mount
  useEffect(() => {
    if (!deviceId) {
      setState(prev => ({ ...prev, loading: false, error: 'Invalid device ID' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    deviceService.getDeviceForEdit(deviceId)
      .then(device => {
        setState(prev => ({ ...prev, device, loading: false }));
      })
      .catch(err => {
        console.error(err);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load device',
        }));
      });
  }, [deviceId]);

  // Update device (price/deposit)
  const updateDevice = async (payload: DeviceUpdatePayload) => {
    if (!deviceId || !state.device) return;

    setState(prev => ({ ...prev, saving: true, error: null }));
    try {
      await deviceService.updateDevice(deviceId, payload);
      // Update local state
      setState(prev => ({
        ...prev,
        device: prev.device ? {
          ...prev.device,
          pricePerDay: payload.pricePerDay,
          depositValue: payload.depositValue,
        } : null,
        saving: false,
      }));
      return true;
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        saving: false,
        error: 'Failed to update device',
      }));
      return false;
    }
  };

  // Set image as primary
  const setImageAsPrimary = async (imageId: number) => {
    if (!deviceId || !state.device) return;

    try {
      await deviceService.setImageAsPrimary(deviceId, imageId);
      // Update local state
      setState(prev => ({
        ...prev,
        device: prev.device ? {
          ...prev.device,
          images: prev.device.images.map(img => ({
            ...img,
            isPrimary: img.id === imageId,
          })),
        } : null,
      }));
      return true;
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        error: 'Failed to set primary image',
      }));
      return false;
    }
  };

  // Delete image
  const deleteImage = async (imageId: number) => {
    if (!deviceId || !state.device) return;

    try {
      await deviceService.deleteDeviceImage(deviceId, imageId);
      // Update local state
      setState(prev => ({
        ...prev,
        device: prev.device ? {
          ...prev.device,
          images: prev.device.images.filter(img => img.id !== imageId),
        } : null,
      }));
      return true;
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        error: 'Failed to delete image',
      }));
      return false;
    }
  };

  // Add new image
  const addImage = async (imageUrl: string) => {
    if (!deviceId || !state.device) return;

    try {
      await deviceService.addDeviceImage(deviceId, imageUrl);
      // Reload device or update state manually
      const updatedDevice = await deviceService.getDeviceForEdit(deviceId);
      setState(prev => ({ ...prev, device: updatedDevice }));
      return true;
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        error: 'Failed to add image',
      }));
      return false;
    }
  };

  return {
    ...state,
    updateDevice,
    setImageAsPrimary,
    deleteImage,
    addImage,
  };
}

