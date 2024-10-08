'use client'
import "./globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nookies from 'nookies';

const NavBar = () => {
  const router = useRouter();
  const handleLogout = () => {
    nookies.destroy(null, 'id');
    nookies.destroy(null, 'jwt');

    router.push('/login');
  };
  const handleLinkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    const cookies = nookies.get(); 

    if (cookies.id && cookies.jwt) {
      router.push('/todolist/en');
    } else {
      router.push('/login');
    }
  };

  return (
      <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">MyApp</div>
          <a href="/about" className="text-white text-lg font-bold">About</a>
          <button onClick={handleLinkClick} className="text-white text-lg font-bold">ListTodo</button>
          <div>
              <button className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600" onClick={handleLogout}>
                  <Link href="/"> Logout </Link>
              </button>
          </div>
      </div>
      </nav>
  );
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar></NavBar>
        {children}
      </body>
    </html>
  );
}
