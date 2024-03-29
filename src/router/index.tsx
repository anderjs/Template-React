import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
/**
 * @description
 * React router dom, installing libraries here.
 */
export const Router: React.FC = React.memo(() => {
  return (
    <BrowserRouter basename="/template">
      <Routes>
        <Route path="/" element={<div>it works!</div>} />
      </Routes>
    </BrowserRouter>
  );
});
