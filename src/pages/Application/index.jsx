import React, { useState } from "react";
import { Table, Button, Menu, Tabs, Select, Input, Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import { FilterOutlined, DownloadOutlined, SendOutlined } from "@ant-design/icons";

const { Option } = Select;

const index = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSendNotificationModalVisible, setIsSendNotificationModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const showModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showSendNotificationModal = () => {
    setIsSendNotificationModalVisible(true);
  };

  const handleSendNotificationOk = () => {
    setIsSendNotificationModalVisible(false);
  };

  const handleSendNotificationCancel = () => {
    setIsSendNotificationModalVisible(false);
  };

  const showFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterOk = () => {
    setIsFilterModalVisible(false);
  };

  const handleFilterCancel = () => {
    setIsFilterModalVisible(false);
  };

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
      key: "appliedPost",
      render: (text, record) => (
        <Button onClick={() => showModal(record)} className="w-full border-none">
          Technician <DownOutlined />
        </Button>
      ),
    },
  ];

  const data = [
    {
      key: 1,
      name: "Candidate Name",
      registrationId: "ABCD1234",
      email: "candidate@gmail.com",
      phoneNumber: "+91 9876543210",
      dateOfRegistration: "31 March 2023",
      appliedCompany: "Tata Motors",
      appliedPost: "Technician",
    },
    {
      key: 2,
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
          Dashboard <span className="text-[#F7B652]">&gt;</span> New Registration List
        </p>
      </div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl">Applications</h1>
        <div className="flex gap-4">
          <Button type="primary" onClick={showSendNotificationModal}>
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
              <Select placeholder="Select payment method" style={{ width: 200 }}>
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>Filters</Button>
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
              <Select placeholder="Select payment method" style={{ width: 200 }}>
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>Filters</Button>
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
              <Select placeholder="Select payment method" style={{ width: 200 }}>
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>Filters</Button>
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
              <Select placeholder="Select payment method" style={{ width: 200 }}>
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>Filters</Button>
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
              <Select placeholder="Select payment method" style={{ width: 200 }}>
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>Filters</Button>
              </div>
            </div>
          </div>
          <Table columns={columns} dataSource={data} pagination={false} />
        </TabPane>
      </Tabs>
      <Modal
        title="Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ top: 0 }}
        width="100%"
        className="h-fit"
      >
        {selectedItem && (
          <div className="flex justify-evenly">
            <div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">Personals Details</h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Registration ID</p>
                  <span>{selectedItem.registrationId}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>First Name</p>
                  <span>{selectedItem.name.split(" ")[0]}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Last Name</p>
                  <span>{selectedItem.name.split(" ")[1]}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Phone Number</p>
                  <span>{selectedItem.phoneNumber}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Email</p>
                  <span>{selectedItem.email}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Date of Registration</p>
                  <span>{selectedItem.dateOfRegistration}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Applied Company</p>
                  <span>{selectedItem.appliedCompany}</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <p>Applied Post</p>
                  <span>{selectedItem.appliedPost}</span>
                </div>
              </div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">Address Details</h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>PIN</p>
                  <span>500046</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>State</p>
                  <span>TELEGANA</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>District</p>
                  <span>Hyderabad</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>City/village</p>
                  <span>Hyderabad</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <p>Address</p>
                  <span>10/30 h</span>
                </div>
              </div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">Educational & Professional Details</h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Highest Qualification</p>
                  <span>ITI</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Trade</p>
                  <span>FITTER</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Experience</p>
                  <span>YES</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Company Name</p>
                  <span>AASA TECHNOLOGIES</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Area of Experience</p>
                  <span>FITTER</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <p>Years of Experience</p>
                  <span>1 YEAR</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">Documents & Service Details</h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Aadhaar No.</p>
                  <span>1567-7492-6363-8976</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Pan No.</p>
                  <span>1567-7492-6363-8976</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Service Selected</p>
                  <span>Job Seeker</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <p>Pan No.</p>
                  <span>1567-7492-6363-8976</span>
                </div>
              </div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">Other Details</h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Job you want to apply</p>
                  <span>TATA MOTORS</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Location of work</p>
                  <span>HYDERABAD</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Any criminal record</p>
                  <span>No</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Registration Fee paid</p>
                  <span>500</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <p>Driving license</p>
                  <span>YES I HAVE TWO WHEELER</span>
                </div>
              </div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">Additional Details</h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>No. of family member</p>
                  <span>5</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>No. of female children</p>
                  <span>2</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>No. of male children</p>
                  <span>1</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Main occupation of the family</p>
                  <span>FARMING</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Need any agricultural products?</p>
                  <span>YES</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>have agricultural land?</p>
                  <span>YES</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Mention agricultural products</p>
                  <span>NA</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Have a toilet at home?</p>
                  <span>YES</span>
                </div>
              </div>
              <button>resume</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Send Notification"
        visible={isSendNotificationModalVisible}
        onOk={handleSendNotificationOk}
        onCancel={handleSendNotificationCancel}
        style={{ top: 0 }}
        width="50%"
        className="h-fit"
      >
        <div className="flex flex-col gap-4">
          <Input placeholder="Notification Title" />
          <Input.TextArea placeholder="Notification Message" rows={4} />
        </div>
      </Modal>

      <Modal
        title="Filters"
        visible={isFilterModalVisible}
        onOk={handleFilterOk}
        onCancel={handleFilterCancel}
        style={{ top: 0 }}
        width="50%"
        className="h-fit"
      >
        <div className="flex flex-col gap-4">
          <Input placeholder="Filter by Registration ID" />
          <Input placeholder="Filter by Email" />
          <Input placeholder="Filter by Phone Number" />
          <Input placeholder="Filter by Date of Registration" />
          <Select placeholder="Filter by Applied Company" style={{ width: '100%' }}>
            <Option value="Tata Motors">Tata Motors</Option>
            <Option value="AASA TECHNOLOGIES">AASA TECHNOLOGIES</Option>
          </Select>
          <Select placeholder="Filter by Applied Post" style={{ width: '100%' }}>
            <Option value="Technician">Technician</Option>
            <Option value="Fitter">Fitter</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default index;
