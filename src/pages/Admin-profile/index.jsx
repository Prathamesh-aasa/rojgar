import React from "react";
import { Input, Button, Avatar } from "antd";
import {
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  PlusOutlined
} from "@ant-design/icons";

const index = () => {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
      <div className=" w-[50%] m-auto">
        <div className="flex flex-col items-center mb-5">
          <Avatar size={64} icon={<UserOutlined />} />
          <Button type="link" className="mt-2"> 
          <PlusOutlined />
            Add Photo
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex  w-60 h-24 border p-2 rounded-lg">
            <p>
              First Name
              <Input
                placeholder="Admin First Name"
                value="Admin First Name"
                className="flex-1 border-none"
                suffix={<EditOutlined />}
              />
            </p>
          </div>
          <div className="flex  w-60 h-24 border p-2 rounded-lg">
            <p>
              Email Id
              <Input
                placeholder="candidate@gmail.com"
                value="candidate@gmail.com"
                className="flex-1 border-none"
              />
            </p>
          </div>
          <div className="flex  w-60 h-24 border p-2 rounded-lg">
            <p>
              Last Name
              <Input
                value="Admin Last Name"
                className="flex-1 border-none"
                suffix={<EditOutlined />}
              />
            </p>
          </div>
          <div>
            <div className="flex  w-60 h-24 border p-2 rounded-lg">
              <p>
                Password
                <Input value="Password Hidden" className="flex-1 border-none" />
              </p>
            </div>
            <Button type="link" className="text-right">
              Reset Password
            </Button>
          </div>
          <div className="flex  w-60 h-24 border p-2 rounded-lg">
            <p>
              Phone
              <Input value="+919876543210" className="flex-1 border-none" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
