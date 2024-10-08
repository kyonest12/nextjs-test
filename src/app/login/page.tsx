'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import nookies from 'nookies';

interface Elements {
    id: number;
    __component: string;
    name: string;
}

const Login: React.FC = () => {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inValidLogin, setInValidLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Elements[]>([]);;

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(`http://localhost:1337/api/login-page?populate[form][populate]=*`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log("DATA: ", data.data.attributes.form)
                setForm(data.data.attributes.form)
                console.log("FORM: ", form)
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
        };
        fetchTodos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(email)
        console.log(password)
        const identifier = email
        try {
            const response = await fetch(`http://localhost:1337/api/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });
            if (!response.ok) {
                setInValidLogin(true)
                return;
            }
            const data = await response.json();
            console.log('Login successful:', data.jwt);
            nookies.set(null, 'jwt', data.jwt, {
                maxAge: 30 * 24 * 60 * 60, 
                path: '/', 
              });
              nookies.set(null, 'id', data.user.id, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
              });
            router.push('/todolist/en')
        } catch (error) {
            setInValidLogin(true)
            console.error('Error during login:', error);
        }
      };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className='loader'></div>
            </div>
        );
    }
    else {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center text-gray-700">Login</h1>
                    {inValidLogin && <h2 className="text-center text-red-600">Wrong password or email</h2>}
                    <form className="space-y-6">
                    
                    {form.map((element) => {

                        if (element.__component === 'element.field') {
                            return (
                                <div key={element.id}>
                                    <label className="block text-sm">{element.name.charAt(0).toUpperCase() + element.name.slice(1)}</label>
                                    <input 
                                    type={element.name}
                                    onChange={element.name === 'email' ? handleEmailChange : handlePasswordChange}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" 
                                    />
                                </div>
                            );
                        } else if (element.__component === 'element.button') {
                            return (
                                <div className="flex items-center justify-between pb-4" key={element.id}>
                                    <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none" onClick={handleSubmit}>
                                    {element.name}
                                    </button>
                                </div>
                            );
                        }
                            return null;
                        })}
                                <Link href="/Register" className='text-red-600 font-bold font-serif'> Don't have account? Reigster </Link>
                                <br></br>
                                <Link href="/passwordreset" className='text-red-600 font-bold font-serif'> Forgot your password? Reset </Link>
                        </form>
                    </div>
                </div>
            );
        }
};

export default Login;