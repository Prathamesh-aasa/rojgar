import React from "react";
import { Table, Button, Dropdown, Menu, Tabs, Select, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import {
  FilterOutlined,
  DownloadOutlined,
  SendOutlined,
} from "@ant-design/icons";

const index = () => {
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
      title: "Status",
      key: "status",
      render: () => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">Pending</Menu.Item>
              <Menu.Item key="2">In-Progress</Menu.Item>
              <Menu.Item key="3">Completed</Menu.Item>
              <Menu.Item key="4">Rejected</Menu.Item>
            </Menu>
          }
        >
          <Button>
            Select <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];
  const data = [
    {
      key: index,
      name: "Company Name",
      CompanyId: "ABCD1234",
      JobposterPhNo: "candidate@gmail.com",
      JobposterPhNo: "+91 9876543210",
      dateRegistration: "31 March 2023",
      Address: "Pune",
      NoofJobpost: "Technician",
    },
    {
        key: index,
        name: "Company Name",
        CompanyId: "ABCD1234",
        JobposterPhNo: "candidate@gmail.com",
        JobposterPhNo: "+91 9876543210",
        dateRegistration: "31 March 2023",
        Address: "Pune",
        NoofJobpost: "Technician",
    },
  ];
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
            <SendOutlined /> Send Notification
          </Button>
          <Button type="primary">
            <DownloadOutlined /> Download
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
    </div>
  );
};

export default index;
