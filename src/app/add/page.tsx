'use client'

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import nookies from 'nookies';

const AddTodoForm: React.FC = () => {

    const router = useRouter();
    const userId = nookies.get().id;
    const jwt = nookies.get().jwt;


    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [isDone, setIsDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await fetch('http://localhost:1337/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({
                    data: {
                        info: {
                            title: title,
                            desc: desc,
                            is_done: isDone,
                        },
                        user: {
                            id: userId
                        }
                    }
                 }),
        });
            const data = await response.json();
            setTitle("");
            setDesc("");
            setIsDone(false);
            setSuccess(true);
            console.log("ADD success: ", data)
        } catch (err) {
            console.log(err)
            setError("Failed to add todo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessOk = () => {
        setSuccess(false);
        router.push("/todolist/en"); 
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Todo</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Success Alert */}
        {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Todo added successfully!</p>
            <button
                onClick={handleSuccessOk}
                className="mt-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
                OK
            </button>
            </div>
        )}

    {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isDone"
                    checked={isDone}
                    onChange={(e) => setIsDone(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isDone" className="ml-2 block text-sm text-gray-900">
                    Is Done?
                </label>
            </div>
            <div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-2 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Todo"}
                </button>
            </div>
            </form>
        )}
        </div>
    );
};

export default AddTodoForm;
