import { ReactNode } from "react";
import { Link } from "react-router-dom";

let navigation = [
    { name: 'ORDERS', href: '/admin/orders', current: false},
    { name: 'INVENTORY', href: '/admin/inventory', current: false}
];

function AdminLayout({ children }: { children: ReactNode }){
    return (
        <div className="min-h-screen grid xl:grid-cols-6">
            <aside className="w-220 pl-12 pt-12 bg-[#6F4E37] text-white">
                <h2 className="font-medium text-2xl mb-6">Admin Menu</h2>
                <ul className="font-light text-lg/8">
                    {navigation.map((a) => (
                        <li key={a.name}>
                            <Link to={a.href} className='hover:drop-shadow-lg'>
                                {a.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <button className="font-light text-lg/8 mt-6">
                    LOGOUT
                </button>
            </aside>
            <main className="xl:col-span-5">
                { children }
            </main>
        </div>
    )
};

export default AdminLayout;