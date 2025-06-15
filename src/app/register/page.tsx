// Sets the 'use client' directive to indicate this is a client component
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    // Local state for form inputs and status
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    //form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            //show error message if backend responds with an error
            setError(data.error || 'Something went wrong');
            setLoading(false);
        } else {
            //on success, show message and redirect after a short delay
            setSuccess(true);
            setLoading(false);
            setTimeout(() => router.push('/login'), 2000);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>

            {/* Show error or success messages */}
            {error && <p className="text-red-600 mb-2">{error}</p>}
            {success && <p className="text-green-600 mb-2">Account created! Redirecting…</p>}

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Name (optional)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={e => setPassword(e.target.value)}
                    className="border px-3 py-2 rounded"
                />

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
        </div>
    );
}
