import React, { useContext, useEffect, useState } from "react";
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
import { Bell, User } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
const Navigation = () => {
  const { loginUser, loading, user, logOut } = useContext(AuthContext);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0); // State for unread notifications count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Notification_Admin"));
        const notificationData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      
          // Calculate unread notifications count
          const unreadCount = notificationData?.filter(notification => !notification?.read)?.length;
          console.log("🚀 ~ fetchNotifications ~ unreadCount:", unreadCount)
          setUnreadNotificationsCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);


  const NotFound = () => {
    return <h1>404 Not Found</h1>;
  };

  const items = [
    {
      key: "1",
      label: <a href="/user">Profile</a>,
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
        <div className="h-screen w-screen flex items-center justify-center absolute top-0 left-0">
          <Spin size="large" />
        </div>
      )}
      {user ? (
        <nav className="bg-[#4A59AE] text-white p-3 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <img src={logo} alt="" className="w-[40px]" />
            <span className="text-xl font-bold">Rozgar Dhaba</span>
          </div>

          <div className="space-x-4">
            <a
              href="/dashboard"
              className="text-white hover:text-[#F7B652] px-3 py-2 rounded-md  font-medium text-lg"
            >
              Dashboard
            </a>
            <a
              href="/application"
              className="text-white hover:text-[#F7B652] px-3 py-2 rounded-md  font-medium text-lg"
            >
              Application
            </a>
            <a
              href="/companies"
              className="text-white hover:text-[#F7B652] px-3 py-2 rounded-md font-medium text-lg"
            >
              Company
            </a>
            <a
              href="/services"
              className="text-white hover:text-[#F7B652] px-3 py-2 rounded-md font-medium text-lg"
            >
              Services
            </a>
            <a
              href="/settings"
              className="text-white hover:text-[#F7B652] px-3 py-2 rounded-md font-medium text-lg"
            >
              Settings
            </a>
          </div>
          <div className="flex items-center justify-center gap-5">
            <a className="" href="/notifications">
              <Space>
                <Bell className=" text-white" />
                <p>{unreadNotificationsCount}</p>
              </Space>
            </a>

            <Dropdown
              menu={{
                items,
              }}
            >
              <div>
                <Space>
                  <User className="text-white" />
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
              <Route path="/user" element={<Pages.Setting />} />
              <Route path="/settings" element={<Pages.EmailSetting />} />
              <Route path="/notifications" element={<Pages.Notification />} />
              <Route path="/dashboard" element={<Pages.Dashboard />} />
              <Route
                path="/applications/company/:id"
                element={<Pages.CompaniesApplications />}
              />
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
