import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function NGOProfiles() {
  const [ngos, setNgos] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from('Users')
        .select('id, name, role, org_name, location, contact_info, trust_level');

      console.log("🔍 All Users:", data);

      if (!error && data) {
        const filtered = data
          .filter(u => u.role === 'receiver' && u.id !== user.id)
          .reduce((acc, curr) => {
            if (!acc.find(a => a.org_name === curr.org_name)) acc.push(curr);
            return acc;
          }, []);
        console.log("✅ Filtered NGOs:", filtered);
        setNgos(filtered);
      }
    };

    fetchData();
  }, []);

  const getBadgeColor = (trust) => {
    switch (trust) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-400';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f0] via-[#eef9f3] to-[#d1ece4] px-6 py-12">
      <h2 className="text-3xl font-bold text-left text-[#f94a4a] mb-6 flex items-center gap-2">
        👥 Public NGO Directory
      </h2>

      {/* 🔹 Navigation Buttons */}
      <div className="flex gap-4 mb-10">
        <a
          href="/"
          className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#f97316] to-[#ff5722] hover:scale-105 transition"
        >
          🏠 Home
        </a>
        <a
          href="/receiver/ReceiverDashboard"
          className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#16a34a] to-[#0d9488] hover:scale-105 transition"
        >
          📦 Back to Dashboard
        </a>
      </div>

      {/* 🔸 NGO Listing */}
      {ngos.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No other NGOs found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ngos.map((ngo, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl border-l-4 border-orange-300 p-6">
              <h3 className="text-xl font-bold text-[#521212] mb-2">{ngo.org_name || 'Unnamed NGO'}</h3>
              <p className="text-sm text-gray-700 mb-1">
                <b>📍 Location:</b>{' '}
                {ngo.location ? (
                  <a href={ngo.location} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    {ngo.location}
                  </a>
                ) : 'N/A'}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <b>📞 Contact:</b> {ngo.contact_info || 'N/A'}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`w-3 h-3 rounded-full ${getBadgeColor(ngo.trust_level)}`}></span>
                <span className="italic text-sm text-gray-600">Verified by AI</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
