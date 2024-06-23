import React from "react";
import { Table, Tabs, Tag, Input, Dropdown, Button } from "antd";
import { useState } from "react";
import { FilterOutlined } from "@ant-design/icons";
const { Search } = Input;

const Index = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filteredTeamTasks, setFilteredTeamTasks] = useState([]);
  const columns = [
    {
      title: " Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Registration ID",
      dataIndex: "registration_id",
      key: "registration_id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Date of Registration",
      dataIndex: "date_of_registration",
      key: "date_of_registration",
    },
    {
      title: "Services Enrolled",
      dataIndex: "services_enrolled",
      key: "services_enrolled",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <>
          <Tag className="capitalize text-purpleText bg-purpleTextMd">
            {status}
          </Tag>
        </>
      ),
    },
  ];

  const managerTaskData = {
    tasks: [
      {
        key: "1",
        first_name: "John",
        registration_id: "123",
        email: "john@example.com",
        phone_number: "123-456-7890",
        date_of_registration: "2023-12-01",
        services_enrolled: "Service A, Service B",
        status: "Pending",
        contact_id: "456",
      },
      {
        key: "2",
        first_name: "Jane",
        registration_id: "124",
        email: "jane@example.com",
        phone_number: "987-654-3210",
        date_of_registration: "2023-12-02",
        services_enrolled: "Service C",
        status: "Completed",
        contact_id: null,
      },
    ],
    teamTasks: [
      {
        key: "3",
        first_name: "Alice",
        registration_id: "125",
        email: "alice@example.com",
        phone_number: "555-666-7777",
        date_of_registration: "2023-12-03",
        services_enrolled: "Service D, Service E",
        status: "In Progress",
        contact_id: "789",
      },
      {
        key: "4",
        first_name: "Bob",
        registration_id: "126",
        email: "bob@example.com",
        phone_number: "888-999-0000",
        date_of_registration: "2023-12-04",
        services_enrolled: "Service F",
        status: "Pending",
        contact_id: null,
      },
    ],
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value === "") {
      setFilteredTasks(managerTaskData.tasks);
      setFilteredTeamTasks(managerTaskData.teamTasks);
    } else {
      const filteredTasks = managerTaskData.tasks.filter((task) =>
        Object.values(task).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(value.toLowerCase())
        )
      );
      const filteredTeamTasks = managerTaskData.teamTasks.filter((task) =>
        Object.values(task).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredTasks(filteredTasks);
      setFilteredTeamTasks(filteredTeamTasks);
    }
  };

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
    <div className="p-5">
      <div>
        <p className="text-base mb-5">
          Dashboard <span className="text-[#F7B652]">&gt;</span> New
          Registration List
        </p>
        <h1 className="text-2xl text-[#013D9D] mb-5 font-semibold">
          New Registrations list
        </h1>
      </div>

      <Tabs>
        <Tabs.TabPane
          tab="Individual Users"
          key="1"
          className="overflow-x-auto"
        >
          <div className="flex justify-between">
            <div></div>
            <Search
              className="mb-4 w-80"
              placeholder="Search..."
              onSearch={handleSearch}
            />
          </div>
          <Table
            columns={columns}
            dataSource={searchText ? filteredTasks : managerTaskData.tasks}
            pagination={false}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Companies" key="2" className="overflow-x-auto">
          <div className="flex justify-between">
            <div></div>
            <div className="flex gap-5">
              <Search
                className="mb-4 w-80"
                placeholder="Search..."
                onSearch={handleSearch}
              />
              <Button icon={<FilterOutlined />} onClick={handleFilter}>
                Filters
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={
              searchText ? filteredTeamTasks : managerTaskData.teamTasks
            }
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
