import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  Input,
  Modal,
  notification,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { Link } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const CompaniesPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const getCompanies = async () => {
    const companyCollection = collection(db, "RegisterAsCompany");
    const companiesSnapshot = await getDocs(companyCollection);
    const companies = companiesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const jobsCollection = collection(db, "Jobs");

    const companiesWithJobCount = await Promise.all(
      companies.map(async (company) => {
        const jobsQuery = query(
          jobsCollection,
          where("company_id", "==", company.id)
        );
        const jobsSnapshot = await getDocs(jobsQuery);
        const jobCount = jobsSnapshot.size;
        return {
          ...company,
          jobCount,
        };
      })
    );

    setCompanies(companiesWithJobCount);
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const handelUpdate = async (status) => {
    try {
      const companyDoc = doc(db, "RegisterAsCompany", selectedItems?.id);
      await updateDoc(companyDoc, {
        status: status,
      });
      notification.success({
        message: "Status Updated",
        description: `Company ${selectedItems?.id} has been ${status} successfully.`,
      });
      handleCancel();
      getCompanies();
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to Update Please try again later.",
      });
    }
  };

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.company_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" || company.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "Company ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Job poster Email Id",
      dataIndex: "job_poster_email",
      key: "job_poster_email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Job poster Ph No.",
      dataIndex: "job_poster_phone_number",
      key: "job_poster_phone_number",
    },
    {
      title: "Date of Registration",
      dataIndex: "date_of_registration",
      key: "date_of_registration",
      render: (text) => {
        return moment(text).format("DD-MM-YYYY");
      },
    },
    {
      title: "Address",
      dataIndex: "registered_address",
      key: "registered_address",
    },
    {
      title: "No of Job post",
      dataIndex: "jobCount",
      key: "jobCount",
    },
    {
      title: "",
      key: "",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Link to={`/companies/details/${record?.id}`} className="underline text-blue-700">
            View
          </Link>
          <Button
            onClick={() => {
              setSelectedItems(record);
              showModal();
            }}
            type="text"
            className="w-full border-none"
          >
            <DownOutlined className="-rotate-90" />
          </Button>
        </div>
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
          <Input
            placeholder="Search"
            className="w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select
            placeholder="Status"
            style={{ width: 300 }}
            value={filterStatus}
            onChange={handleStatusFilter}
          >
            <Option value="">All</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </div>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} />
      <Modal
        title="Details"
        open={isModalVisible}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
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
                <span>{selectedItems?.id}</span>
              </div>
              <div className="flex flex-col mb-2 mr-2 gap-1">
                <p>Company Name</p>
                <span>{selectedItems?.company_name}</span>
              </div>
              <div className="flex flex-col mb-2 mr-2 gap-1">
                <p>GSTIN No.</p>
                <span>{selectedItems?.gstin}</span>
              </div>
              <div className="flex flex-col mb-5 gap-1">
                <p>Email Id</p>
                <span>{selectedItems?.company_email}</span>
              </div>
            </div>
            <h1 className="text-[#013D9D] font-medium text-xl mb-5">
              Address Details
            </h1>
            <div className="grid grid-cols-3">
              <div className="flex flex-col gap-2 ml-2 p-1 mb-2">
                <p>PIN </p>
                <span>{selectedItems?.pin}</span>
              </div>
              <div className="flex flex-col gap-2 ml-2 p-1">
                <p>State</p>
                <span>{selectedItems?.state}</span>
              </div>
              <div className="flex flex-col gap-2 ml-2 p-1">
                <p>District</p>
                <span>{selectedItems?.district || "NA"}</span>
              </div>
              <div className="flex flex-col gap-2 ml-2 p-1">
                <p>City/village</p>
                <span>{selectedItems?.city || "NA"}</span>
              </div>
              <div className="flex flex-col gap-2 mb-4 ml-2 p-1">
                <p>Address</p>
                <span>{selectedItems?.registered_address}</span>
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
                <span>{selectedItems?.company_name}</span>
              </div>
              <div className="flex flex-col gap-2 mr-2 ml-2 p-1">
                <p>Email Id</p>
                <span>{selectedItems?.company_email}</span>
              </div>
              <div className="flex flex-col gap-2 mr-2 ml-2 p-1">
                <p>Phone Number</p>
                <span>{selectedItems?.job_poster_phone_number}</span>
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
