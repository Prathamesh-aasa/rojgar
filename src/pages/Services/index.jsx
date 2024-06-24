import React from "react";
import { Button, Tabs } from "antd";
import { Alert, Form, Input } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { Select } from "antd";

const index = () => {
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}
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
            <div>
              <Form name="contactForm" layout="vertical" autoComplete="on">
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
                    name="name"
                    className="w-full mb-2"
                  >
                    <Input placeholder="Enter GST Number" />
                  </Form.Item>

                  <Form.Item
                    name="name"
                    label="Company Pan Card No *"
                    className="mb-2"
                  >
                    <Input placeholder="Enter PAN number" />
                  </Form.Item>
                  <Form.Item name="pin" label="PIN*" className="mb-2">
                    <Input placeholder="Eg. 741234" />
                  </Form.Item>
                  <Form.Item name="name" label="State*" className="mb-2">
                    <Input placeholder="Eg. Hyderbad" />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="Registered Address *"
                    className="mb-8"
                  >
                    <Input placeholder="Eg. 24 Bombay House" />
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div>
              <Form name="contactForm" layout="vertical" autoComplete="on">
                <h1 className="text-lg font-medium text-[#013D9D] mb-4 ml-32">
                  Job Details
                </h1>
                <div className="grid grid-cols-3 gap-2 w-[80%] mx-auto">
                  <Form.Item
                    label="Job Position*"
                    name="companyName"
                    className="w-full mb-2"
                  >
                    <Input placeholder="Eg. Tecnician" />
                  </Form.Item>
                  <Form.Item
                    label="Education Qualification *"
                    name="name"
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

                  <Form.Item name="jobname" label="Job Place *" className="mb-2">
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
                    name="pin"
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
                    name="skillname"
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
                    name="openingname"
                    label="Number of Opennings *"
                    className="mb-2"
                  >
                    <Input placeholder="Eg.100" />
                  </Form.Item>
                  <Form.Item name="payoutname" label="Payout *" className="mb-2">
                    <div className="flex items-center justify-center gap-2">
                      <Input placeholder="Eg.741234" />
                      <p>To</p>
                      <Input placeholder="Eg.741234" />
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="benefitname"
                    label="Other Benefit *"
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
                  <Button>Cancel</Button>
                  <Button>Post</Button>
                </div>
              </Form>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Skiling" key="2"></TabPane>
        <TabPane tab="Volunteer" key="3"></TabPane>
        <TabPane tab="Document" key="4"></TabPane>
        <TabPane tab="Welfare Scheme" key="5"></TabPane>
        <TabPane tab="Subscription Plan" key="6"></TabPane>
        <TabPane tab="Suggestive Lists" key="7"></TabPane>
      </Tabs>
    </div>
  );
};

export default index;
