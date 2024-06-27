import React, { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
  Outlet,
} from "react-router-dom";
import * as Pages from "../pages";
import { AuthContext } from "../AuthProvider";
import { Menu, Badge, Dropdown, Space, Button, Spin } from "antd";
import {
  AppstoreOutlined,
  BuildOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  BellOutlined,
  UserOutlined as UserIcon,
} from "@ant-design/icons";
import logo from "../assets/Rozgar Dhaba logo1-1 1.png";
const Navigation = () => {
  const { loginUser, loading, user, logOut } = useContext(AuthContext);
  const NotFound = () => {
    return <h1>404 Not Found</h1>;
  };

  const items = [
    {
      key: "1",
      label: (<a href="/setting">Setting</a>),
    },
    {
      key: "2",
      label: (
        <button
      
          onClick={() =>
            logOut()
              .then(() => {
                console.log("User logged out successfully");
                window.location.replace("/");
              })
              .catch((error) => console.error(error))
          }
        >
          Logout
        </button>
      ),
    },
    
  ];

  const RequireAuth = () => {
    if (!loading) {
      if (!user) return <Navigate to="/" />;
      else return <Outlet />;
    }
  };

  return (
    <>
      {loading && (
        <div className="h-screen w-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      )}
      {user ? (
        <nav className="bg-[#4A59AE] text-white p-2 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <img src={logo} alt="" className="w-[40px]" />
            <span className="text-xl font-bold">Rozgar Dhaba</span>
          </div>

          <div className="space-x-4">
            <a
              href="/dashboard"
              className="text-white hover:text-[#F7B652] px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/application"
              className="text-white hover:text-[#F7B652] px-3 py-2 rounded-md text-sm font-medium"
            >
              Application
            </a>
            <a
              href="/companies"
              className="text-white hover:text-[#F7B652] px-3 py-2 rounded-md text-sm font-medium"
            >
              Company
            </a>
            <a
              href="/services"
              className="text-white hover:text-[#F7B652] px-3 py-2 rounded-md text-sm font-medium"
            >
              Services
            </a>
          </div>
          <div className="flex items-center justify-center gap-3">
            <a className="relative" href="/notifications">
              <BellOutlined className="h-10 w-10 text-white" />
            </a>

            <Dropdown
              menu={{
                items,
              }}
            >
              <div>
                <Space>
                  <UserIcon className="h-6 w-6 text-white" />
                </Space>
              </div>
            </Dropdown>
          </div>
        </nav>
      ) : (
        <nav className="bg-[#4A59AE] text-white p-2 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <img src={logo} alt="" className="w-[40px]" />
            <span className="text-xl font-bold">Rozgar Dhaba</span>
          </div>
        </nav>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Pages.Login />} />
            <Route path="/forgot-password" element={<Pages.ForgetPassword />} />
            <Route path="/verify-otp" element={<Pages.VerifyOTP />} />
            <Route element={<RequireAuth />}>
              <Route
                path="/dashboard-registration"
                element={<Pages.NewRegistration />}
              />
              <Route path="/admin-profile" element={<Pages.AdminProfile />} />
              <Route
                path="/dashboard-payment-report"
                element={<Pages.PaymentReport />}
              />
              <Route
                path="/payment-view-details/:id"
                element={<Pages.PaymentViewDetails />}
              />
              <Route path="/application" element={<Pages.Application />} />
              <Route
                path="/application/sent-application/:id"
                element={<Pages.SentApplication />}
              />
              <Route path="/companies" element={<Pages.Companies />} />
              <Route
                path="/companies/details/:id"
                element={<Pages.Details />}
              />
              <Route path="/services" element={<Pages.Services />} />
              <Route path="/setting" element={<Pages.Setting />} />
              <Route path="/notifications" element={<Pages.Notification />} />
              <Route path="/dashboard" element={<Pages.Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Navigation;
