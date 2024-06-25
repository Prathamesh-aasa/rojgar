import { Button } from "antd";
import Navigation from "./navigation";
import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  BuildOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  BellOutlined,
  UserOutlined as UserIcon,
} from "@ant-design/icons";
import logo from './assets/Rozgar Dhaba logo1-1 1.png'

function App() {
  return (
    <div className="App">
      <nav className="bg-[#4A59AE] text-white p-2 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <img src={logo} alt="" className="w-[40px]"/>
          <span className="text-xl font-bold">Rozgar Dhaba</span>
        </div>

        <div className="space-x-4">
          <a
            href="#"
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
        <div className="flex items-center">
          <button className="relative">
            <BellOutlined className="h-10 w-10 text-white" />
          </button>

          <UserIcon className="h-6 w-6 text-white" />
        </div>
      </nav>
      <Navigation />
    </div>
  );
}

export default App;
