import { ReactNode } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

function Layout({ children }: { children: ReactNode }){
    return (
        <div className="m-0 p-0">
            <Header />
            <main>
                { children }
            </main>
            <Footer />
        </div>
    )
};

export default Layout;