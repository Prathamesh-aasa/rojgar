import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Table, Button } from "antd";
import * as XLSX from "xlsx";
import { DownloadIcon } from "lucide-react";

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

        // Array to store promises for fetching job seeker data
        const jobSeekerPromises = [];

        // Iterate through each application
        for (let index = 0; index < apps.length; index++) {
          const data = apps[index];
          if (data?.job_seeker_id) {
            const q = query(
              collection(db, "Job Seekers"),
              where("id", "==", data.job_seeker_id)
            );
            jobSeekerPromises.push(getDocs(q));
          } else {
            // Handle case where job_seeker_id is missing or falsy
            jobSeekerPromises.push(Promise.resolve({ empty: true }));
          }
        }

        // Resolve all promises for fetching job seeker data
        const snapshots = await Promise.all(jobSeekerPromises);

        // Map the fetched job seeker data to corresponding applications
        for (let index = 0; index < snapshots.length; index++) {
          const snapshot = snapshots[index];
          // Check if snapshot has data (avoid accessing [0] if it's empty or undefined)
          const jobSeekerData = snapshot.empty
            ? null
            : snapshot.docs[0]?.data();
          apps[index].jobSeekerData = jobSeekerData;
        }

        console.log("🚀 ~ apps ~ apps:", apps);
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [id]);

  const downloadExcel = () => {
    const newData = [];
    applications.forEach((app) =>
      newData.push({
        Id: app?.jobSeekerData?.id || "-",
        Name: app?.jobSeekerData?.full_name || "-",
        Email: app?.jobSeekerData?.email || "-",
        Phone: app?.jobSeekerData?.phone_number || "-",
        Qualification: app?.qualification || "-",
        Status: app?.status || "-",
        Resume_Link: app?.resume_link || "-",
      })
    );
    const worksheet = XLSX.utils.json_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "Applications.xlsx");
  };

  // Define columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "full_name",
      render: (text, record) => record?.jobSeekerData?.full_name,
      // key: "jobSeekerData.full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => record?.jobSeekerData?.email,

      // key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      render: (text, record) => record?.jobSeekerData?.phone_number,
      key: "phone_number",
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
      render: (text) =>
        text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            View Resume
          </a>
        ) : (
          <h1>No Resume Uploaded</h1>
        ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl text-[#4A59AE] my-5">
        Applications For {applications[0]?.post}
      </h1>
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={downloadExcel}
          style={{ marginBottom: 16 }}
          icon={<DownloadIcon height={17} />}
        >
          Download Applications
        </Button>
      </div>
      <Table
        dataSource={applications}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default CompanyApplications;
