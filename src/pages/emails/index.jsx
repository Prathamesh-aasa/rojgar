import React, { useState, useEffect } from "react";
import { Form, Input, Button, notification } from "antd";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";

const Emails = () => {
  const [form] = Form.useForm();
  const [emails, setEmails] = useState({
    paymentsUpdate: "",
    adminEmail: "",
    volunteers: "",
    documents: "",
    jobsNotification: "",
    skilling: "",
  });

  useEffect(() => {
    // Fetch the existing document if it exists
    const fetchEmails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Emails"));
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          console.log("🚀 ~ fetchEmails ~ docData:", docData);
          setEmails(docData);
          form.setFieldsValue(docData); // Pre-fill form fields with existing values
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
        notification.error({
          message: "Error",
          description: "An error occurred while fetching emails.",
        });
      }
    };

    fetchEmails();
  }, []);

  const onFinish = async (values) => {
    try {
      // Update existing document or add new document
      const emailRef = collection(db, "Emails");
      const querySnapshot = await getDocs(emailRef);

      if (!querySnapshot.empty) {
        // Update existing document
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(db, "Emails", docId);
        await updateDoc(docRef, values);
        notification.success({
          message: "Success",
          description: "Emails updated successfully!",
        });
      } else {
        // Add new document
        await addDoc(emailRef, values);
        notification.success({
          message: "Success",
          description: "Emails saved successfully!",
        });
      }

      setEmails(values); // Update emails state
    } catch (error) {
      console.error("Error saving emails:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while saving emails.",
      });
    }
  };

  return (
    <div className="p-5 shadow m-5 rounded-md">
      <h1 className="font-semibold text-xl text-blue-600 mb-5">Emails</h1>
      <Form
        form={form}
        initialValues={emails}
        onFinish={onFinish}
        layout="vertical"
        className="grid grid-cols-1 gap-5"
      >
        <Form.Item
          label="Payments Update"
          name="paymentsUpdate"
          initialValue={emails.paymentsUpdate}
          rules={[
            {
              type: "email",
              whitespace: true,
              required: true,
              message: "Please input the email for Payments Update!",
            },
          ]}
        >
          <Input placeholder="Enter email for Payments Update" />
        </Form.Item>
        <Form.Item
          label="Admin Email"
          name="adminEmail"
          initialValue={emails.adminEmail}
          rules={[
            {
              type: "email",
              whitespace: true,
              required: true,
              message: "Please input the Admin email!",
            },
          ]}
        >
          <Input placeholder="Enter Admin email" />
        </Form.Item>
        <Form.Item
          label="Volunteers"
          name="volunteers"
          initialValue={emails.volunteers}
          rules={[
            {
              type: "email",
              whitespace: true,
              required: true,
              message: "Please input the email for Volunteers!",
            },
          ]}
        >
          <Input placeholder="Enter email for Volunteers" />
        </Form.Item>
        <Form.Item
          label="Documents"
          name="documents"
          initialValue={emails.documents}
          rules={[
            {
              type: "email",
              whitespace: true,
              required: true,
              message: "Please input the email for Documents / Scheme!",
            },
          ]}
        >
          <Input placeholder="Enter email for Documents / Scheme" />
        </Form.Item>
        <Form.Item
          label="Jobs Notification"
          name="jobsNotification"
          initialValue={emails.jobsNotification}
          rules={[
            {
              type: "email",
              whitespace: true,
              required: true,
              message: "Please input the email for Jobs Notification!",
            },
          ]}
        >
          <Input placeholder="Enter email for Jobs Notification" />
        </Form.Item>
        <Form.Item
          label="Skilling"
          name="skilling"
          initialValue={emails.skilling}
          rules={[
            {
              type: "email",
              whitespace: true,
              required: true,
              message: "Please input the email for Skilling!",
            },
          ]}
        >
          <Input placeholder="Enter email for Skilling" />
        </Form.Item>
        <Form.Item
          label="Welfare "
          name="welfare"
          initialValue={emails.welfare}
          rules={[
            {
              type: "email",
              whitespace: true,
              required: true,
              message: "Please input the email for Skilling!",
            },
          ]}
        >
          <Input placeholder="Enter email for Skilling" />
        </Form.Item>
        <Form.Item
          label="Company"
          name="company"
          initialValue={emails.company}
          rules={[
            {
              type: "email",
              whitespace: true,
              required: true,
              message: "Please input the email for Company!",
            },
          ]}
        >
          <Input placeholder="Enter email for Company" />
        </Form.Item>
        <div>
          <Button type="primary" htmlType="submit">
            Update Emails
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Emails;
