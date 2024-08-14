import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Dropdown,
  Menu,
  Input,
  Tabs,
  Select,
  Modal,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
const { TabPane } = Tabs;
const { Option } = Select;

const Index = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterMethod, setFilterMethod] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [individualPayments, setIndividualPayments] = useState([]);
  const [companyPayments, setCompanyPayments] = useState([]);
  const [filteredIndividualPayments, setFilteredIndividualPayments] = useState(
    []
  );
  const [filteredCompanyPayments, setFilteredCompanyPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const downloadAllTransactions = () => {
    const dataToDownload = filteredIndividualPayments.map((payment) => ({
      "Registration Id": payment.id,
      "Payment From": payment.user_id,
      "Transaction ID": payment.transaction_id,
      "Selected Service": payment.title,
      "Payment Date": moment(payment.date).format("DD-MM-YYYY"),
      "Payment Status": payment.status,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(dataToDownload[0]).join(",") +
      "\n" +
      dataToDownload.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "all_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPayments = async () => {
    const paymentsCollection = collection(db, "Payments");
    const snapshot = await getDocs(paymentsCollection);
    const paymentsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("🚀 ~ paymentsList ~ paymentsList:", paymentsList);

    const individualPayments = paymentsList.filter(
      (payment) => payment.is_individual
    );
    const companyPayments = paymentsList.filter(
      (payment) => !payment.is_individual
    );

    setIndividualPayments(individualPayments);
    setFilteredIndividualPayments(individualPayments);
    setCompanyPayments(companyPayments);
    setFilteredCompanyPayments(companyPayments);
  };

  useEffect(() => {
    getPayments();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterPayments(e.target.value, filterMethod, statusFilter);
  };

  const handleFilterMethod = (value) => {
    setFilterMethod(value);
    filterPayments(searchTerm, value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterPayments(searchTerm, filterMethod, value);
  };

  const filterPayments = (searchTerm, filterMethod, statusFilter) => {
    let filteredIndividuals = individualPayments;
    let filteredCompanies = companyPayments;

    if (searchTerm) {
      filteredIndividuals = filteredIndividuals.filter(
        (payment) =>
          payment?.user_id?.includes(searchTerm) ||
          payment?.id?.includes(searchTerm) ||
          payment?.transaction_id?.includes(searchTerm) ||
          payment?.title?.includes(searchTerm)
      );
      filteredCompanies = filteredCompanies?.filter(
        (payment) =>
          payment?.user_id?.includes(searchTerm) ||
          payment?.id?.includes(searchTerm) ||
          payment?.transaction_id?.includes(searchTerm) ||
          payment?.title?.includes(searchTerm)
      );
    }

    if (filterMethod) {
      filteredIndividuals = filteredIndividuals.filter((payment) =>
        filterMethod === "Online Payment"
          ? payment.is_payment_gateway
          : !payment.is_payment_gateway
      );
      filteredCompanies = filteredCompanies.filter((payment) =>
        filterMethod === "Online Payment"
          ? payment.is_payment_gateway
          : !payment.is_payment_gateway
      );
    }

    if (statusFilter) {
      filteredIndividuals = filteredIndividuals.filter(
        (payment) => payment.status === statusFilter
      );
      filteredCompanies = filteredCompanies.filter(
        (payment) => payment.status === statusFilter
      );
    }

    setFilteredIndividualPayments(filteredIndividuals);
    setFilteredCompanyPayments(filteredCompanies);
  };

  const columns = [
    {
      title: "Registration Id",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Payment From",
      dataIndex: "user_id",
      key: "user_id",
      sorter: (a, b) => a.user_id.localeCompare(b.user_id),
    },
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
      sorter: (a, b) => a?.transaction_id?.localeCompare(b?.transaction_id || ""),
    },
    {
      title: "Selected Service",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Payment Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <span>{moment(date)?.format("DD-MM-YYYY") || "NA"}</span>
      ),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Payment Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`tag ${
            status === "Completed"
              ? "bg-green-500"
              : status === "Pending"
              ? "bg-yellow-500"
              : "bg-red-500"
          } text-white px-2 py-1 rounded-full`}
        >
          {status}
        </span>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  // const columns = [
  //   {
  //     title: "Registration Id",
  //     dataIndex: "id",
  //     key: "id",
  //   },
  //   {
  //     title: "Payment From",
  //     dataIndex: "user_id",
  //     key: "user_id",
  //   },
  //   {
  //     title: "Transaction ID",
  //     dataIndex: "transaction_id",
  //     key: "transaction_id",
  //   },
  //   {
  //     title: "Payment Type",
  //     dataIndex: "title",
  //     key: "title",
  //   },
  //   // {
  //   //   title: "Payment Receive On",
  //   //   dataIndex: "paymentReceiveOn",
  //   //   key: "paymentReceiveOn",
  //   // },
  //   {
  //     title: "Payment Date",
  //     dataIndex: "date",
  //     key: "date",
  //     render: (date) => (
  //       <span>{moment(date)?.format("DD-MM-YYYY") || "NA"}</span>
  //     ),
  //   },
  //   {
  //     title: "Payment Status",
  //     dataIndex: "status",
  //     key: "status",
  //     render: (status) => (
  //       <span
  //         className={`tag ${
  //           status === "Completed"
  //             ? "bg-green-500"
  //             : status === "Pending"
  //             ? "bg-yellow-500"
  //             : "bg-red-500"
  //         } text-white px-2 py-1 rounded-full`}
  //       >
  //         {status}
  //       </span>
  //     ),
  //   },
  // ];
  const handleRowClick = (record) => {
    navigate(`/payment-view-details/${record.id}`);
  };
  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl text-[#013D9D] mb-5 font-semibold">
          Payment Report
        </h1>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Individual Users" key="1">
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-5">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
              />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
                value={filterMethod}
                onChange={handleFilterMethod}
              >
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              {filterMethod === "Manual Payment" && (
                <Select
                  placeholder="Select status"
                  style={{ width: 200 }}
                  value={statusFilter}
                  onChange={handleStatusFilter}
                >
                  <Option value="">All</Option>
                  <Option value="Approved">Approved</Option>
                  <Option value="Rejected">Rejected</Option>
                  <Option value="Pending">Pending</Option>
                </Select>
              )}
              <div className="flex gap-2">
                <Button
                  icon={<DownloadOutlined />}
                  type="primary"
                  onClick={downloadAllTransactions}
                >
                  Download all Transaction
                </Button>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredIndividualPayments}
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        </TabPane>
        <TabPane tab="Companies" key="2">
          <Table
            columns={columns}
            dataSource={filteredCompanyPayments}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
