import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogoutUser } from "../../redux/auth/AuthSlice";

let navigation = [
    { name: '← Menu', href: '/', current: false},
    { name: 'Orders', href: '/admin/orders', current: false},
    { name: 'Inventory', href: '/admin/inventory', current: false},
    { name: 'Items', href: '/admin/items', current: false},
    { name: 'Batches', href: '/admin/batches', current: false},
    { name: 'Suppliers', href: '/admin/suppliers', current: false},
];

function AdminLayout({ children }: { children: ReactNode }){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {

        // Clear redux state
        dispatch(LogoutUser());

        // Remove JWT token
        localStorage.removeItem("token");

        // Redirect to login page
        navigate("/");
    }
    return (
        <div className="min-h-screen grid xl:grid-cols-6">
            <aside className="w-220 pl-12 pt-12 bg-[#6F4E37] text-white">
                <h2 className="font-medium text-2xl mb-6">Admin Menu</h2>
                <ul className="font-light text-lg/8">
                    {navigation.map((a) => (
                        <li key={a.name}>
                            <NavLink 
                                to={a.href} 
                                className={({ isActive }) =>
                                `
                                block
                                w-fit
                                px-4
                                py-2
                                rounded-lg
                                transition
                                duration-200
                                ${
                                    isActive
                                    ? "bg-[#A67B5B] font-medium"
                                    : ""
                                }
                                `
                                }
                            >
                                {a.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <button
                onClick={handleLogout}
                className="
                    font-light
                    text-lg
                    mt-6
                    px-4
                    py-2
                    rounded-lg
                    hover:bg-red-600
                    transition
                    duration-200
                "
                >
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