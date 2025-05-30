import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';     

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
    org_name: '',
    org_type: '',
    location: '',
    description: '',
    doc_url: '',
    contact_info: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:8000/register_user_with_ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      setLoading(false); // Stop loading

      if (!response.ok) {
        throw new Error(result.detail || 'Registration failed');
      }

      router.push('/auth/Login');
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 px-4 animate-fade-in">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border-t-[6px] border-orange-400">
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-6"> Create Account</h1>

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
        {loading && <p className="text-orange-500 text-center mb-4 font-medium">Please wait, verifying your organization…</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="input-style" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="input-style" required />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="input-style" type="password" required />
          <select name="role" value={form.role} onChange={handleChange} className="input-style text-gray-700">
            <option value="donor">Donor</option>
            <option value="receiver">Receiver</option>
          </select>
          <input name="contact_info" value={form.contact_info || ''} onChange={handleChange} placeholder="Contact Number" className="input-style" required />
          <input name="org_name" value={form.org_name} onChange={handleChange} placeholder="Organization Name" className="input-style" required />
          <input name="org_type" value={form.org_type} onChange={handleChange} placeholder="Organization Type (e.g., NGO, Restaurant)" className="input-style" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location (City, Area)" className="input-style" required />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Short Description" className="input-style" required />
          <input name="doc_url" value={form.doc_url} onChange={handleChange} placeholder="Document URL (for verification)" className="input-style" required />

          <button type="submit" className="btn-primary w-full" disabled={loading}>🚀 Sign Up</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/auth/Login" className="text-orange-600 font-semibold hover:underline">Login</a>
        </p>
      </div>

      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background-color: #f9fafb;
          font-size: 14px;
          color: #1f2937;
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

        .btn-primary {
          padding: 12px;
          background-color: #f97316;
          color: white;
          font-weight: 600;
          border-radius: 10px;
          transition: 0.3s;
        }

        .btn-primary:hover {
          background-color: #ea580c;
          transform: translateY(-1px);
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
