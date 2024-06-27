import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Button, Input, Table, Tabs } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Search } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { TabPane } = Tabs;

const Dashboard = () => {
  const [tab, setTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Candidates",
        data: [300, 200, 400, 300, 200, 250, 350],
        fill: false,
        borderColor: "#4A90E2",
      },
    ],
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Total Fees",
        data: [100, 400, 300, 500, 300, 400, 150],
        backgroundColor: "#4A90E2",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
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
      title: "Services Enrolled",
      dataIndex: "servicesEnrolled",
      key: "servicesEnrolled",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  const data = [
    {
      key: "1",
      name: "Candidate Name",
      registrationId: "ABCD1234",
      email: "candidate@gmail.com",
      phoneNumber: "+91 9876543210",
      dateOfRegistration: "31 March 2023",
      servicesEnrolled: "Job Seeking & 1 more",
      status: "Pending",
    },
    // Add more rows as needed
  ];
  const data1 = [
    {
      key: "1",
      name: "areyaar",
      registrationId: "ABCD1234",
      email: "candidate@gmail.com",
      phoneNumber: "+91 9876543210",
      dateOfRegistration: "31 March 2023",
      servicesEnrolled: "Job Seeking & 1 more",
      status: "Pending",
    },
    
  ];

  return (
    <div className="p-4">
      <h1 className="w-[500px] p-2 text-[#013D9D] text-[18px] font-semibold ">
        Welcome!
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-[#013D9D] text-[18px] font-semibold p-2">
            New Registrations
          </h2>
          <Line data={lineData} options={options} />
        </div>
        <div>
          <h2 className="text-[#013D9D] text-[18px] font-semibold p-2">
            Payments Report
          </h2>
          <Bar data={barData} options={options} />
        </div>
      </div>
      <div className="mt-9 p-5">
        <Tabs
          activeKey={tab}
          onChange={(w) => {
            setSearchTerm("");
            setFilterStatus("");
            setTab(w);
          }}
        >
          <TabPane tab="New Registrations" key="1">
            <div className=" flex justify-between">
              <div>
                <Input
                  placeholder="Search"
                  prefix={<Search />}
                  className="mb-10 w-[340px]"
                />
              </div>
              <div>
                <Button className="bg-[#013D9D] text-[#FFFFFF]">
                View All
                </Button>
              </div>
            </div>

            <Table columns={columns} dataSource={data} pagination={false} />
          </TabPane>
          <TabPane tab="Payment Report" key="2">
          <div className=" flex justify-between">
              <div>
                <Input
                  placeholder="Search"
                  prefix={<Search />}
                  className="mb-10 w-[340px]"
                />
              </div>
              <div>
                <Button className="bg-[#013D9D] text-[#FFFFFF]">
                View All
                </Button>
              </div>
            </div>
            
            <Table columns={columns} dataSource={data1} pagination={false}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
