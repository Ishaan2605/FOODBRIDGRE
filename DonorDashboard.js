import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Layout from '../components/Layout';

export default function DonorDashboard() {
  const [foods, setFoods] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from('food_listings')
        .select('*')
        .eq('donor_id', user.id);

      if (!error) setFoods(data);
    };

    fetchListings();
  }, []);

  return (
    <Layout role="donor">
      <h2 className="text-2xl font-bold mb-6 text-orange-600">📦 Your Food Listings</h2>
      {foods.length === 0 ? (
        <p>No food listed yet. Go to Add Food.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <div key={food.food_id} className="bg-white p-4 rounded shadow border">
              <h3 className="font-bold text-lg text-orange-700">{food.food_name}</h3>
              <p>Quantity: {food.quantity}</p>
              <p>Type: {food.food_type}</p>
              <p>Location: {food.location}</p>
              <p>Best Before: {new Date(food.expires_on).toLocaleString()}</p>
              <p>Status: <span className={`font-semibold ${food.status === 'available' ? 'text-green-600' : 'text-gray-500'}`}>{food.status}</span></p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
