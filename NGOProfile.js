import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Layout from '../components/Layout';

export default function NGOProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [food, setFood] = useState(null);
  const [pickupTime, setPickupTime] = useState('');
  const [location, setLocation] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from('food_listings')
        .select('*')
        .eq('food_id', id)
        .single();
      setFood(data);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchData();
  }, [id]);

  const handleRequest = async () => {
    const { error } = await supabase.from('requests').insert([
      {
        food_id: id,
        reciever_id: userId,
        pickup_time: pickupTime,
        location,
        status: 'pending',
      }
    ]);
    if (!error) {
      alert('Request sent!');
      router.push('/receiver/ReceiverDashboard');
    } else {
      alert('Error creating request');
    }
  };

  if (!food) return <p className="p-4">Loading food info...</p>;

  return (
    <Layout role="receiver">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">📋 Request Form</h2>
        <p><strong>Food:</strong> {food.food_name}</p>
        <p><strong>Quantity:</strong> {food.quantity}</p>
        <p><strong>Pickup from:</strong> {food.location}</p>

        <input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="input-box mt-4" />
        <input type="text" placeholder="Your Pickup Address" value={location} onChange={(e) => setLocation(e.target.value)} className="input-box" />

        <button onClick={handleRequest} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded">
          Confirm Request
        </button>
      </div>

      <style jsx>{`
        .input-box {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          border-radius: 8px;
          background: #f9fafb;
          border: 1px solid #ccc;
        }
      `}</style>
    </Layout>
  );
}
