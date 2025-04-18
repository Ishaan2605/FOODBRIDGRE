import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor' });
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Step 1: Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Step 2: Add user to Users table with auth.user.id
    const id = data.user?.id;

    const { error: insertError } = await supabase.from('Users').insert([
      {
        id,
        name: form.name,
        email: form.email,
        role: form.role,
        is_verified: false,
      },
    ]);

    if (insertError) {
      setErrorMsg(insertError.message);
      return;
    }

    // Step 3: Redirect to role-based dashboard
    router.push('/auth/Login');
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-orange-600 mb-6">Create Account</h1>

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="input-style"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="input-style"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="input-style"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input-style text-gray-700"
          >
            <option value="donor">Donor</option>
            <option value="receiver">Receiver</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/auth/Login" className="text-orange-600 font-semibold hover:underline">
            Login
          </a>
        </p>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-500 mb-2">or sign up with</p>
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 border py-2 px-4 rounded-lg bg-white hover:bg-gray-50 transition shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">Google</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background-color: #f9fafb;
          font-size: 14px;
          color: #111827;
        }

        .input-style::placeholder {
          color: #6b7280;
          opacity: 1;
        }

        .input-style:focus {
          border-color: #f97316;
          outline: none;
          background-color: white;
        }
      `}</style>
    </div>
  );
}
