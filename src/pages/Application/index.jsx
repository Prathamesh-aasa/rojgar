import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Menu,
  Tabs,
  Select,
  Input,
  Modal,
  notification,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import {
  FilterOutlined,
  DownloadOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { db } from "../../../firebase";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";

const { Option } = Select;

const Applications = () => {
  const [tab, setTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSendNotificationModalVisible, setIsSendNotificationModalVisible] =
    useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const [aggregatedData, setAggregatedData] = useState([]);
  const [jobSeekerData, setJobSeekerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const getColumns = (tab) => {
    const commonColumns = [
      {
        title: "Name",
        dataIndex: "full_name",
        key: "full_name",
      },
      {
        title: "Registration ID",
        dataIndex: "id",
        key: "id",
      },

      {
        title: "Phone Number",
        dataIndex: "phone_number",
        key: "phone_number",
      },
      {
        title: "Date of Registration",
        dataIndex: "date_of_registration",
        key: "date_of_registration",
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
      },
    ];

    if (tab === "1") {
      return [
        ...commonColumns,
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Applied Company",
          dataIndex: "company_name",
          key: "company_name",
        },
        {
          title: "Applied Post",
          key: "job_you_want_to_apply",
          dataIndex: "job_you_want_to_apply",
        },
        {
          title: "Action",
          render: (text, record) => (
            <Button onClick={() => showModal(record)} type="link">
              <DownOutlined />
            </Button>
          ),
        },
      ];
    } else if (tab === "2") {
      return [
        ...commonColumns,
        {
          title: "Email",
          dataIndex: "email_id",
          key: "email_id",
        },
        {
          title: "Skilling Program",
          dataIndex: "skill_name",
          key: "skill_name",
        },
        {
          title: "Course",
          key: "course_name",
          dataIndex: "course_name",
        },
        {
          title: "Action",
          render: (text, record) => (
            <Button onClick={() => showModal(record)} type="link">
              <DownOutlined />
            </Button>
          ),
        },
      ];
    }

    return commonColumns;
  };

  const getJobSeekers = async () => {
    const jobSeekerCollection = collection(db, "Job Seekers");
    const qry = query(jobSeekerCollection);
    const snapshot = await getDocs(qry);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJobSeekerData(data);
  };

  const getCoursesAndSkills = async () => {
    const courseCollection = collection(db, "Courses");
    const courseSnapshot = await getDocs(query(courseCollection));
    const courses = courseSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const skillCollection = collection(db, "Skills");
    const skillSnapshot = await getDocs(query(skillCollection));
    const skills = skillSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { courses, skills };
  };

  const getSkilling = async () => {
    const skillingCollection = collection(db, "Skilling");
    const skillingSnapshot = await getDocs(query(skillingCollection));
    const skillingData = skillingSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const { courses, skills } = await getCoursesAndSkills();

    const aggregatedData = skillingData.map((skillingItem) => {
      const courseItem = courses.find(
        (course) => course.id === skillingItem.course_id
      );
      const skillItem = skills.find(
        (skill) => skill.id === skillingItem.skilling_proram_id
      );
      return {
        ...skillingItem,
        course_name: courseItem ? courseItem.name : "",
        skill_name: skillItem ? skillItem.name : "",
      };
    });

    setAggregatedData(aggregatedData);
    console.log("🚀 ~ getSkilling ~ aggregatedData:", aggregatedData);
  };

  useEffect(() => {
    getJobSeekers();
    getSkilling();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
  };

  const filterData = (data) => {
    return data.filter((item) => {
      const matchesSearch = item.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "" || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };

  const showModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showSendNotificationModal = () => {
    setIsSendNotificationModalVisible(true);
  };

  const handleSendNotificationOk = () => {
    setIsSendNotificationModalVisible(false);
  };

  const handleSendNotificationCancel = () => {
    setIsSendNotificationModalVisible(false);
  };

  const showFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterOk = () => {
    setIsFilterModalVisible(false);
  };

  const handleFilterCancel = () => {
    setIsFilterModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
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
    {
      title: "Date of Registration",
      dataIndex: "date_of_registration",
      key: "date_of_registration",
    },
    tab == "1" && {
      title: "Applied Company",
      dataIndex: "company_name",
      key: "company_name",
    },
    tab == "1" && {
      title: "Applied Post",
      key: "job_you_want_to_apply",
      dataIndex: "job_you_want_to_apply",
    },
    tab == "2" && {
      title: "Skilling Program",
      dataIndex: "company_name",
      key: "company_name",
    },
    tab == "2" && {
      title: "Course",
      key: "job_you_want_to_apply",
      dataIndex: "job_you_want_to_apply",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Action",
      render: (text, record) => (
        <Button onClick={() => showModal(record)} type="link">
          <DownOutlined />
        </Button>
      ),
    },
  ];

  const data = [
    {
      key: 1,
      name: "Candidate Name",
      registrationId: "ABCD1234",
      email: "candidate@gmail.com",
      phoneNumber: "+91 9876543210",
      dateOfRegistration: "31 March 2023",
      appliedCompany: "Tata Motors",
      appliedPost: "Technician",
    },
    {
      key: 2,
      name: "Candidate Name",
      registrationId: "ABCD1254",
      email: "candidate@gmail.com",
      phoneNumber: "+91 987654546",
      dateOfRegistration: "31 March 2020",
      appliedCompany: "Tata Motors car",
      appliedPost: "Technician",
    },
  ];

  const handelUpdate = async (status) => {
    try {
      const jobSeekerDoc = doc(db, "Job Seekers", selectedItem?.id);
      await updateDoc(jobSeekerDoc, {
        status: status,
      });
      notification.success({
        message: "Status Updated",
        description: `Job Seeker ${selectedItem?.id} has been ${status} successfully.`,
      });
      handleCancel();
      getJobSeekers();
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to Update Please try again later.",
      });
    }
  };
  const handelCompleteSkilling = async () => {
    try {
      const skillingDoc = doc(db, "Skilling", selectedItem?.id);
      await updateDoc(skillingDoc, {
        status: "Completed",
      });
      notification.success({
        message: "Status Updated",
        description: `Skilling ${selectedItem?.id} has been Completed successfully.`,
      });
      handleCancel();
      getSkilling();
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to Update Please try again later.",
      });
    }
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
        <h1 className="text-xl">Applications</h1>
        <div className="flex gap-4">
          {/* <Button type="primary" onClick={showSendNotificationModal}>
            <SendOutlined /> Send Notification
          </Button> */}
          {/* <Button type="primary">
            <DownloadOutlined /> Download
          </Button> */}
        </div>
      </div>
      <Tabs
        activeKey={tab}
        onChange={(w) => {
          setSearchTerm("");
          setFilterStatus("");
          setTab(w);
        }}
      >
        <TabPane tab="Job Seeker" key="1">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input
                placeholder="Search"
                className="w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <Option value="">All</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
            </div>
          </div>
          <Table
            columns={getColumns("1")}
            dataSource={filterData(jobSeekerData)}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="Skilling" key="2">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input
                placeholder="Search"
                className="w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <Option value="">All</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Completed">Completed</Option>
                {/* <Option value="Rejected">Rejected</Option> */}
              </Select>
              {/* <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>
                  Filters
                </Button>
              </div> */}
            </div>
          </div>
          <Table
            columns={getColumns("2")}
            dataSource={filterData(aggregatedData)}
            // dataSource={aggregatedData}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="Volunteer" key="3">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input placeholder="Search" className="w-full" />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
              >
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>
                  Filters
                </Button>
              </div>
            </div>
          </div>
          <Table
            columns={getColumns("3")}
            dataSource={data}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="Documents" key="4">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input placeholder="Search" className="w-full" />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
              >
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>
                  Filters
                </Button>
              </div>
            </div>
          </div>
          <Table columns={columns} dataSource={data} pagination={false} />
        </TabPane>
        <TabPane tab="Welfare Scheme" key="5">
          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-5">
              <Input placeholder="Search" className="w-full" />
              <Select
                placeholder="Select payment method"
                style={{ width: 200 }}
              >
                <Option value="">All</Option>
                <Option value="Online Payment">Online Payment</Option>
                <Option value="Manual Payment">Manual Payment</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>
                  Filters
                </Button>
              </div>
            </div>
          </div>
          <Table columns={columns} dataSource={data} pagination={false} />
        </TabPane>
      </Tabs>
      <Modal
        title="Details"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ top: 20 }}
        width="100%"
        className="h-fit"
        footer={
          selectedItem?.status == "Pending" && (
            <>
              {tab == "1" && (
                <>
                  <Button danger onClick={() => handelUpdate("Rejected")}>
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handelUpdate("Approved")}
                  >
                    Approve
                  </Button>
                </>
              )}
              {tab == "2" && (
                <>
                  <Button
                    type="primary"
                    onClick={() => handelCompleteSkilling()}
                  >
                    Complete
                  </Button>
                </>
              )}
            </>
          )
        }
      >
        {selectedItem && (
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
              {tab == "1" ? (
                <>
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
                        {selectedItem?.do_you_have_agriculture_land
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>Mention agricultural products</p>
                      <span>{selectedItem?.farming_product}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>Have a toilet at home?</p>
                      <span>
                        {selectedItem?.do_you_have_toilet_at_home
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </div>
                  <a href={selectedItem?.resume_link}>resume</a>
                </>
              ) : (
                "No information available"
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Send Notification"
        open={isSendNotificationModalVisible}
        onOk={handleSendNotificationOk}
        onCancel={handleSendNotificationCancel}
        style={{ top: 0 }}
        width="50%"
        className="h-fit"
      >
        <div className="flex flex-col gap-4">
          <Input placeholder="Notification Title" />
          <Input.TextArea placeholder="Notification Message" rows={4} />
        </div>
      </Modal>

      <Modal
        title="Filters"
        open={isFilterModalVisible}
        onOk={handleFilterOk}
        onCancel={handleFilterCancel}
        style={{ top: 0 }}
        width="50%"
        className="h-fit"
      >
        <div className="flex flex-col gap-4">
          <Input placeholder="Filter by Registration ID" />
          <Input placeholder="Filter by Email" />
          <Input placeholder="Filter by Phone Number" />
          <Input placeholder="Filter by Date of Registration" />
          <Select
            placeholder="Filter by Applied Company"
            style={{ width: "100%" }}
          >
            <Option value="Tata Motors">Tata Motors</Option>
            <Option value="AASA TECHNOLOGIES">AASA TECHNOLOGIES</Option>
          </Select>
          <Select
            placeholder="Filter by Applied Post"
            style={{ width: "100%" }}
          >
            <Option value="Technician">Technician</Option>
            <Option value="Fitter">Fitter</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default Applications;
