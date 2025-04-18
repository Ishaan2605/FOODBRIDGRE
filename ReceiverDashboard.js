import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import Layout from '../components/Layout';

export default function ReceiverDashboard() {
  const [foods, setFoods] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('food_listings')
        .select('*, Users(*)')
        .eq('status', 'available');

      if (!error && data) {
        const verifiedFoods = data.filter((f) => f.Users?.is_verified === true);
        setFoods(verifiedFoods);
      }
    };

    fetchListings();
  }, []);

  return (
    <Layout role="receiver">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">🍽️ Available Food Listings</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food) => (
          <div key={food.food_id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold text-orange-700">{food.food_name}</h3>
            <p>Type: {food.food_type}</p>
            <p>Quantity: {food.quantity}</p>
            <p>Pickup: {food.location}</p>
            <p>Expires: {new Date(food.expires_on).toLocaleString()}</p>
            <button
              onClick={() => router.push(`/receiver/NGOProfile?id=${food.food_id}`)}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded"
            >
              Request Food
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
