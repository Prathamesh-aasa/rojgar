import React from "react";
import { Table, Button, Dropdown, Menu, Input, Tabs, Select } from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Search } = Input;

const index = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">Online Payments</Menu.Item>
      <Menu.Item key="2">Manual Payments</Menu.Item>
    </Menu>
  );

  const data = [
    // Sample data
    {
      key: "1",
      registrationId: "ABCD1234",
      paymentFrom: "UPI id",
      transactionId: "93DJ2231AD035672D",
      paymentType: "Registration Fee",
      paymentReceiveOn: "Bank Account No",
      paymentDate: "31 March 2023",
      paymentStatus: "Failed",
    },
    {
      key: "1",
      registrationId: "ABCD1245",
      paymentFrom: "UPI id",
      transactionId: "93DJ2231AD0356656",
      paymentType: "Registration Fee",
      paymentReceiveOn: "Bank Account No",
      paymentDate: "31 March 2024",
      paymentStatus: "Successful",
    },
    // Add more sample data as needed
  ];
  const columns = [
    {
      title: "Registration Id",
      dataIndex: "registrationId",
      key: "registrationId",
    },
    {
      title: "Payment From",
      dataIndex: "paymentFrom",
      key: "paymentFrom",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Payment Receive On",
      dataIndex: "paymentReceiveOn",
      key: "paymentReceiveOn",
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <span
          className={`tag ${
            status === "Successful"
              ? "bg-green-500"
              : status === "Pending"
              ? "bg-yellow-500"
              : "bg-red-500"
          } text-white px-2 py-1 rounded-full`}
        >
          {status}
        </span>
      ),
    },
  ];
  const handleFilter = () => {
    // Define your filtering logic here
    const filteredTasks = managerTaskData.tasks.filter(
      (task) => task.status === "Pending"
    );
    const filteredTeamTasks = managerTaskData.teamTasks.filter(
      (task) => task.status === "Pending"
    );
    setFilteredTasks(filteredTasks);
    setFilteredTeamTasks(filteredTeamTasks);
  };

  return (
    <div className="p-4">
      <div>
        <p className="text-base mb-5">
          Dashboard <span className="text-[#F7B652]">&gt;</span> New
          Registration List
        </p>
        <h1 className="text-2xl text-[#013D9D] mb-5 font-semibold">
        Payment Report
        </h1>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Individual Users" key="1">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                className="w-full"
              />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
                onChange={handleFilter}
              >
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<DownloadOutlined />} type="primary">
                  Download all Transaction
                </Button>
                <Button icon={<FilterOutlined />} onClick={handleFilter}>
                  Filters
                </Button>
              </div>
            </div>
          </div>
          <Table columns={columns} dataSource={data} pagination={false} />
        </TabPane>
        <TabPane tab="Companies" key="2">
          <Table columns={columns} dataSource={data} pagination={false} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default index;
