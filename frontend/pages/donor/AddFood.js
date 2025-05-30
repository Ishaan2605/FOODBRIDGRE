import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function AddFood() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    foodType: '',
    packageType: '',
    made_on: '',
    expires_on: '',
    location: '',
    contact: '',
    image: null,
    
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth/Login');

      setUserId(user.id);

      const { data: userData, error } = await supabase
        .from('Users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && userData) setRole(userData.role);
    };

    getUser();
  }, [router]);

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const location = `https://maps.google.com/?q=${latitude},${longitude}`;
        setForm((prev) => ({ ...prev, location }));
      },
      () => alert('Unable to access location')
    );
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    if (form.image) {
      const fileName = `${Date.now()}_${form.image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(fileName, form.image);

      if (uploadError) return alert('❌ Image upload failed');

      const { data } = supabase.storage.from('food-images').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from('food_listings').insert([{
      donor_id: userId,
      name: form.name,
      quantity: `${form.quantity} ${form.unit}`,
      food_type: `${form.foodType} | ${form.packageType}`,
      made_on: form.made_on,
      expires_on: form.expires_on,
      location: form.location,
      contact_info: form.contact,
      img_url: imageUrl,
      status: 'available',
    }]);

    if (error) {
      console.error(error);
      alert('❌ Failed to add food listing');
    } else {
      alert('✅ Food listed successfully!');
      router.push('/donor/DonorDashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#E7F6F2] to-[#D1E8E4]">
      <nav className="w-full bg-gradient-to-r from-[#f3eeee] via-[#e0e8e0] to-[#d2ebe6] px-6 py-4 shadow-md flex justify-between items-center rounded-b-2xl">
        <div className="text-2xl font-bold text-[#d92424]">🍱 FoodBridge</div>
        <div className="space-x-6 text-sm font-medium text-[#000000]">
          <a href="/" className="hover:text-[#a94e4e] transition">Home</a>
          {role === 'donor' && (
            <a href="/donor/AddFood" className="hover:text-[#a94e4e] transition">Refresh</a>
          )}
        </div>
      </nav>

      <div className="flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/60 animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#e61616]">🍱 Add Food Listing</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" name="name" placeholder="Food Name" onChange={handleChange} required />

            <div className="grid grid-cols-2 gap-4">
              <input className="input" name="quantity" placeholder="Quantity" onChange={handleChange} required />
              <select className="input" name="unit" value={form.unit} onChange={handleChange}>
                <option value="kg">kg</option>
                <option value="gm">gm</option>
                <option value="ltr">ltr</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select className="input" name="foodType" onChange={handleChange} required>
                <option value="">Veg / Non-Veg</option>
                <option value="Veg">🌿 Veg</option>
                <option value="Non-Veg">🍗 Non-Veg</option>
              </select>
              <select className="input" name="packageType" onChange={handleChange} required>
                <option value="">Cooked / Packaged</option>
                <option value="Cooked">🍛 Cooked</option>
                <option value="Packaged">🥡 Packaged</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Made On</label>
                <input className="input" type="date" name="made_on" onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Use Before</label>
                <input className="input" type="date" name="expires_on" onChange={handleChange} required />
              </div>
            </div>

            <div className="text-sm text-[#360bc1] font-medium cursor-pointer" onClick={detectLocation}>
              📍 Use My Location
            </div>

            <input className="input" name="location" placeholder="Pickup Location" value={form.location} onChange={handleChange} required />
            <input className="input" name="contact" placeholder="Contact Info" onChange={handleChange} required />

            <label className="block">
              <span className="text-sm text-gray-600 font-medium">Upload Image of Food</span>
              <input className="input mt-1" type="file" accept="image/*" name="image" onChange={handleChange} />
            </label>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#f84141] to-[#ff7d36] hover:scale-105 transition-all shadow-md"
            >
              🚀 Submit Listing
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .input {
          padding: 0.75rem;
          background: #ffffff;
          border-radius: 0.75rem;
          width: 100%;
          border: 1px solid #ddd;
          outline: none;
          color: #333;
          font-size: 0.95rem;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
        }
        .input::placeholder {
          color: #777;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
