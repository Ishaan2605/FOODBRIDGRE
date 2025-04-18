// frontend/pages/donate/FoodType.js
import { useRouter } from 'next/router';

export default function FoodType() {
  const router = useRouter();

  const handleSelect = (type) => {
    router.push({
      pathname: '/donate/FoodDetails',
      query: { type },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">Select Food Type</h2>
      <div className="flex gap-6">
        <button onClick={() => handleSelect('Veg')} className="btn">Vegetarian</button>
        <button onClick={() => handleSelect('Non-Veg')} className="btn">Non-Vegetarian</button>
      </div>

      <style jsx>{`
        .btn {
          padding: 12px 24px;
          background-color: #f97316;
          color: white;
          font-weight: 600;
          border-radius: 8px;
          transition: 0.3s;
        }
        .btn:hover {
          background-color: #ea580c;
        }
      `}</style>
    </div>
  );
}
