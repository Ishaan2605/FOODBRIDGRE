import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function MyRequests() {
  const [requestedFoods, setRequestedFoods] = useState([]);
  const [form, setForm] = useState({
    quantity: '',
    food_type: '',
    required_by: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return;
    setUserId(user.id);

    const { data: foodRequests } = await supabase
      .from('requests')
      .select('request_id, food_id, food_listings(name, quantity, food_type, contact_info, expires_on)')
      .eq('reciever_id', user.id);

    const { data: customRequests } = await supabase
      .from('custom_requests')
      .select('*')
      .eq('reciever_id', user.id);

    const formatted = [
      ...(foodRequests || []).map(req => ({
        id: req.request_id,
        ...req.food_listings,
        isCustom: false
      })),
      ...(customRequests || []).map(req => ({
        id: req.id,
        name: req.food_type,
        quantity: req.quantity,
        contact_info: 'N/A',
        expires_on: req.required_by,
        notes: req.notes,
        isCustom: true
      }))
    ];

    setRequestedFoods(formatted);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const response = await fetch("http://localhost:8000/submit_custom_request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reciever_id: user.id,
        quantity: form.quantity,
        food_type: form.food_type,
        required_by: form.required_by,
        notes: form.notes,
      })
    });

    setLoading(false);
    if (response.ok) {
      alert("✅ Custom request submitted!");
      fetchRequests();
      setForm({ quantity: '', food_type: '', required_by: '', notes: '' });
      setShowForm(false);
    } else {
      alert("❌ Failed to submit request");
    }
  };

  const handleDelete = async (id, isCustom) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this request?");
    if (!confirmDelete) return;

    const table = isCustom ? 'custom_requests' : 'requests';
    const column = isCustom ? 'id' : 'request_id';
    const { error } = await supabase.from(table).delete().eq(column, id);

    if (!error) {
      alert("🗑️ Request cancelled");
      fetchRequests();
    } else {
      alert("❌ Failed to cancel request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#E7F6F2] to-[#D1E8E4] px-6 py-10 font-sans">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push('/receiver/ReceiverDashboard')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-full shadow transition"
        >
          🔙 Back to Dashboard
        </button>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-full shadow transition"
        >
          {showForm ? 'Hide Request Form' : '➕ Request Food'}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {requestedFoods.map((food, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-all relative">
            <h3 className="text-xl font-bold text-[#4B1C1C]">{food.name}</h3>
            <p className="text-sm text-gray-800 mt-1">🍛 <b>{food.isCustom ? 'Requested' : 'Type'}:</b> {food.name}</p>
            <p className="text-sm text-gray-800">📦 <b>Quantity:</b> {food.quantity}</p>
            <p className="text-sm text-gray-800">📞 <b>Donor:</b> {food.contact_info}</p>
            <p className="text-sm text-gray-800">⏳ <b>Use Before:</b> {new Date(food.expires_on).toLocaleDateString()}</p>
            {food.notes && (
              <p className="text-sm text-gray-600 italic mt-1">“{food.notes}”</p>
            )}
            <p className="text-xs text-gray-500 mt-2 italic">Status: pending</p>
            <button
              onClick={() => handleDelete(food.id, food.isCustom)}
              className="absolute top-2 right-3 text-red-500 hover:text-red-700 text-lg"
              title="Delete Request"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto space-y-4">
          <h3 className="text-2xl font-bold text-orange-600 mb-2">📝 Request Food</h3>
          <input
  type="text"
  name="quantity"
  placeholder="e.g., 6kg"
  value={form.quantity}
  onChange={handleChange}
  className="p-3 w-full border border-gray-300 rounded text-black placeholder-gray-600"
  required
/>

<input
  type="text"
  name="food_type"
  placeholder="e.g., Veg / Non-Veg"
  value={form.food_type}
  onChange={handleChange}
  className="p-3 w-full border border-gray-300 rounded text-black placeholder-gray-600"
  required
/>

<input
  type="date"
  name="required_by"
  value={form.required_by}
  onChange={handleChange}
  className="p-3 w-full border border-gray-300 rounded text-black placeholder-gray-600"
  required
/>

<textarea
  name="notes"
  placeholder="Why or how many people?"
  value={form.notes}
  onChange={handleChange}
  className="p-3 w-full border border-gray-300 rounded text-black placeholder-gray-600"
/>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition"
          >
            📩 {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
}
