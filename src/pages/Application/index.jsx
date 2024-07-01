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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
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
  const [welfares, setWelfares] = useState([]);
  const [isVolunteerModal, setIsVolunteerModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const sendNotification = async (userID, message) => {
    const userRef = doc(db, "Users", userID);
    console.log("🚀 ~ sendNotification ~ userID:", userID);
    const notificationsRef = collection(userRef, "Notifications");

    const docRef = await addDoc(notificationsRef, {
      user_id: userID,
      text: message,
      sent_at: moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      image_link: null,
    });
    console.log(docRef.id);
    // Update the document with its ID
    await updateDoc(docRef, {
      id: docRef.id,
    });
  };

  const fetchPaymentData = async (transactionId) => {
    // Fetch data from the Payments collection based on transaction_id
    const paymentCollection = collection(db, "Payments");
    const paymentQuery = query(
      paymentCollection,
      where("transaction_id", "==", transactionId)
    );
    const querySnapshot = await getDocs(paymentQuery);

    if (!querySnapshot.empty) {
      // Assuming you only need the first document
      const paymentDoc = querySnapshot.docs[0];
      setPaymentData(paymentDoc.data());
    } else {
      notification.error({
        message: "Payment data not found",
        description: "Please try again later.",
      });
      console.log("No such document!");
    }
  };
  const fetchPaymentDatas = async (transactionId) => {
    console.log("🚀 ~ fetchPaymentDatas ~ transactionId:", transactionId);
    // Fetch data from the Payments collection based on transaction_id
    const paymentCollection = collection(db, "Payments");
    const paymentQuery = query(
      paymentCollection,
      where("payment_id", "==", transactionId)
    );
    const querySnapshot = await getDocs(paymentQuery);

    if (!querySnapshot.empty) {
      // Assuming you only need the first document
      const paymentDoc = querySnapshot.docs[0];
      console.log("🚀 ~ fetchPaymentDatas ~ querySnapshot:", paymentDoc.data());
      setPaymentData(paymentDoc.data());
      setModalVisible(true);
    } else {
      notification.error({
        message: "Payment data not found",
        description: "Please try again later.",
      });
      console.log("No such document!");
    }
  };

  const handleButtonClick = async (record, index = 0) => {
    if (record?.payment_id && index == 1) {
      await fetchPaymentDatas(record.payment_id);
      setModalVisible(true);
    } else if (record?.payment_id) {
      await fetchPaymentData(record.payment_id);
      setModalVisible(true);
    }
  };
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
            <>
              <Button onClick={() => showModal(record, 1)} type="link">
                <DownOutlined />
              </Button>

              {record?.payment_id && (
                <Button
                  onClick={() => handleButtonClick(record, 1)}
                  type="link"
                >
                  View Payment
                </Button>
              )}
            </>
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
            <div>
              <Button onClick={() => showModal(record)} type="link">
                <DownOutlined />
              </Button>
              {record?.payment_id && (
                <Button onClick={() => handleButtonClick(record)} type="link">
                  View Payment
                </Button>
              )}
            </div>
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
            <Button onClick={() => showModal(record)} type="link">
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
            <div>
              <Button onClick={() => showModal(record)} type="link">
                <DownOutlined />
              </Button>
            </div>
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
    console.log("🚀 ~ showModal ~ item:", item);
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
      const paymentCollection = collection(db, "Payments");
      const paymentQuery = query(
        paymentCollection,
        where("payment_id", "==", selectedItem?.payment_id)
      );
      const querySnapshot = await getDocs(paymentQuery);

      if (!querySnapshot.empty) {
        const paymentDoc = querySnapshot.docs[0];
        const data = paymentDoc.data();
        if (data.status == "Pending")
          return notification.error({
            message: "Payment data approved",
            description:
              "Payment for this job seeker have not been approved yet.",
          });
      } else {
        return notification.error({
          message: "Payment data not found",
          description: "Please try again later.",
        });
      }

      const jobSeekerDoc = doc(db, "Job Seekers", selectedItem?.id);
      await updateDoc(jobSeekerDoc, {
        status: status,
      });
      notification.success({
        message: "Status Updated",
        description: `Job Seeker ${selectedItem?.id} has been ${status} successfully.`,
      });

      sendNotification(
        selectedItem?.user_id,
        `Your request for job seeker has been ${status}`
      );
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
      sendNotification(
        selectedItem?.user_id,
        `Your request for skilling has been ${status}`
      );

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
      sendNotification(
        selectedItem?.user_id,
        `Your request for document has been ${status}`
      );

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
      sendNotification(
        selectedItem?.user_id,
        `Your request for welfare has been ${status}`
      );

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
  const handelCompleteVolunteer = async (status) => {
    try {
      const jobSeekerDoc = doc(db, "Volunteer", selectedVolunteer?.id);
      await updateDoc(jobSeekerDoc, {
        status: status,
      });
      notification.success({
        message: "Status Updated",
        description: `Volunteer ${selectedVolunteer?.id} has been ${status} successfully.`,
      });
      sendNotification(
        selectedItem?.user_id,
        `Your request for volunteer has been ${status}`
      );

      setIsVolunteerModal(false);
      getVolunteer();
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to Update Please try again later.",
      });
    }
  };
  const [applications, setApplications] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(
          collection(db, "Job Applied")
          // where("job_id", "==", id)
        );
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("🚀 ~ apps ~ apps:", apps);
        setApplications(apps);
        setFilteredApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    const getCompanies = async () => {
      const companyCollection = collection(db, "RegisterAsCompany");
      const companiesSnapshot = await getDocs(companyCollection);
      const companies = companiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllCompanies(companies);
    };

    fetchApplications();
    getCompanies();
  }, []);
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
  const handleCompanyFilterChange = (value) => {
    // setSelectedCompany(value);
    const filtered = value
      ? applications.filter((app) => app.company_id === value)
      : applications;
    setFilteredApplications(filtered);
  };
  const handleApprove = async (id, userId) => {
    try {
      const paymentDocRef = doc(db, "Payments", id);
      await updateDoc(paymentDocRef, {
        status: "Approved",
      });

      sendNotification(userId, `Your payments request  has been approved`);

      notification.success({
        message: "Payment Approved",
        description: `Payment ID ${id} has been approved successfully.`,
      });
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to approve payment. Please try again later.",
      });
    }
  };

  const handleReject = async (id) => {
    try {
      const paymentDocRef = doc(db, "Payments", id);
      await updateDoc(paymentDocRef, {
        status: "Rejected",
      });

      setModalVisible(false);
      notification.success({
        message: "Payment Rejected",
        description: `Payment ID ${id} has been rejected successfully.`,
      });
      sendNotification(userId, `Your payments request  has been rejected`);
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to reject payment. Please try again later.",
      });
    }
  };

  const handleImageDownload = () => {
    const link = document.createElement("a");
    link.href = paymentDetails?.screenshot_link;
    link.download = "payment_screenshot.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        // className="font-semibold"

        activeKey={tab}
        onChange={(w) => {
          setSearchTerm("");
          setFilterStatus("");
          setTab(w);
        }}
      >
        <TabPane
          tab={<span className="font-semibold">Job Seeker</span>}
          // tab="Job Seeker"
          key="1"
        >
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
          <div>
            <Table
              columns={getColumns("1")}
              dataSource={filterData(jobSeekerData)}
              pagination={false}
            />
          </div>
        </TabPane>
        <TabPane
          //  tab="Skilling"
          tab={<span className="font-semibold">Skilling</span>}
          key="2"
        >
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
        <TabPane
          // tab="Volunteer"
          tab={<span className="font-semibold">Volunteer</span>}
          key="3"
        >
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
              {/* <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>
                  Filters
                </Button>
              </div> */}
            </div>
          </div>
          <Table
            columns={getColumns("3")}
            dataSource={filterData(volunteerData)}
            pagination={false}
          />
        </TabPane>
        <TabPane
          tab={<span className="font-semibold">Documents</span>}
          // tab="Documents"
          key="4"
        >
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
              {/* <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>
                  Filters
                </Button>
              </div> */}
            </div>
          </div>
          <Table
            columns={getColumns("4")}
            dataSource={filterData(documents)}
            pagination={false}
          />
        </TabPane>
        <TabPane
          // tab="Welfare Scheme"
          tab={<span className="font-semibold">Welfare Scheme</span>}
          key="5"
        >
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
              {/* <div className="flex gap-2">
                <Button icon={<FilterOutlined />} onClick={showFilterModal}>
                  Filters
                </Button>
              </div> */}
            </div>
          </div>
          <Table
            columns={getColumns("5")}
            dataSource={filterData(welfares)}
            pagination={false}
          />
        </TabPane>
        <TabPane
          // tab="Job Application"
          tab={<span className="font-semibold">Job Application</span>}
          key="6"
        >
          <div>
            <Select
              placeholder="Filter by Company"
              onChange={handleCompanyFilterChange}
              style={{ marginBottom: 16, width: 200 }}
            >
              <Option value={null}>All Companies</Option>
              {allCompanies.map((company) => (
                <Option key={company.id} value={company.id}>
                  {company.company_name}
                </Option>
              ))}
            </Select>
            <Table
              dataSource={filteredApplications}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </div>
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
              <a href={selectedItem?.resume_link}>resume</a>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Personal Details"
        open={isVolunteerModal}
        onCancel={() => setIsVolunteerModal(false)}
        width="100%"
        footer={null}
      >
        {selectedVolunteer && (
          <div className="flex  gap-8">
            <div>
              {selectedVolunteer?.profile_photo ? (
                <img
                  src={selectedVolunteer?.profile_photo}
                  alt="No Image Uploaded By User"
                  className="rounded-full w-20"
                />
              ) : (
                <h1>No Image Uploaded By User</h1>
              )}
            </div>
            <div className="w-full">
              <h1 className="mb-8 text-xl text-[#013D9D] font-medium">
                Personal Details
              </h1>
              <div className="grid grid-cols-5 mb-8">
                <div className="flex flex-col">
                  <p>Registration ID</p>
                  <span>{selectedVolunteer?.id}</span>
                </div>
                <div className="flex flex-col">
                  <p>Full Name</p>
                  <span>{selectedVolunteer?.full_name}</span>
                </div>
                <div className="flex flex-col">
                  <p>Phone No.</p>
                  <span>{selectedVolunteer?.phone_number}</span>
                </div>
                <div className="flex flex-col">
                  <p>Email ID</p>
                  <span>{selectedVolunteer?.email_id}</span>
                </div>
                <div className="flex flex-col mb-5">
                  <p>Linkedin Link</p>
                  <a href={selectedVolunteer?.linkdin_link}>
                    {selectedVolunteer?.linkdin_link}
                  </a>
                </div>
                <div className="flex flex-col">
                  <p>Other Social Media Link</p>
                  {/* <span>https://www.facebook.com</span> */}
                  <a href={selectedVolunteer?.other_social_media_link}>
                    {selectedVolunteer?.other_social_media_link}
                  </a>
                </div>
              </div>
              <h1 className="mb-8 text-xl text-[rgb(1,61,157)] font-medium">
                Address Details
              </h1>
              <div className="grid grid-cols-5 mb-8">
                <div className="flex flex-col">
                  <p>PIN</p>
                  <span>{selectedVolunteer?.pin}</span>
                </div>
                <div className="flex flex-col">
                  <p>State</p>
                  <span>{selectedVolunteer?.state}</span>
                </div>
                <div className="flex flex-col">
                  <p>District</p>
                  <span>{selectedVolunteer?.district || "NA"}</span>
                </div>
                <div className="flex flex-col">
                  <p>City/Village</p>
                  <span>{selectedVolunteer?.city || "NA"}</span>
                </div>
              </div>

              <h1 className="mb-8 text-xl text-[#013D9D] font-medium">
                Services Details
              </h1>
              <div className="grid grid-cols-5 mb-8">
                {/* <div className="flex flex-col">
                  <p>Service Selected</p>
                  <span>{selectedVolunteer?.}</span>
                </div> */}
                <div className="flex flex-col">
                  <p>Date</p>
                  <span>
                    {moment(selectedVolunteer?.date_of_registration).format(
                      "DD-MM-YYYY"
                    )}
                  </span>
                </div>
                <div className="flex flex-col">
                  <p>Time</p>
                  <span>
                    {moment(selectedVolunteer?.date_of_registration).format(
                      "HH:MM:SS"
                    )}{" "}
                  </span>
                </div>
                <div className="flex flex-col">
                  <p>Status</p>
                  <span>{selectedVolunteer?.status}</span>
                </div>
                {/*    <div className="flex flex-col">
                  <p>course(s)</p>
                  <span>BASIC EXCEL,BASIC PPT</span>
                </div> */}
              </div>
              <h1 className="mb-8 text-xl text-[#013D9D] font-medium">
                Additional Details
              </h1>
              <div className="grid grid-cols-5">
                <div className="flex flex-col">
                  <p>No. of family member</p>
                  <span>
                    {selectedVolunteer?.number_of_family_members || 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <p>No. of female children</p>
                  <span>
                    {selectedVolunteer?.number_of_female_children || 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <p>No. of male children</p>
                  <span>{selectedVolunteer?.number_of_male_children || 0}</span>
                </div>
                <div className="flex flex-col mb-5">
                  <p>Main occupation of the family</p>
                  <span>
                    {selectedVolunteer?.main_occupation_of_family || "NA"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <p>have agricultural land?</p>
                  <span>
                    {selectedVolunteer?.do_you_have_agriculture_land
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <p>Need any agricultural products?</p>
                  <span>YES</span>
                </div>
                <div className="flex flex-col">
                  <p>Mention agricultural products</p>
                  <span>
                    {selectedVolunteer?.do_you_need_any_farming_products
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <p>Have a toilet at home?</p>
                  <span>
                    {selectedVolunteer?.do_you_have_toilet_at_home
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                {selectedVolunteer?.status !== "Completed" && (
                  <Button
                    className="bg-[#013D9D] text-white"
                    onClick={() => handelCompleteVolunteer("Completed")}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* <Modal
        open={isVolunteerModal}
        onCancel={() => setIsVolunteerModal(false)}
        width="100%"
        footer={null}
      >
        {selectedVolunteer && (

        )}
      </Modal> */}

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
      <Modal
        title="Payment Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1200}
        // className="w-full"
      >
        {paymentData ? (
          <div>
            <div className="flex items-center justify-center p-5">
              <div className="w-full">
                <div className="border-t border-gray-300 pt-5">
                  <div className="flex justify-evenly gap-5">
                    <div className="col-span-1 flex flex-col items-center">
                      <img
                        src={paymentData?.screenshot_link}
                        alt="Payment Screenshots"
                        className="w-[250px] h-[450px]"
                      />
                      <a
                        href={paymentData?.screenshot_link}
                        download="payment_screenshot.png"
                        className="mt-3 bg-blue-500 text-white py-2 px-16 rounded"
                        onClick={handleImageDownload}
                      >
                        Download Image
                      </a>
                    </div>
                    <div>
                      <h1 className="text-2xl text-[#013D9D] font-medium mb-5">
                        Personal Details
                      </h1>
                      <div className="grid grid-cols-5  mb-16">
                        <div className="flex flex-col gap-3">
                          <p className="font-semibold">Phone No.</p>
                          <span>{paymentData?.phone_number}</span>
                        </div>
                        <div className="flex flex-col gap-3">
                          <p className="font-semibold">Full Name.</p>
                          <span>{paymentData?.full_name}</span>
                        </div>

                        <div className="flex flex-col gap-3">
                          <p className="font-semibold">Email Id</p>
                          <span>{paymentData?.email_id}</span>
                        </div>
                        <div className="flex flex-col gap-3 ">
                          <p className="font-semibold">Registration ID</p>
                          <span>{paymentData?.user_id}</span>
                        </div>
                      </div>
                      <h1 className="text-2xl text-[#013D9D] font-medium mb-5">
                        Payment Details
                      </h1>

                      <div className="grid grid-cols-5 gap-14">
                        <div className="flex flex-col gap-3">
                          <p className="font-semibold">Payment Amount</p>
                          <span>{paymentData?.amount}</span>
                        </div>
                        <div className="flex flex-col gap-3">
                          <p className="font-semibold">Registration Fee paid</p>
                          <span>{paymentData?.amount}</span>
                        </div>
                        <div className="flex flex-col gap-3">
                          <p className="font-semibold">Transaction Id</p>
                          <span>{paymentData?.transaction_id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {paymentData?.status == "Pending" && (
                    <div className="flex justify-end mt-5">
                      <button
                        onClick={() =>
                          handleReject(paymentData?.id, paymentData?.user_id)
                        }
                        className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          handleApprove(paymentData?.id, paymentData?.user_id)
                        }
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default Applications;
