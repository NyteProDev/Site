import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Download from './pages/Download';
import Register from './pages/Register';
import Login from './pages/Login';
import Footer from './components/Footer'; // ✅ Bien importé !
import MonCompte from './pages/MonCompte';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/telecharger" element={<Download />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/moncompte" element={<MonCompte />} />
      </Routes>
      <Footer />
    </Router>
  );
}


export default App;
