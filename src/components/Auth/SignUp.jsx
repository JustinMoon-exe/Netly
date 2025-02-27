import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const SignUp = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Sign-up successful!");
            onClose(); // Call onClose to close the modal
        } catch (firebaseError) {
            setError(firebaseError.message);
            console.error("Sign-up error:", firebaseError);
        }
    };

    return (
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Sign Up</h2>
            {error && <p className="text-red-400 mb-2">{error}</p>}
            <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;