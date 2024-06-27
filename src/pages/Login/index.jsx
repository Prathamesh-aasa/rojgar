import React from "react";
import { Form, Input, Button, Flex, Checkbox, notification } from "antd";
import { Mail } from "lucide-react";
import img from "../../assets/OBJECTS.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { redirect, useRoutes } from "react-router-dom";

const Login = () => {
  const auth = getAuth();

  const handelFinish = async (values) => {
    console.log(values);
    signInWithEmailAndPassword(auth, values?.email, values?.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("🚀 ~ .then ~ user:", user);
        notification.success({
          message: "Authentication",
          description: `Welcome ${values?.email}`,
        });
        redirect('/')
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        notification.error({
          message: errorCode,
          description: errorMessage,
        });
      });
  };

  return (
    <div className="flex items-center justify-evenly mt-10">
      <div className="">
        <img src={img} alt="" />
      </div>

      <Form
        name="login-form"
        className="w-[35%]"
        layout="vertical"
        autoComplete="on"
        onFinish={handelFinish}
      >
        <h1 className="text-[#013D9D] text-4xl font-bold   mb-5">
          Admin Log In
        </h1>
        <Form.Item label="Email Id" name="email">
          <Input
            placeholder="Enter registered email"
            prefix={<Mail strokeWidth={"1"} height={16} />}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password placeholder="Enter Your Password" />
        </Form.Item>

        <div className="flex justify-between mb-5">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
