import React, { useState, useEffect } from "react";
import { SendOutlined } from "@ant-design/icons";
import {
  Modal,
  Button,
  Input,
  Tabs,
  Form,
  Avatar,
  Radio,
  Select,
  notification,
} from "antd";
import { db } from "../../../firebase"; // Adjust the path to your Firebase config
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";
const { TextArea } = Input;
const { TabPane } = Tabs;

const Notifications = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [notificationForm] = Form.useForm();
  const [notificationMessageForm] = Form.useForm();

  const getUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const userData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (user) =>
            user.phone_number !== null && user.phone_number !== undefined
        );

      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "Notification_Admin")
        );
        const notificationData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    getUsers();
  }, []);

  const sendNotificationToAll = async (values) => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users"));

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const note = {
        text: values.message,
        sent_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      };

      const promises = users.map(async (user) => {
        const userRef = doc(db, "Users", user.id);
        const notificationsRef = collection(userRef, "Notifications");
        await addDoc(notificationsRef, {
          ...note,
          image_link: null,
        });
      });

      await Promise.all(promises);
      notificationForm.resetFields();
      setIsModalVisible(false);
      notification.success({
        message: "Notification sent successfully",
        description: "Message Has Been sent to all users",
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      notification.error({
        message: "Error sending notifications",
        description:
          "Error sending notifications to users , Please try again later.",
      });
    }
  };
  const handelNotificationSentToSelected = async (values) => {
    console.log("🚀 ~ handelNotificationSentToSelected ~ values:", values);

    const { service_type, user, message } = values;

    try {
      // Prepare the notification object
      const note = {
        service_type: service_type,
        text: message,
        sent_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      };

      // Send notification to each selected user
      const promises = user?.map(async (userId) => {
        const userRef = doc(db, "Users", userId);
        const notificationsRef = collection(userRef, "Notifications");
        await addDoc(notificationsRef, {
          ...note,
          image_link: null, // Assuming you want to set image_link to null
        });
      });

      await Promise.all(promises);
      setIsModalVisible(false);
      notificationMessageForm.resetFields();
      notification.success({
        message: "Notification sent successfully",
        description: "Notifications sent successfully to selected users.",
      });
      console.log("Notifications sent successfully to selected users.");
    } catch (error) {
      console.error("Error sending notifications:", error);
      notification.error({
        message: "Error sending notifications",
        description: "Error sending notifications to selected users.",
      });
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#013D9D]">
          Notifications ({notifications.length})
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
        {notifications?.map((section, index) => (
          <div
            key={index}
            className="mb-4 shadow-md shadow-primary/10 p-5 rounded-md flex items-center gap-5"
          >
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              size={"large"}
              icon={<UserOutlined />}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg text-[#013D9D] mb-2 font-semibold">
                  {section?.bold_text}
                </h3>
                <p>{section?.text}</p>
              </div>
              <p>User ID : {section?.user_id}</p>
            </div>
          </div>
        ))}
      </div>
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        className="text-[#013D9D]"
      >
        <div className="">
          <h1 className="text-[#013D9D] text-2xl font-semibold">
            Send Notification
          </h1>
          <Tabs centered>
            <TabPane tab="Notification Message" key="1" className="p-4">
              <div className="w-[80%] m-auto">
                <Form
                  layout="vertical"
                  form={notificationForm}
                  onFinish={sendNotificationToAll}
                >
                  <Form.Item
                    label="Message"
                    name="message"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter a message",
                      },
                    ]}
                  >
                    <TextArea
                      placeholder="Message"
                      className="w-full h-32 px-4 py-2 border rounded-lg focus:outline-none "
                    ></TextArea>
                  </Form.Item>
                  <div className="flex justify-end ">
                    <Button
                      className="bg-[#013D9D] text-white"
                      htmlType="submit"
                    >
                      Send
                    </Button>
                  </div>
                </Form>
              </div>
            </TabPane>
            <TabPane tab="Service Message" key="2" className="p-4">
              <div className=" flex items-center justify-center">
                <div className="bg-white p-8 w-full max-w-2xl">
                  <Form
                    form={notificationMessageForm}
                    onFinish={handelNotificationSentToSelected}
                    layout="vertical"
                  >
                    <div className="mb-4">
                      <Form.Item
                        name={"service_type"}
                        label="Select Service"
                        rules={[
                          {
                            required: true,
                            message: "Please select service!",
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Radio value="jobseeker">Jobseeker</Radio>
                          <Radio value="skilling">Skilling</Radio>
                          <Radio value="volunteer">Volunteer</Radio>
                          <Radio value="document">Document</Radio>
                          <Radio value="welfare">Welfare</Radio>
                          <Radio value="company">Company</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    <div className="mb-4">
                      <Form.Item
                        name={"user"}
                        rules={[
                          {
                            required: true,
                            message: "Please select user!",
                          },
                        ]}
                        label="User"
                      >
                        <Select mode="multiple">
                          {users?.map((user, index) => (
                            <Option key={index} value={user.id}>
                              {user.phone_number}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="mb-4">
                      <Form.Item
                        label="Message"
                        name="message"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please enter a message",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Message"
                          className="w-full h-32 px-4 py-2 border rounded-lg focus:outline-none "
                        ></TextArea>
                      </Form.Item>
                    </div>
                    <div className="flex  justify-end">
                      <Button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        htmlType="submit"
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

export default Notifications;
