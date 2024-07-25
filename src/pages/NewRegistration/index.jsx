import React, { useEffect, useState } from "react";
import { Table, Tabs, Tag, Input } from "antd";
import { db } from "../../../firebase";
import { collection, getDocs, query } from "firebase/firestore";
const { Search } = Input;

const Index = () => {
  const [filteredIndividualUsers, setFilteredIndividualUsers] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [individualUsers, setIndividualUsers] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);

  const getIndividualUsers = async () => {
    const individualCollection = collection(db, "Individuals");
    const indQry = query(individualCollection);
    const snapshot = await getDocs(indQry);
    const usersList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setIndividualUsers(usersList);
    setFilteredIndividualUsers(usersList);
  };

  const getCompanies = async () => {
    const companyCollection = collection(db, "RegisterAsCompany");
    const compQry = query(companyCollection);
    const snapshot = await getDocs(compQry);
    const companiesList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCompaniesList(companiesList);
    setFilteredCompanies(companiesList);
  };

  useEffect(() => {
    getIndividualUsers();
    getCompanies();
  }, []);

  const handleSearch = (value, type) => {
    if (type === "individuals") {
      const filtered = individualUsers.filter((user) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredIndividualUsers(filtered);
    } else {
      const filtered = companiesList.filter((company) =>
        Object.values(company).some((val) =>
          String(val).toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredCompanies(filtered);
    }
  };

  const columns = [
    {
      title: " Name",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Registration ID",
      dataIndex: "id",
      key: "id",
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
    // {
    //   title: "Services Enrolled",
    //   dataIndex: "trade",
    //   key: "trade",
    // },
    // {
    //   title: "Status",
    //   key: "status",
    //   dataIndex: "status",
    //   render: (_, { status }) => (
    //     <>
    //       <Tag className="capitalize text-purpleText bg-purpleTextMd">
    //         {status}
    //       </Tag>
    //     </>
    //   ),
    // },
  ];

  const companiesColumns = [
    {
      title: "Company Name",
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
      title: "Job poster Phone Number",
      dataIndex: "job_poster_phone_number",
      key: "job_poster_phone_number",
    },
    {
      title: "Date of Registration",
      dataIndex: "date_of_registration",
      key: "date_of_registration",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Address",
      dataIndex: "registered_address",
      key: "registered_address",
    },
    {
      title: "Verification Status",
      render: (_, { status }) => {
        return status;
      },
    },
  ];

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
          <div className="flex justify-end">
            <Search
              className="mb-4 w-80"
              placeholder="Search..."
              onChange={(e) => handleSearch(e.target.value, "individuals")}
              onSearch={(value) => handleSearch(value, "individuals")}
            />
          </div>
          <Table
            columns={columns}
            dataSource={filteredIndividualUsers}
            pagination={false}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Companies" key="2" className="overflow-x-auto">
          <div className="flex justify-end">
            <div className="flex gap-5">
              <Search
                className="mb-4 w-80"
                placeholder="Search..."
                onChange={(e) => handleSearch(e.target.value, "companies")}
                onSearch={(value) => handleSearch(value, "companies")}
              />
            </div>
          </div>
          <Table
            columns={companiesColumns}
            dataSource={filteredCompanies}
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
