import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Table } from "antd";

const CompanyApplications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(
          collection(db, "Job Applied"),
          where("job_id", "==", id)
        );
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("🚀 ~ apps ~ apps:", apps);
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [id]);

  // Define columns for the table
  const columns = [
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "Position",
      dataIndex: "post",
      key: "post",
    },
    {
      title: "Number of Posts",
      dataIndex: "openings",
      key: "openings",
    },
    {
      title: "Qualification",
      dataIndex: "qualification",
      key: "qualification",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Resume Link",
      dataIndex: "resume_link",
      key: "resume_link",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          View Resume
        </a>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl text-[#4A59AE] my-5">
        Applications For {applications[0]?.post}{" "}
      </h1>
      <Table dataSource={applications} columns={columns} rowKey="id" />
    </div>
  );
};

export default CompanyApplications;
