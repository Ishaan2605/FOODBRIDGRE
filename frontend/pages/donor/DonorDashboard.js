import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function DonorDashboard() {
  const [foods, setFoods] = useState([]);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/auth/Login');
    setUserId(user.id);

    const roleRes = await supabase.from('Users').select('role').eq('id', user.id).single();
    if (!roleRes.error && roleRes.data) setRole(roleRes.data.role);

    const { data, error } = await supabase
      .from('food_listings')
      .select('*')
      .eq('donor_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setFoods(data);
  };

  const handleDelete = async (food_id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this food listing?');
    if (!confirmDelete) return;

    // Delete related requests
    await supabase.from('requests').delete().eq('food_id', food_id);

    // Delete the food listing
    const { error } = await supabase.from('food_listings').delete().eq('food_id', food_id);
    if (!error) {
      // Update state to reflect change
      setFoods(prev => prev.filter(food => food.food_id !== food_id));
      alert('🗑️ Food listing deleted!');
    } else {
      alert('❌ Deletion failed');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#E7F6F2] to-[#D1E8E4]">
      <nav className="w-full bg-gradient-to-r from-[#FFF8F0] via-[#FDE4E4] to-[#D1E8E4] px-6 py-4 shadow-md flex justify-between items-center rounded-b-2xl">
        <div className="text-2xl font-bold text-[#ca1919]">🍽️ FoodBridge</div>
        <div className="space-x-6 text-sm font-medium text-[#333]">
          <a href="/" className="hover:text-[#7f3b3b] transition">Home</a>
          <a href="/donor/DonorDashboard" className="hover:text-[#683232] transition">Reload</a>
          <button
            onClick={() => router.push('/donor/ReceiverRequests')}
            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
          >
            🧾 Receiver Requests
          </button>
        </div>
      </nav>

      <div className="max-w-7xl px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#cf2828]">📦 Your Food Listings</h1>
          <button
            onClick={() => router.push('/donor/AddFood')}
            className="bg-gradient-to-r from-[#d62121] to-[#e37f33] text-white font-semibold py-2 px-5 rounded-xl shadow-md hover:scale-105 transition-all"
          >
            ➕ Add New
          </button>
        </div>

        {foods.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-20">
            You haven’t added any food yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {foods.map((food) => (
              <div
                key={food.food_id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all animate-fade-in transform hover:-translate-y-1 border border-white/60 relative"
              >
                {food.img_url && (
                  <img src={food.img_url} alt={food.name} className="w-full h-52 object-cover" />
                )}
                <div className="p-5 space-y-2 text-[#4E342E]">
                  <h2 className="text-xl font-bold text-[#4f0303]">{food.name}</h2>
                  <p className="text-sm">📦 <b>Quantity:</b> {food.quantity}</p>
                  <p className="text-sm">🍽 <b>Type:</b> {food.food_type}</p>
                  <p className="text-sm">📍 <b>Location:</b> <a href={food.location} target="_blank" className="text-blue-600 hover:underline">Map</a></p>
                  <p className="text-sm">⏳ <b>Expires:</b> {new Date(food.expires_on).toLocaleDateString()}</p>
                  <p className="text-sm">📞 <b>Contact:</b> {food.contact_info}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    food.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {food.status}
                  </span>
                  <button
                    onClick={() => handleDelete(food.food_id)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-xl"
                    title="Delete this listing"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
