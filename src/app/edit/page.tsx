'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import nookies from 'nookies';

export interface Todo {
    id: number;
    title: string;
    desc: string;
    is_done: boolean;
  }

const EditTodo = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const jwt = nookies.get().jwt;
    const [todoo, setTodoo] = useState<Todo | null>(null);

    useEffect(() => {
        const fetchTodoById = async () => {
            const response = await fetch(`http://127.0.0.1:1337/api/todos/${id}?[populate]=*`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
            } );
            const data = await response.json();
            setTodoo(data.data.attributes.info)
        }; 
        fetchTodoById()
      }, [id]);
   
    console.log("TODOO: ", todoo)
    const [title, setTitle] = useState(todoo?.title || ''); 
    const [desc, setDesc] = useState(todoo?.desc || ''); 
    const [isDone, setIsDone] = useState(todoo?.is_done || false);
    
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTodo = {
            title,
            desc,
            is_done: isDone,
        };
        console.log(updatedTodo)
        try {
            const response = await fetch(`http://127.0.0.1:1337/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({data: {info: updatedTodo}}),
            });
            if (response.ok) {
                router.push('/todolist/en');
            } else {
                console.error('Failed to update todo');
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-700">Edit Todo</h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Description</label>
                        <textarea
                            name="desc"
                            value={desc} // Giá trị hiện tại của description
                            onChange={(e) => setDesc(e.target.value)} // Cập nhật state khi người dùng thay đổi textarea
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Is Done</label>
                        <input
                            type="checkbox"
                            name="is_done"
                            checked={isDone} 
                            onChange={(e) => setIsDone(e.target.checked)}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit" 
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditProm = () => {
    return <Suspense>
        <EditTodo/>
    </Suspense>
}

export default EditProm;
