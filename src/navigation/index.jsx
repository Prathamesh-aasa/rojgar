/* eslint-disable react/prop-types */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Pages from "../pages";

const Navigation = () => {
  const NotFound = () => {
    return <h1>404 Not Found</h1>;
  };

  const Forbidden = () => {
    return <h1>403 Forbidden. You don t have access to this page.</h1>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Pages.Login />} />
          <Route path="/forgot-password" element={<Pages.ForgetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
