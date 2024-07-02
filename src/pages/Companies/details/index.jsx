import { Button } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../../../firebase";

function CompanyInfo() {
  const [companyData, setCompanyData] = useState({});
  const [companyJobs, setCompanyJobs] = useState([]);

  const { id } = useParams();
  const getCompanyInfo = async () => {
    const paymentsCollection = collection(db, "RegisterAsCompany");
    const payQry = query(paymentsCollection, where("id", "==", id));
    const snapshot = await getDocs(payQry);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("🚀 ~ data ~ data:", data)

    const finalData = data[0]
    console.log("🚀 ~ getCompanyInfo ~ finalData:", finalData)

    setCompanyData(finalData);
  };
  const getCompanyJobs = async () => {
    const paymentsCollection = collection(db, "Jobs");
    const payQry = query(paymentsCollection, where("company_id", "==", id));
    const snapshot = await getDocs(payQry);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("🚀 ~ data ~ data:", data);

    setCompanyJobs(data);
  };

  useEffect(() => {
    getCompanyInfo();
    getCompanyJobs();
  }, []);

  return (
    <div className="p-8">
      <div>
        <p className="text-base mb-5">
          Dashboard <span className="text-[#F7B652]">&gt;</span> Company
          <span className="text-[#F7B652]"> &gt;</span> 
        </p>
        <p className="text-2xl font-semibold text-[#013D9D]">{companyData?.company_name} </p>
      </div>
      <div className="flex gap-4">
        <div className="mt-8 bg-[#EEF2F9] w-[50%] p-4 rounded-lg h-fit">
          <h1 className="mb-5 text-[#013D9D] text-[22px] font-medium">
            Company Details
          </h1>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col">
              <p className="font-semibold text-sm">Email Id</p>
              <span className="text-sm">{companyData?.company_email}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">Phone No.</p>
              <span className="text-sm">
                {companyData?.job_poster_phone_number}
              </span>
            </div>

            <div className="flex flex-col mb-4">
              <p className="font-semibold text-sm">GSTIN No.</p>
              <span className="text-sm">{companyData?.gstin}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">Company Id</p>
              <span className="text-sm">{id}</span>
            </div>
          </div>
          <h1 className="mb-5 text-[#013D9D] text-[22px] font-medium">
            Job Poster Details
          </h1>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col">
              <p className="font-semibold text-sm">Full Name</p>
              <span className="text-sm">{companyData?.job_poster_name}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">Email Id</p>
              <span className="text-sm">{companyData?.job_poster_email}</span>
            </div>
            <div className="flex flex-col mb-5">
              <p className="font-semibold text-sm">Phone Number</p>
              <span className="text-sm">
                {companyData?.job_poster_phone_number}
              </span>
            </div>
          </div>

          <h1 className="mb-5 text-[#013D9D] text-[22px] font-medium">
            Address Details
          </h1>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col">
              <p className="font-semibold text-sm">PIN</p>
              <span className="text-sm">{companyData?.pin}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">State</p>
              <span className="text-sm">{companyData?.state}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">District</p>
              <span className="text-sm">{companyData?.district || "NA"}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">City/Village</p>
              <span className="text-sm">{companyData?.city}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">Address</p>
              <span className="text-sm">{companyData?.registered_address}</span>
            </div>
          </div>
        </div>
        <div className="mt-8 p-4 w-[50%] flex flex-col gap-5">
          {companyJobs?.map((job) => {
            return (
              <div className="shadow-lg p-4 rounded-lg" key={job?.id}>
                <div className="flex items-center justify-between mb-5 ">
                  <h1 className=" text-[#013D9D] text-[22px] font-medium">
                    {job?.job_position}
                  </h1>
                  <Link
                    className="underline text-[#013D9D]"
                    to={`/applications/company/${job?.id}`}
                  >
                    See all Application
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">Job Position</p>
                    <span className="text-sm">{job?.job_position}</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">Qualification</p>
                    <span className="text-sm">{job?.qualification}</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">Experience</p>
                    <span className="text-sm">{job?.experience_required}</span>
                  </div>
                  <div className="flex flex-col mb-4">
                    <p className="font-semibold text-sm">Skill Required</p>
                    <span className="text-sm">{job?.skills_required}</span>
                  </div>
                  <div className="flex flex-col mb-4">
                    <p className="font-semibold text-sm">Job Opening</p>
                    <span className="text-sm">{job?.job_openings}</span>
                  </div>
                  <div className="flex flex-col mb-4">
                    <p className="font-semibold text-sm">Payout</p>
                    <span className="text-sm">
                      {job?.payout_from} - {job?.payout_to}
                    </span>
                  </div>
                  <div className="flex flex-col mb-4">
                    <p className="font-semibold text-sm">Job Id</p>
                    <span className="text-sm">{job?.id}</span>
                  </div>
                  <div className="flex flex-col mb-4">
                    <p className="font-semibold text-sm">Payment Mode</p>
                    <span className="text-sm">{job?.payment_mode || "NA"}</span>
                  </div>
                  <div className="flex flex-col mb-4">
                    <p className="font-semibold text-sm">Benefit</p>
                    <span className="text-sm">{job?.benefits}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* <div className="shadow-lg p-4 rounded-lg">
            <div className="flex items-center justify-between mb-5">
              <h1 className=" text-[#013D9D] text-[22px] font-medium">
                Posted Job (TECHNICIAN)
              </h1>
              <Link className="underline text-[#013D9D]">
                View Sent Application
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col">
                <p className="font-semibold text-sm">Job Position</p>
                <span className="text-sm">TECHNICIAN</span>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm">Qualification</p>
                <span className="text-sm">GRADUATION</span>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm">Experience</p>
                <span className="text-sm">ANY</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Skill Required</p>
                <span className="text-sm">BASIC EXCEL</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Job Opening</p>
                <span className="text-sm">100</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Payout</p>
                <span className="text-sm">20,000-30,000</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Job Id</p>
                <span className="text-sm">ABCD1234</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Payment Mode</p>
                <span className="text-sm">CASH IN HAND</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Benefit</p>
                <span className="text-sm">BONUS</span>
              </div>
            </div>
          </div>

          <div className="shadow-lg p-4 rounded-lg">
            <div className="flex items-center justify-between mb-5">
              <h1 className=" text-[#013D9D] text-[22px] font-medium">
                Posted Job (TECHNICIAN)
              </h1>
              <Button className=" text-[red] bg-[#FFE4E4] rounded-full">
                closed
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col">
                <p className="font-semibold text-sm">Job Position</p>
                <span className="text-sm">TECHNICIAN</span>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm">Qualification</p>
                <span className="text-sm">GRADUATION</span>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm">Experience</p>
                <span className="text-sm">ANY</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Skill Required</p>
                <span className="text-sm">BASIC EXCEL</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Job Opening</p>
                <span className="text-sm">100</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Payout</p>
                <span className="text-sm">20,000-30,000</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Job Id</p>
                <span className="text-sm">ABCD1234</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Payment Mode</p>
                <span className="text-sm">CASH IN HAND</span>
              </div>
              <div className="flex flex-col mb-4">
                <p className="font-semibold text-sm">Benefit</p>
                <span className="text-sm">BONUS</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default CompanyInfo;
