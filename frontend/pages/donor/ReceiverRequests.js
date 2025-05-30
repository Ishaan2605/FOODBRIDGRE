import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function ReceiverRequests() {
  const [requests, setRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchAllReceiverRequests();
  }, []);

  const fetchAllReceiverRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/auth/Login');

    // Fetch linked food listing requests
    const { data: foodRequests } = await supabase
      .from('requests')
      .select('request_id, status, food_listings(name, quantity), Users(name, contact_info)')
      .neq('food_id', null);

    // Fetch custom food requests
    const { data: customRequests } = await supabase
      .from('custom_requests')
      .select('id, food_type, quantity, required_by, notes, reciever_id, Users(name, contact_info)');

    const formatted = [
      ...(foodRequests || []).map(req => ({
        id: req.request_id,
        name: req.food_listings?.name || 'Unnamed',
        quantity: req.food_listings?.quantity || 'N/A',
        contact_info: req.Users?.contact_info || 'N/A',
        receiver_name: req.Users?.name || 'Unknown',
        expires_on: null,
        isCustom: false,
        status: req.status,
      })),
      ...(customRequests || []).map(req => ({
        id: req.id,
        name: req.food_type,
        quantity: req.quantity,
        contact_info: req.Users?.contact_info || 'N/A',
        receiver_name: req.Users?.name || 'Unknown',
        expires_on: req.required_by,
        notes: req.notes,
        isCustom: true,
        status: 'pending',
      }))
    ];

    setRequests(formatted);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#FFF8F0] via-[#E7F6F2] to-[#D1E8E4]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-[#c92828]">📨 Receiver Food Requests</h1>
        <button
          onClick={() => router.push('/donor/DonorDashboard')}
          className="px-6 py-2 bg-purple-600 text-white font-semibold rounded shadow hover:bg-purple-700"
        >
          🔙 Back to Dashboard
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-700 mb-6 text-lg">No food requests from receivers yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6 border border-white/60">
              <h2 className="text-xl font-bold text-[#5e1c1c] mb-1">{req.name}</h2>
              <p className="text-sm text-gray-800"><b>Quantity:</b> {req.quantity}</p>
              <p className="text-sm text-gray-800"><b>Receiver:</b> {req.receiver_name}</p>
              <p className="text-sm text-gray-800"><b>Contact:</b> {req.contact_info}</p>
              {req.expires_on && (
                <p className="text-sm text-gray-800"><b>Use Before:</b> {new Date(req.expires_on).toLocaleDateString()}</p>
              )}
              {req.notes && <p className="text-sm text-gray-700 italic mt-1">"{req.notes}"</p>}
              <p className="text-xs text-gray-500 mt-2 italic">Status: '{req.status}'</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
