// import { useEffect, useState } from 'react';
// import { deviceService } from '../services/deviceService';
//
// export default function OwnerCalendarPage() {
//   // const [devices, setDevices] = useState<{ id: number; productName: string; serialNumber: string }[]>([]);
//   // const [deviceId, setDeviceId] = useState<number | null>(null);
//   const [blockedDates, setBlockedDates] = useState<string[]>([]);
//   const [start, setStart] = useState('');
//   const [end, setEnd] = useState('');
//   // const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   // Load owner's devices on mount
//   // useEffect(() => {
//   //   const loadDevices = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const data = await deviceService.getMyInventory();
//   //       setDevices(data.size || []);
//   //       if (data && data.length > 0) {
//   //         setDeviceId(data.content);
//   //       }
//   //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   //     } catch (err: any) {
//   //       console.error(err);
//   //       setError('Failed to load devices');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   loadDevices();
//   // }, []);
//
//   // Load blocked dates when device changes
//   useEffect(() => {
//     if (!deviceId) return;
//     const loadCalendar = async () => {
//       try {
//         const data = await deviceService.getBlockedDates(deviceId);
//         setBlockedDates(data || []);
//         setError(null);
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (err: any) {
//         console.error(err);
//         setError('Failed to load calendar');
//       }
//     };
//     loadCalendar();
//   }, [deviceId]);
//
//   const handleBlock = async () => {
//     if (!deviceId) {
//       alert('Please select a device');
//       return;
//     }
//     if (!start || !end) {
//       alert('Please select date range');
//       return;
//     }
//     if (new Date(start) > new Date(end)) {
//       alert('Start date must be before end date');
//       return;
//     }
//
//     setActionLoading(true);
//     try {
//       await deviceService.blockDates(deviceId, start, end);
//       alert('Dates blocked successfully!');
//       setStart('');
//       setEnd('');
//       // Reload calendar
//       const data = await deviceService.getBlockedDates(deviceId);
//       setBlockedDates(data || []);
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.message || 'Failed to block dates');
//     } finally {
//       setActionLoading(false);
//     }
//   };
//
//   const handleUnblock = async () => {
//     if (!deviceId) return;
//     if (!start || !end) {
//       alert('Please select date range to unblock');
//       return;
//     }
//
//     setActionLoading(true);
//     try {
//       await deviceService.unblockDates(deviceId, start, end);
//       alert('Dates unblocked successfully!');
//       setStart('');
//       setEnd('');
//       // Reload calendar
//       const data = await deviceService.getBlockedDates(deviceId);
//       setBlockedDates(data || []);
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.message || 'Failed to unblock dates');
//     } finally {
//       setActionLoading(false);
//     }
//   };
//
//   return (
//     <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
//       <h1 className="text-2xl font-bold mb-6">Manage Device Calendar</h1>
//
//       {error && (
//         <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//           {error}
//         </div>
//       )}
//
//       <div className="space-y-6">
//         {/* Device Selection */}
//         <div className="p-4 bg-white rounded shadow">
//           <label className="block font-semibold mb-2">Select Device</label>
//           {/*{loading ? (*/}
//           {/*  <p className="text-gray-600">Loading devices...</p>*/}
//           {/*) : devices.length === 0 ? (*/}
//           {/*  <p className="text-gray-600">No devices found. <a href="/dashboard/inventory"*/}
//           {/*                                                    className="text-blue-600 underline">Create one</a></p>*/}
//           {/*) : (*/}
//           {/*  <select*/}
//           {/*    value={deviceId || ''}*/}
//           {/*    onChange={e => setDeviceId(Number(e.target.value))}*/}
//           {/*    className="border border-gray-300 p-2 rounded w-full"*/}
//           {/*  >*/}
//           {/*    {devices.map(d => (*/}
//           {/*      <option key={d.id} value={d.id}>*/}
//           {/*        {d.productName} ({d.serialNumber})*/}
//           {/*      </option>*/}
//           {/*    ))}*/}
//           {/*  </select>*/}
//           {/*)}*/}
//         </div>
//
//         {/* Blocked Dates Display */}
//         {deviceId && (
//           <div className="p-4 bg-white rounded shadow">
//             <h3 className="font-semibold mb-3">Blocked Dates</h3>
//             {blockedDates.length === 0 ? (
//               <p className="text-gray-600">No blocked dates for this device.</p>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//                 {blockedDates.map(d => (
//                   <span key={d} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
//                     {d}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//
//         {/* Block/Unblock Controls */}
//         {deviceId && (
//           <div className="p-4 bg-white rounded shadow">
//             <h3 className="font-semibold mb-3">Block or Unblock Dates</h3>
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Start Date</label>
//                 <input
//                   type="date"
//                   value={start}
//                   onChange={e => setStart(e.target.value)}
//                   className="border border-gray-300 p-2 rounded w-full"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">End Date</label>
//                 <input
//                   type="date"
//                   value={end}
//                   onChange={e => setEnd(e.target.value)}
//                   className="border border-gray-300 p-2 rounded w-full"
//                 />
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button
//                   onClick={handleBlock}
//                   disabled={actionLoading}
//                   className="flex-1 bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {actionLoading ? 'Processing...' : 'Block Dates'}
//                 </button>
//                 <button
//                   onClick={handleUnblock}
//                   disabled={actionLoading}
//                   className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {actionLoading ? 'Processing...' : 'Unblock Dates'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
//
//
