import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErrorMsg(error.message);

    const user_id = data.user?.id;

    const { data: userData, error: fetchError } = await supabase
      .from('Users')
      .select('role')
      .eq('id', user_id)
      .single();

    if (fetchError || !userData) return setErrorMsg('Failed to fetch user role');

    router.push(userData.role === 'donor' ? '/donor/DonorDashboard' : '/receiver/ReceiverDashboard');
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setErrorMsg(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-yellow-50 to-orange-100">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">Welcome Back</h2>

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-box" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-box" required />

        <button type="submit" className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded">Login</button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/auth/Signup" className="text-orange-600 font-semibold hover:underline">Sign Up</a>
        </p>

        <div className="mt-6 text-center">
          <p className="text-sm mb-2 text-gray-500">or login with</p>
          <button type="button" onClick={handleGoogleLogin} className="w-full bg-white border flex items-center justify-center gap-2 py-2 rounded shadow-sm hover:bg-gray-50">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            <span className="text-sm font-medium text-gray-600">Google</span>
          </button>
        </div>
      </form>

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
