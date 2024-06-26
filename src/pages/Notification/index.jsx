import React, { useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { Modal, Button, Input, Tabs, Form } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import TextArea from "antd/es/input/TextArea";

const index = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const notifications = [
    {
      date: "Today",
      items: [
        {
          type: "User",
          name: "User Name",
          action: "has registered in Jobseeker",
          time: "12:10 pm",
          id: "ABCD1234",
        },
        {
          type: "User",
          name: "User Name",
          action: "has paid registration fee of ₹500",
          time: "12:10 pm",
          id: "ABCD1234",
        },
      ],
    },
    {
      date: "Yesterday",
      items: [
        {
          type: "Company",
          name: "Company Name",
          action: "has paid subscription fee of ₹3,500",
          time: "12:10 pm",
          id: "ABCD1234",
        },
        {
          type: "Company",
          name: "Company Name",
          action: "has posted a job",
          time: "12:10 pm",
          id: "ABCD1234",
        },
        {
          type: "User",
          name: "User Name",
          action: "has registered for volunteer",
          time: "12:10 pm",
          id: "ABCD1234",
        },
      ],
    },
    {
      date: "12 Jan 24",
      items: [
        {
          type: "User",
          name: "User Name",
          action:
            "has paid course fee of ₹500 in Environment course under Gyan Shala program",
          time: "12:10 pm",
          id: "ABCD1234",
        },
      ],
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log("Notification message:", notificationMessage);
    setIsModalVisible(false);
    setNotificationMessage("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (e) => {
    setNotificationMessage(e.target.value);
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#013D9D]">
          Notifications (4)
        </h2>
        <button
          className="bg-[#013D9D] text-white px-4 py-2 rounded flex items-center gap-2"
          onClick={showModal}
        >
          <SendOutlined />
          Send Notification
        </button>
      </div>
      <div className="w-[70%] mx-auto p-4">
        {notifications.map((section, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg text-[#013D9D] mb-2">{section.date}</h3>
            {section.items.map((item, id) => (
              <div
                key={id}
                className="flex justify-between items-center bg-white p-4 border rounded mb-2"
              >
                <div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex justify-center items-center mr-3">
                      <span className="text-gray-800">{item.type[0]}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[#013D9D] font-semibold flex  gap-2">
                        {item.name}
                        <div className="text-gray-600">{item.action}</div>
                      </div>
                      <div>
                        <p className="text-[#013D9D] text-sm">ABCD12345</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[#013D9D] text-sm">{item.time}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width="100%"
        className="text-[#013D9D]"
      >
        <div className="">
          <h1 className="text-[#013D9D] text-2xl font-semibold">Send Notification</h1>
          <Tabs centered>
            <TabPane tab="Notification Message" key="1" className="p-4">
              <div className="w-[50%] m-auto">
                <Form name="validateOnly" layout="vertical">
                  <Form.Item
                    name={["user", "introduction"]}
                    label="Type Message"
                  >
                    <Input.TextArea placeholder="Message" />
                  </Form.Item>
                  <div className="flex justify-end ">
                    <Button className="bg-[#013D9D] text-white">Send</Button>
                  </div>
                </Form>
              </div>
            </TabPane>
            <TabPane tab="Service Message" key="2" className="p-4">
              <h2 className="text-2xl font-semibold mb-6 text-[#013D9D]">
                Send Notification
              </h2>
              <div className=" flex items-center justify-center">
                <div className="bg-white p-8 w-full max-w-2xl">
                  <Form>
                    <div className="mb-4 flex items-center">
                      <p className=" text-gray-700 mb-2 flex items-center">
                        Select Service
                      </p>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <Input type="radio" name="service" className="mr-2" />
                          Jobseeker
                        </label>
                        <label className="flex items-center">
                          <Input type="radio" name="service" className="mr-2" />{" "}
                          Skilling
                        </label>
                        <label className="flex items-center">
                          <Input type="radio" name="service" className="mr-2" />{" "}
                          Volunteer
                        </label>
                        <label className="flex items-center">
                          <Input type="radio" name="service" className="mr-2" />{" "}
                          Document
                        </label>
                        <label className="flex items-center">
                          <Input type="radio" name="service" className="mr-2" />{" "}
                          Welfare
                        </label>
                        <label className="flex items-center">
                          <Input type="radio" name="service" className="mr-2" />{" "}
                          Company
                        </label>
                      </div>
                    </div>
                    <div className="mb-4">
                      <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                          {
                            required: true,
                            message: "Please input your username!",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          label="Select User"
                          placeholder="Search by name or ID"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </Form.Item>
                    </div>
                    <div className="mb-4">
                      <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                          {
                            required: true,
                            message: "Please input your username!",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Message"
                          className="w-full h-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        ></TextArea>
                      </Form.Item>
                    </div>
                    <div className="flex  justify-end">
                      <Button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Send
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};

export default index;
