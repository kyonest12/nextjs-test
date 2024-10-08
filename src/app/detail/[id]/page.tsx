import { cookies } from 'next/headers'

export async function generateStaticParams() {
    const res = await fetch(`http://127.0.0.1:1337/api/todos/?[populate]=*`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        next: { tags: ['todos'] }
    });
    const data = await res.json()
    const params = [];
    for (let i = 0; i < data.data.length; i++) {
        const todo = data.data[i];
        
        // Thêm object chứa id vào mảng params
        params.push({
          id: todo.id.toString(), // Chuyển id thành chuỗi
        });
    }
    return params
}

export default async function Page({ params }: { params: { id: string } }) {
    const cookieStore = cookies()
    const jwt = cookieStore.get('jwt')?.value
    const todos = await fetch(`http://localhost:1337/api/todos/${params.id}?[populate]=*`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
    }).then(
        (res) => res.json()
    )
    const todo = todos.data.attributes.info
    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">{todo.title}</h1>
            <p className="mb-2">{todo.desc}</p>
            <p className={`font-semibold ${todo.isDone ? 'text-green-500' : 'text-red-500'}`}>
                {todo.isDone ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            </p>
            <a href = '/todolist/en' className="mt-7 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Quay lại danh sách Todo
            </a>
        </div>
    )
}
