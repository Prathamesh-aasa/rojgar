import React, { useContext, useEffect, useState } from "react";
import { Input, Button, Avatar, notification } from "antd";
import { EditOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { AuthContext } from "../../AuthProvider";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const Setting = () => {
  const { loginUser, loading, user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const fetchUser = async () => {
    const userRef = doc(db, "Admins", user.uid);
    const userDoc = await getDoc(userRef);
    const data = userDoc.data();
    setFirstName(data.first_name);
    setLastName(data.last_name);
    setEmail(data.email);
    setPhone(data.phone);
    setUserData(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // State variables for editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Function to handle updating user data in Firestore
  const handleUpdate = async () => {
    try {
      const userRef = doc(db, "Admins", user.uid); // Assuming user.id is the document ID in Firestore
      const updates = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
      };

      await updateDoc(userRef, updates);

      notification.success({
        message: "Profile Updated Successfully",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      notification.error({
        message: "Error updating user",
        description: "Error updating user",
      });
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
      <div className=" w-[50%] m-auto">
        <div className="flex flex-col items-center mb-8">
          <Avatar size={64} icon={<UserOutlined />} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex  h-24 border p-2 rounded-lg">
            <p>
              First Name
              <Input
                placeholder="Admin First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 border-none"
                // suffix={<EditOutlined />}
              />
            </p>
          </div>
          <div className="flex h-24 border p-2 rounded-lg">
            <p>
              Email Id
              <Input
                placeholder="candidate@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-none"
              />
            </p>
          </div>
          <div className="flex  h-24 border p-2 rounded-lg">
            <p>
              Last Name
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 border-none"
                // suffix={<EditOutlined />}
              />
            </p>
          </div>
          {/* <div>
            <div className="flex  w-60 h-24 border p-2 rounded-lg">
              <p>
                Password
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 border-none"
                />
              </p>
            </div>
          </div> */}
          <div className="flex h-24 border p-2 rounded-lg">
            <p>
              Phone
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 border-none"
              />
            </p>
          </div>
        </div>
        <Button type="primary" onClick={handleUpdate} className="mt-3">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Setting;
