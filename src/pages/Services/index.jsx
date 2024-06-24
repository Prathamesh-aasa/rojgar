import React, { useRef, useState } from "react";
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
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";

let index1 = 0;
const { Option } = Select;

const Index = () => {
  const [items, setItems] = useState([
    "Digital shala",
    "Life Skill Shala",
    "Soft Skill Shala",
    "Rozgar Shala",
  ]);
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef(null);

  const options = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i,
    });
  }
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([{ key: 0 }]);

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

  const [selectedPlan, setSelectedPlan] = useState("Basic Plan");

  const plans = {
    "Basic Plan": {
      benefits: [
        "25 Different Posts",
        "25 Different Posts",
        "25 Different Posts",
      ],
      tenure: "Yearly",
      price: "999",
    },
    "Business Plan": {
      benefits: [
        "50 Different Posts",
        "50 Different Posts",
        "50 Different Posts",
      ],
      tenure: "Yearly",
      price: "1999",
    },
    "Premium Plan": {
      benefits: ["Unlimited Posts", "Unlimited Posts", "Unlimited Posts"],
      tenure: "Yearly",
      price: "2999",
    },
  };

  const [selectedTrade, setSelectedTrade] = useState("");
  const [showButton, setShowButton] = useState(false);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedTrade(value);
    setShowButton(value !== "");
  };

  const [tabPosition, setTabPosition] = useState("left");
  const changeTabPosition = (e) => {
    setTabPosition(e.target.value);
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
        <TabPane tab="Job Post" key="1" className="p-4">
          <div>
            <Form name="companyDetailsForm" layout="vertical" autoComplete="on">
              <h1 className="text-lg font-medium text-[#013D9D] mb-8 ml-32">
                Company Details
              </h1>
              <div className="grid grid-cols-3 gap-2 w-[80%] mx-auto">
                <Form.Item
                  label="Company Name *"
                  name="companyName"
                  className="w-full mb-2"
                >
                  <Input placeholder="Enter Company Name" />
                </Form.Item>
                <Form.Item
                  label="Company GSTIN No *"
                  name="companyGstin"
                  className="w-full mb-2"
                >
                  <Input placeholder="Enter GST Number" />
                </Form.Item>
                <Form.Item
                  name="companyPan"
                  label="Company Pan Card No *"
                  className="mb-2"
                >
                  <Input placeholder="Enter PAN number" />
                </Form.Item>
                <Form.Item name="companyPin" label="PIN*" className="mb-2">
                  <Input placeholder="Eg. 741234" />
                </Form.Item>
                <Form.Item name="companyState" label="State*" className="mb-2">
                  <Input placeholder="Eg. Hyderabad" />
                </Form.Item>
                <Form.Item
                  name="companyAddress"
                  label="Registered Address *"
                  className="mb-8"
                >
                  <Input placeholder="Eg. 24 Bombay House" />
                </Form.Item>
              </div>
            </Form>

            <Form name="jobDetailsForm" layout="vertical" autoComplete="on">
              <h1 className="text-lg font-medium text-[#013D9D] mb-4 ml-32">
                Job Details
              </h1>
              <div className="grid grid-cols-3 gap-2 w-[80%] mx-auto">
                <Form.Item
                  label="Job Position*"
                  name="jobPosition"
                  className="w-full mb-2"
                >
                  <Input placeholder="Eg. Technician" />
                </Form.Item>
                <Form.Item
                  label="Education Qualification *"
                  name="educationQualification"
                  className="w-full mb-2"
                >
                  <Select
                    placeholder="Choose from dropdown"
                    style={{
                      flex: 1,
                    }}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "Yiminghe",
                        label: "yiminghe",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="jobPlace" label="Job Place *" className="mb-2">
                  <Select
                    placeholder="Choose from dropdown"
                    mode="tags"
                    style={{
                      flex: 1,
                    }}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "Yiminghe",
                        label: "yiminghe",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="experienceRequired"
                  label="Experience Required **"
                  className="mb-2"
                >
                  <Select
                    placeholder="Choose from dropdown"
                    style={{
                      flex: 1,
                    }}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "Yiminghe",
                        label: "yiminghe",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="skillRequired"
                  label="Skill Required*"
                  className="mb-2"
                >
                  <Select
                    placeholder="Choose from dropdown"
                    mode="tags"
                    style={{
                      flex: 1,
                    }}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "Yiminghe",
                        label: "yiminghe",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="numberOfOpenings"
                  label="Number of Openings *"
                  className="mb-2"
                >
                  <Input placeholder="Eg.100" />
                </Form.Item>
                <Form.Item name="payout" label="Payout *" className="mb-2">
                  <div className="flex items-center justify-center gap-2">
                    <Input placeholder="Eg.741234" />
                    <p>To</p>
                    <Input placeholder="Eg.741234" />
                  </div>
                </Form.Item>
                <Form.Item
                  name="otherBenefits"
                  label="Other Benefits *"
                  className="mb-2"
                >
                  <Select
                    placeholder="Choose from dropdown"
                    mode="tags"
                    style={{
                      flex: 1,
                    }}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "Yiminghe",
                        label: "yiminghe",
                      },
                    ]}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-end gap-8">
                <Button className="px-8 py-2">Cancel</Button>
                <Button className="px-8 py-2 bg-[#013D9D] text-white">
                  Post
                </Button>
              </div>
            </Form>
          </div>
        </TabPane>
        <TabPane tab="Skilling" key="2">
          <div className="ml-72 mt-7">
            <Form form={form} layout="vertical">
              <Form.Item label="Program Name" name="programName">
                <Input placeholder="Enter Program Name" />
              </Form.Item>
              {courses.map((course, index) => (
                <div key={course.key} className="course-item">
                  <Divider>Course {index + 1}</Divider>
                  <div className="grid grid-cols-3 gap-5">
                    <Form.Item
                      label="Course Name"
                      name={`courseName${course.key}`}
                    >
                      <Input placeholder="Enter course Name" />
                    </Form.Item>
                    <Form.Item
                      label="Course Video Link"
                      name={`courseVideoLink${course.key}`}
                    >
                      <Input placeholder="Enter Video Link" />
                    </Form.Item>
                    <Form.Item
                      label="Course Fee"
                      name={`courseFee${course.key}`}
                    >
                      <Select placeholder="Select">
                        <Option value="free">Free</Option>
                        <Option value="paid">Paid</Option>
                      </Select>
                    </Form.Item>
                  </div>
                  {courses.length > 1 && (
                    <Button
                      type="link"
                      onClick={() => removeCourse(course.key)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="dashed" onClick={addCourse} icon={<PlusOutlined />}>
                Add Course
              </Button>
              <div className="flex justify-end gap-8 mt-4">
                <Button>Cancel</Button>
                <Button type="primary">Save</Button>
              </div>
            </Form>
          </div>
        </TabPane>
        <TabPane tab="Volunteer" key="3">
          <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between">
              <div className="w-1/2 pr-4">
                <Form layout="vertical">
                  {workshops.map((workshop, index) => (
                    <div key={index} className="mb-4">
                      <input
                        type="text"
                        id={`workshop${index + 1}`}
                        name={`workshop${index + 1}`}
                        placeholder={`Enter Workshop ${index + 1}`}
                        className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={workshop}
                        onChange={(e) =>
                          handleWorkshopChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none"
                      onClick={addWorkshopInput}
                    >
                      Add Workshop
                    </button>
                  </div>
                </Form>
              </div>
              <div className="w-1/2 pl-4">
                <div className="flex justify-end mb-4">
                  <Button type="default">Edit</Button>
                </div>
                <Form layout="vertical">
                  <Form.Item label="Training Program 1">
                    <Input defaultValue="Basic Computer Skills Training" />
                  </Form.Item>
                  <Form.Item label="Training Program 2">
                    <Input defaultValue="Communication Skills Development" />
                  </Form.Item>
                  <div className="flex justify-between">
                    <Button>Cancel</Button>
                    <Button type="primary">Save</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </TabPane>

        <TabPane tab="Document" key="4">
          <div className="max-w-4xl mx-auto mt-10">
            <div className="flex justify-between">
              <h1 className="text-[#013D9D] font-semibold text-base">
                Document Services
              </h1>
              <Button className="bg-[#013D9D] text-white">
                <EditOutlined />
                Edit
              </Button>
            </div>
            <div className="flex items-center justify-center mt-20">
              <div className="flex flex-wrap gap-5 bg-[#EEF2F9] p-5 rounded-lg">
                <Button>Pan Card</Button>
                <Button>E-Shram Card</Button>
                <Button>Aadhaar Card Correction</Button>
                <Button>Caste Certificate</Button>
                <div className="flex gap-5">
                  <Button>Income Certificate</Button>
                  <Button>Domicile Certificate</Button>
                  <Button>Khasra</Button>
                  <Button>Birth Certificate</Button>
                  <Button>Train Support</Button>
                </div>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Welfare Scheme" key="5">
          <div className="max-w-4xl mx-auto mt-10">
            <div className="flex justify-between">
              <h1 className="text-[#013D9D] font-semibold text-base">
                Welfare Schemes
              </h1>
              <Button className="bg-[#013D9D] text-white">
                <EditOutlined />
                Edit
              </Button>
            </div>
            <div className="flex items-center justify-center mt-20">
              <div className="flex flex-wrap gap-5 bg-[#EEF2F9] p-5 rounded-lg">
                <Button>Pan Card</Button>
                <Button>E-Shram Card</Button>
                <Button>Aadhaar Card Correction</Button>
                <Button>Caste Certificate</Button>
                <div className="flex gap-5">
                  <Button>Income Certificate</Button>
                  <Button>Domicile Certificate</Button>
                  <Button>Khasra</Button>
                  <Button>Birth Certificate</Button>
                  <Button>Train Support</Button>
                </div>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Subscription Plan" key="6">
          <div className="flex gap-5 p-4 mx-auto w-[85%]">
            <div className="flex flex-col w-96 border p-4 gap-5 rounded-lg">
              <Button
                onClick={() => setSelectedPlan("Basic Plan")}
                className={`p-2 ${
                  selectedPlan === "Basic Plan" ? "bg-blue-500 text-white" : ""
                }`}
              >
                Basic Plan
              </Button>
              <Button
                onClick={() => setSelectedPlan("Business Plan")}
                className={`p-2 ${
                  selectedPlan === "Business Plan"
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                Business Plan
              </Button>
              <Button
                onClick={() => setSelectedPlan("Premium Plan")}
                className={`p-2 ${
                  selectedPlan === "Premium Plan"
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                Premium Plan
              </Button>
              <Button className="mt-auto p-2 bg-blue-100 text-blue-500 rounded-lg">
                Add New Plan
              </Button>
            </div>
            <div className="flex-grow flex gap-5 p-4">
              <div className="flex justify-between mb-4 border rounded-lg h-[120px] w-[250px]">
                <ul className="list-decimal   p-4 ">
                  <h2 className="text-xl font-bold">Benefits</h2>
                  {plans[selectedPlan].benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="flex mt-4 gap-5">
                <div className="flex-grow border h-[100px] w-[250px] p-4 rounded-lg">
                  <h3 className="font-semibold">Plan Tenure</h3>
                  <p>{plans[selectedPlan].tenure}</p>
                </div>
                <div className="flex-grow  border h-[100px] w-[150px] p-4 rounded-lg">
                  <h3 className="font-semibold">Price (₹)</h3>
                  <p>{plans[selectedPlan].price}</p>
                </div>
              </div>
              <div></div>
            </div>
            <div>
              <Button className="bg-[#013D9D] text-white px-4 py-4">
                {" "}
                <EditOutlined />
                Edit
              </Button>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Suggestive Lists" key="7" className="w-[80%] flex items-center justify-center mx-auto">
          <Tabs className="w-[80%] border flex"
            tabPosition={"left"}
            items={new Array(3).fill(null).map((_, i) => {
              const id = String(i + 1);
              return {
                label: `Tab ${id}`,
                key: id,
                children: `Content of Tab ${id}`,
              };
            })}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
