import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Hortifruti } from "./screens/Hortifruti";
import { Furniture } from "./screens/Furniturel";
import { Electronics } from "./screens/Electronics";  

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hortifruti />} />
        <Route path="/furniture" element={<Furniture />} />
        <Route path="/electronics" element={<Electronics />} />
      </Routes>
    </Router>
  );
}
