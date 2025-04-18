// frontend/pages/donate/FoodDetails.js
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function FoodDetails() {
  const router = useRouter();
  const { type } = router.query;

  const [form, setForm] = useState({ name: '', quantity: '', expires_on: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = () => {
    router.push({
      pathname: '/donate/PickupInfo',
      query: {
        ...form,
        type,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Enter Food Details</h2>
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <input name="name" placeholder="Food Name" onChange={handleChange} className="input-box" required />
        <input name="quantity" placeholder="Quantity (e.g. 5 plates)" onChange={handleChange} className="input-box" required />
        <input name="expires_on" type="datetime-local" onChange={handleChange} className="input-box" required />
        <button onClick={handleNext} className="w-full mt-4 bg-orange-500 text-white py-2 rounded">Next</button>
      </div>

      <style jsx>{`
        .input-box {
          width: 100%;
          margin-bottom: 12px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}
