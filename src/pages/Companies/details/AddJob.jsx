import { Button, Card, Form, Input, notification, Select } from "antd";
import { addDoc, collection, getDocs, query, where,updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../firebase";
import moment from "moment";

const AddJob = () => {
  const { id } = useParams();
  const [companyForm] = Form.useForm();

  const [companyData, setCompanyData] = useState({});
  const [otherBenefits, setOtherBenefits] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [trades, setTrades] = useState([]);
  const [educationQualification, setEducationQualification] = useState("");

  const getSuggestiveList = async () => {
    const suggestiveListCollection = collection(db, "All Suggestive Lists");

    const skillQry = query(
      suggestiveListCollection,
      where("type", "==", "Skills")
    );
    const benefitQry = query(
      suggestiveListCollection,
      where("type", "==", "Benefit")
    );
    const tradesQry = query(
      suggestiveListCollection,
      where("type", "==", "Trades")
    );

    const skillSnapshot = await getDocs(skillQry);
    const benefitSnapshot = await getDocs(benefitQry);
    const tradesQrySnapshot = await getDocs(tradesQry);

    const skillsData = skillSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const benefitsData = benefitSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const tradesData = tradesQrySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOtherBenefits(benefitsData);
    setRequiredSkills(skillsData);
    setTrades(tradesData);
  };

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
    setCompanyData(finalData);
  };

  useEffect(() => {
    getCompanyInfo();
    getSuggestiveList();
  }, []);

  const handelCreateJobPost = async (value) => {
    try {
      const job =  await addDoc(collection(db, "Jobs"), {
        benefits: value?.otherBenefits,
        company_id: id,
        experience_required: value?.experienceRequired,
        job_openings: Number(value?.numberOfOpenings),
        job_place: value?.jobPlace,
        job_position: value?.jobPosition,
        min_experience_in_months: 0,
        payout_from: Number(value?.payout_from),
        payout_to: Number(value?.payout_to),
        isOpen: true,
        max_age:Number(value?.max_age),
        min_age:Number(value?.min_age),
        posted_on: moment().format("DD-MM-YYYY HH:mm:ss"),
        qualification: value?.educationQualification,
        skills_required: value?.skillRequired,
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      });

      await updateDoc(job, { id: job?.id });

      notification.success({
        message: "Job Added",
        description: `Job has been added successfully.`,
      });
      companyForm.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to Create Please try again later.",
      });
    }
  };

  return (
    <div className="m-5">
      <h1 className="text-emerald-700 font-bold text-xl p-3 bg-emerald-700/20 rounded-lg mb-5">
        Company Details
      </h1>
      <Card className="shadow-[#013D9D]/20 shadow-md mb-8">
        <div className=" grid grid-cols-3 gap-3">
          <div>
            <p className="font-semibold">Name :</p>
            <p className="text-green-950">{companyData?.company_name}</p>
          </div>
          <div>
            <p className="font-semibold">Email :</p>
            <p className="text-green-950">{companyData?.company_email}</p>
          </div>
          <div>
            <p className="font-semibold">Phone :</p>
            <p className="text-green-950">{companyData?.company_phone}</p>
          </div>
          <div>
            <p className="font-semibold">GSTIN :</p>
            <p className="text-green-950">{companyData?.gstin}</p>
          </div>
          <div>
            <p className="font-semibold">Job Poster :</p>
            <p className="text-green-950">{companyData?.job_poster_name}</p>
          </div>
          <div>
            <p className="font-semibold">Job Poster Email :</p>
            <p className="text-green-950">{companyData?.job_poster_email}</p>
          </div>
        </div>
      </Card>
      <h1 className="text-emerald-700 font-bold text-xl p-3 bg-emerald-700/20 rounded-lg mb-5">
        Add New Job
      </h1>
      <Card className="shadow-[#013D9D]/20 shadow-md mb-8">
        <Form
          layout="vertical"
          onFinish={handelCreateJobPost}
          form={companyForm}
        >
          <div className="grid grid-cols-3 gap-2  mx-auto">
            <Form.Item
              label="Job Position"
              name="jobPosition"
              className="w-full mb-2"
              rules={[
                {
                  required: true,
                  message: "Job Position is required",
                },
                {
                  whitespace: true,
                  message: "Job Position is required",
                },
              ]}
            >
              <Input placeholder="Eg. Technician" />
            </Form.Item>
            <Form.Item
              label="Education Qualification"
              name="educationQualification"
              className="w-full mb-2"
              rules={[
                {
                  required: true,
                  message: "Education Qualification is required",
                },
                {
                  whitespace: true,
                  message: "Education Qualification is required",
                },
              ]}
            >
              <Select
                placeholder="Choose from dropdown"
                style={{
                  flex: 1,
                }}
                onChange={(e) => setEducationQualification(e)}
              >
                <Option value="5th pass">5th pass</Option>
                <Option value="8th pass">8th pass</Option>
                <Option value="10th pass">10th pass</Option>
                <Option value="12th pass">12th pass</Option>
                <Option value="12th Science">12th Science</Option>
                <Option value="ITI">ITI</Option>
                <Option value="Diploma">Diploma</Option>
                <Option value="Polytechnic">Polytechnic</Option>
                <Option value="BE / Btech">BE / Btech</Option>
                <Option value="BA">BA</Option>
                <Option value="BSC">BSC</Option>
                <Option value="MBA">MBA</Option>
                <Option value="MA">MA</Option>
                <Option value="PHD">PHD</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            {educationQualification == "ITI" && (
              <Form.Item
                label="Trade"
                name="trade"
                className="mb-2"
                rules={[
                  { required: true, message: "Trade is required" },
                  { whitespace: true, message: "Trade is required" },
                ]}
              >
                <Select
                  placeholder="Tarde"
                  style={{
                    flex: 1,
                  }}
                >
                  {trades?.map((op) => {
                    return (
                      <Option value={op?.name} key={op?.id}>
                        {op?.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            <Form.Item
              name="jobPlace"
              label="Job Place"
              className="mb-2"
              rules={[
                {
                  required: true,
                  message: "Job Place is required",
                },
              ]}
            >
              <Select
                placeholder="Place"
                mode="tags"
                style={{
                  flex: 1,
                }}
              />
            </Form.Item>
            <Form.Item
              name="experienceRequired"
              label="Experience Required"
              className="mb-2"
              rules={[
                {
                  required: true,
                  message: "Experience Required is required",
                },
              ]}
            >
              <Select
                placeholder="Experience"
                style={{
                  flex: 1,
                }}
                options={[
                  {
                    value: "Any",
                    label: "Any",
                  },
                  {
                    value: "Fresher",
                    label: "Fresher",
                  },
                  {
                    value: "Experience",
                    label: "Experience",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="skillRequired"
              label="Skill Required"
              className="mb-2"
              rules={[
                {
                  required: true,
                  message: "Skill Required is required",
                },
              ]}
            >
              <Select
                placeholder="Skills"
                mode="multiple"
                style={{
                  flex: 1,
                }}
              >
                {requiredSkills?.map((op) => {
                  return (
                    <Option value={op?.name} key={op?.id}>
                      {op?.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="numberOfOpenings"
              label="Number of Openings"
              className="mb-2"
              rules={[
                {
                  required: true,
                  message: "Number of Openings is required",
                },
                {
                  whitespace: true,
                  message: "Number of Openings is required",
                },
              ]}
            >
              <Input placeholder="Eg.100" type="number" />
            </Form.Item>
            <div className="flex items-center justify-center gap-2 w-full">
              <Form.Item
                name="payout_from"
                label="Payout From"
                className="mb-2 flex-1"
                rules={[
                  {
                    required: true,
                    message: "Payout is required",
                  },
                ]}
              >
                <Input placeholder="Eg.741234" type="number" />
              </Form.Item>
              <p>To</p>
              <Form.Item
                label="Payout To"
                name="payout_to"
                className="mb-2 flex-1"
                rules={[
                  {
                    required: true,
                    message: "Payout is required",
                  },
                ]}
              >
                <Input placeholder="Eg.741234" type="number" />
              </Form.Item>
            </div>
            <Form.Item
              name="otherBenefits"
              label="Other Benefits"
              className="mb-2"
              rules={[
                {
                  required: true,
                  message: "Other Benefits are required",
                },
              ]}
            >
              <Select
                placeholder="Other Benefits"
                mode="multiple"
                style={{
                  flex: 1,
                }}
              >
                {otherBenefits?.map((op) => {
                  return (
                    <Option value={op?.name} key={op?.id}>
                      {op?.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
                  name="min_age"
                  label="Min Age"
                  className="mb-2"
                  rules={[
                    {
                      required: true,
                      message: "Min age is required!",
                    },
                  
                  ]}
                >
                  <Input placeholder="Eg.20" type="number" />
                </Form.Item>
                <Form.Item
                  name="max_age"
                  label="Max Age"
                  className="mb-2"
                  rules={[
                    {
                      required: true,
                      message: "Max age is required!",
                    },
                  
                  ]}
                >
                  <Input placeholder="Eg.20" type="number" />
                </Form.Item>
          </div>
          <div className="flex justify-end gap-8">
            <Button
              className="px-8 py-2 bg-[#013D9D] text-white"
              htmlType="submit"
            >
              Post
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddJob;
