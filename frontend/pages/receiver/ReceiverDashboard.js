import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function ReceiverDashboard() {
  const [foods, setFoods] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [donorInfoMap, setDonorInfoMap] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchEverything();
  }, []);

  const fetchEverything = async () => {
    const { data: listings, error } = await supabase
      .from('food_listings')
      .select('*')
      .eq('status', 'available'); // Only available food
  
    if (error) {
      console.error("Error fetching food listings:", error);
      return;
    }
  
    const validListings = (listings || []).filter(item => item.food_id); // Ensure valid UUID
    setFoods(validListings);
  
    const donorIds = [...new Set(validListings.map(item => item.donor_id).filter(Boolean))];
    if (donorIds.length > 0) {
      const { data: usersData } = await supabase
        .from('Users')
        .select('id, name, email, org_name, trust_level, contact_info')
        .in('id', donorIds);
  
      const map = {};
      (usersData || []).forEach(user => {
        map[user.id] = user;
      });
      setDonorInfoMap(map);
    }
  };
  

  const toggleCard = (foodId) => {
    setFlippedCards(prev => ({ ...prev, [foodId]: !prev[foodId] }));
  };

  const getTrustBadgeColor = (level) => {
    switch (level) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-400';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#E7F6F2] to-[#D1E8E4]">
      <nav className="w-full bg-gradient-to-r from-[#f3eeee] via-[#e0e8e0] to-[#d2ebe6] px-6 py-4 shadow-md flex justify-between items-center rounded-b-2xl">
        <div className="text-2xl font-bold text-[#d92424]">FoodBridge</div>
        <div className="space-x-6 text-sm font-medium text-[#000000]">
          <button onClick={() => router.push('/')} className="hover:text-[#a94e4e]">Home</button>
          <button onClick={() => fetchEverything()} className="hover:text-[#a94e4e]">Reload</button>
          <button onClick={() => router.push('/receiver/MyRequests')} className="hover:text-[#a94e4e]">My Requests</button>
          <button onClick={() => router.push('/receiver/NGOProfile')} className="hover:text-[#a94e4e]">NGO Directory</button>
        </div>
      </nav>

      <div className="max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-extrabold text-[#f94a4a] mb-10">📦 Available Food Listings</h2>

        {foods.length === 0 ? (
          <p className="text-center text-gray-600 text-lg mt-10">No food available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {foods.map(food => {
              const isFlipped = flippedCards[food.food_id];
              const donor = donorInfoMap[food.donor_id];

              return (
                <div key={food.food_id} className="relative w-full h-[470px] [perspective:1000px]">
                  <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-2xl shadow-xl border border-white/60 p-6 flex flex-col justify-between">
                      {food.img_url && <img src={food.img_url} alt={food.name} className="w-full h-52 object-cover rounded-lg" />}
                      <div className="pt-4 space-y-1">
                        <h3 className="text-xl font-bold text-[#521212]">{food.name}</h3>
                        <p className="text-sm text-gray-700"><b>🍽 Type:</b> {food.food_type}</p>
                        <p className="text-sm text-gray-700"><b>📦 Quantity:</b> {food.quantity}</p>
                        <p className="text-sm text-gray-700"><b>📍 Location:</b> <a href={food.location} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Map</a></p>
                        <p className="text-sm text-gray-700"><b>⏳ Expires:</b> {new Date(food.expires_on).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-700"><b>📞 Contact:</b> {food.contact_info}</p>
                      </div>
                      <div className="mt-4">
                        <button onClick={() => toggleCard(food.food_id)} className="w-full bg-purple-100 text-purple-700 py-2 rounded-md font-semibold shadow hover:bg-purple-200">👤 Donor Info</button>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rotate-y-180 bg-white rounded-2xl shadow-xl border border-white/60 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#521212] mb-3">👤 Donor Info</h3>
                        <p className="text-sm text-gray-800"><b>Name:</b> {donor?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-800"><b>Contact:</b> {donor?.contact_info || 'N/A'}</p>
                        <p className="text-sm text-gray-800"><b>Org:</b> {donor?.org_name || 'N/A'}</p>
                        <div className="flex items-center mt-2 gap-2">
                          <span className={`w-3 h-3 rounded-full ${getTrustBadgeColor(donor?.trust_level)}`}></span>
                          <span className="text-xs italic text-gray-500">Verified by AI</span>
                        </div>
                      </div>
                      <button onClick={() => toggleCard(food.food_id)} className="mt-4 bg-yellow-100 text-purple-800 py-2 rounded-md font-semibold">🔙 Back</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
