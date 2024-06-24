import React, { useRef, useState } from "react";
import { Button, Tabs, Form, Input, Space, Select, Modal, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setItems([...items, name || `New item ${index1++}`]);
    setName("");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
                  <Form.Item label="Skilling Workshops">
                    <Select defaultValue="Interview Preparation Sessions">
                      <Option value="Interview Preparation Sessions">
                        Interview Preparation Sessions
                      </Option>
                      <Option value="Rozgar Camp Coordination">
                        Rozgar Camp Coordination
                      </Option>
                      <Option value="Mentorship and Support">
                        Mentorship and Support
                      </Option>
                      <Option value="Financial Literacy Workshops">
                        Financial Literacy Workshops
                      </Option>
                      <Option value="Entrepreneurship Development Sessions">
                        Entrepreneurship Development Sessions
                      </Option>
                    </Select>
                  </Form.Item>
                  <Button type="primary" block>
                    Add New Category
                  </Button>
                </Form>
              </div>
              <div className="w-1/2 pl-4">
              <div className="flex justify-end mb-4">
            <Button type="default">Edit</Button>
          </div>
                <Form layout="vertical">
                  <Form.Item label="Training Program">
                    <Input defaultValue="Basic Computer Skills Training" />
                  </Form.Item>
                  <Form.Item label="Training Program">
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
        <TabPane tab="Document" key="4"></TabPane>
        <TabPane tab="Welfare Scheme" key="5"></TabPane>
        <TabPane tab="Subscription Plan" key="6"></TabPane>
        <TabPane tab="Suggestive Lists" key="7"></TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
