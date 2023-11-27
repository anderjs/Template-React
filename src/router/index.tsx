import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// - Views
import Admin from "@views/Admin/admin.view";
import Pricing from "@views/Pricing";
import Settings from "@views/Settings";
import Dashboard from "@views/Dashboard";

// - Admin Views
import Coupon from "@views/Coupon/coupon.view";
import EditCoupon from "@views/Edit-Coupon";
import CreateCoupon from "@views/Create-Coupon";

// - Roles
import Roles from "@views/Roles/roles.view";

// - History
import History from "@views/History/history.view";

/**
 * @description
 * React router dom, installing libraries here.
 */
export const Router: React.FC = React.memo(() => {
  return (
    <BrowserRouter basename="/dashboard">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/coupons" element={<Coupon />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/coupons/create" element={<CreateCoupon />} />
        <Route path="/coupons/edit/:id" element={<EditCoupon />} />
      </Routes>
    </BrowserRouter>
  );
});
