import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// - Views
import Admin from "@views/Admin";
import Settings from "@views/Settings";
import Dashboard from "@views/Dashboard";

/**
 * @description
 * React router dom, installing libraries here.
 */
export const Router: React.FC = React.memo(() => {
  return (
    <BrowserRouter basename="/dashboard">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
});
