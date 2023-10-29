import { BrowserRouter, Routes, Route } from "react-router-dom";

// - Views
import Settings from "../views/Settings";
import Dashboard from "../views/Dashboard";

export const Router: React.FC = () => {
  return (
    <BrowserRouter basename="/dashboard">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};
