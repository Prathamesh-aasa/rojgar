import { Button } from "antd";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../../../firebase";
import { PlusCircle } from "lucide-react";
import moment from "moment";

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

    const finalData = data[0];
    if (finalData?.subscription) {
      const subscriptionCollection = collection(db, "Subscription Plans");
      const subQry = query(
        subscriptionCollection,
        where("id", "==", finalData?.subscription)
      );
      const snap = await getDocs(subQry);
      const snapData = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      finalData.subscription = snapData[0];
    }
    console.log("🚀 ~ getCompanyInfo ~ finalData:", finalData);

    setCompanyData(finalData);
  };
  const getCompanyJobs = async () => {
    try {
      const paymentsCollection = collection(db, "Jobs");
      const payQry = query(
        paymentsCollection,
        where("company_id", "==", id)
        // orderBy("created_at", "desc")
      );
      const snapshot = await getDocs(payQry);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("🚀 ~ data ~ data:", data);

      setCompanyJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const closeJob = async (jobId) => {
    try {
      const jobRef = doc(db, "Jobs", jobId);
      await updateDoc(jobRef, {
        isOpen: false,
      });
      getCompanyJobs();
    } catch (error) {
      console.error("Error closing job:", error);
    }
  };

  useEffect(() => {
    getCompanyInfo();
    getCompanyJobs();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-base mb-5">
            Dashboard <span className="text-[#F7B652]">&gt;</span> Company
            <span className="text-[#F7B652]"></span>
          </p>
          <p className="text-2xl font-semibold text-[#013D9D]">
            {companyData?.company_name}{" "}
          </p>
        </div>
        <div>
          <Link to={`/companies/add-job/${id}`}>
            <Button type="primary">
              <PlusCircle className="h-4 w-4" />
              Add New Job
            </Button>
          </Link>
        </div>
      </div>
      <div className="">
        <div className="mt-8 shadow-lg p-5 rounded-lg">
          <h1 className="text-emerald-600 font-bold text-lg bg-emerald-600/20 p-2 rounded-lg my-4">
            Company Details
          </h1>
          <div className="grid grid-cols-3 gap-3 p-3">
            <div className="flex flex-col">
              <p className="font-semibold text-sm">Email Id</p>
              <span className="text-sm">{companyData?.company_email}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">Phone No.</p>
              <span className="text-sm">
                {companyData?.company_phone || "Not Given"}
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
          <h1 className="text-emerald-600 font-bold text-lg bg-emerald-600/20 p-2 rounded-lg my-4">
            Job Poster Details
          </h1>
          <div className="grid grid-cols-3 gap-3 p-3">
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

          <h1 className="text-emerald-600 font-bold text-lg bg-emerald-600/20 p-2 rounded-lg my-4">
            Address Details
          </h1>
          <div className="grid grid-cols-3 gap-3 p-3">
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

          <h1 className="text-emerald-600 font-bold text-lg bg-emerald-600/20 p-2 rounded-lg my-4">
            Subscription Details
          </h1>
          {companyData?.subscription ? (
            <div className="grid grid-cols-3 gap-3 p-3 mb-3">
              <div className="flex flex-col">
                <p className="font-semibold text-sm">Name</p>
                <span className="text-sm">
                  {companyData?.subscription?.name}
                </span>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm">Interval</p>
                <span className="text-sm">
                  {companyData?.subscription?.per}
                </span>
              </div>
              <div className="flex flex-col mb-5">
                <p className="font-semibold text-sm">Price</p>
                <span className="text-sm">
                  {companyData?.subscription?.price}
                </span>
              </div>
              <div className="flex flex-col mb-5 col-span-2">
                <p className="font-semibold text-sm mb-3">Benefits</p>
                <span className="text-sm">
                  {companyData?.subscription?.benefits?.map((be, idx) => (
                    <p key={be}>
                      {idx + 1}. {be}
                    </p>
                  ))}
                </span>
              </div>
            </div>
          ) : (
            <p className="mb-3 p-3">No Subscription Taken</p>
          )}
        </div>
        <div className="mt-8 p-4  flex flex-col gap-5">
          {companyJobs?.map((job) => {
            return (
              <div className="shadow-lg p-4 rounded-lg" key={job?.id}>
                <div className="flex items-center justify-between mb-5 ">
                  <h1 className=" text-[#013D9D] text-[22px] font-medium flex gap-3 items-center">
                    {job?.job_position}{" "}
                    {job?.isOpen ? (
                      <p className="bg-green-600 text-white px-2 rounded-lg text-center text-sm font-light">
                        Open
                      </p>
                    ) : (
                      <p className="bg-red-600 text-white px-2 rounded-lg text-center text-sm font-light">
                        Closed
                      </p>
                    )}
                  </h1>
                  <div>
                    <Link
                      className="underline text-[#013D9D]"
                      to={`/applications/company/${job?.id}`}
                    >
                      See all Application
                    </Link>
                    {job?.isOpen && (
                      <Button
                        onClick={() => closeJob(job.id)}
                        type="primary"
                        danger
                        className="ml-5"
                      >
                        Close Job
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">Job Position</p>
                    <span className="text-sm">{job?.job_position}</span>
                  </div>
                  {/* <div className="flex flex-col">
                    <p className="font-semibold text-sm">Posted On</p>
                    <span className="text-sm">
                      {moment(job?.posted_on)?.format("DD-MM-YYYY")}
                    </span>
                  </div> */}
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
                    <span className="text-sm">{job?.skills_required?.join(', ')}</span>
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
                  {/* <div className="flex flex-col mb-4">
                    <p className="font-semibold text-sm">Payment Mode</p>
                    <span className="text-sm">{job?.payment_mode || "NA"}</span>
                  </div> */}
                  <div className="flex flex-col mb-4">
                    <p className="font-semibold text-sm">Benefit</p>
                    <span className="text-sm">{job?.benefits?.join(', ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CompanyInfo;
