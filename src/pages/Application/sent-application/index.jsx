import React, { useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { DownOutlined,FilePdfOutlined} from "@ant-design/icons";
import { Link } from "react-router-dom";

const ApplicantTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const resumeLink = "https://example.com/resume.pdf";
  const uploadDate = "June 25, 2024";

  const [form] = Form.useForm();

  const data = Array.from({ length: 15 }, (_, index) => ({
    key: index,
    name: "Candidate Name",
    registrationId: "ABCD1234",
    email: "candidate@gmail.com",
    phoneNumber: "+91 9876543210",
    dateOfRegistration: "31 March 2023",
    appliedCompany: "Tata Motors",
    appliedPost: "Technician",
  }));

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
      render: (text) => <a href="#">{text}</a>,
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
      title: "Applied Company",
      dataIndex: "appliedCompany",
      key: "appliedCompany",
    },
    {
      title: "Applied Post",
      render: (text, record) => (
        <Button onClick={() => showModal(record)} type="link">
          Technicuan <DownOutlined />
        </Button>
      ),
    },
  ];

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Handle the form submission here (e.g., update the data or perform any other actions)
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const showModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  return (
    <div className="p-4">
      <div>
        <p className="text-base mb-5">
          Dashboard <span className="text-[#F7B652]">&gt;</span> Company{" "}
          <span className="text-[#F7B652]">&gt;</span> Sent Application
        </p>
      </div>
      <h2 className="text-xl font-bold mb-4">Sent Applicants</h2>
      <Table columns={columns} dataSource={data} pagination={false} />

      <Modal
        title="Edit Technician"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="100%"
        className="h-fit top-5 w-full"
        footer={false}
      >
        <div className="flex flex-col">
          <div className="flex justify-evenly">
            <div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                Personals Details
              </h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Registration ID</p>
                  <span>{selectedItem?.id}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>First Name</p>
                  <span>{selectedItem?.full_name?.split(" ")[0]}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Last Name</p>
                  <span>{selectedItem?.full_name?.split(" ")[1]}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Phone Number</p>
                  <span>{selectedItem?.phone_number}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Email</p>
                  <span>{selectedItem?.email}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Date of Registration</p>
                  <span>{selectedItem?.date_of_registration}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Applied Company</p>
                  <span>{selectedItem?.company_name}</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <p>Applied Post</p>
                  <span>{selectedItem?.job_you_want_to_apply}</span>
                </div>
              </div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                Address Details
              </h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>PIN</p>
                  <span>{selectedItem?.pin}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>State</p>
                  <span>{selectedItem?.state}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>District</p>
                  <span>{selectedItem?.district}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>City/village</p>
                  <span>{selectedItem?.city}</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <p>Address</p>
                  <span>{selectedItem?.address}</span>
                </div>
              </div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                Educational & Professional Details
              </h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Highest Qualification</p>
                  <span>{selectedItem?.highest_qualification}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Trade</p>
                  <span>{selectedItem?.trade}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Experience</p>
                  <span>{selectedItem?.years_of_experience}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Company Name</p>
                  <span>{selectedItem?.company_name}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Area of Experience</p>
                  <span>{selectedItem?.area_of_experience}</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <p>Years of Experience</p>
                  <span>{selectedItem?.years_of_experience}</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                Documents & Service Details
              </h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Aadhaar No.</p>
                  <span>{selectedItem?.adhaar_card_number}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Pan No.</p>
                  <span>{selectedItem?.pan_card_number}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Service Selected</p>
                  <span>{selectedItem?.profile_type}</span>
                </div>
              </div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                Other Details
              </h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Job you want to apply</p>
                  <span>{selectedItem?.job_you_want_to_apply}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Location of work</p>
                  <span>{selectedItem?.preferred_city_of_work}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Any criminal record</p>
                  <span>
                    {selectedItem?.do_you_have_any_criminal_record
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Registration Fee paid</p>
                  <span>{selectedItem?.fee_paid}</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <p>Driving license</p>
                  <span>
                    {selectedItem?.do_you_have_any_driving_license
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
              </div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                Additional Details
              </h1>

              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>No. of family member</p>
                  <span>{selectedItem?.number_of_family_members}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>No. of female children</p>
                  <span>{selectedItem?.number_of_female_children}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>No. of male children</p>
                  <span>{selectedItem?.number_of_male_children}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Main occupation of the family</p>
                  <span>{selectedItem?.main_occupation_of_family}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Need any agricultural products?</p>
                  <span>
                    {selectedItem?.do_you_need_any_farming_products
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>have agricultural land?</p>
                  <span>
                    {selectedItem?.do_you_have_agriculture_land ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Mention agricultural products</p>
                  <span>{selectedItem?.farming_product}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Have a toilet at home?</p>
                  <span>
                    {selectedItem?.do_you_have_toilet_at_home ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow w-[60%]">
                <div className="mr-4">
                  <FilePdfOutlined className="text-2xl text-blue-700" />
                </div>
                <div>
                  <a
                    href={resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-bold hover:underline"
                  >
                    Resume.pdf
                  </a>
                  <p className="block text-sm text-gray-500">
                    Uploaded on {uploadDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <Button className="bg-[#FFE4E4] text-[#CD2424]">Reject</Button>
            <Button className="bg-[#013D9D] text-white">Complete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicantTable;
