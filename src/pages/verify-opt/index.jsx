import React from "react";
import { Button, Flex, Input, Form } from "antd";
const index = () => {
  return (
    <Flex
      gap="middle"
      align="flex-start"
      className="flex items-center mt-20"
      vertical
    >
      <Form name="" className="flex flex-col ">
        <h1 className="font-semibold text-2xl text-[#013D9D]">Enter OTP</h1>
        <p className="text-sm mb-5">Please enter five digits otp number that was sent to your registered email</p>
        <Form.Item className="flex  justify-center"
          name="otp"
          rules={[
            {
              required: true,
              message: "OTP is required",
            },
            {
              whitespace: true,
            },
          ]}
        >
          <Input.OTP/>
        </Form.Item>
        <Button type="primary" className="mt-5 bg-[#013D9D]" htmlType="submit">
          Verify OTP
        </Button>
      </Form>
    </Flex>
  );
};

export default index;
