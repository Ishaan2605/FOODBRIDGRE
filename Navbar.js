import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('Users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data) setRole(data.role);
    };

    fetchUserRole();
  }, []);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-orange-600 text-white shadow-md">
      <Link href="/" className="text-2xl font-bold tracking-wide">FOODBRIDGE</Link>

      <div className="space-x-6 text-lg">
        <Link href="/" className="hover:text-orange-200 transition">Home</Link>

        {/* Show Add Food only if role is donor */}
        {role === 'donor' && (
          <Link href="/donor/AddFood" className="hover:text-orange-200 transition">
            Add Food
          </Link>
        )}
      </div>
    </nav>
  );
}
