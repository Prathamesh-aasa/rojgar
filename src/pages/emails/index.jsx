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
  const [emails, setEmails] = useState({});
  const [docId, setDocId] = useState(null);

  useEffect(() => {
    // Fetch the existing document if it exists
    const fetchEmails = async () => {
      const querySnapshot = await getDocs(collection(db, "Emails"));
      querySnapshot.forEach((doc) => {
        setEmails(doc.data());
        setDocId(doc.id);
      });
    };

    fetchEmails();
  }, []);

  const onFinish = async (values) => {
    try {
      if (docId) {
        // Update existing document
        const emailDocRef = doc(db, "Emails", docId);
        await updateDoc(emailDocRef, values);
        notification.success({
          message: "Success",
          description: "Emails updated successfully!",
        });
      } else {
        // Add new document
        const docRef = await addDoc(collection(db, "Emails"), values);
        setDocId(docRef.id);
        notification.success({
          message: "Success",
          description: "Emails saved successfully!",
        });
      }
      setEmails(values);
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
        className="grid grid-cols-3 gap-5"
      >
        <Form.Item
          label="Job Seeker"
          name="jobPost"
          rules={[
            { required: true, message: "Please input the email for Job Post!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Skilling"
          name="skilling"
          rules={[
            { required: true, message: "Please input the email for Skilling!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Volunteer"
          name="volunteer"
          rules={[
            {
              required: true,
              message: "Please input the email for Volunteer!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Document"
          name="document"
          rules={[
            { required: true, message: "Please input the email for Document!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Welfare Scheme"
          name="welfareScheme"
          rules={[
            {
              required: true,
              message: "Please input the email for Welfare Scheme!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Subscription Plan"
          name="subscriptionPlan"
          rules={[
            {
              required: true,
              message: "Please input the email for Subscription Plan!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <div>
          <Button type="primary" htmlType="submit" className="bg-blue-800 font-semibold">
            Update Emails
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Emails;
