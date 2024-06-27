import React, { useState } from "react";
import { Table, Button, Menu, Tabs, Select, Input, Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import {
  FilterOutlined,
  DownloadOutlined,
  SendOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const index = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const showModal = (status) => {
    setSelectedStatus(status);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Company ID",
      dataIndex: "CompanyId",
      key: "CompanyId",
    },
    {
      title: "Job poster Email Id",
      dataIndex: "JobposterEmail",
      key: "JobposterEmail",
    },
    {
      title: "Job poster Ph No.",
      dataIndex: "JobposterPhNo",
      key: "JobposterPhNo",
    },
    {
      title: "Date of Registration",
      dataIndex: "dateRegistration",
      key: "dateRegistration",
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",
    },
    {
      title: "No of Job post",
      dataIndex: "NoofJobpost",
      key: "NoofJobpos",
    },
    {
      title: "Applied Post",
      key: "appliedPost",
      render: () => (
        <Button
          onClick={() => showModal("Status")}
          className=" w-full border-none"
        >
          Technician <DownOutlined />
        </Button>
      ),
    },
  ];
  const data = [
    {
      key: index,
      name: "Company Name",
      CompanyId: "ABCD1234",
      JobposterEmail: "candidate@gmail.com",
      JobposterPhNo: "+91 9876543210",
      dateRegistration: "31 March 2023",
      Address: "Pune",
      NoofJobpost: "Technician",
    },
    {
      key: index,
      name: "Company Name",
      CompanyId: "ABCD1234",
      JobposterEmail: "candidate@gmail.com",
      JobposterPhNo: "+91 9876543210",
      dateRegistration: "31 March 2023",
      Address: "Pune",
      NoofJobpost: "Technician",
    },
  ];

  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const showModal2 = () => {
    setIsModalVisible2(true);
  };

  const handleOk2 = () => {
    setIsModalVisible2(false);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };
  return (
    <div className="p-6">
      <div>
        <p className="text-base mb-5">
          Dashboard <span className="text-[#F7B652]">&gt;</span> New
          Registration List
        </p>
      </div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-[#013D9D]">Companies</h1>
        <div className="flex gap-4">
          <Button type="primary">
            <DownloadOutlined /> Download
          </Button>
          <Modal
            visible={isModalVisible2}
            onOk={handleOk2}
            onCancel={handleCancel2}
            width="50%"
            footer={null}
          >
            <div>
              <p className="text-[#013D9D] text-2xl font-semibold text-center mb-5">
                You are sending 100 applications to Tata motors
              </p>
              <div className="text-center mb-5">
                <p>
                  All details except Additional details of each candidate are
                  sent to
                </p>
                <p>
                  Tata Motors in excel file, once you send you can not undo
                  file.
                </p>
              </div>
              <div className="border flex items-center justify-center w-52 h-14  rounded-lg  mx-auto bg-[#EEF2F9]">
                <Link className="border-none flex  gap-3 bg-[#EEF2F9]">
                  <FileOutlined />
                  <div className="flex flex-col text-sm">
                    Apllication (Tecnician).xls
                    <span>Upload 12-02-24</span>
                  </div>
                </Link>
              </div>
              <div className="flex justify-end gap-2">
                <Button>Cancel</Button>
                <Button className="bg-[#013D9D] text-white">Send</Button>
              </div>
            </div>
          </Modal>
          <Button type="primary" icon={<SendOutlined />} onClick={showModal2}>
            Send Notification
          </Button>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div></div>
        <div className="flex items-center gap-5">
          <Input placeholder="Search" className="w-full" />
          <Select placeholder="Select payment method" style={{ width: 200 }}>
            <Option value="">All</Option>
            <Option value="Online Payment">Online Payment</Option>
            <Option value="Manual Payment">Manual Payment</Option>
          </Select>
          <div className="flex gap-2">
            <Button icon={<FilterOutlined />}>Filters</Button>
          </div>
        </div>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} />
      <Modal
        title="Details"
        open={isModalVisible}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ top: 0 }}
        width="100%"
        className="h-fit"
      >
        <div className="flex justify-evenly">
          <div>
            <h1 className="text-[#013D9D] font-medium text-xl mb-5">
              Company’s Details
            </h1>
            <div className="grid grid-cols-3">
              <div className="flex flex-col mb-2 mr-2 gap-1">
                <p>Company ID</p>
                <span>ABCD1234</span>
              </div>
              <div className="flex flex-col mb-2 mr-2 gap-1">
                <p>Company Name</p>
                <span>USER NAME</span>
              </div>
              <div className="flex flex-col mb-2 mr-2 gap-1">
                <p>GSTIN No.</p>
                <span>32345545668</span>
              </div>
              <div className="flex flex-col mb-5 gap-1">
                <p>Email Id</p>
                <span>ABCD@gmail.com</span>
              </div>
            </div>
            <h1 className="text-[#013D9D] font-medium text-xl mb-5">
              Address Details
            </h1>
            <div className="grid grid-cols-3">
              <div className="flex flex-col gap-2 ml-2 p-1 mb-2">
                <p>PIN </p>
                <span>500049</span>
              </div>
              <div className="flex flex-col gap-2 ml-2 p-1">
                <p>State</p>
                <span>TELENGANA</span>
              </div>
              <div className="flex flex-col gap-2 ml-2 p-1">
                <p>District</p>
                <span>9876543210</span>
              </div>
              <div className="flex flex-col gap-2 ml-2 p-1">
                <p>City/village</p>
                <span>Hyderabad</span>
              </div>
              <div className="flex flex-col gap-2 mb-4 ml-2 p-1">
                <p>Address</p>
                <span>10/30 h</span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-[#013D9D] font-medium text-xl mb-5">
              Job Poster Details
            </h1>
            <div className="grid grid-cols-3">
              <div className="flex flex-col gap-2 mr-2 ml-2 p-1">
                <p>Full Name</p>
                <span>JOB POSTER NAME</span>
              </div>
              <div className="flex flex-col gap-2 mr-2 ml-2 p-1">
                <p>Email Id</p>
                <span>candidate@gmail.com</span>
              </div>
              <div className="flex flex-col gap-2 mr-2 ml-2 p-1">
                <p>Phone Number</p>
                <span>9876543210</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button className="text-[#CD2424] bg-[#FFE4E4]">Reject</Button>
          <Button className="text-[#FFFFFF] bg-[#013D9D]">Approve</Button>
        </div>
        {/* Add form elements here to handle status update if needed */}
      </Modal>
    </div>
  );
};

export default index;
