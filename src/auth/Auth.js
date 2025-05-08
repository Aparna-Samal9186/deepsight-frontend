import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function Auth({ onAuth }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async () => {
        setLoading(true);
        try {
            const url = isSignUp ? 'http://localhost:8000/signup' : 'http://localhost:8000/login';

            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            localStorage.setItem('token', response.data.token);
            onAuth(true);
            navigate('/dashboard');
        } catch (error) {
            console.error(`${isSignUp ? 'Sign Up' : 'Login'} error:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-800 to-gray-900 flex items-center justify-center z-50 overflow-hidden">
            <Card className="w-[400px] mx-auto mt-10">
                <CardHeader>
                    <CardTitle className='text-white'>{isSignUp ? 'Sign Up' : 'Login'}</CardTitle>
                    <CardDescription className='text-white'>{isSignUp ? 'Create an account to get started.' : 'Enter your credentials to login.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mb-2"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4"
                    />
                    <Button className='flex text-white bg-slate-500 w-full' onClick={handleAuth} disabled={loading}>
                        {loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : isSignUp ? 'Sign Up' : 'Login'}
                    </Button>
                    <div className="mt-4 text-center">
                        <span className='text-white'>
                            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-blue-400 hover:underline"
                            >
                                {isSignUp ? 'Login' : 'Sign Up'}
                            </button>
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Auth;