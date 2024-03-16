import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "@views/App/AppView";

// - Views
import Admin from "@views/Admin/admin.view";
import Pricing from "@views/Pricing";
import Dashboard from "@views/Dashboard";

// - Admin Views
import Coupon from "@views/Coupon/coupon.view";
import EditCoupon from "@views/Coupon/Edit";
import CreateCoupon from "@views/Coupon/Create";

// - Plans
import Plans from "@views/Plans/plans.view";
import EditPlan from "@views/Plans/Edit";
import CreatePlan from "@views/Plans/Create";

// - Roles
import Roles from "@views/Roles/roles.view";

// - History
import History from "@views/History/history.view";

// - Courses
import Courses from "@views/Courses/courses.view";
import CreateCourse from "@views/Courses/Create";

// - Categories
import Settings from "@views/Settings/settings.view";
import Categories from "@views/Categories/categories.view";
import CreateCategory from "@views/Categories/Create";
import EditCategory from "@views/Categories/Edit";

/**
 * @description
 * React router dom, installing libraries here.
 */
export const Router: React.FC = React.memo(() => {
  return (
    <BrowserRouter basename="/dashboard">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/app" element={<App />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/coupons" element={<Coupon />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/plans/create"
          element={<CreatePlan isEditMode={false} />}
        />
        <Route path="/plans/edit/:id" element={<EditPlan />} />
        <Route
          path="/coupons/create"
          element={<CreateCoupon isEditMode={false} />}
        />
        <Route path="/coupons/edit/:id" element={<EditCoupon />} />
        <Route path="/courses/create/:id" element={<CreateCourse />} />
        <Route
          path="/categories/create"
          element={<CreateCategory isEditMode={false} />}
        />
        <Route path="/categories/edit/:id" element={<EditCategory />} />
      </Routes>
    </BrowserRouter>
  );
});
