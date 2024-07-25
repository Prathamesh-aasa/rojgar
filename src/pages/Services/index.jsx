import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Tabs,
  Form,
  Input,
  Space,
  Select,
  Modal,
  Divider,
  Radio,
  notification,
  Card,
  message,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { CrossIcon, Minus, MinusCircle, PenBoxIcon, XIcon } from "lucide-react";
import moment from "moment";

let index1 = 0;
const { Option } = Select;

const Index = () => {
  const [suggestiveList, setSuggestiveList] = useState([]);
  const [form] = Form.useForm();
  const [skillingForm] = Form.useForm();
  const [addNewCourseForm] = Form.useForm();
  const [createSubscriptionForm] = Form.useForm();
  const [welfareForm] = Form.useForm();
  const [createNewVolunteer] = Form.useForm();
  const [documentService] = Form.useForm();
  const [suggestiveForm] = Form.useForm();
  const [companyForm] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const [educationQualification, setEducationQualification] = useState("");

  const addCourse = () => {
    setCourses([...courses, { key: courses.length }]);
  };

  const removeCourse = (key) => {
    setCourses(courses.filter((course) => course.key !== key));
  };
  const [workshops, setWorkshops] = useState([""]);
  const addWorkshopInput = () => {
    setWorkshops([...workshops, ""]);
  };

  const handleWorkshopChange = (index, value) => {
    const newWorkshops = [...workshops];
    newWorkshops[index] = value;
    setWorkshops(newWorkshops);
  };

  //////////////////////////////////////////////////////////////////////////////////

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [welfareList, setWelfaresList] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [subscriptionTabs, setSubscriptionTabs] = useState([]);
  const [tab, setTab] = useState("Trades");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSkillingModal, setIsSkillingModal] = useState(false);
  const [skilling, setSkilling] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isSkillingModalVisible, setIsSkillingModalVisible] = useState(false);
  const [isAddNewVolunteerModalVisible, setIsAddNewVolunteerModal] =
    useState(false);
  const [volunteer, setVolunteer] = useState([]);

  const getVolunteer = async () => {
    try {
      const coursesCollection = collection(db, "Courses");
      const q = query(coursesCollection, where("is_volunteer", "==", true));

      const snapshot = await getDocs(q);
      const coursesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVolunteer(coursesList);
      console.log("🚀 ~ getVolunteer ~ coursesList:", coursesList);
    } catch (error) {
      console.error("Error fetching volunteer courses:", error);
    }
  };
  const handleSessionUpdate = async (courseId, sessionNumber, newData) => {
    try {
      const courseRef = doc(db, "Courses", courseId);
      await updateDoc(courseRef, {
        [`session.name_${sessionNumber}`]: newData.name,
        [`session.date_${sessionNumber}`]: newData.date,
        [`session.time_slot_${sessionNumber}`]: newData.timeSlot,
      });
      console.log(
        `Session ${sessionNumber} updated successfully for course ${courseId}`
      );
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };
  const getSubscriptionPlans = async () => {
    const welfareCollection = collection(db, "Subscription Plans");
    const listSnapshot = await getDocs(welfareCollection);
    const listData = listSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSubscriptionPlans(listData);
    const sTabs = listData?.map((data) => {
      return {
        key: data?.id,
        label: data?.name,
        children: (
          <div>
            <Form
              layout="vertical"
              onFinish={handelSubscriptionPlan}
              initialValues={{
                benefits: data?.benefits,
                plan_name: data?.name,
                plan_price: data?.price,
                plan_tenure: data?.per,
                id: data?.id,
              }}
            >
              <div className="flex gap-3 items-start">
                <div className="shadow p-5 rounded-lg">
                  <Form.List
                    name="benefits"
                    rules={[
                      {
                        validator: async (_, benefits) => {
                          if (!benefits || benefits.length < 1) {
                            return Promise.reject(
                              new Error("At least 1 benefits")
                            );
                          }
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <div className="flex flex-col w-80">
                        {fields.map((field, index) => (
                          <Form.Item
                            className="w-full"
                            label={index === 0 ? "Benefits" : ""}
                            required={false}
                            key={field.key}
                          >
                            <div className="flex flow-row gap-2 items-center justify-center">
                              <Form.Item
                                className="w-full"
                                {...field}
                                validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message:
                                      "Please input Benefits name or delete this field.",
                                  },
                                ]}
                                noStyle
                              >
                                <Input placeholder="Benefit name" />
                              </Form.Item>
                              {fields.length > 0 ? (
                                <MinusCircle
                                  className="dynamic-delete-button text-red-500"
                                  onClick={() => remove(field.name)}
                                />
                              ) : null}
                            </div>
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Add field
                          </Button>

                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </div>
                    )}
                  </Form.List>
                </div>
                <div className="shadow p-5 rounded-lg">
                  <Form.Item
                    label="Plan Name"
                    className="w-80"
                    name="plan_name"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please input plan name",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item hidden className="w-80" name="id">
                    <Input />
                  </Form.Item>
                </div>
                <div className="shadow p-5 rounded-lg w-52">
                  <Form.Item
                    label="Plan Tenure"
                    name="plan_tenure"
                    rules={[
                      {
                        required: true,
                        message: "Please select plan tenure",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="Monthly">Monthly</Option>
                      <Option value="Yearly">Yearly</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="shadow p-5 rounded-lg">
                  <Form.Item
                    label="Price (₹)"
                    name="plan_price"
                    rules={[
                      {
                        required: true,

                        message: "Please input plan price",
                      },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </div>
              </div>
              <Form.Item className="my-5 flex justify-center">
                <Button htmlType="submit" type="primary">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        ),
      };
    });

    setSubscriptionTabs(sTabs);
  };
  const getWelfare = async () => {
    const welfareCollection = collection(db, "All Welfare Schemes");

    const query2 = query(welfareCollection, where("status", "==", "active"));

    const listSnapshot = await getDocs(query2);

    // const listSnapshot = await getDocs(welfareCollection);
    const listData = listSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setWelfaresList(listData);
  };
  const getDocuments = async () => {
    const documentCollection = collection(db, "All Documents");
    const query2 = query(documentCollection, where("status", "==", "active"));

    const listSnapshot = await getDocs(query2);
    const listData = listSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setDocuments(listData);
  };
  const getSkilling = async () => {
    const skillingCollection = collection(db, "Skills");
    const listSnapshot = await getDocs(skillingCollection);
    const skills = listSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const coursesCollection = collection(db, "Courses");
    const snap = await getDocs(coursesCollection);
    const courses = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Create a mapping of skills by their IDs
    const skillsMap = skills.reduce((acc, skill) => {
      acc[skill.id] = { ...skill, courses: [] };
      return acc;
    }, {});

    // Assign each course to the corresponding skill
    courses.forEach((course) => {
      const { skillId } = course;
      if (skillsMap[skillId]) {
        skillsMap[skillId].courses.push(course);
      }
    });

    // Convert the skills map back to an array
    const listData = Object.values(skillsMap);
    console.log("🚀 ~ getSkilling ~ listData:", listData);

    // Assuming you have a state setter for skilling
    setSkilling(listData);
  };
  const getSuggestiveList = async () => {
    const suggestiveListCollection = collection(db, "All Suggestive Lists");
    const listSnapshot = await getDocs(suggestiveListCollection);
    const listData = listSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const groupedData = listData?.reduce((acc, item) => {
      const { type } = item;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {});
    console.log(groupedData);
    setSuggestiveList(groupedData);
    setLoading(false);
  };
  const createSuggestiveList = async (name) => {
    try {
      await addDoc(collection(db, "All Suggestive Lists"), {
        name,
        type: tab,
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      });
      notification.success({
        message: "Item Added",
        description: `Suggestive ${name} has been added successfully.`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to Create Please try again later.",
      });
    } finally {
      getSuggestiveList();
      suggestiveForm.resetFields();
    }
  };
  const deleteSuggestiveList = async (id, name) => {
    try {
      await deleteDoc(doc(db, "All Suggestive Lists", id));
      notification.success({
        message: "Item Deleted",
        description: `Suggestive ${name} has been deleted successfully.`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete item. Please try again later.",
      });
    } finally {
      getSuggestiveList();
    }
  };
  const createScheme = async (name, fee) => {
    try {
      const welfareRef = await addDoc(collection(db, "All Welfare Schemes"), {
        name,
        fee: Number(fee) || 0,
        status: "active",
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      });

      const welfareId = welfareRef.id;

      await updateDoc(welfareRef, { id: welfareId });

      notification.success({
        message: "Item Added",
        description: `Suggestive ${name} has been added successfully.`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to Create Please try again later.",
      });
    } finally {
      getWelfare();
      welfareForm.resetFields();
    }
  };
  const deleteWelfareSchemes = async (id, name) => {
    try {
      const documentRef = doc(db, "All Welfare Schemes", id);

      // Update the document
      await updateDoc(documentRef, {
        status: "deleted",
      });

      // await deleteDoc(doc(db, "All Welfare Schemes", id));
      notification.success({
        message: "Item Deleted",
        description: `Welfare Schemes ${name} has been deleted successfully.`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete item. Please try again later.",
      });
    } finally {
      getWelfare();
    }
  };
  const createDocument = async (name, fee) => {
    try {
      await addDoc(collection(db, "All Documents"), {
        name,
        fee: Number(fee) || 0,
        status: "active",
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      });
      notification.success({
        message: "Item Added",
        description: `Documents ${name} has been added successfully.`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to Create Please try again later.",
      });
    } finally {
      documentService.resetFields();
      getDocuments();
    }
  };
  const deleteDocument = async (id, name) => {
    try {
      const documentRef = doc(db, "All Documents", id);

      // Update the document
      await updateDoc(documentRef, {
        status: "deleted",
      });

      // await updateDoc(doc(db, "All Documents", id));
      notification.success({
        message: "Item Deleted",
        description: `Documents ${name} has been deleted successfully.`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete item. Please try again later.",
      });
    } finally {
      getDocuments();
    }
  };
  const handelCreateJobPost = async (value) => {
    try {
      const compony = await addDoc(collection(db, "RegisterAsCompany"), {
        city: "",
        company_email: value.email,
        company_name: value?.companyName,
        company_phone: value?.phone,
        date_of_registration: moment().format("YYYY-MM-DDTHH:mm:ss"),
        gstin: value?.companyGstin,
        job_poster_email: value.job_poster_email,
        job_poster_name: value.job_poster_name,
        job_poster_phone_number: value.job_poster_phone,
        pin: value?.companyPin,
        profile_type: "Company",
        registered_address: value?.companyAddress,
        state: value?.companyState,
        status: "Approved",
        verified: false,
        subscription: "",
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      });

      await updateDoc(compony, { id: compony?.id });

      await addDoc(collection(db, "Jobs"), {
        benefits: value?.otherBenefits,
        company_id: compony?.id,
        experience_required: value?.experienceRequired,
        job_openings: value?.numberOfOpenings,
        job_place: value?.jobPlace,
        job_position: value?.jobPosition,
        min_experience_in_months: 0,
        payout_from: value?.payout_from,
        payout_to: value?.payout_to,
        isOpen: true,
        trade: value?.trade,
        posted_on: moment().format("DD-MM-YYYY HH:mm:ss"),
        qualification: value?.educationQualification,
        skills_required: value?.skillRequired,
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      });
      notification.success({
        message: "Item Added",
        description: `Job has been added successfully.`,
      });
      companyForm.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to Create Please try again later.",
      });
    } finally {
    }
  };
  const handelSubscriptionPlan = async (values) => {
    try {
      const planRef = doc(db, "Subscription Plans", values?.id);
      await updateDoc(planRef, {
        benefits: values?.benefits,
        name: values?.plan_name,
        per: values?.plan_tenure,
        price: values?.plan_price,
      });
      notification.success({
        message: "Subscription Updated",
        description: `Subscription Updated successfully.`,
      });
    } catch (error) {
      console.log("🚀 ~ handelSubscriptionPlan ~ error:", error);
      notification.error({
        message: "Error",
        description: "Failed to update Please try again later.",
      });
    } finally {
      getSubscriptionPlans();
    }
  };
  const handleCreateSubscriptionPlan = async (values) => {
    try {
      console.log("Received values:", values);

      const subscriptionPlan = {
        name: values.plan_name,
        price: values.plan_price,
        per: values.plan_tenure,
        benefits: values.benefits,
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      };

      const docRef = await addDoc(
        collection(db, "Subscription Plans"),
        subscriptionPlan
      );
      // Get the ID of the newly added document
      const newDocumentId = docRef.id;
      console.log("New Document ID:", newDocumentId);

      // Update the same document with the ID field
      await updateDoc(docRef, { id: newDocumentId });

      notification.success({
        message: "Success",
        description: "Subscription plan added successfully!",
      });

      setIsModalVisible(false);
      createSubscriptionForm.resetFields();
      getSubscriptionPlans();
    } catch (errorInfo) {
      notification.error({
        message: "Error",
        description: "Failed to add subscription plan. Please try again later.",
      });
      console.log("Validation Failed:", errorInfo);
    }
  };
  const onFinish = async (values) => {
    try {
      const { programName } = values;

      // 1. Add the program
      const program = await addDoc(collection(db, "Skills"), {
        name: programName,
        isFree: true,
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      });

      await updateDoc(program, { id: program.id });

      // 2. Add each course
      const courses = [];
      for (let i = 0; values[`courseName${i}`] !== undefined; i++) {
        const courseName = values[`courseName${i}`];
        const courseVideoLink = values[`courseVideoLink${i}`] || "";
        const fee = values[`fee${i}`] || 0;
        const location = values[`location${i}`] || "";
        const duration = values[`duration${i}`] || "";
        const startDate = values[`startDate${i}`] || "";
        const courseType = values[`courseType${i}`] === "free" ? true : false;

        // Add course to courses array or database directly
        courses.push({
          skillId: program.id,
          name: courseName,
          videoLink: courseVideoLink,
          isFree: courseType,
          fee: Number(fee),
          location: location,
          duration: duration,
          startDate: startDate,
        });

        const courseRef = await addDoc(collection(db, "Courses"), {
          skillId: program.id,
          name: courseName,
          videoLink: courseVideoLink,
          fee: Number(fee),
          isFree: true,
          location: location,
          duration: duration,
          startDate: startDate,
          created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
        });

        const courseId = courseRef.id;

        await updateDoc(courseRef, { id: courseId });
      }

      form.resetFields();
      console.log("Courses added:", courses);
      notification.success({
        message: "Success",
        description: "Skills and courses added successfully!",
      });
    } catch (error) {
      console.log("🚀 ~ onFinish ~ error:", error);
    }
  };
  const handleSkillChange = (value) => {
    const skill = skilling.find((skill) => skill.id === value);
    setSelectedSkill(skill);
    const coursesData = skill.courses.map((course, index) => ({
      [`courseName${index}`]: course.name,
      [`videoLink${index}`]: course.videoLink,
      [`course_id${index}`]: course.id,
      [`fee${index}`]: course?.fee,
      [`duration${index}`]: course?.duration,
      [`startDate${index}`]: course?.startDate,
      [`location${index}`]: course?.location,
      [`courseType${index}`]: course.isFree ? "free" : "paid",
    }));
    skillingForm.setFieldsValue({
      // programName: skill.name,
      ...Object.assign({}, ...coursesData),
    });
  };
  const handleFormSubmit = async (values) => {
    try {
      // Iterate through the form values to update each course
      for (let i = 0; values[`courseName${i}`] !== undefined; i++) {
        const courseId = values[`course_id${i}`];
        const courseName = values[`courseName${i}`];
        const fee = values[`fee${i}`] || 0;
        const location = values[`location${i}`];
        const duration = values[`duration${i}`];
        const startDate = values[`startDate${i}`];
        const courseVideoLink = values[`videoLink${i}`];
        const courseType = values[`courseType${i}`] == "free" ? true : false;

        // Update existing course
        const courseRef = doc(db, "Courses", courseId);
        await updateDoc(courseRef, {
          name: courseName,
          videoLink: courseVideoLink || "",
          isFree: courseType,
          fee: Number(fee) || "",
          location: location || "",
          duration: duration || "",
          startDate: startDate || "",
        });
      }
      notification.success({
        message: "Success",
        description: "Courses updated successfully!",
      });
      getSkilling();
      console.log("Courses updated successfully.");
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update courses. Please try again later.",
      });
      console.log("🚀 ~ updateCourses ~ error:", error);
    }
  };
  const handleAddCourse = async (values) => {
    try {
      const courseRef = await addDoc(collection(db, "Courses"), {
        skillId: selectedSkill?.id,
        name: values.courseName,
        videoLink: values.courseVideoLink || "",
        fee: Number(values.fee) || 0,
        location: values.location || "",
        duration: values.duration || "",
        startDate: values.startDate || "",
        isFree: values.courseType == "free" ? true : false,
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      });

      const courseId = courseRef.id;

      await updateDoc(courseRef, { id: courseId });
      addNewCourseForm.resetFields();
      setIsSkillingModalVisible(false);
      setSelectedSkill(null);
      getSkilling();
      notification.success({
        message: "Success",
        description: "Course added successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add course. Please try again later.",
      });
      console.log("🚀 ~ handleAddCourse ~ error:", error);
    }
  };
  const handelCreateVolunteer = async (value) => {
    try {
      const volunteer = {
        name: value?.volunteerName,
        is_volunteer: true,
        isFree: true,
        session: {
          name_1: value?.sessionName1,
          name_2: value?.sessionName2,
        },
        skillId: "",
        videoLink: "",
        created_at: moment().format("DD-MM-YYYY HH:mm:ss"),
      };
      await addDoc(collection(db, "Courses"), volunteer);
      getVolunteer();
      notification.success({
        message: "Success",
        description: "Volunteer added successfully!",
      });
      createNewVolunteer.resetFields();
      setIsAddNewVolunteerModal(false);
    } catch (error) {
      console.log("🚀 ~ handelCreateVolunteer ~ error:", error);
      notification.error({
        message: "Error",
        description: "Failed to add volunteer. Please try again later.",
      });
    }
  };
  const updateDocument = async (id, name) => {
    if (!id) message.error("Please Select Document First TO Edit.");

    try {
      const documentRef = doc(db, "All Documents", id);

      // Update the document
      await updateDoc(documentRef, {
        name: name,
      });

      // await updateDoc(doc(db, "All Documents", id));
      notification.success({
        message: "Document",
        description: `Documents ${name} has been updated successfully.`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete item. Please try again later.",
      });
    } finally {
      getDocuments();
    }
  };
  const updateWelfareSchemes = async (id, name, fee) => {
    try {
      if (!id) message.error("Please Select a Welfare scheme to edit.");
      const documentRef = doc(db, "All Welfare Schemes", id);

      // Update the document
      await updateDoc(documentRef, {
        name: name,
        fee: fee,
      });

      // await deleteDoc(doc(db, "All Welfare Schemes", id));
      notification.success({
        message: "Welfare Updated",
        description: `Welfare Schemes ${name} has been updated successfully.`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to updated item. Please try again later.",
      });
    } finally {
      getWelfare();
    }
  };
  useEffect(() => {
    getSuggestiveList();
    getWelfare();
    getDocuments();
    getSubscriptionPlans();
    getSkilling();
    getVolunteer();
  }, []);

  const tabItems = [
    {
      label: `Trades`,
      key: "Trades",
      children: (
        <div className="m-3">
          <div className="my-5 flex justify-end">
            {isEditing ? (
              <Button type="primary" onClick={() => setIsEditing(false)}>
                Add
              </Button>
            ) : (
              <Button type="primary" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
          <div className="">
            {!isEditing && (
              <Form
                form={suggestiveForm}
                onFinish={(values) =>
                  createSuggestiveList(values?.benefit, "Trades")
                }
              >
                <Form.Item
                  name="benefit"
                  rules={[
                    {
                      whitespace: true,
                      required: true,
                      message: "Benefit Name is required",
                    },
                  ]}
                >
                  <Input placeholder="Benefit Name" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">Save</Button>
                </Form.Item>
              </Form>
            )}
          </div>
          <div className="flex items-center gap-3 m-3 flex-wrap">
            {suggestiveList?.Trades?.map((trade) => {
              return (
                <div
                  className="flex items-center justify-center bg-primary px-3 py-2 rounded-full"
                  key={trade?.id}
                >
                  <p className="text-sm font-semibold text-white">
                    {trade?.name}
                  </p>
                  {isEditing && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        deleteSuggestiveList(trade?.id, trade?.name)
                      }
                    >
                      <XIcon className="text-white" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      label: `Skill`,
      key: "Skill",
      children: (
        <div className="m-3">
          <div className="my-5 flex justify-end">
            {isEditing ? (
              <Button type="primary" onClick={() => setIsEditing(false)}>
                Add
              </Button>
            ) : (
              <Button type="primary" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
          <div className="">
            {!isEditing && (
              <Form
                form={suggestiveForm}
                onFinish={(values) =>
                  createSuggestiveList(values?.benefit, "Skills")
                }
              >
                <Form.Item
                  name="benefit"
                  rules={[
                    {
                      required: true,
                      message: "Benefit Name is required",
                    },
                  ]}
                >
                  <Input placeholder="Benefit Name" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">Save</Button>
                </Form.Item>
              </Form>
            )}
          </div>
          <div className="flex items-center gap-3 m-3 flex-wrap">
            {suggestiveList?.Skill?.map((trade) => {
              return (
                <div
                  className="flex items-center justify-center bg-primary px-3 py-2 rounded-full"
                  key={trade?.id}
                >
                  <p className="text-sm font-semibold text-white">
                    {trade?.name}
                  </p>
                  {isEditing && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        deleteSuggestiveList(trade?.id, trade?.name)
                      }
                    >
                      <XIcon className="text-white" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      label: `Benefit`,
      key: "Benefit",
      // children: `Content of Tab ${id}`,
      children: (
        <div className="m-3">
          <div className="my-5 flex justify-end">
            {isEditing ? (
              <Button type="primary" onClick={() => setIsEditing(false)}>
                Add
              </Button>
            ) : (
              <Button type="primary" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
          <div className="">
            {!isEditing && (
              <Form
                form={suggestiveForm}
                onFinish={(values) =>
                  createSuggestiveList(values?.benefit, "Other Benefits")
                }
              >
                <Form.Item
                  name="benefit"
                  rules={[
                    {
                      required: true,
                      message: "Benefit Name is required",
                    },
                  ]}
                >
                  <Input placeholder="Benefit Name" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">Save</Button>
                </Form.Item>
              </Form>
            )}
          </div>
          <div className="flex items-center gap-3 m-3 flex-wrap">
            {suggestiveList["Benefit"]?.map((trade) => {
              return (
                <div
                  className="flex items-center justify-center bg-primary px-3 py-2 rounded-full"
                  key={trade?.id}
                >
                  <p className="text-sm font-semibold text-white">
                    {trade?.name}
                  </p>
                  {isEditing && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        deleteSuggestiveList(trade?.id, trade?.name)
                      }
                    >
                      <XIcon className="text-white" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
  ];
  const SessionForm = ({ courseId, session, onUpdate }) => {
    const [session1, setSession1] = useState(session.name_1 || "");
    const [session2, setSession2] = useState(session.name_2 || "");

    const handleUpdate = async () => {
      try {
        await updateDoc(doc(db, "Courses", courseId), {
          session: {
            name_1: session1,
            name_2: session2,
          },
        });
        console.log(`Sessions updated successfully for course ${courseId}`);
      } catch (error) {
        console.error("Error updating sessions:", error);
      }
    };

    return (
      <div>
        <div className="flex gap-5">
          <Card title="Session 1">
            <Input
              value={session1}
              onChange={(e) => setSession1(e.target.value)}
              placeholder="Session 1 Name"
            />
          </Card>
          <Card title="Session 2">
            <Input
              value={session2}
              onChange={(e) => setSession2(e.target.value)}
              placeholder="Session 2 Name"
              style={{ marginLeft: "10px" }}
            />
          </Card>
        </div>
        <Button type="primary" onClick={handleUpdate} className="mt-4">
          Update Sessions
        </Button>
      </div>
    );
  };

  return (
    <div className="p-5">
      <div>
        <p className="text-base mb-5">
          Dashboard <span className="text-[#F7B652]">&gt;</span> New
          Registration List
        </p>
        <span className="text-2xl font-semibold text-[#013D9D]">Services</span>
      </div>
      <Tabs centered>
        <TabPane
          tab={<span className="font-semibold">Job Post</span>}
          key="1"
          className="p-4 mx-auto"
        >
          <div>
            <Form
              name="companyDetailsForm"
              layout="vertical"
              form={companyForm}
              onFinish={handelCreateJobPost}
            >
              <h1 className="text-lg font-medium text-[#013D9D] mb-8 ml-32">
                Company Details
              </h1>
              <div className="grid grid-cols-3 gap-2 w-[80%] mx-auto">
                <Form.Item
                  label="Company Name"
                  name="companyName"
                  className="w-full mb-2"
                  rules={[
                    { required: true, message: "Company Name is required" },
                    { whitespace: true, message: "Company Name is required" },
                  ]}
                >
                  <Input placeholder="Enter Company Name" />
                </Form.Item>
                <Form.Item
                  label="Company GSTIN No"
                  name="companyGstin"
                  className="w-full mb-2"
                  rules={[
                    {
                      pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/,
                      message: "Invalid GSTIN number",
                    },
                  ]}
                >
                  <Input placeholder="Enter GST Number" />
                </Form.Item>
                <Form.Item
                  name="companyPan"
                  label="Company Pan Card No"
                  className="mb-2"
                  rules={[
                    {
                      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "Invalid PAN number",
                    },
                  ]}
                >
                  <Input placeholder="Enter PAN number" />
                </Form.Item>
                <Form.Item
                  name="companyPin"
                  label="PIN"
                  className="mb-2"
                  rules={[
                    { required: true, message: "PIN is required" },
                    {
                      pattern: /^[1-9][0-9]{5}$/,
                      message: "Invalid PIN code",
                    },
                  ]}
                >
                  <Input placeholder="Eg. 741234" type="number" />
                </Form.Item>
                <Form.Item
                  name="companyState"
                  label="State"
                  className="mb-2"
                  rules={[
                    { required: true, message: "State is required" },
                    {
                      pattern: /^[a-zA-Z\s]+$/,
                      message:
                        "State name cannot contain numbers or special characters",
                    },
                  ]}
                >
                  <Input placeholder="Eg. Hyderabad" />
                </Form.Item>
                <Form.Item
                  name="companyAddress"
                  label="Registered Address"
                  className=""
                  rules={[
                    {
                      required: true,
                      message: "Registered Address is required",
                    },
                    {
                      whitespace: true,
                      message: "Registered Address is required",
                    },
                  ]}
                >
                  <Input placeholder="Eg. 24 Bombay House" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  className=""
                  rules={[
                    { required: true, message: "Email is required" },
                    {
                      type: "email",
                      message: "Invalid email address",
                    },
                  ]}
                >
                  <Input placeholder="Enter Email" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone"
                  className=""
                  rules={[
                    { required: true, message: "Phone is required" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Invalid phone number",
                    },
                  ]}
                >
                  <Input placeholder="+917837432342" />
                </Form.Item>
                <Form.Item
                  label="Job Poster Name"
                  name="job_poster_name"
                  rules={[
                    { required: true, message: "Job Poster Name is required" },
                    {
                      whitespace: true,
                      message: "Job Poster Name is required",
                    },
                  ]}
                >
                  <Input placeholder="Job Poster Name" />
                </Form.Item>
                <Form.Item
                  label="Job Poster Email"
                  name="job_poster_email"
                  rules={[
                    { required: true, message: "Job Poster email is required" },
                    {
                      type: "email",
                      message: "Invalid email address",
                    },
                  ]}
                >
                  <Input placeholder="Job Poster email" />
                </Form.Item>
                <Form.Item
                  label="Job Poster Phone"
                  name="job_poster_phone"
                  rules={[
                    { required: true, message: "Job Poster phone is required" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Invalid phone number",
                    },
                  ]}
                >
                  <Input placeholder="+917837432342" />
                </Form.Item>
              </div>

              <h1 className="text-lg font-medium text-[#013D9D] mb-4 ml-32">
                Job Details
              </h1>
              <div className="grid grid-cols-3 gap-2 w-[80%] mx-auto">
                <Form.Item
                  label="Job Position"
                  name="jobPosition"
                  className="w-full mb-2"
                  rules={[
                    { required: true, message: "Job Position is required" },
                    { whitespace: true, message: "Job Position is required" },
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
                    style={{ flex: 1 }}
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
                      {suggestiveList?.Trades?.map((op) => {
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
                  rules={[{ required: true, message: "Job Place is required" }]}
                >
                  <Select placeholder="Place" mode="tags" style={{ flex: 1 }} />
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
                    style={{ flex: 1 }}
                    options={[
                      { value: "Any", label: "Any" },
                      { value: "Fresher", label: "Fresher" },
                      { value: "Experience", label: "Experience" },
                    ]}
                  />
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
                    placeholder="Required Skills"
                    mode="multiple"
                    style={{
                      flex: 1,
                    }}
                  >
                    {suggestiveList?.Skill?.map((op) => {
                      return (
                        <Option value={op?.name} key={op?.id}>
                          {op?.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <div className="flex items-center justify-center gap-2">
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
                  </Form.Item>{" "}
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
                      message: "Other Benefits is required",
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
                    {suggestiveList["Benefit"]?.map((op) => {
                      return (
                        <Option value={op?.name} key={op?.id}>
                          {op?.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  className="bg-[#013D9D] ml-[40%] px-12"
                  htmlType="submit"
                >
                  Post Job
                </Button>
              </Form.Item>
            </Form>
          </div>
        </TabPane>
        <TabPane
          //  tab="Skilling"
          tab={<span className="font-semibold">Skilling</span>}
          key="2"
        >
          <div className="flex justify-end">
            {selectedSkill && (
              <Button
                type="primary"
                className="mr-3"
                onClick={() => setIsSkillingModalVisible(true)}
              >
                Add New Course
              </Button>
            )}
            <Button type="primary" onClick={() => setIsSkillingModal(true)}>
              Add New Skilling
            </Button>
          </div>
          <div className=" max-w-screen-xl mt-7 mx-auto">
            <Form
              form={skillingForm}
              layout="vertical"
              onFinish={handleFormSubmit}
            >
              <Form.Item
                label="Select Skill"
                name="skill"
                rules={[{ required: true, message: "Please select a skill" }]}
              >
                <Select
                  placeholder="Select a skill"
                  onChange={handleSkillChange}
                  value={selectedSkill?.id}
                >
                  {skilling.map((skill) => (
                    <Option key={skill.id} value={skill.id}>
                      {skill.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {/* 
              <Form.Item
                label="Program Name"
                name="programName"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Program Name is required",
                  },
                ]}
              >
                <Input placeholder="Enter Program Name" />
              </Form.Item> */}

              {selectedSkill &&
                selectedSkill.courses.map((course, index) => (
                  <div key={course.id} className="course-item">
                    <Divider>Course {index + 1}</Divider>
                    <div className="grid grid-cols-3 gap-5">
                      <Form.Item
                        label="Course Name"
                        name={`courseName${index}`}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Course Name is required",
                          },
                        ]}
                      >
                        <Input placeholder="Enter course Name" />
                      </Form.Item>
                      <Form.Item
                        label="Course Video Link"
                        name={`videoLink${index}`}
                        rules={[
                          {
                            // required: true,
                            whitespace: true,
                            message: "Course Video Link is required",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Video Link" />
                      </Form.Item>
                      <Form.Item name={`course_id${index}`} hidden>
                        <Input placeholder="Enter Video Link" />
                      </Form.Item>
                      <Form.Item
                        label="Course Type"
                        name={`courseType${index}`}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Course Type is required",
                          },
                        ]}
                      >
                        <Select placeholder="Select">
                          <Option value="free">Free</Option>
                          <Option value="paid">Chargeable </Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="Amount" name={`fee${index}`}>
                        <Input placeholder="Amount" type="number" />
                      </Form.Item>
                      <Form.Item label="Location" name={`location${index}`}>
                        <Input placeholder="Location" />
                      </Form.Item>
                      <Form.Item
                        label="Duration"
                        name={`duration${index}`}
                      >
                        <Input placeholder="Duration" />
                      </Form.Item>
                      <Form.Item label="Start Date" name={`startDate${index}`}>
                        <Input placeholder="start Date" type="date" />
                      </Form.Item>
                    </div>
                  </div>
                ))}

              {selectedSkill && (
                <div className="flex justify-end gap-8 mt-4">
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </div>
              )}
            </Form>
          </div>
        </TabPane>
        {/* <TabPane
          tab={<span className="font-semibold">Volunteer</span>}
          //  tab=""
          key="3"
        >
          <Modal
            open={isAddNewVolunteerModalVisible}
            onClose={() => setIsAddNewVolunteerModal(false)}
            onCancel={() => setIsAddNewVolunteerModal(false)}
            title="Add New Volunteer"
            footer={null}
          >
            <Form
              form={createNewVolunteer}
              layout="vertical"
              onFinish={handelCreateVolunteer}
            >
              <Form.Item
                name="volunteerName"
                label="Volunteer Name"
                rules={[
                  { required: true, message: "Please enter volunteer name" },
                ]}
              >
                <Input placeholder="Enter volunteer name" />
              </Form.Item>
              <Form.Item
                name="sessionName1"
                label="Session 1 Name"
                rules={[
                  { required: true, message: "Please enter session 1 name" },
                ]}
              >
                <Input placeholder="Enter session 1 name" />
              </Form.Item>
              <Form.Item
                name="sessionName2"
                label="Session 2 Name"
                rules={[
                  { required: true, message: "Please enter session 2 name" },
                ]}
              >
                <Input placeholder="Enter session 2 name" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <div>
            <div className="flex justify-end">
              <Button
                onClick={() => setIsAddNewVolunteerModal(true)}
                type="primary"
              >
                Add New Volunteer
              </Button>
            </div>
            <Tabs type="card" tabPosition={"left"}>
              {volunteer?.map((course) => (
                <TabPane tab={course.name} key={course.id}>
                  <SessionForm
                    courseId={course.id}
                    sessionNumber={1}
                    session={course.session}
                    onUpdate={handleSessionUpdate}
                  />
                </TabPane>
              ))}
            </Tabs>
          </div>
        </TabPane> */}
        <TabPane
          tab={<span className="font-semibold">Document</span>}
          // tab="Document"
          key="4"
        >
          <div className="max-w-4xl mx-auto mt-10">
            <div className="flex justify-between">
              <h1 className="text-[#013D9D] font-semibold text-base">
                Document Services
              </h1>
              {isEditing ? (
                <Button
                  type="primary"
                  className="bg-[#013D9D] text-white"
                  onClick={() => {
                    setIsEditing(false);
                    documentService.resetFields();
                  }}
                >
                  Add
                </Button>
              ) : (
                <Button
                  className="bg-[#013D9D] text-white"
                  onClick={() => {
                    setIsEditing(true);
                    documentService.resetFields();
                  }}
                >
                  <EditOutlined />
                  Edit
                </Button>
              )}
            </div>

            <Form
              layout="vertical"
              className="mt-4"
              form={documentService}
              onFinish={(values) =>
                !isEditing
                  ? createDocument(values?.document, values?.fee)
                  : updateDocument(values?.document_id, values?.document)
              }
            >
              <Form.Item
                name="document"
                label="Name"
                rules={[
                  {
                    whitespace: true,
                    required: true,
                    message: "Document Name is required",
                  },
                ]}
              >
                <Input placeholder="Document Name" />
              </Form.Item>
              {isEditing && (
                <Form.Item name="document_id" label="ID">
                  <Input placeholder="Document Id" disabled />
                </Form.Item>
              )}
              <Form.Item
                name="fee"
                hidden
                // rules={[
                //   {
                //     required: true,
                //     message: "Amount is required",
                //   },
                // ]}
              >
                <Input placeholder="Amount" type="number" />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">
                  {isEditing ? "Update" : "Save"}
                </Button>
              </Form.Item>
            </Form>

            <div className="flex gap-3 mt-5 flex-wrap">
              {documents?.map((document) => {
                return (
                  <p className="bg-primary px-3 py-2 rounded-full text-white font-semibold items-center justify-between flex flex-nowrap">
                    {document?.name}
                    {isEditing && (
                      <Button
                        type="link"
                        size="small"
                        className="ml-3"
                        onClick={() => {
                          documentService.setFieldValue(
                            "document",
                            document?.name
                          );
                          documentService.setFieldValue(
                            "document_id",
                            document?.id
                          );
                        }}
                      >
                        <PenBoxIcon className="text-white h-4 w-4" />
                      </Button>
                    )}
                    {isEditing && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() =>
                          deleteDocument(document?.id, document?.name)
                        }
                      >
                        <XIcon className="text-white h-4 w-4" />
                      </Button>
                    )}
                  </p>
                );
              })}
            </div>
          </div>
        </TabPane>
        <TabPane
          tab={<span className="font-semibold">Welfare Scheme</span>}
          key="5"
        >
          <div className="max-w-4xl mx-auto mt-10">
            <div className="flex justify-between">
              <h1 className="text-[#013D9D] font-semibold text-base">
                Welfare Schemes
              </h1>
              {isEditing ? (
                <Button
                  type="primary"
                  className="bg-[#013D9D] text-white"
                  onClick={() => {
                    setIsEditing(false);
                    welfareForm.resetFields();
                  }}
                >
                  Add
                </Button>
              ) : (
                <Button
                  className="bg-[#013D9D] text-white"
                  onClick={() => {
                    setIsEditing(true);
                    welfareForm.resetFields();
                  }}
                >
                  <EditOutlined />
                  Edit
                </Button>
              )}
            </div>

            <Form
              className="mt-4"
              form={welfareForm}
              layout="vertical"
              onFinish={(values) =>
                isEditing
                  ? updateWelfareSchemes(
                      values?.welfare_id,
                      values?.scheme,
                      values?.fee
                    )
                  : createScheme(values?.scheme, values?.fee)
              }
            >
              <Form.Item
                name="scheme"
                label="Benefit Name"
                rules={[
                  {
                    whitespace: true,
                    required: true,
                    message: "Benefit Name is required",
                  },
                ]}
              >
                <Input placeholder="Benefit Name" />
              </Form.Item>
              {isEditing && (
                <Form.Item name="welfare_id" label="ID">
                  <Input placeholder="Welfare Id" disabled />
                </Form.Item>
              )}
              <Form.Item
                name="fee"
                label="Fee"
                rules={[
                  {
                    required: true,
                    message: "Amount is required",
                  },
                ]}
              >
                <Input placeholder="Amount" type="number" />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">
                  {isEditing ? "Update" : "Save"}
                </Button>
              </Form.Item>
            </Form>

            <div className="flex gap-3 mt-5 flex-wrap">
              {welfareList?.map((welfare) => {
                return (
                  <p className="bg-primary px-3 py-2 rounded-full text-white font-semibold items-center justify-between flex flex-nowrap">
                    {welfare?.name}
                    {isEditing && (
                      <Button
                        type="link"
                        size="small"
                        className="ml-2"
                        onClick={() =>
                          welfareForm.setFieldsValue({
                            scheme: welfare?.name,
                            welfare_id: welfare.id,
                            fee: welfare?.fee,
                          })
                        }
                      >
                        <PenBoxIcon className="text-white h-4 w-4" />
                      </Button>
                    )}
                    {isEditing && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() =>
                          deleteWelfareSchemes(welfare?.id, welfare?.name)
                        }
                      >
                        <XIcon className="text-white h-4 w-4" />
                      </Button>
                    )}
                  </p>
                );
              })}
            </div>
          </div>
        </TabPane>
        <TabPane
          //  tab="Subscription Plan"
          tab={<span className="font-semibold">Subscription Plan</span>}
          key="6"
        >
          <div className="flex justify-end mb-4">
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Create New Benefit
            </Button>
          </div>
          <Tabs
            className="w-full"
            tabPosition={"left"}
            items={subscriptionTabs}
          />
        </TabPane>
        <TabPane
          // tab="Suggestive Lists"
          tab={<span className="font-semibold">Suggestive Lists</span>}
          key="7"
          className="w-[80%] flex items-center justify-center mx-auto"
        >
          <Tabs
            className="w-full"
            activeKey={tab}
            tabPosition={"left"}
            items={tabItems}
            onChange={(t) => setTab(t)}
          />
        </TabPane>
      </Tabs>
      <Modal
        title="Create New Benefit"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={createSubscriptionForm}
          layout="vertical"
          className="flex  gap-10"
          onFinish={handleCreateSubscriptionPlan}
        >
          <div>
            <Form.List
              name="benefits"
              rules={[
                {
                  validator: async (_, benefits) => {
                    if (!benefits || benefits.length < 1) {
                      return Promise.reject(
                        new Error("At least 1 benefit is required.")
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <div className="flex flex-col w-80">
                  {fields.map((field, index) => (
                    <Form.Item
                      className="w-full"
                      label={index === 0 ? "Benefits" : ""}
                      required={false}
                      key={field.key}
                    >
                      <div className="flex flow-row gap-2 items-center justify-center">
                        <Form.Item
                          className="w-full"
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message:
                                "Please input benefit name or delete this field.",
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="Benefit name" />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircle
                            className="dynamic-delete-button text-red-500"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </div>
                    </Form.Item>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add field
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </div>
              )}
            </Form.List>
          </div>
          <div className="w-full">
            <Form.Item
              label="Plan Tenure"
              name="plan_tenure"
              rules={[
                {
                  required: true,
                  message: "Please select plan tenure",
                },
              ]}
            >
              <Select>
                <Option value="Monthly">Monthly</Option>
                <Option value="Yearly">Yearly</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Plan Name"
              name="plan_name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input plan name",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Price (₹)"
              name="plan_price"
              rules={[
                {
                  required: true,

                  message: "Please input plan price",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Create New Skilling"
        open={isSkillingModal}
        onCancel={() => setIsSkillingModal(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Program Name"
            name="programName"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Program Name is required",
              },
            ]}
          >
            <Input placeholder="Enter Program Name" />
          </Form.Item>
          {courses.map((course, index) => (
            <div key={course.key} className="course-item">
              <Divider>Course {index + 1}</Divider>
              <div className="grid grid-cols-3 gap-5">
                <Form.Item
                  label="Course Name"
                  name={`courseName${course.key}`}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Course Name is required",
                    },
                  ]}
                >
                  <Input placeholder="Enter course Name" />
                </Form.Item>
                <Form.Item
                  label="Course Video Link"
                  name={`courseVideoLink${course.key}`}
                  rules={[
                    {
                      // required: true,
                      whitespace: true,
                      message: "Course Video Link is required",
                    },
                  ]}
                >
                  <Input placeholder="Enter Video Link" />
                </Form.Item>
                <Form.Item
                  label="Course Type"
                  name={`courseType${course.key}`}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Course Fee is required",
                    },
                  ]}
                >
                  <Select placeholder="Select">
                    <Option value="free">Free</Option>
                    <Option value="paid">Chargeable </Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Amount" name={`fee${index}`}>
                  <Input placeholder="Amount" type="number" />
                </Form.Item>
                <Form.Item label="Location" name={`location${index}`}>
                  <Input placeholder="Location" />
                </Form.Item>
                <Form.Item label="Duration" name={`duration${index}`}>
                  <Input placeholder="Duration" />
                </Form.Item>{" "}
                <Form.Item label="Start Date" name={`startDate${index}`}>
                  <Input placeholder="start Date" type="date" />
                </Form.Item>
              </div>
              {courses.length > 1 && (
                <Button type="link" onClick={() => removeCourse(course.key)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="dashed" onClick={addCourse} icon={<PlusOutlined />}>
            Add Course
          </Button>
          <div className="flex justify-end gap-8 mt-4">
            <Button onClick={() => setIsSkillingModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Add Course"
        open={isSkillingModalVisible}
        onCancel={() => setIsSkillingModalVisible(false)}
        footer={null}
      >
        <Form
          form={addNewCourseForm}
          layout="vertical"
          onFinish={handleAddCourse}
        >
          <Form.Item
            label="Course Name"
            name="courseName"
            rules={[{ required: true, message: "Course Name is required" }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>
          <Form.Item
            label="Course Video Link"
            name="courseVideoLink"
            rules={[
              { whitespace: true, message: "Course Video Link is required" },
            ]}
          >
            <Input placeholder="Enter video link" />
          </Form.Item>
          <Form.Item
            label="Course Type"
            name="courseType"
            rules={[{ required: true, message: "Course Type is required" }]}
          >
            <Select placeholder="Select course type">
              <Option value="free">Free</Option>
              <Option value="paid">Chargeable </Option>
            </Select>
          </Form.Item>
          <Form.Item label="Amount" name={`fee`}>
            <Input placeholder="Amount" type="number" />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ whitespace: true, message: "location is required" }]}
          >
            <Input placeholder="location" />
          </Form.Item>
          <Form.Item label="Duration" name={`duration`}>
            <Input placeholder="Duration" />
          </Form.Item>
          <Form.Item label="Start Date" name={`startDate`}>
            <Input placeholder="start Date" type="date" />
          </Form.Item>

          <div className="flex justify-end gap-8 mt-4">
            <Button onClick={() => setIsSkillingModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Course
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Index;
