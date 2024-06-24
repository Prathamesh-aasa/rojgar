import React, { useState } from "react";
import { Table, Button, Dropdown, Menu, Input, Tabs, Select, Modal } from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option } = Select;

const index = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterMethod, setFilterMethod] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

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
      key: "2",
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
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Implement your filter logic here using filterMethod and selectedMonth
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFilterMethodChange = (value) => {
    setFilterMethod(value);
    setSelectedMonth("");
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
                onChange={handleFilterMethodChange}
              >
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
                <Option value="Month">Month</Option>
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
      <Modal
        title="Filter Payments"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          placeholder="Select filter method"
          style={{ width: "100%" }}
          onChange={handleFilterMethodChange}
          value={filterMethod}
        >
          <Option value="">All</Option>
          <Option value="Online Payment">Online Payment</Option>
          <Option value="Manual Payment">Manual Payment</Option>
          <Option value="Month">Month</Option>
        </Select>
        {filterMethod === "Month" && (
          <Select
            placeholder="Select month"
            style={{ width: "100%", marginTop: 16 }}
            onChange={(value) => setSelectedMonth(value)}
            value={selectedMonth}
          >
            <Option value="January">January</Option>
            <Option value="February">February</Option>
            <Option value="March">March</Option>
            <Option value="April">April</Option>
            <Option value="May">May</Option>
            <Option value="June">June</Option>
            <Option value="July">July</Option>
            <Option value="August">August</Option>
            <Option value="September">September</Option>
            <Option value="October">October</Option>
            <Option value="November">November</Option>
            <Option value="December">December</Option>
          </Select>
        )}
      </Modal>
    </div>
  );
};

export default index;
