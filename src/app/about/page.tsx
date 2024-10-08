async function getAboutPage() {
    const res = await fetch(`http://127.0.0.1:1337/api/about-page?populate[Contact][populate]=*`);
    const data = await res.json()
    return data
}

interface Elements {
    id: number;
    __component: string;
    name: string;
}

export default async function page() {
    const data = await getAboutPage()
    const info = data.data.attributes
    const contact = data.data.attributes.Contact
    return (
        <div className="text-center my-8">
            <h1 className="text-4xl font-bold">{info.Name}</h1>
            <p>{info.Description}</p>
            <h2 className="text-2xl mt-8 mb-4">Contact Links</h2>
            <ul className="list-none p-0">
                {contact.map((link:Elements) => (
                <li key={link.id} className="my-2">
                    <a target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {link.name}
                    </a>
                </li>
                ))}
            </ul>
        </div>
    );
}
