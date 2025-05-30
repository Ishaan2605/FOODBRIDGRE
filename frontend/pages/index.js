import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowHero(true), 100); // smooth fade-in
  }, []);

  return (
    <div className="min-h-screen bg-[#e3e1ec] text-[#333]">
      {/* Hero Section */}
      <section className={`transition-opacity duration-1000 ${showHero ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-10">
          <h1 className="text-5xl font-extrabold text-[#c43636] leading-tight mb-4 animate-fade-slide">
          🙏  Welcome to <span className="text-[#0d572b]">FoodBridge</span>
          </h1>
          <p className="text-lg text-[#4E342E] max-w-xl mb-6">
            Connecting food donors with shelters & NGOs. Help reduce food waste, spread nourishment, and make someone’s day better today.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/auth/Login">
              <button className="px-6 py-3 bg-[#2da91785] hover:bg-[#e95e5e] text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105">
                ❤️ Login
              </button>
            </Link>
            <Link href="/auth/Signup">
              <button className="px-6 py-3 bg-[#2da91785] hover:bg-[#e95e5e] text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105">
                🤝 Sign Up
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-12 bg-white rounded-t-3xl shadow-inner mt-10 animate-fade-slide">
        <h2 className="text-3xl font-bold text-center text-[#3b885a] mb-10">🌟 Why FoodBridge?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            emoji="🌍"
            title="Live Food Listings"
            desc="Get real-time access to available food donations in your area with geolocation."
          />
          <FeatureCard
            emoji="🏆"
            title="Trusted Donors & NGOs"
            desc="Verified profiles and safe delivery workflows ensure dignity & transparency."
          />
          <FeatureCard
            emoji="📊"
            title="Track Your Impact"
            desc="See how much food you've saved and lives you've touched through your dashboard."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-500 pb-6">
        Made with 💛 by the FoodBridge Team • © {new Date().getFullYear()}
      </footer>

      <style jsx>{`
        .animate-fade-slide {
          animation: fade-slide 0.8s ease-out forwards;
        }
        @keyframes fade-slide {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// FeatureCard Component
function FeatureCard({ emoji, title, desc }) {
  return (
    <div className="bg-[#FDF6F0] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-2">{emoji}</div>
      <h3 className="text-xl font-semibold text-[#4E342E] mb-2">{title}</h3>
      <p className="text-gray-700 text-sm">{desc}</p>
    </div>
  );
}
