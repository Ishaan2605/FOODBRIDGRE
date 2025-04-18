import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Layout from '../components/Layout';

export default function AddFood() {
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    made_on: '',
    expires_on: '',
    location: ''
  });
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      else router.push('/auth/Login');
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('food_listings').insert([
      {
        donor_id: userId,
        name: form.name,
        quantity: form.quantity,
        made_on: new Date().toISOString().split('T')[0],
        expires_on: new Date(form.expires_on).toISOString().split('T')[0],
        location: form.location
      }
    ]);

    if (error) {
      console.error('Upload failed:', error.message);
      alert('🚫 Failed to upload food listing');
    } else {
      alert('✅ Food listed successfully!');
      router.push('/donor/DonorDashboard');
    }
  };

  return (
    <Layout role="donor">
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-orange-100 to-yellow-50 shadow-2xl rounded-3xl p-8 mt-10 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-6 drop-shadow-md">
          🍛 Add Food Listing
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="name" placeholder="Food Name" onChange={handleChange} className="input-box" required />
          <input name="quantity" placeholder="Quantity (e.g. 5 kg)" onChange={handleChange} className="input-box" required />
          <input name="expires_on" type="date" onChange={handleChange} className="input-box" required />
          <input name="location" placeholder="Pickup Location" onChange={handleChange} className="input-box" required />

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl transition-transform transform hover:scale-105 shadow-md"
          >
            🚀 Submit
          </button>
        </form>
      </div>

      <style jsx>{`
        .input-box {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #fb923c;
          border-radius: 10px;
          background-color: #fffaf0;
          font-size: 1rem;
          color: #1f2937;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .input-box:focus {
          border-color: #f97316;
          outline: none;
          background-color: #ffffff;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
}
