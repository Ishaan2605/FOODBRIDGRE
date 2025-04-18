// frontend/pages/donate/PickupInfo.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function PickupInfo() {
  const router = useRouter();
  const { name, quantity, expires_on, type } = router.query;

  const [location, setLocation] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
    const { error } = await supabase.from('food_listings').insert([{
      donor_id: userId,
      food_name: name,
      quantity,
      food_type: type,
      location,
      made_on: new Date().toISOString(),
      expires_on,
      status: 'available',
    }]);

    if (error) {
      alert('Failed to add food listing');
    } else {
      alert('Food listed successfully!');
      router.push('/donor/DonorDashboard');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Pickup Information</h2>
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <input placeholder="Pickup Location" value={location} onChange={(e) => setLocation(e.target.value)} className="input-box" />
        <button onClick={handleSubmit} className="w-full mt-4 bg-orange-500 text-white py-2 rounded">Confirm & Submit</button>
      </div>

      <style jsx>{`
        .input-box {
          width: 100%;
          margin-bottom: 12px;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}
