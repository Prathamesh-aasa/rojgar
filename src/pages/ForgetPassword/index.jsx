import React from "react";
import { Form, Input, Button, } from "antd";
import { Mail } from "lucide-react";
import img from "../../assets/OBJECTS.png";

const ForgotPassword = () => {
  return (
    <div className=" flex items-center justify-evenly mt-10">
      <div className="">
        <img src={img} alt="" />
      </div>

      <Form
        name="login-form"
        className="w-[35%]"
        layout="vertical"
        autoComplete="on"
      >
        <h1 className="text-[#013D9D] text-4xl font-bold   mb-5">
        Forget Password
        </h1>
        <p className="mb-5">Please enter your registered email, we will send you a verification code </p>
        <Form.Item label="Email Id" name="email">
          <Input
            placeholder="Enter registered email"
            prefix={<Mail strokeWidth={"1"} height={16} />}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Send OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
