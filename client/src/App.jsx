import './index.css';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from "./pages/Profile";
import AdminLayout from './pages/admin/AdminLayout';
import Orders from "./pages/admin/Orders";
import Inventory from "./pages/admin/Inventory";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
      <Router>
        <Routes>
            <Route exact path='/' element={<Layout><Home /></Layout>} />
            <Route path='/menu' element={<Layout><Menu /></Layout>} />
            <Route path='/contact' element={<Layout><Contact /></Layout>} />
            <Route path='/login' element={<Layout><Login /></Layout>} />
            <Route path='/register' element={<Layout><Register /></Layout>} />
            <Route path='/profile' element={<Layout><Profile /></Layout>} />
            <Route path='/admin/orders' element={<Orders />} />
            <Route path='/admin/inventory' element={<Inventory />} />
        </Routes>
      </Router>
  )
}

export default App
