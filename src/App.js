
import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Template from './pages/Template';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="*" element={<Template />} />
            <Route path="/" element={<Template />} />
        </Routes>
    </Router>
  );
}

export default App;
