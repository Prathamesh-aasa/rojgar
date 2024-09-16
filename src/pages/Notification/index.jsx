import React, { useState, useEffect } from "react";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
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
  collection,
  doc,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import moment from "moment";
const { TextArea } = Input;
const { TabPane } = Tabs;

const Notifications = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [notificationForm] = Form.useForm();
  const [notificationMessageForm] = Form.useForm();
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [selectedUserType, setSelectedUserType] = useState("Job Seekers");
  const [documentType, setDocumentType] = useState("");

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
        // Calculate unread notifications count
        const unreadCount = notificationData?.filter(
          (notification) => !notification?.read
        )?.length;
        setUnreadNotificationsCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    getUsers();
  }, []);

  const getUsers = async (e) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, e || selectedUserType)
      );
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(">>> ~ userData ~ userData:", userData)

      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const sendNotificationToAll = async (values) => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users"));

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const note = {
        text: values.message,
        sent_at: moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      };

      const promises = users.map(async (user) => {
        const userRef = doc(db, "Users", user.id);
        const notificationsRef = collection(userRef, "Notifications");

        const docRef = await addDoc(notificationsRef, {
          user_id: user.id,
          ...note,
          image_link: null,
        });

        // Update the document with its ID
        await updateDoc(docRef, {
          id: docRef.id,
        });
      });

      await Promise.all(promises);

      notificationForm.resetFields();
      setIsModalVisible(false);
      notification.success({
        message: "Notification sent successfully",
        description: "Message has been sent to all users.",
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      notification.error({
        message: "Error sending notifications",
        description:
          "Error sending notifications to users. Please try again later.",
      });
    }
  };

  const handelNotificationSentToSelected = async (values) => {
    const { service_type, user, message } = values;

    try {
      const note = {
        service_type: selectedUserType,
        text: message,
        sent_at: moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      };

      // const promises = user?.map(async (userId) => {
      //   const userRef = doc(db, "Users", userId);
      //   const notificationsRef = collection(userRef, "Notifications");
      //   const docRef = await addDoc(notificationsRef, {
      //     user_id: userId,
      //     ...note,
      //     image_link: null, // Assuming you want to set image_link to null
      //   });
      //   // Update the document with its ID
      //   await updateDoc(docRef, {
      //     id: docRef.id,
      //   });
      // });

      const promises = user?.map(async (selectedUser,index) => {
        let collectionName = "Users";
        let idField = "user_id";
        let userId = selectedUser.value;

        if (
          selectedUserType == "Document" &&
          documentType[index]?.document_type == "Company Document"
        ) {
          collectionName = "RegisterAsCompany";
          idField = "company_id";
        }
        
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',selectedUserType,'sssssssssssss',documentType,collectionName);
        const userRef = doc(db, collectionName, userId);
        const notificationsRef = collection(userRef, "Notifications");
        const docRef = await addDoc(notificationsRef, {
          [idField]: userId,
          ...note,
          image_link: null,
        });


        // Update the document with its ID
        await updateDoc(docRef, {
          id: docRef.id,
        });
      });
      await Promise.all(promises);

      setIsModalVisible(false);
      notificationMessageForm.resetFields();
      notification.success({
        message: "Notification sent successfully",
        description: "Notifications sent successfully to selected users.",
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      notification.error({
        message: "Error sending notifications",
        description: "Error sending notifications to selected users.",
      });
    }
  };
  const handelNotificationSentToSelectedForCompany = async (values) => {
    const { user, message } = values;

    try {
      const note = {
        text: message,
        sent_at: moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      };

      const promises = user?.map(async (userId) => {
        const userRef = doc(db, "RegisterAsCompany", userId);
        const notificationsRef = collection(userRef, "Notifications");
        const docRef = await addDoc(notificationsRef, {
          company_id: userId,
          ...note,
          image_link: null, // Assuming you want to set image_link to null
        });
        // Update the document with its ID
        await updateDoc(docRef, {
          id: docRef.id,
        });
      });

      await Promise.all(promises);

      setIsModalVisible(false);
      notificationMessageForm.resetFields();
      notification.success({
        message: "Notification sent successfully",
        description: "Notifications sent successfully to selected users.",
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      notification.error({
        message: "Error sending notifications",
        description: "Error sending notifications to selected users.",
      });
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "Notification_Admin", notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });
      // Update local state to reflect the change (optional)
      const updatedNotifications = notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      notification.error({
        message: "Error marking notification as read",
        description: "Please try again later.",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      // const batch = db.batch();
      const notificationRef = collection(db, "Notification_Admin");

      // Get all notifications
      const querySnapshot = await getDocs(notificationRef);

      // Update each notification to mark as read
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { read: true });
      });

      // Commit the batch update
      // await batch.commit();

      // Update local state to reflect the change (optional)
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      setNotifications(updatedNotifications);

      notification.success({
        message: "All notifications marked as read",
        description: "All notifications have been marked as read.",
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      notification.error({
        message: "Error marking notifications as read",
        description: "Please try again later.",
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
        <div className="flex items-center gap-4">
          <button
            className="bg-[#013D9D] text-white px-4 py-2 rounded flex items-center gap-2"
            onClick={showModal}
          >
            <SendOutlined />
            Send Notification
          </button>
          <button
            className="bg-[#013D9D] text-white px-4 py-2 rounded flex items-center gap-2"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </button>
        </div>
      </div>
      <div className="w-[70%] mx-auto p-4">
        {notifications?.map((notification, index) => (
          <div
            key={index}
            className={`mb-4 shadow-md shadow-primary/10 p-5 rounded-md flex items-center gap-5 ${
              notification.read ? "bg-gray-200" : ""
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              size={"large"}
              icon={<UserOutlined />}
            />
            <div className="relative">
              <div className="flex items-center gap-2">
                <h3 className="text-lg text-[#013D9D] mb-2 font-semibold">
                  {notification?.bold_text}
                </h3>
                <p>{notification?.text}</p>
              </div>
              <p>User ID : {notification?.user_id}</p>
              <p className="text-[#013D9D] text-sm font-semibold">{moment(notification?.sent_at)?.format('DD-MM-YYYY hh:mm A')}</p>
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
                    onFinish={(e) =>
                      selectedUserType == "RegisterAsCompany"
                        ? handelNotificationSentToSelectedForCompany(e)
                        : handelNotificationSentToSelected(e)
                    }
                    layout="vertical"
                  >
                    <div className="mb-4">
                      <Form.Item name={"service_type"} label="Select Service">
                        <Radio.Group
                          defaultValue={selectedUserType}
                          onChange={(e) => {
                            setSelectedUserType(e.target.value);
                            getUsers(e.target.value);
                            notificationMessageForm.resetFields();
                          }}
                        >
                          <Radio value="Job Seekers">JobSeeker</Radio>
                          <Radio value="Skilling">Skilling</Radio>
                          <Radio value="Volunteer">Volunteer</Radio>
                          <Radio value="Document">Document</Radio>
                          <Radio value="Welfare">Welfare</Radio>
                          <Radio value="RegisterAsCompany">Company</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    <div className="mb-4">
                      {selectedUserType != "RegisterAsCompany" && (
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
                          <Select
                            mode="multiple"
                            labelInValue
                            onChange={(selectedOptions) => {
                              if (selectedUserType === "Document") {
                                const selectedValues = selectedOptions.map(option => {
                                  const user = users.find(u => u.user_id === option.value);
                                  return {
                                    user_id: option.value,
                                    document_type: user ? user.document_type : null,
                                  };
                                });
                                console.log('Selected Document Types:', selectedValues);
                                setDocumentType(selectedValues);
                              }
                            }}
                          >
                            {users
                              ?.filter(
                                (user, index, self) =>
                                  index ===
                                  self.findIndex(
                                    (t) => t.user_id === user.user_id
                                  )
                              )
                              .map((user) => (
                                <Select.Option
                                  key={user.user_id}
                                  value={user.user_id}
                                >
                                  {user.full_name}
                                </Select.Option>
                              ))}
                          </Select>
                        </Form.Item>
                      )}
                      {selectedUserType == "RegisterAsCompany" && (
                        <Form.Item
                          name={"user"}
                          rules={[
                            {
                              required: true,
                              message: "Please select user!",
                            },
                          ]}
                          label="Company"
                        >
                          <Select
                            mode="multiple"
                            onSelect={(e) => console.log(e)}
                            options={users
                              .filter(
                                (user, index, self) =>
                                  index ===
                                  self.findIndex(
                                    (t) => t.id === user.id
                                  )
                              )
                              .map((user) => ({
                                value: user.id,
                                label: user.company_name,
                              }))}
                          />
                        </Form.Item>
                      )}
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
