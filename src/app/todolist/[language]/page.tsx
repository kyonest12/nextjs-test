'use client'

import nookies from 'nookies';
import { useRouter } from "next/navigation";
import { useEffect, useState} from "react";

export interface Todo {
    id: number;
    title: string;
    desc: string;
    is_done: boolean;
  }

interface ItemProps {
    todo: Todo; 
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

const Item: React.FC<ItemProps> = ({ todo, onToggle, onDelete }) => { 
    const router = useRouter();
    const jwt = nookies.get().jwt;
    const id = Number(nookies.get().id);

    const changeState = async () => {
        const updatedTodo = {
            title: todo.title,
            desc: todo.desc,
            is_done: !todo.is_done,
        };
        try {
            const response = await fetch(`http://localhost:1337/api/todos/${todo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({data: {info: updatedTodo}}),
            });
            if (response.ok) {
                onToggle(todo.id)
            } else {
                console.error('Failed to update todo');
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };
    
    const deleteTodo = async () => {
        try {
            const response = await fetch(`http://localhost:1337/api/todos/${todo.id}`, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
            });  
            console.log(response)
            onDelete(id);
            } catch (error) {
                console.error(error);
            }
    };

    const editTodo = () => {
        router.push(`/edit?id=${todo.id}`)
    }

    return(
        <div className={`p-4 rounded-md shadow-md ${
            todo.is_done ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{todo.title}</h2>
                <span
                className={`px-2 py-1 text-sm rounded ${
                    todo.is_done ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}
                >
                {todo.is_done ? 'Done' : 'Todo'}
                </span>
            </div>
            <p className="text-gray-700">{todo.desc}</p>
            <div className="mt-2 flex space-x-2">
                <button
                    onClick={changeState}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                Change
                </button>
                <button
                    onClick={deleteTodo}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                Delete
                </button>
                <button
                    onClick={editTodo}
                    className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                >
                Edit
                </button>
                <button
                    onClick={() => {router.push(`http://localhost:3000/detail/${todo.id}`)}}
                    className="px-4 py-2 text-white bg-slate-600 rounded hover:bg-blue-600"
                >
                View Detail
                </button>   
            </div>
        </div>
    );
};

const TodoList = ({ params }: { params: { language: string } }) => {
    
    const router = useRouter();
    const [searchTitle, setSearchTitle] = useState(''); 
    const [filterIsDone, setFilterIsDone] = useState(2);
    const jwt = nookies.get().jwt;
    
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const handleAdd = () => {
        router.push('/add')
    }

    const handleNavigate = (lang: string) => {
        router.push(`http://localhost:3000/todolist/${lang}`);
      };

    const handleSearch = async () => {
        try {
            
            let url = `http://localhost:1337/api/users/me?populate[todos][populate]=*&populate[todos][filters][locale][$eq]=${params.language}`;

            const filters = [];
            if (searchTitle) {
                filters.push(`&populate[todos][filters][info][title][$containsi]=${encodeURIComponent(searchTitle)}`);
            }
            if (filterIsDone !== 2) {
                let isDone: boolean
                if (filterIsDone == 1) isDone = true
                else isDone = false
                filters.push(`&populate[todos][filters][info][is_done][$eq]=${isDone}`);
            }
            if (filters.length > 0) {
                url += '&' + filters.join('&');
            }
            console.log("URL: ", url)
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
            });
            const data = await response.json();
            const infoArray = data.todos.map((todo: { id: number; info: { title: string; desc: string; is_done: string; }; }) => ({
                id: todo.id,
                title: todo.info.title,
                desc: todo.info.desc,
                is_done: todo.info.is_done
              }));
            setTodos(infoArray)
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(`http://localhost:1337/api/users/me?populate[todos][populate]=*&populate[todos][filters][locale][$eq]=${params.language}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwt}`,
                    },
                })
                const data = await response.json();
                const infoArray = data.todos.map((todo: { id: number; info: { title: string; desc: string; is_done: string; }; }) => ({
                    id: todo.id,
                    title: todo.info.title,
                    desc: todo.info.desc,
                    is_done: todo.info.is_done
                  }));
                setTodos(infoArray)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTodos();
    }, []);


    const onChangeState = (id: number) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === id ? { ...todo, is_done: !todo.is_done } : todo
            )
          );
    }

    const onDelete = (id: number) => {
        setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== id)
          );
          window.location.reload();
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader"></div>
            </div>
        );
    }
    else {
        return (
            <div className="max-w-lg mx-auto my-8 p-4">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold mb-4 p-2 m-4">Todo List</h1>
                    <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                        >
                            Add Todo
                        </button>
                </div>
                <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)} // Cập nhật giá trị searchTitle
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <div className="mb-4">
                    <select
                        value={filterIsDone}
                        onChange={(e) => setFilterIsDone(Number(e.target.value))} // Cập nhật giá trị filterIsDone
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                        <option value={2}>All</option>
                        <option value={0}>Todo</option>
                        <option value={1}>Done</option>
                    </select>
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                        Search
                    </button>
                </div>
                <div className="fixed bottom-5 right-5 flex flex-col gap-2">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                        onClick={() => handleNavigate('en')}
                    >
                        EN
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
                        onClick={() => handleNavigate('ja')}
                    >
                        JA
                    </button>
                </div>
            </div>
                <ul className="space-y-4">
                {todos.map(todo => (
                    <Item
                        key={todo.id}
                        todo={todo}
                        onToggle={onChangeState}
                        onDelete={onDelete}
                    />
                    ))}
                </ul>
            </div>
        )
    }
};

export default TodoList;