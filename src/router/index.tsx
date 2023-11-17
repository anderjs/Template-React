import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// - Views
import Admin from "@views/Admin";
import Pricing from "@views/Pricing";
import Settings from "@views/Settings";
import Dashboard from "@views/Dashboard";

// - Admin Views
import Coupon from "@views/Coupon";
import EditCoupon from "@views/Edit-Coupon";
import CreateCoupon from "@views/Create-Coupon";

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
        <Route path="/coupons" element={<Coupon />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/coupons/create" element={<CreateCoupon />} />
        <Route path="/coupons/edit/:id" element={<EditCoupon />} />
      </Routes>
    </BrowserRouter>
  );
});
