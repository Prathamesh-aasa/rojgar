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
import logo from "./assets/Rozgar Dhaba logo1-1 1.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AuthProvider, { AuthContext } from "./AuthProvider";
import Header from "./components/Header";
function App() {

  return (
    <div className="App">
     
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </div>
  );
}

export default App;
