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
          <Route path="/verify-otp" element={<Pages.VerifyOTP/>}/>
          <Route path="/dashboard-registration" element={<Pages.NewRegistration/>}/>
          <Route path="/admin-profile" element={<Pages.AdminProfile/>}/>
          <Route path="/dashboard-payment-report" element={<Pages.PaymentReport/>}/>
          <Route path="/payment-view-details/:id" element={<Pages.PaymentViewDetails/>}/>
          <Route path="/application" element={<Pages.Application/>}/>
          <Route path="/application/sent-application/:id" element={<Pages.SentApplication/>}/>
          <Route path="/companies" element={<Pages.Companies/>}/>
          <Route path="/companies/details/:id" element={<Pages.Details/>}/>
          <Route path="/services" element={<Pages.Services/>}/>
          <Route path="/setting" element={<Pages.Setting/>}/>
          <Route path="/notification" element={<Pages.Notification/>}/>
          <Route path="/dashboard" element={<Pages.Dashboard/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;