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
import moment from "moment";
import img from "../../assets/download-1.jpeg";

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
  const [coursess, setCourses] = useState([]);
  const [skill, setSkills] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState([]);
  const [selectedVolunteertwo, setSelectedVolunteerTwo] = useState([]);
  const [welfares, setWelfares] = useState([]);
  const [isVolunteerModal, setIsVolunteerModal] = useState(false);
  const [isVolunteerModaltwo, setIsVolunteerModalTwo] = useState(false);
  const [filterMethod, setFilterMethod] = useState("");
  const [filterMethodcompany, setFilterMethodcompany] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedcompany, setSelectedcompany] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredDatatwo, setFilteredDatatwo] = useState([]);

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
        render: (text) => moment(text).format("DD-MM-YYYY"),
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
    } else if (tab === "3") {
      return [
        ...commonColumns,
        {
          title: "Email",
          dataIndex: "email_id",
          key: "email_id",
        },
        // {
        //   title: "Date & Time",
        //   dataIndex: "email_id",
        //   key: "email_id",
        // },
        {
          title: "Training Program(s)",
          dataIndex: "skills_name",
          key: "skills_name",
        },
        {
          title: "Course(s)",
          dataIndex: "courses",
          key: "courses",
        },
        {
          title: "Action",
          render: (text, record) => (
            <Button
              onClick={() => {
                setSelectedVolunteer(record);
                setIsVolunteerModal(true);
              }}
              type="link"
            >
              <DownOutlined />
            </Button>
          ),
        },
      ];
    } else if (tab == "4") {
      return [
        ...commonColumns,
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Document(s)",
          dataIndex: "document_service",
          key: "document_service",
        },

        {
          title: "Action",
          render: (text, record) => (
            <Button  onClick={() => { 
              setSelectedVolunteerTwo(record);
              setIsVolunteerModalTwo(true);
            }} type="link">
              <DownOutlined />
            </Button>
          ),
        },
      ];
    } else if (tab == "5") {
      return [
        ...commonColumns,
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Family Income",
          dataIndex: "family_income",
          key: "family_income",
        },
        {
          title: "Scheme(s)",
          dataIndex: "welfare_schemes",
          key: "welfare_schemes",
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
    setCourses(courses);

    const skillCollection = collection(db, "Skills");
    const skillSnapshot = await getDocs(query(skillCollection));
    const skills = skillSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setSkills(skills);

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
  };

  const getVolunteer = async () => {
    const volunteerCollection = collection(db, "Volunteer");
    const volunteerSnapshot = await getDocs(query(volunteerCollection));
    const volunteers = volunteerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const { courses, skills } = await getCoursesAndSkills();

    const aggregatedData = volunteers.map((volunteer) => {
      const courseInfo = volunteer.volunteer_program_model.map((courseId) => {
        return courses.find((c) => c.id === courseId);
      });

      const skills_name = courseInfo.map((course) => {
        return skills.find((sk) => sk.id == course?.skillId)?.name;
      });

      const names = courseInfo.map((course) => course?.name);
      volunteer.courses = names.join(",");
      volunteer.skills_name = skills_name.join(",");

      return volunteer;
    });

    setVolunteerData(aggregatedData);
  };

  const getDocuments = async () => {
    const documentsCollection = collection(db, "Document");
    const qry = query(documentsCollection);
    const snapshot = await getDocs(qry);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDocuments(data);
  };

  const getWelfare = async () => {
    const welfareCollection = collection(db, "Welfare");
    const qry = query(welfareCollection);
    const snapshot = await getDocs(qry);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setWelfares(data);
  };

  useEffect(() => {
    getJobSeekers();
    getSkilling();
    getVolunteer();
    getDocuments();
    getWelfare();
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

  const handelUpdateDocuments = async (status) => {
    try {
      const jobSeekerDoc = doc(db, "Document", selectedItem?.id);
      await updateDoc(jobSeekerDoc, {
        status: status,
      });
      notification.success({
        message: "Status Updated",
        description: `Document ${selectedItem?.id} has been ${status} successfully.`,
      });
      handleCancel();
      getDocuments();
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to Update Please try again later.",
      });
    }
  };
  const handelUpdateWelfare = async (status) => {
    try {
      const jobSeekerDoc = doc(db, "Welfare", selectedItem?.id);
      await updateDoc(jobSeekerDoc, {
        status: status,
      });
      notification.success({
        message: "Status Updated",
        description: `Welfare ${selectedItem?.id} has been ${status} successfully.`,
      });
      handleCancel();
      getDocuments();
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to Update Please try again later.",
      });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const showModaltwo = () => {
    setIsModalOpen(true);
  };

  const handleOktwo = () => {
    setIsModalOpen(false);
    filterData();
  };

  const handleCanceltwo = () => {
    setIsModalOpen(false);
  };
  const handleFilterChangetwo = (value) => {
    setSelectedFilter(value);
  };
  const handleFilterMethodChange = (value) => {
    setFilterMethod(value);
    setSelectedMonth("");
    setFilterMethodcompany(value);
    setSelectedcompany("");
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
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showModaltwo}>
                  Filters
                </Button>
                <Modal
                  title=""
                  visible={isModalOpen}
                  onOk={handleOktwo}
                  onCancel={handleCanceltwo}
                  footer={null}
                >
                  <h1 className="text-2xl text-[#013D9D] font-semibold mb-5">
                    Filter Jobseekers
                  </h1>
                  <div className="flex mb-6">
                    <label className="flex items-center">Fillter by</label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      onChange={handleFilterMethodChange}
                      value={filterMethod}
                      className=" mx-auto "
                    >
                      <Option value="Company">company</Option>
                      <Option value="Month">Month</Option>
                    </Select>
                  </div>

                  {filterMethod === "Company" && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        {" "}
                        Select Company
                      </label>
                      <Select
                        placeholder="Select month"
                        style={{ width: "60%" }}
                        onChange={(value) => setSelectedcompany(value)}
                        value={selectedcompany}
                        className="flex items-center"
                      >
                        <Option value="CompanyName">Company Name</Option>
                        <Option value="comapanyname">Comapany Name2</Option>
                      </Select>
                    </div>
                  )}
                  {filterMethod === "Month" && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center"> Select Month</label>
                      <Select
                        placeholder="Select month"
                        style={{ width: "70%" }}
                        onChange={(value) => setSelectedMonth(value)}
                        value={selectedMonth}
                        className="flex items-center"
                      >
                        <Option value="January">January</Option>
                        <Option value="February">February</Option>
                        <Option value="March">March</Option>
                        <Option value="April">April</Option>
                        <Option value="May">May</Option>
                        <Option value="June">June</Option>
                        <Option value="July">July</Option>
                        <Option value="August">August</Option>
                        <Option value="September">September</Option>
                        <Option value="October">October</Option>
                        <Option value="November">November</Option>
                        <Option value="December">December</Option>
                      </Select>
                    </div>
                  )}
                </Modal>
              </div>
            </div>
          </div>
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
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showModaltwo}>
                  Filters
                </Button>
                <Modal
                  visible={isModalOpen}
                  onOk={handleOktwo}
                  onCancel={handleCanceltwo}
                  footer={null}
                >
                  <h1 className="text-2xl text-[#013D9D] font-semibold mb-5">
                    Filter Skilling
                  </h1>
                  <div className="flex mb-6">
                    <label className="flex items-center">Fillter by</label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      onChange={handleFilterMethodChange}
                      value={filterMethod}
                      className=" mx-auto "
                    >
                      <Option value="Registered">Non-Registered</Option>
                      <Option value="MonSkillingth">Skilling Program</Option>
                      <Option value="Month">Month</Option>
                    </Select>
                  </div>

                  {filterMethod === "Company" && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        {" "}
                        Select Company
                      </label>
                      <Select
                        placeholder="Select month"
                        style={{ width: "60%" }}
                        onChange={(value) => setSelectedcompany(value)}
                        value={selectedcompany}
                        className="flex items-center"
                      >
                        <Option value="CompanyName">Company Name</Option>
                        <Option value="comapanyname">Comapany Name2</Option>
                      </Select>
                    </div>
                  )}
                  {filterMethod === "Month" && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center"> Select Month</label>
                      <Select
                        placeholder="Select month"
                        style={{ width: "70%" }}
                        onChange={(value) => setSelectedMonth(value)}
                        value={selectedMonth}
                        className="flex items-center"
                      >
                        <Option value="January">January</Option>
                        <Option value="February">February</Option>
                        <Option value="March">March</Option>
                        <Option value="April">April</Option>
                        <Option value="May">May</Option>
                        <Option value="June">June</Option>
                        <Option value="July">July</Option>
                        <Option value="August">August</Option>
                        <Option value="September">September</Option>
                        <Option value="October">October</Option>
                        <Option value="November">November</Option>
                        <Option value="December">December</Option>
                      </Select>
                    </div>
                  )}
                </Modal>
              </div>
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
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showModaltwo}>
                  Filters
                </Button>
                <Modal
                  visible={isModalOpen}
                  onOk={handleOktwo}
                  onCancel={handleCanceltwo}
                  footer={null}
                >
                  <h1 className="text-2xl text-[#013D9D] font-semibold mb-5">
                    Filter Volunteer
                  </h1>
                  <div className="flex mb-6">
                    <label className="flex items-center">Fillter by</label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      onChange={handleFilterMethodChange}
                      value={filterMethod}
                      className=" mx-auto "
                    >
                      <Option value="Traning">Traning Program</Option>
                      <Option value="Month">Month</Option>
                    </Select>
                  </div>

                  {filterMethod === "Traning" && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        {" "}
                        Select traning
                      </label>
                      <Select
                        placeholder="Select month"
                        style={{ width: "70%" }}
                        onChange={(value) => setSelectedcompany(value)}
                        value={selectedcompany}
                        className="flex items-center"
                      >
                        <Option value="CompanyName">Company Name</Option>
                        <Option value="comapanyname">Comapany Name2</Option>
                      </Select>
                    </div>
                  )}
                  {filterMethod === "Month" && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center"> Select Month</label>
                      <Select
                        placeholder="Select month"
                        style={{ width: "70%" }}
                        onChange={(value) => setSelectedMonth(value)}
                        value={selectedMonth}
                        className="flex items-center"
                      >
                        <Option value="January">January</Option>
                        <Option value="February">February</Option>
                        <Option value="March">March</Option>
                        <Option value="April">April</Option>
                        <Option value="May">May</Option>
                        <Option value="June">June</Option>
                        <Option value="July">July</Option>
                        <Option value="August">August</Option>
                        <Option value="September">September</Option>
                        <Option value="October">October</Option>
                        <Option value="November">November</Option>
                        <Option value="December">December</Option>
                      </Select>
                    </div>
                  )}
                </Modal>
              </div>
            </div>
          </div>
          <Table
            columns={getColumns("3")}
            dataSource={filterData(volunteerData)}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="Documents" key="4">
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
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showModaltwo}>
                  Filters
                </Button>
                <Modal
                  visible={isModalOpen}
                  onOk={handleOktwo}
                  onCancel={handleCanceltwo}
                  footer={null}
                >
                  <h1 className="text-2xl text-[#013D9D] font-semibold mb-5">
                    Filter Document
                  </h1>
                  <div className="flex mb-6">
                    <label className="flex items-center">Fillter by</label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      onChange={handleFilterMethodChange}
                      value={filterMethod}
                      className=" mx-auto "
                    >
                      <Option value="Individual">Individual</Option>
                      <Option value="Company">Company</Option>
                      <Option value="Month">Month</Option>
                    </Select>
                  </div>

                  {filterMethod === "Individual" && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        {" "}
                        Select Individual
                      </label>
                      <Select
                        placeholder="Select month"
                        style={{ width: "70%" }}
                        onChange={(value) => setSelectedcompany(value)}
                        value={selectedcompany}
                        className="flex items-center"
                      >
                        <Option value="CompanyName">Company Name</Option>
                        <Option value="comapanyname">Comapany Name2</Option>
                      </Select>
                    </div>
                  )}

                  {filterMethod === "Company" && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        {" "}
                        Select Company
                      </label>
                      <Select
                        placeholder="Select month"
                        style={{ width: "70%" }}
                        onChange={(value) => setSelectedcompany(value)}
                        value={selectedcompany}
                        className="flex items-center"
                      >
                        <Option value="CompanyName">Company Name</Option>
                        <Option value="comapanyname">Comapany Name2</Option>
                      </Select>
                    </div>
                  )}

                  {filterMethod === "Month" && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center"> Select Month</label>
                      <Select
                        placeholder="Select month"
                        style={{ width: "70%" }}
                        onChange={(value) => setSelectedMonth(value)}
                        value={selectedMonth}
                        className="flex items-center"
                      >
                        <Option value="January">January</Option>
                        <Option value="February">February</Option>
                        <Option value="March">March</Option>
                        <Option value="April">April</Option>
                        <Option value="May">May</Option>
                        <Option value="June">June</Option>
                        <Option value="July">July</Option>
                        <Option value="August">August</Option>
                        <Option value="September">September</Option>
                        <Option value="October">October</Option>
                        <Option value="November">November</Option>
                        <Option value="December">December</Option>
                      </Select>
                    </div>
                  )}
                </Modal>
              </div>
            </div>
          </div>
          <Table
            columns={getColumns("4")}
            dataSource={filterData(documents)}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="Welfare Scheme" key="5">
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
                <Option value="Rejected">Rejected</Option>
              </Select>
              <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showModaltwo}>
                  Filters
                </Button>
                <Modal
                  visible={isModalOpen}
                  onOk={handleOktwo}
                  onCancel={handleCanceltwo}
                  footer={null}
                  width="40%"
                >
                  <h1 className="text-2xl text-[#013D9D] font-semibold mb-5">
                    Filter Scheme
                  </h1>
                  <div className="flex mb-6">
                    <label className="flex items-center">Schemes</label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      className=" mx-auto "
                    >
                      <Option value="name">Individual</Option>
                      <Option value="Companys">Company</Option>
                      <Option value="Months">Month</Option>
                    </Select>
                  </div>
                  <div className="flex mb-6">
                    <label className="flex items-center">
                      Have Health Insurance
                    </label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      className=" mx-auto "
                    >
                      <Option value="Individuals">Individual</Option>
                      <Option value="Companys">Company</Option>
                      <Option value="Months">Month</Option>
                    </Select>
                  </div>
                  <div className="flex mb-6">
                    <label className="flex items-center">Have Toilet</label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      className=" mx-auto "
                    >
                      <Option value="Individuals">Individual</Option>
                      <Option value="Companys">Company</Option>
                      <Option value="Months">Month</Option>
                    </Select>
                  </div>
                  <div className="flex mb-6">
                    <label className="flex items-center">
                      Have Agricuture Land
                    </label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      className=" mx-auto "
                    >
                      <Option value="Individual">Individual</Option>
                      <Option value="Company">Company</Option>
                      <Option value="Month">Month</Option>
                    </Select>
                  </div>
                  <div className="flex mb-6">
                    <label className="flex items-center">
                      Need Farm Products
                    </label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      className=" mx-auto "
                    >
                      <Option value="Individuals">Individual</Option>
                      <Option value="Companys">Company</Option>
                      <Option value="Months">Month</Option>
                    </Select>
                  </div>
                  <div className="flex mb-6">
                    <label className="flex items-center">Month</label>
                    <Select
                      placeholder="Select filter method"
                      style={{ width: "70%" }}
                      className=" mx-auto "
                    >
                      <Option value="Individuals">Individual</Option>
                      <Option value="Companys">Company</Option>
                      <Option value="Months">Month</Option>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-[#013D9D] text-white">Apply</Button>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
          <Table
            columns={getColumns("5")}
            dataSource={filterData(welfares)}
            pagination={false}
          />
        </TabPane>
      </Tabs>
      <Modal
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
              {tab == "4" && (
                <>
                  <Button
                    danger
                    onClick={() => handelUpdateDocuments("Rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handelUpdateDocuments("Approved")}
                  >
                    Approve
                  </Button>
                </>
              )}
              {tab == "5" && (
                <>
                  <Button
                    danger
                    onClick={() => handelUpdateWelfare("Rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handelUpdateWelfare("Approved")}
                  >
                    Approve
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
            </div>
            <div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                Educational Details
              </h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Highest Qualification</p>
                  <span>ITI</span>
                </div>
                <div className="flex flex-col gap-2 mb-5">
                  <p>Trade</p>
                  <span>FILTER</span>
                </div>
              </div>

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
                Additional Details
              </h1>

              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>No information available</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <Button className="bg-[#013D9D] text-white">Completed</Button>
        </div>
      </Modal>
      
      <Modal
       open={isVolunteerModaltwo}
       onCancel={() => setIsVolunteerModalTwo(false)}
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
              {tab == "4" && (
                <>
                  <Button
                    danger
                    onClick={() => handelUpdateDocuments("Rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handelUpdateDocuments("Approved")}
                  >
                    Approve
                  </Button>
                </>
              )}
              {tab == "5" && (
                <>
                  <Button
                    danger
                    onClick={() => handelUpdateWelfare("Rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handelUpdateWelfare("Approved")}
                  >
                    Approve
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
            </div>
            <div>
              <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                Educational Details
              </h1>
              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>Highest Qualification</p>
                  <span>ITI</span>
                </div>
                <div className="flex flex-col gap-2 mb-5">
                  <p>Trade</p>
                  <span>FILTER</span>
                </div>
              </div>

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
                Additional Details
              </h1>

              <div className="grid grid-cols-3">
                <div className="flex flex-col gap-2">
                  <p>No information available</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <Button className="bg-[#013D9D] text-white">Completed</Button>
        </div>
      </Modal>

      <Modal
        open={isVolunteerModal}
        onCancel={() => setIsVolunteerModal(false)}
        width="100%"
        footer={null}
      >
        {selectedVolunteer && (
          <div className="flex  gap-8">
            <div>
              <img src={img} alt="" className="rounded-full w-20" />
            </div>
            <div className="w-full">
              <h1 className="mb-8 text-xl text-[#013D9D] font-medium">
                Personal Details
              </h1>
              <div className="grid grid-cols-5 mb-8">
                <div className="flex flex-col">
                  <p>Registration ID</p>
                  <span>ABCD12345</span>
                </div>
                <div className="flex flex-col">
                  <p>Full Name</p>
                  <span>User Name</span>
                </div>
                <div className="flex flex-col">
                  <p>Phone No.</p>
                  <span>6390569706</span>
                </div>
                <div className="flex flex-col">
                  <p>Email ID</p>
                  <span>ABCD@gmail.com</span>
                </div>
                <div className="flex flex-col mb-5">
                  <p>Linkedin Link</p>
                  <span>https://www.linkedin.com</span>
                </div>
                <div className="flex flex-col">
                  <p>Other Social Media Link</p>
                  <span>https://www.facebook.com</span>
                </div>
              </div>
              <h1 className="mb-8 text-xl text-[rgb(1,61,157)] font-medium">
                Address Details
              </h1>
              <div className="grid grid-cols-5 mb-8">
                <div className="flex flex-col">
                  <p>PIN</p>
                  <span>50049</span>
                </div>
                <div className="flex flex-col">
                  <p>State</p>
                  <span>TELENGANA</span>
                </div>
                <div className="flex flex-col">
                  <p>District</p>
                  <span>HYDERBAD</span>
                </div>
                <div className="flex flex-col">
                  <p>City/Village</p>
                  <span>HYDERBAD</span>
                </div>
              </div>

              <h1 className="mb-8 text-xl text-[#013D9D] font-medium">
                Services Details
              </h1>
              <div className="grid grid-cols-5 mb-8">
                <div className="flex flex-col">
                  <p>Service Selected</p>
                  <span>VOLUNTEER</span>
                </div>
                <div className="flex flex-col">
                  <p>Date</p>
                  <span>June 06</span>
                </div>
                <div className="flex flex-col">
                  <p>Time</p>
                  <span>10:00AM - 12:00 PM </span>
                </div>
                <div className="flex flex-col">
                  <p>Training Program(s)</p>
                  <span>DIGITAL SHALA</span>
                </div>
                <div className="flex flex-col">
                  <p>course(s)</p>
                  <span>BASIC EXCEL,BASIC PPT</span>
                </div>
              </div>
              <h1 className="mb-8 text-xl text-[#013D9D] font-medium">
                Additional Details
              </h1>
              <div className="grid grid-cols-5">
                <div className="flex flex-col">
                  <p>No. of family member</p>
                  <span>5</span>
                </div>
                <div className="flex flex-col">
                  <p>No. of female children</p>
                  <span>2</span>
                </div>
                <div className="flex flex-col">
                  <p>No. of male children</p>
                  <span>1</span>
                </div>
                <div className="flex flex-col mb-5">
                  <p>Main occupation of the family</p>
                  <span>AGRICULTURE</span>
                </div>
                <div className="flex flex-col">
                  <p>have agricultural land?</p>
                  <span>YES</span>
                </div>
                <div className="flex flex-col">
                  <p>Need any agricultural products?</p>
                  <span>YES</span>
                </div>
                <div className="flex flex-col">
                  <p>Mention agricultural products</p>
                  <span>NA</span>
                </div>
                <div className="flex flex-col">
                  <p>Have a toilet at home?</p>
                  <span>YES</span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-[#013D9D] text-white">Complete</Button>
              </div>
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
