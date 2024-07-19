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
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { Link } from "react-router-dom";
import moment from "moment";
import { Sorter } from "../../utils/sorter";

const { Option } = Select;

const CompaniesPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");


  const sendNotification = async (id, message) => {
    const userRef = doc(db, "RegisterAsCompany", id);
    console.log("🚀 ~ sendNotification ~ userID:", id);
    const notificationsRef = collection(userRef, "Notifications");

    const docRef = await addDoc(notificationsRef, {
      company_id: id,
      text: message,
      read:false,
      sent_at: moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      image_link: null,
    });
    console.log(docRef.id);
    // Update the document with its ID
    await updateDoc(docRef, {
      id: docRef.id,
    });
  };

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

      sendNotification(selectedItems?.id,`Your company request has been ${status}`)
      notification.success({
        message: "Status Updated",
        description: `Company ${selectedItems?.company_name} has been ${status} successfully.`,
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
      sorter: (a, b) =>
        a?.company_name
          ?.toLowerCase()
          ?.localeCompare(b?.company_name?.toLowerCase()),
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
      sorter: (a, b) =>
        a?.job_poster_email
          ?.toLowerCase()
          ?.localeCompare(b?.job_poster_email?.toLowerCase()),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) =>
        a?.status?.toLowerCase()?.localeCompare(b?.status?.toLowerCase())
    },
    {
      title: "Job poster Ph No.",
      dataIndex: "job_poster_phone_number",
      key: "job_poster_phone_number",
      sorter: (a, b) =>
        a?.job_poster_phone_number
          ?.localeCompare(b?.job_poster_phone_number),
    },
    {
      title: "Date of Registration",
      dataIndex: "date_of_registration",
      key: "date_of_registration",
      sorter: (dateA, dateB) =>
        moment(dateA?.date_of_registration).diff(
          moment(dateB?.date_of_registration)
        ),
      render: (text) => {
        return moment(text).format("DD-MM-YYYY");
      },
    },
    {
      title: "Address",
      dataIndex: "registered_address",
      key: "registered_address",
      sorter: (a, b) =>
        a?.registered_address
          ?.toLowerCase()
          ?.localeCompare(b?.registered_address?.toLowerCase()),

    },
    {
      title: "No of Job post",
      dataIndex: "jobCount",
      key: "jobCount",
      sorter: {
        compare: (a, b) => a.jobCount - b.jobCount,
        multiple: 2,
      },
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
      <Table
        columns={columns}
        dataSource={filteredCompanies}
        pagination={true}
        rowKey={"id"}
      />
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
              Company Details
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
        {selectedItems.status === "Pending" && (
          <div className="flex justify-end gap-4">
            <Button
              className="text-[#CD2424] bg-[#FFE4E4]"
              onClick={() => handelUpdate("Rejected")}
            >
              Reject
            </Button>
            <Button
              className="text-[#FFFFFF] bg-[#013D9D]"
              onClick={() => handelUpdate("Approved")}
            >
              Approve
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompaniesPage;
