// frontend/pages/index.js

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-8 text-center">
      <h1 className="text-4xl font-bold text-orange-600 mb-4">🍽️ Welcome to FoodBridge</h1>
      <p className="text-lg text-gray-700 mb-6">
        Connecting surplus food donors with NGOs & shelters.  
      </p>
      <div className="flex gap-4">
        <Link href="/auth/Login">
          <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded">
            Login
          </button>
        </Link>
        <Link href="/auth/Signup">
          <button className="px-6 py-2 border border-orange-500 text-orange-500 hover:bg-orange-100 font-semibold rounded">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
