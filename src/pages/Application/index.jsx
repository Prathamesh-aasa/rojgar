import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tabs,
  Select,
  Input,
  Modal,
  notification,
  Form,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import { db } from "../../../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import { FileTextIcon } from "lucide-react";
import { Sorter } from "../../utils/sorter";
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
  const [jobApplicationModal, setJobApplicationModal] = useState(false);
  const [jobApplicationData, setJobApplicationData] = useState(false);
  const [addManualPaymentDataModal, setAddManualPaymentDataModal] =
    useState(false);
  const [volPaymentData, setVolPaymentData] = useState(null);
  const [secondPaymentData, setSecondPaymentData] = useState(null);

  const sendNotification = async (userID, message) => {
    const userRef = doc(db, "Users", userID);
    const notificationsRef = collection(userRef, "Notifications");

    const docRef = await addDoc(notificationsRef, {
      user_id: userID,
      text: message,
      read: false,
      sent_at: moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      image_link: null,
    });
    console.log(docRef.id);
    // Update the document with its ID
    await updateDoc(docRef, {
      id: docRef.id,
    });
  };

  const fetchSecondPaymentData = async (transactionId) => {
    const paymentCollection = collection(db, "Payments");
    const paymentQuery = query(
      paymentCollection,
      where("id", "==", transactionId)
    );
    const querySnapshot = await getDocs(paymentQuery);

    if (!querySnapshot.empty) {
      const paymentDoc = querySnapshot.docs[0];
      console.log("🚀 ~ fetchSecondPaymentData ~ paymentDoc:", paymentDoc);
      setSecondPaymentData(paymentDoc.data());
    } else {
      notification.error({
        message: "Payment data not found",
        description: "Please try again later.",
      });
    }
  };
  const fetchPaymentData = async (transactionId) => {
    const paymentCollection = collection(db, "Payments");
    const paymentQuery = query(
      paymentCollection,
      where("id", "==", transactionId)
    );
    const querySnapshot = await getDocs(paymentQuery);

    if (!querySnapshot.empty) {
      const paymentDoc = querySnapshot.docs[0];
      setVolPaymentData(paymentDoc.data());
      setAddManualPaymentDataModal(true);
    } else {
      notification.error({
        message: "Payment data not found",
        description: "Please try again later.",
      });
    }
  };
  const fetchPaymentDatas = async (transactionId) => {
    setSecondPaymentData(null);
    const paymentCollection = collection(db, "Payments");
    const paymentQuery = query(
      paymentCollection,
      where("id", "==", transactionId)
    );
    const querySnapshot = await getDocs(paymentQuery);

    if (querySnapshot.docs.length != 0) {
      const paymentDoc = querySnapshot.docs[0];
      setPaymentData(paymentDoc.data());
      setModalVisible(true);
    } else {
      notification.error({
        message: "Payment data not found",
        description: "Please try again later.",
      });
    }
  };

  const handleButtonClick = async (record, index = 0) => {
    setSelectedItem(record);
    // if (record?.payment_id && index == 1) {
    // setModalVisible(true);
    await fetchPaymentDatas(record.payment_id);
    if (record?.complete_payment_id && record?.complete_payment_id !== "")
      await fetchSecondPaymentData(record?.complete_payment_id);
    // } else if (record?.payment_id) {
    // setModalVisible(true);
    // await fetchPaymentData(record.payment_id);
    // }
  };
  const getColumns = (tab) => {
    const commonColumns = [
      {
        title: "Name",
        dataIndex: "full_name",
        key: "full_name",
        sorter: (a, b) =>
          a?.full_name
            ?.toLowerCase()
            ?.localeCompare(b?.full_name?.toLowerCase()),
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
        sorter: (a, b) => a?.phone_number?.localeCompare(b?.phone_number),
        // sorter: Sorter.DEFAULT,
      },
      {
        title: "Date of Registration",
        dataIndex: "date_of_registration",
        key: "date_of_registration",
        sorter: (dateA, dateB) =>
          moment(dateA?.date_of_registration).diff(
            moment(dateB?.date_of_registration)
          ),
        render: (text) => moment(text).format("DD-MM-YYYY"),
      },
    ];

    if (tab === "1") {
      return [
        ...commonColumns,
        {
          title: "Status",
          key: "status",
          dataIndex: "status",
          sorter: (a, b) =>
            a?.status?.toLowerCase()?.localeCompare(b?.status?.toLowerCase()),
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          sorter: (a, b) =>
            a?.email?.toLowerCase()?.localeCompare(b?.email?.toLowerCase()),
        },
        {
          title: "Applied Company",
          dataIndex: "company_name",
          key: "company_name",
          sorter: (a, b) =>
            a?.company_name
              ?.toLowerCase()
              ?.localeCompare(b?.company_name?.toLowerCase()),
        },
        {
          title: "Applied Post",
          key: "job_you_want_to_apply",
          dataIndex: "job_you_want_to_apply",
          sorter: (a, b) =>
            a?.job_you_want_to_apply
              ?.toLowerCase()
              ?.localeCompare(b?.job_you_want_to_apply?.toLowerCase()),
        },
        {
          title: "Action",
          render: (text, record) => (
            <>
              <Button onClick={() => showModal(record, 1)} type="link">
                <DownOutlined />
              </Button>

              {record?.payment_id != "" && (
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
          title: "Status",
          key: "status",
          dataIndex: "status",
          sorter: (a, b) =>
            a?.status?.toLowerCase()?.localeCompare(b?.status?.toLowerCase()),
        },
        {
          title: "Email",
          dataIndex: "email_id",
          key: "email_id",
          sorter: (a, b) =>
            a?.email_id
              ?.toLowerCase()
              ?.localeCompare(b?.email_id?.toLowerCase()),
        },
        {
          title: "Skilling Program",
          dataIndex: "skill_name",
          key: "skill_name",
          sorter: (a, b) =>
            a?.skill_name
              ?.toLowerCase()
              ?.localeCompare(b?.skill_name?.toLowerCase()),
        },
        {
          title: "Course",
          key: "course_name",
          dataIndex: "course_name",

          sorter: (a, b) =>
            a?.course_name
              ?.toLowerCase()
              ?.localeCompare(b?.course_name?.toLowerCase()),
        },
        {
          title: "Action",
          render: (text, record) => (
            <div>
              <Button onClick={() => showModal(record)} type="link">
                <DownOutlined />
              </Button>
              {record?.payment_id != "" && record?.course_amount != 0 && (
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
        // {
        //   title: "Status",
        //   key: "status",
        //   dataIndex: "status",

        //   sorter: (a, b) =>
        //     a?.status?.toLowerCase()?.localeCompare(b?.status?.toLowerCase()),
        // },
        {
          title: "Status",
          key: "status",
          dataIndex: "status",
          render: (text, record) => {
            let overallStatus = "Completed";
            if (record?.programs) {
              record.programs.map((pr) => {
                if (pr?.status?.toLowerCase() != "completed") {
                  overallStatus = "Pending";
                }
              });
            }
            return overallStatus;
          },
        },
        {
          title: "Email",
          dataIndex: "email_id",
          key: "email_id",
          sorter: (a, b) =>
            a?.email_id
              ?.toLowerCase()
              ?.localeCompare(b?.email_id?.toLowerCase()),
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
          sorter: (a, b) =>
            a?.skills_name
              ?.toLowerCase()
              ?.localeCompare(b?.skills_name?.toLowerCase()),
        },
        {
          title: "Course(s)",
          dataIndex: "courses",
          key: "courses",
          sorter: (a, b) =>
            a?.courses?.toLowerCase()?.localeCompare(b?.courses?.toLowerCase()),
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
          title: "Status",
          key: "status",
          dataIndex: "status",
          sorter: (a, b) =>
            a?.status?.toLowerCase()?.localeCompare(b?.status?.toLowerCase()),
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          sorter: (a, b) =>
            a?.email?.toLowerCase()?.localeCompare(b?.email?.toLowerCase()),
        },
        {
          title: "Document(s)",
          dataIndex: "document_service",
          key: "document_service",
          sorter: (a, b) =>
            a?.document_service
              ?.toLowerCase()
              ?.localeCompare(b?.document_service?.toLowerCase()),
        },

        {
          title: "Action",
          render: (text, record) => (
            <div className="flex">
              <Button onClick={() => showModal(record)} type="link">
                <DownOutlined />
              </Button>
              {record?.payment_id != "" && (
                <Button onClick={() => handleButtonClick(record)} type="link">
                  View Payment
                </Button>
              )}
            </div>
          ),
        },
      ];
    } else if (tab == "5") {
      return [
        ...commonColumns,
        {
          title: "Status",
          key: "status",
          dataIndex: "status",
          sorter: (a, b) =>
            a?.status?.toLowerCase()?.localeCompare(b?.status?.toLowerCase()),
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          sorter: (a, b) =>
            a?.email?.toLowerCase()?.localeCompare(b?.email?.toLowerCase()),
        },
        {
          title: "Family Income",
          dataIndex: "family_income",
          key: "family_income",
          sorter: (a, b) =>
            a?.family_income
              ?.toLowerCase()
              ?.localeCompare(b?.family_income?.toLowerCase()),
        },
        {
          title: "Scheme(s)",
          dataIndex: "welfare_schemes",
          key: "welfare_schemes",
          sorter: (a, b) =>
            a?.welfare_schemes
              ?.toLowerCase()
              ?.localeCompare(b?.welfare_schemes?.toLowerCase()),
        },
        {
          title: "Action",
          render: (text, record) => (
            <div>
              <Button onClick={() => showModal(record)} type="link">
                <DownOutlined />
              </Button>

              {record?.payment_id != "" && (
                <Button onClick={() => handleButtonClick(record)} type="link">
                  View Payment
                </Button>
              )}
            </div>
          ),
        },
      ];
    }

    return commonColumns;
  };

  const getJobSeekers = async () => {
    const jobSeekerCollectionRef = collection(db, "Job Seekers");
    const q = query(jobSeekerCollectionRef, orderBy("full_name", "asc"));
    const querySnapshot = await getDocs(q);
    const jobSeekerData = [];
    querySnapshot.forEach((doc) => {
      jobSeekerData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setJobSeekerData(jobSeekerData);
    // setJobSeekerData(data);
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
    const skillingSnapshot = await getDocs(
      query(skillingCollection, orderBy("date_of_registration", "desc"))
    );
    const skillingData = skillingSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const { courses, skills } = await getCoursesAndSkills();

    // Function to perform case-insensitive comparison
    const compareIgnoreCase = (str1, str2) => {
      return str1.localeCompare(str2, undefined, { sensitivity: "accent" });
    };

    const aggregatedData = skillingData.map((skillingItem) => {
      console.log(
        "🚀 ~ aggregatedData ~ skillingItem:",
        skillingItem?.skilling_proram_id
      );
      const courseItem = courses.find(
        (course) => course?.id == skillingItem?.course_id
      );
      const skillItem = skills.find(
        (skill) => skill?.id == skillingItem?.skilling_proram_id
      );

      return {
        ...skillingItem,
        course_name: courseItem ? courseItem.name : "",
        course_amount: courseItem ? courseItem.fee : "",
        isFree: courseItem ? courseItem.isFree : "",
        skill_name: skillItem ? skillItem.name : "",
      };
    });

    // Sort aggregatedData by course_name or skill_name (case-insensitive)
    // aggregatedData.sort(
    //   (a, b) =>
    //     compareIgnoreCase(a.course_name, b.course_name) ||
    //     compareIgnoreCase(a.skill_name, b.skill_name)
    // );

    setAggregatedData(aggregatedData);
    console.log("🚀 ~ getSkilling ~ aggregatedData:", aggregatedData);
  };

  const getVolunteer = async () => {
    try {
      const volunteerCollection = collection(db, "Volunteer");
      const volunteerSnapshot = await getDocs(volunteerCollection);

      const { courses, skills } = await getCoursesAndSkills();

      const aggregatedData = await Promise.all(
        volunteerSnapshot.docs.map(async (doc) => {
          const volunteer = {
            id: doc.id,
            ...doc.data(),
          };

          const programsRef = collection(db, "Volunteer", doc.id, "Programs");
          const programsSnapshot = await getDocs(programsRef);

          const programsData = programsSnapshot.docs.map((programDoc) => ({
            id: programDoc.id,
            ...programDoc.data(),
          }));
          volunteer.programs = programsData;

          const courseInfo = volunteer.programs.map((program) => {
            return courses.find((c) => c.id === program.courseId);
          });

          const skillsName = courseInfo.map((program) => {
            return skills.find((sk) => sk.id === program.skillId)?.name;
          });

          volunteer.courses = courseInfo
            .map((program) => program.name)
            .join(",");
          volunteer.skills_name = skillsName.join(",");

          return volunteer;
        })
      );

      // Set aggregated data to state or perform further operations
      setVolunteerData(aggregatedData);
      console.log("🚀 ~ getVolunteerData ~ aggregatedData:", aggregatedData);
    } catch (error) {
      console.error("Error fetching volunteer data:", error);
    }
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
    console.log("🚀 ~ getDocuments ~ data:", data);
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
      if (status == "Rejected") {
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
        return;
      }
      const paymentCollection = collection(db, "Payments");
      const paymentQuery = query(
        paymentCollection,
        where("payment_id", "==", selectedItem?.payment_id)
      );
      const querySnapshot = await getDocs(paymentQuery);

      if (!querySnapshot.empty) {
        const paymentDoc = querySnapshot.docs[0];
        const data = paymentDoc.data();
        if (data.status == "Pending" || data.status == "Rejected") {
          return notification.error({
            message: "Payment data approved",
            description: "Payment for this job seeker have not been approved.",
          });
        } else {
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
        }
      } else {
        return notification.error({
          message: "Payment data not found",
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to Update Please try again later.",
      });
    }
  };
  const handelCompleteSkilling = async () => {
    console.log("ccccccccccccccccccccccccc");
    try {
      const paymentCollection = collection(db, "Payments");
      const paymentQuery = query(
        paymentCollection,
        where("id", "==", selectedItem?.payment_id)
      );
      const querySnapshot = await getDocs(paymentQuery);
      if (!querySnapshot.empty) {
        const paymentDoc = querySnapshot.docs[0];
        const data = paymentDoc.data();
        if (data.status == "Pending" || data.status == "Rejected")
          return notification.error({
            message: "Payment",
            description: "Payment for this skilling have not been approved.",
          });
      }
      const skillingDoc = doc(db, "Skilling", selectedItem?.id);
      await updateDoc(skillingDoc, {
        status: "Completed",
      });
      notification.success({
        message: "Status Updated",
        description: `Skilling ${selectedItem?.id} has been Completed successfully.`,
      });
      console.log(
        "🚀 ~ handelCompleteSkilling ~  selectedItem?.user_id,:",
        selectedItem?.user_id
      );
      sendNotification(
        selectedItem?.user_id,
        `Your request for skilling has been Completed`
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
      if (status == "Rejected") {
        console.log("if -----------------------");
        const jobSeekerDoc = doc(db, "Document", selectedItem?.id);
        await updateDoc(jobSeekerDoc, {
          status: status,
        });
        notification.success({
          message: "Status Updated",
          description: `${selectedItem?.document_service} has been ${status} successfully.`,
        });
        sendNotification(
          selectedItem?.user_id,
          `${selectedItem?.document_service} has been ${status}.`
        );
        getDocuments();
        handleCancel();

        return;
      }
      const paymentCollection = collection(db, "Payments");
      const paymentQuery = query(
        paymentCollection,
        where("id", "==", selectedItem?.payment_id)
      );
      const querySnapshot = await getDocs(paymentQuery);

      if (!querySnapshot.empty) {
        const paymentDoc = querySnapshot.docs[0];
        const data = paymentDoc.data();
        if (data.status !== "Pending" && data.status !== "Rejected") {
          console.log("if l2 -----------------");
          const jobSeekerDoc = doc(db, "Document", selectedItem?.id);
          await updateDoc(jobSeekerDoc, {
            status: status,
          });
          notification.success({
            message: "Status Updated",
            description: `${selectedItem?.document_service} has been ${status} successfully.`,
          });
          sendNotification(
            selectedItem?.user_id,
            `${selectedItem?.document_service} has been ${status}.`
          );

          handleCancel();
          getDocuments();
        } else {
          return notification.error({
            message: "Payment",
            description: "Payment for this document have not been approved.",
          });
        }
      } else {
        return notification.error({
          message: "Payment data not found",
          description: "Please try again later.",
        });
      }
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
      if (status == "Rejected") {
        const jobSeekerDoc = doc(db, "Welfare", selectedItem?.id);
        await updateDoc(jobSeekerDoc, {
          status: status,
        });
        notification.success({
          message: "Status Updated",
          description: `Welfare ${selectedItem?.welfare_schemes} has been ${status} successfully.`,
        });
        sendNotification(
          selectedItem?.user_id,
          `Your request for ${selectedItem?.welfare_schemes} has been ${status}`
        );

        handleCancel();
        // getDocuments();
        getWelfare();
        return;
      }

      const paymentCollection = collection(db, "Payments");
      const paymentQuery = query(
        paymentCollection,
        where("id", "==", selectedItem?.payment_id)
      );
      const querySnapshot = await getDocs(paymentQuery);
      if (!querySnapshot.empty) {
        const paymentDoc = querySnapshot.docs[0];
        const data = paymentDoc.data();
        if (data.status == "Pending" || data.status == "Rejected") {
          return notification.error({
            message: "Payment",
            description: "Payment for this welfare have not been approved.",
          });
        } else {
          const jobSeekerDoc = doc(db, "Welfare", selectedItem?.id);
          await updateDoc(jobSeekerDoc, {
            status: status,
          });
          notification.success({
            message: "Status Updated",
            description: `Welfare ${selectedItem?.welfare_schemes} has been ${status} successfully.`,
          });
          sendNotification(
            selectedItem?.user_id,
            `Your request for ${selectedItem?.welfare_schemes} has been ${status}`
          );

          handleCancel();
          getWelfare();
        }
      } else {
        return notification.error({
          message: "Payment data not found",
          description: "Please try again later.",
        });
      }
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
      console.log(
        "🚀 ~ handelCompleteVolunteer ~ selectedItem?.user_id:",
        selectedVolunteer?.user_id
      );
      sendNotification(
        selectedVolunteer?.user_id,
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

  const fetchApplications = async () => {
    try {
      const q = query(collection(db, "Job Applied"));
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
        const jobSeekerData = snapshot.empty ? null : snapshot.docs[0]?.data();
        apps[index].jobSeekerData = jobSeekerData;
      }

      // Update state with applications including job seeker data
      setApplications(apps);
      setFilteredApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handelCourseComplete = async (volunteerId, programId, courseName) => {
    const programDocRef = doc(
      db,
      "Volunteer",
      volunteerId,
      "Programs",
      programId
    );
    try {
      await updateDoc(programDocRef, {
        status: "Completed",
      });
      setIsVolunteerModal(false);
      console.log(
        "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC=>",
        selectedVolunteer?.user_id
      );
      sendNotification(
        selectedVolunteer?.user_id,
        `${courseName} has been completed successfully for volunteer.`
      );
      notification.success({
        message: "Course Completed",
        description: `${courseName} has been completed successfully for volunteer ${selectedVolunteer?.full_name}.`,
      });

      getVolunteer();
      console.log("Program status updated successfully!");
    } catch (error) {
      console.error("Error updating program status: ", error);
      notification.error({
        message: "Error",
        description: "Failed to update course status. Please try again later.",
      });
    }
  };
  const [applications, setApplications] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  useEffect(() => {
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
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a, b) =>
        a?.jobSeekerData?.full_name
          ?.toLowerCase()
          ?.localeCompare(b?.jobSeekerData?.full_name?.toLowerCase()),
      render: (text, record) => record?.jobSeekerData?.full_name,
    },
    {
      title: "Position",
      dataIndex: "post",
      key: "post",
      sorter: (a, b) =>
        a?.post?.toLowerCase()?.localeCompare(b?.post?.toLowerCase()),
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
      sorter: (a, b) =>
        a?.qualification
          ?.toLowerCase()
          ?.localeCompare(b?.qualification?.toLowerCase()),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) =>
        a?.status?.toLowerCase()?.localeCompare(b?.status?.toLowerCase()),
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
    {
      title: "Action",
      dataIndex: "ss",
      key: "ss",
      render: (text, record) =>
        record?.job_seeker_id && (
          <Button
            onClick={() => {
              setJobApplicationData(record);
              setJobApplicationModal(record);
            }}
          >
            View
          </Button>
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
  const handleApprove = async (id, userId, reason) => {
    try {
      const paymentDocRef = doc(db, "Payments", id);
      await updateDoc(paymentDocRef, {
        status: "Approved",
      });

      sendNotification(
        userId,
        `Your payments request for the ${reason} ${
          selectedItem?.profile_type &&
          selectedItem?.profile_type != "Job Seeker" &&
          selectedItem?.profile_type != "Skilling"
            ? `of ${selectedItem?.profile_type}`
            : ""
        } has been approved`
      );

      notification.success({
        message: "Payment Approved",
        description: `Payment ID ${id} has been approved successfully.`,
      });
      // getJobSeekers()
      getSkilling();
      getVolunteer();
      getDocuments();
      getWelfare();
      getJobSeekers();
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to approve payment. Please try again later.",
      });
    }
  };

  const handleReject = async (id, userId, reason) => {
    try {
      const paymentDocRef = doc(db, "Payments", id);
      await updateDoc(paymentDocRef, {
        status: "Rejected",
      });

      setModalVisible(false);

      getJobSeekers();
      getSkilling();
      getVolunteer();
      getDocuments();
      getWelfare();
      getJobSeekers();

      notification.success({
        message: "Payment Rejected",
        description: `Payment ID ${id} has been rejected successfully.`,
      });
      sendNotification(
        userId,
        `Your payments request for the ${reason} ${
          selectedItem?.profile_type ? `of ${selectedItem?.profile_type}` : ""
        } has been rejected`
      );
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

  const handleJobApplicationApprove = async (id, data) => {
    try {
      const jobDocRef = doc(db, "Job Applied", id);
      await updateDoc(jobDocRef, {
        status: "Approved",
      });

      console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCC", data?.jobSeekerData?.user_id);
      sendNotification(
        data?.jobSeekerData?.user_id,
        `Your Job Application for ${data?.post} has been Approved`
      );

      notification.success({
        message: "Job Application Approved",
        description: `Job Application for ${data?.post} has been Approved.`,
      });
      setJobApplicationModal(false);
      fetchApplications();
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to approve payment. Please try again later.",
      });
    }
  };
  const handleJobApplicationReject = async (id, data) => {
    try {
      const jobDocRef = doc(db, "Job Applied", id);
      await updateDoc(jobDocRef, {
        status: "Rejected",
      });

      sendNotification(
        data?.jobSeekerData?.user_id,
        `Your Job Application for ${data?.post} has been Rejected`
      );

      notification.success({
        message: "Job Application Approved",
        description: `Job Application for ${data?.post} has been Rejected.`,
      });
      setJobApplicationModal(false);
      fetchApplications();
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to approve payment. Please try again later.",
      });
    }
  };

  const handleAddSecondPayment = async () => {
    try {
      const paymentRef = doc(collection(db, "Payments"));
      const newId = paymentRef.id;

      // Generate a random order ID
      const newTransactionId = `order_${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      // Define the new payment data
      const newPaymentData = {
        amount: selectedItem?.course_amount - volPaymentData?.amount || 0,
        date: moment().format("YYYY-MM-DDTHH:mm:ss.SSSSSS"),
        email_id: selectedItem?.email_id,
        full_name: selectedItem?.full_name,
        id: newId,
        is_individual: true,
        is_payment_gateway: false,
        phone_number: selectedItem?.phone_number,
        screenshot_link: null,
        status: "Completed",
        title: "Skilling",
        transaction_id: newTransactionId,
        user_id: selectedItem?.user_id,
      };

      // Add the new payment record to the Payments collection
      await setDoc(paymentRef, newPaymentData);

      // Update the status in the Skilling document
      const skillingDoc = doc(db, "Skilling", selectedItem?.id);
      await updateDoc(skillingDoc, {
        complete_payment_id: newId,
        paid: true,
      });

      // Close modal and reset states
      setAddManualPaymentDataModal(false);
      getSkilling();
      setVolPaymentData(null);
      setSelectedItem(null);
      setIsModalVisible(false);

      // Show success notification
      notification.success({
        message: "Payment Completed",
        description: "Payment has been marked as completed successfully.",
      });
    } catch (error) {
      console.error("Error updating payment status", error);

      // Show error notification
      notification.error({
        message: "Error",
        description:
          "Failed to mark payment as completed. Please try again later.",
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
          <div className="overflow-scroll">
            <Table
              columns={getColumns("1")}
              dataSource={filterData(jobSeekerData)}
              pagination={true}
              rowKey={"id"}
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
          <div className="overflow-scroll">
            <Table
              columns={getColumns("2")}
              dataSource={filterData(aggregatedData)}
              // dataSource={aggregatedData}
              pagination={true}
            />
          </div>
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
          <div className="overflow-scroll">
            <Table
              columns={getColumns("3")}
              dataSource={filterData(volunteerData)}
              pagination={true}
            />
          </div>
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
          <div className="overflow-scroll">
            <Table
              columns={getColumns("4")}
              dataSource={filterData(documents)}
              pagination={true}
            />
          </div>
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
          <div className="overflow-scroll">
            <Table
              columns={getColumns("5")}
              dataSource={filterData(welfares)}
              pagination={true}
            />
          </div>
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
            <div className="overflow-scroll">
              <Table
                dataSource={filteredApplications}
                columns={columns}
                rowKey="id"
                pagination={true}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
      <Modal
        // title="Details"
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
                <div className="flex gap-5 justify-end">
                  <button
                    onClick={() => handelUpdate("Rejected")}
                    className="bg-red-500/40 border-red-500 border px-6 py-2 text-red-900 font-semibold rounded-lg"
                  >
                    Reject
                  </button>
                  <button
                    size="large"
                    className="bg-green-500/40 border-green-500 border px-6 py-2 text-green-900 font-semibold rounded-lg"
                    onClick={() => handelUpdate("Approved")}
                  >
                    Approve
                  </button>
                </div>
              )}
              {tab == "2" && (
                <>
                  <Button
                    type="primary"
                    onClick={() => handelCompleteSkilling()}
                  >
                    Complete
                  </Button>

                  {selectedItem?.paid == false &&
                    selectedItem?.isFree == false && (
                      <Button
                        onClick={() => {
                          fetchPaymentData(selectedItem?.payment_id);
                        }}
                      >
                        Manual Payment
                      </Button>
                    )}
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
        <h1 className="text-xl font-semibold p-5 text-blue-900 bg-blue-400/25 my-3 rounded-md mt-5">
          Details
        </h1>
        {selectedItem && (
          <div className="flex justify-around gap-3">
            <div className="flex-1 flex flex-col space--x-4 space-y-4">
              <div className="shadow shadow-blue-300/40 p-3 rounded-md">
                <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                  Personals Details
                </h1>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <p>Registration ID</p>
                    <span>{selectedItem?.id}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>Name</p>
                    <span>{selectedItem?.full_name}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Phone Number</p>
                    <span>{selectedItem?.phone_number}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>Email</p>
                    <span>
                      {selectedItem?.email ||
                        selectedItem?.email_id ||
                        "Not Given"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>DOB</p>
                    <span>
                      {moment(selectedItem?.dob).format("DD-MM-YYYY") ||
                        "Not Given"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>Date of Registration</p>
                    <span>
                      {moment(selectedItem?.date_of_registration).format(
                        "DD-MM-YYYY"
                      )}
                    </span>
                  </div>
                  {selectedItem?.company_name && (
                    <div className="flex flex-col gap-2">
                      <p>Applied Company</p>
                      <span>{selectedItem?.company_name || "NA"}</span>
                    </div>
                  )}
                  {selectedItem?.job_you_want_to_apply && (
                    <div className="flex flex-col gap-2 mb-4">
                      <p>Applied Post</p>
                      <span>{selectedItem?.job_you_want_to_apply || "NA"}</span>
                    </div>
                  )}
                  {tab != "4" && tab != "5" && (
                    <div className="flex flex-col gap-2 mb-4">
                      <p>Referred By</p>
                      <span>{selectedItem?.referred_by || "NA"}</span>
                    </div>
                  )}
                  {tab == "2" && (
                    <div className="flex flex-col gap-2 mb-4">
                      <p>City User Want For Offline Skilling</p>
                      <span>{selectedItem?.preferred_city || "NA"}</span>
                    </div>
                  )}
                  {selectedItem?.document_type == "Company Document" && (
                    <div className="flex flex-col gap-2 mb-4">
                      <p>GSTIN No</p>
                      <span>{selectedItem?.aadhaar_number || "NA"}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="shadow shadow-blue-300/40 p-3 rounded-md">
                <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                  Address Details
                </h1>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-2">
                    <p>PIN</p>
                    <span>
                      {selectedItem?.pin ||
                        selectedItem?.pincode ||
                        "Not Given"}
                    </span>
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
              {tab != "4" && tab != "5" && (
                <div className="shadow shadow-blue-300/40 p-3 rounded-md">
                  <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                    Educational & Professional Details
                  </h1>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-2">
                      <p>Highest Qualification</p>
                      <span>{selectedItem?.highest_qualification || "NA"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>Trade</p>
                      <span>{selectedItem?.trade || "NA"}</span>
                    </div>
                    {tab != "2" && (
                      <div className="flex flex-col gap-2">
                        <p>Experience</p>
                        <span>
                          {selectedItem?.years_of_experience ? "YES" : "NO"}
                        </span>
                      </div>
                    )}

                    {selectedItem?.company_name && (
                      <div className="flex flex-col gap-2">
                        <p>Company Name</p>
                        <span>{selectedItem?.company_name || "NA"}</span>
                      </div>
                    )}

                    {selectedItem?.area_of_experience && (
                      <div className="flex flex-col gap-2">
                        <p>Area of Experience</p>
                        <span>{selectedItem?.area_of_experience || "NA"}</span>
                      </div>
                    )}
                    {selectedItem?.years_of_experience && (
                      <div className="flex flex-col gap-2 mb-4">
                        <p>Years of Experience</p>
                        <span>{selectedItem?.years_of_experience || "NA"}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col space--x-4 space-y-4 h-full">
              <div className="shadow shadow-blue-300/40 p-3 rounded-md">
                <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                  Documents & Service Details
                </h1>
                <div className="grid grid-cols-3 gap-3">
                  {selectedItem?.document_type != "Company Document" && (
                    <div className="flex flex-col gap-2">
                      <p>Aadhaar No.</p>
                      <span>
                        {selectedItem?.adhaar_card_number ||
                          selectedItem?.adhaar_number ||
                          selectedItem?.aadhaar_number ||
                          "Not Given"}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <p>Pan No.</p>
                    <span>
                      {selectedItem?.pan_card_number ||
                        selectedItem?.pan_number ||
                        "Not Given"}
                    </span>
                  </div>
                  {tab !== "2" && (
                    <div className="flex flex-col gap-2">
                      <p>Service Selected</p>
                      <span>
                        {selectedItem?.welfare_schemes ||
                          selectedItem?.profile_type ||
                          selectedItem?.document_service ||
                          "Not Given"}
                      </span>
                    </div>
                  )}
                  {tab == "2" && (
                    <div className="flex flex-col gap-2">
                      <p>Service Courses</p>
                      <span>{selectedItem?.course_name || "Not Given"}</span>
                    </div>
                  )}
                </div>
              </div>
              {tab != "2" && tab != "4" && tab != "5" && (
                <div className="shadow shadow-blue-300/40 p-3 rounded-md">
                  <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                    Other Details
                  </h1>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-2">
                      <p>Job you want to apply</p>
                      <span>{selectedItem?.job_you_want_to_apply || "NA"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>Location of work</p>
                      <span>
                        {selectedItem?.preferred_city_of_work || "NA"}
                      </span>
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
                      <p>Booking Fee paid</p>
                      <span>{selectedItem?.fee_paid || "NA"}</span>
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
                </div>
              )}
              {tab != "2" && (
                <div className="shadow shadow-blue-300/40 p-3 rounded-md">
                  <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                    Additional Details
                  </h1>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-2">
                      <p>No. of family member</p>
                      <span>{selectedItem?.number_of_family_members}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>No. of female children</p>
                      <span>
                        {selectedItem?.number_of_female_children || 0}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>No. of male children</p>
                      <span>{selectedItem?.number_of_male_children || 0}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>Main occupation of the family</p>
                      <span>
                        {selectedItem?.main_occupation_of_family || "Not Given"}
                      </span>
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
                      <span>
                        {selectedItem?.farming_product || "Not Given"}
                      </span>
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
                  <div className="flex mt-4">
                    {selectedItem?.resume_link && (
                      <>
                        <a
                          href={selectedItem?.resume_link}
                          className="p-3 bg-blue-700/40 rounded flex gap-4"
                        >
                          <div>
                            <FileTextIcon className="h-5 w-5" />
                          </div>
                          <p className="text-blue-900">Resume</p>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title=""
        open={isVolunteerModal}
        onCancel={() => setIsVolunteerModal(false)}
        width="100%"
        footer={null}
      >
        {selectedVolunteer && (
          <div className="flex  gap-8">
            <div className="w-full flex flex-col gap-3">
              <div className="shadow shadow-blue-300/40 p-3 rounded-md">
                <h1 className="text-[#013D9D] font-medium text-xl mb-5">
                  Personal Details
                </h1>
                <div className="flex justify-between ">
                  <div className="grid grid-cols-5 mb-8 gap-4 w-[90%]">
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
                    <div className="flex flex-col">
                      <p>DOB</p>
                      <span>
                        {moment(selectedVolunteer?.dob)?.format("DD-MM-YYYY") ||
                          "Not Given"}
                      </span>
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
                  <div className="mr-4 shadow shadow-blue-300/40 p-5 px-12 rounded-md h-full">
                    <h1 className="text-[#013D9D] font-semibold text-md mb-5">
                      User Profile
                    </h1>
                    {selectedVolunteer?.profile_photo ? (
                      <img
                        src={selectedVolunteer?.profile_photo}
                        alt="No Image Uploaded By User"
                        className="rounded-full w-20 h-20"
                      />
                    ) : (
                      <h1>No Image Uploaded By User</h1>
                    )}
                  </div>
                </div>
              </div>
              <div className="shadow shadow-blue-300/40 p-3 rounded-md">
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
                    <span>
                      {selectedVolunteer?.city_village ||
                        selectedVolunteer?.city ||
                        "NA"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="shadow shadow-blue-300/40 p-3 rounded-md">
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
              </div>
              <div className="shadow shadow-blue-300/40 p-3 rounded-md">
                <h1 className="mb-8 text-xl text-[#013D9D] font-medium">
                  Additional Details
                </h1>
                <div className="grid grid-cols-3">
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
                    <span>
                      {selectedVolunteer?.number_of_male_children || 0}
                    </span>
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
              </div>

              <div className="shadow shadow-blue-300/40 p-3 rounded-md">
                <h1 className="mb-2 text-xl text-[rgb(1,61,157)] font-medium">
                  Courses Info
                </h1>
                {selectedVolunteer?.programs?.map((program) => {
                  return (
                    <div
                      key={program.courseId}
                      className="grid grid-cols-5 mb-3"
                    >
                      <div className="flex flex-col">
                        <p>Course Name:</p>
                        <span>{program.courseName}</span>
                      </div>
                      <div className="flex flex-col">
                        <p>Event Date:</p>
                        <span>{program.eventDate}</span>
                      </div>
                      <div className="flex flex-col">
                        <p>Event Time:</p>
                        <span>
                          {program?.eventTime}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p>Status:</p>
                        <span>{program?.status || "Pending"}</span>
                      </div>
                      {program?.status != "Completed" && (
                        <div className="flex flex-col">
                          <Button
                            onClick={() =>
                              handelCourseComplete(
                                selectedVolunteer?.id,
                                program?.id,
                                program?.courseName
                              )
                            }
                          >
                            Complete
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* <div className="flex justify-end">
                {selectedVolunteer?.status !== "Completed" && (
                  <Button
                    className="bg-[#013D9D] text-white"
                    onClick={() => handelCompleteVolunteer("Completed")}
                  >
                    Complete
                  </Button>
                )}
              </div> */}
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
                    {paymentData?.screenshot_link && (
                      <div className="col-span-1 flex flex-col items-center shadow shadow-blue-300/40 p-3 rounded-md mb-4">
                        <img
                          src={paymentData?.screenshot_link}
                          alt="Payment Screenshots"
                          className="w-[350px] h-[450px] object-contain aspect-auto"
                        />
                        <a
                          href={paymentData?.screenshot_link}
                          download="payment_screenshot.png"
                          className="mt-3 bg-blue-500 text-white py-2 px-16 rounded"
                          // onClick={handleImageDownload}
                        >
                          Download Image
                        </a>
                      </div>
                    )}
                    <div>
                      <div className="shadow shadow-blue-300/40 p-3 rounded-md mb-4">
                        <h1 className="text-2xl text-[#013D9D] font-medium mb-5">
                          Personal Details
                        </h1>
                        <div className="grid grid-cols-3 gap-5 mb-16">
                          <div className="flex flex-col gap-3">
                            <p className="font-semibold">Phone No.</p>
                            <span>{paymentData?.phone_number}</span>
                          </div>
                          <div className="flex flex-col gap-3">
                            <p className="font-semibold">Full Name.</p>
                            <span>{selectedItem?.full_name}</span>
                          </div>

                          <div className="flex flex-col gap-3">
                            <p className="font-semibold">Email Id</p>
                            <span>
                              {selectedItem?.email || selectedItem?.email_id}
                            </span>
                          </div>
                          <div className="flex flex-col gap-3 ">
                            <p className="font-semibold">Registration ID</p>
                            <span>{paymentData?.user_id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shadow shadow-blue-300/40 p-3 rounded-md mb-4">
                        <h1 className="text-2xl text-[#013D9D] font-medium mb-5">
                          Payment Details
                        </h1>

                        <div className="grid grid-cols-3  gap-5">
                          <div className="flex flex-col gap-3">
                            <p className="font-semibold">Status.</p>
                            <span>{paymentData?.status}</span>
                          </div>
                          {tab != "4" && tab !== "1" && (
                            <div className="flex flex-col gap-3">
                              <p className="font-semibold">Pending Amount</p>
                              <span>
                                {selectedItem?.course_amount != 0
                                  ? selectedItem?.course_amount -
                                    paymentData.amount
                                  : 0}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col gap-3">
                            <p className="font-semibold">
                              Registration Fee Paid
                            </p>
                            <span>{paymentData?.amount}</span>
                          </div>
                          <div className="flex flex-col gap-3">
                            <p className="font-semibold">Transaction Id</p>
                            <span>
                              {paymentData?.transaction_id || "Not Generated"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-3">
                            <p className="font-semibold">Payment Mode</p>
                            <span>
                              {paymentData?.is_payment_gateway
                                ? "Online"
                                : "Manual"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {secondPaymentData && (
                        <div className="shadow shadow-blue-300/40 p-3 rounded-md mb-4">
                          <h1 className="text-2xl text-[#013D9D] font-medium mb-5">
                            Second Payment Details
                          </h1>

                          <div className="grid grid-cols-5 gap-14">
                            <div className="flex flex-col gap-3">
                              <p className="font-semibold">Status.</p>
                              <span>{secondPaymentData?.status}</span>
                            </div>
                            <div className="flex flex-col gap-3">
                              <p className="font-semibold">Payment Amount</p>
                              <span>{secondPaymentData?.amount}</span>
                            </div>

                            <div className="flex flex-col gap-3">
                              <p className="font-semibold">Transaction Id</p>
                              <span>{secondPaymentData?.transaction_id}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {paymentData?.status == "Pending" &&
                    selectedItem?.status != "Rejected" && (
                      <div className="flex justify-end mt-5">
                        <button
                          onClick={() =>
                            handleReject(
                              paymentData?.id,
                              paymentData?.user_id,
                              paymentData?.title
                            )
                          }
                          className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            handleApprove(
                              paymentData?.id,
                              paymentData?.user_id,
                              paymentData?.title
                            )
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

      <Modal
        title=""
        open={jobApplicationModal}
        onCancel={() => setJobApplicationModal(false)}
        footer={null}
        width={1200}
        className="w-full"
      >
        <>
          <h1 className="text-xl font-semibold p-5 text-blue-900 bg-blue-400/25 my-3 rounded-md mt-5">
            Job Application
          </h1>
          <div className="shadow shadow-blue-300/40 p-3 rounded-md mb-4">
            <h1 className="text-[#013D9D] font-medium text-xl mb-5">
              Personal Details
            </h1>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2">
                <p>Name</p>
                <span>{jobApplicationData?.jobSeekerData?.full_name}</span>
              </div>
              <div className="flex flex-col gap-2">
                <p>Email</p>
                <span>{jobApplicationData?.jobSeekerData?.email}</span>
              </div>
              <div className="flex flex-col gap-2">
                <p>DOB</p>
                <span>
                  {moment(
                    jobApplicationData?.jobSeekerData?.date_of_birth
                  )?.format("DD-MM-YYYY")}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <p>Phone</p>
                <span>{jobApplicationData?.jobSeekerData?.phone_number}</span>
              </div>
              <div className="flex flex-col gap-2">
                <p>City</p>
                <span>{jobApplicationData?.jobSeekerData?.city}</span>
              </div>
              <div className="flex flex-col gap-2">
                <p>Address</p>
                <span>{jobApplicationData?.jobSeekerData?.address}</span>
              </div>
              {jobApplicationData?.jobSeekerData?.resume_link && (
                <div className="flex flex-col gap-2">
                  <p>Resume</p>
                  <span>
                    <a
                      href={jobApplicationData?.jobSeekerData?.resume_link}
                      className="p-3 bg-blue-700/40 rounded flex gap-4"
                    >
                      <div>
                        <FileTextIcon className="h-5 w-5" />
                      </div>
                      <p className="text-blue-900">Resume</p>
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="shadow shadow-blue-300/40 p-3 rounded-md mb-4">
            <h1 className="text-[#013D9D] font-medium text-xl mb-5">
              Company Details
            </h1>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2">
                <p>Company Name</p>
                <span>{jobApplicationData?.company_name}</span>
              </div>
              <div className="flex flex-col gap-2">
                <p>Place</p>
                <span>{jobApplicationData?.place}</span>
              </div>
              <div className="flex flex-col gap-2">
                <p>Position</p>
                <span>{jobApplicationData?.post}</span>
              </div>
              <div className="flex flex-col gap-2">
                <p>Apply Date</p>
                <span>
                  {moment(jobApplicationData?.date).format("DD-MM-YYYY")}
                </span>
              </div>
            </div>
          </div>
          {jobApplicationData?.status == "Applied" && (
            <div className="shadow shadow-blue-300/40 p-3 rounded-md mb-4">
              <button
                className="bg-green-500/40 border-green-500 border px-6 py-2 text-green-900 font-semibold rounded-lg"
                onClick={() =>
                  handleJobApplicationApprove(
                    jobApplicationData?.id,
                    jobApplicationData
                  )
                }
              >
                Approve
              </button>
              <button
                className="bg-red-500/40 border-red-500 border px-6 py-2 text-red-900 font-semibold rounded-lg ml-4"
                onClick={() =>
                  handleJobApplicationReject(
                    jobApplicationData?.id,
                    jobApplicationData
                  )
                }
              >
                Reject
              </button>
            </div>
          )}
        </>
      </Modal>
      <Modal
        open={addManualPaymentDataModal}
        onClose={() => setAddManualPaymentDataModal(false)}
        onCancel={() => setAddManualPaymentDataModal(false)}
        footer={null}
      >
        <div className="flex flex-col gap-4 my-3">
          <h1 className="text-xl font-semibold bg-emerald-400 p-3 rounded-md ">
            Add Manual Payment Data
          </h1>
          <div className="shadow shadow-emerald-300/50 p-3 rounded-md">
            <div className="flex justify-between">
              <h1 className="font-semibold text-lg">Total Amount</h1>
              <p className="font-semibold">
                {selectedItem?.course_amount || 0}
              </p>
            </div>
            <div className="flex justify-between">
              <h1 className="font-semibold text-lg">Amount Paid</h1>
              <p className="font-semibold">{volPaymentData?.amount || 0}</p>
            </div>
            <div className="flex justify-between">
              <h1 className="font-semibold text-lg">Remaining Amount</h1>
              <p className="font-semibold">
                {selectedItem?.course_amount - volPaymentData?.amount || 0}
              </p>
            </div>
          </div>
          <div className="shadow shadow-emerald-300/50 p-3 rounded-md justify-end flex">
            <button
              onClick={handleAddSecondPayment}
              className="font-semibold text-white bg-emerald-700 p-2 rounded-md"
            >
              Compete payment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Applications;
