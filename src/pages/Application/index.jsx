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
      title: "Registration ID",
      dataIndex: "registrationId",
      key: "registrationId",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Date of Registration",
      dataIndex: "dateOfRegistration",
      key: "dateOfRegistration",
    },
    {
      title: "Applied Company",
      dataIndex: "appliedCompany",
      key: "appliedCompany",
    },
    {
      title: "Applied Post",
      dataIndex: "appliedPost",
      key: "appliedPost",
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
      name: "Candidate Name",
      registrationId: "ABCD1234",
      email: "candidate@gmail.com",
      phoneNumber: "+91 9876543210",
      dateOfRegistration: "31 March 2023",
      appliedCompany: "Tata Motors",
      appliedPost: "Technician",
    },
    {
      key: index,
      name: "Candidate Name",
      registrationId: "ABCD1254",
      email: "candidate@gmail.com",
      phoneNumber: "+91 987654546",
      dateOfRegistration: "31 March 2020",
      appliedCompany: "Tata Motors car",
      appliedPost: "Technician",
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
        <h1 className="text-xl">Applications</h1>
        <div className="flex gap-4">
          <Button type="primary">
            <SendOutlined /> Send Notification
          </Button>
          <Button type="primary">
            <DownloadOutlined /> Download
          </Button>
        </div>
      </div>
      <Tabs>
        <TabPane tab="Jobseeker" key="1">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input placeholder="Search" className="w-full" />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
              >
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
        </TabPane>
        <TabPane tab="Skilling" key="2">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input placeholder="Search" className="w-full" />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
              >
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
        </TabPane>
        <TabPane tab="Volunteer" key="3">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input placeholder="Search" className="w-full" />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
              >
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
        </TabPane>
        <TabPane tab="Documents" key="4">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input placeholder="Search" className="w-full" />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
              >
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
        </TabPane>
        <TabPane tab="Welfare Scheme" key="5">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input placeholder="Search" className="w-full" />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
              >
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
        </TabPane>
      </Tabs>
    </div>
  );
};

export default index;
