import React from 'react'
import { Input, Button, Select } from 'antd';;

const { Option } = Select;

const index = () => {
  return (
    <div className="p-8 bg-white shadow-md rounded-md max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Services</h2>
    <div className="mb-8">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input placeholder="Company Name" />
        <Input placeholder="Company GSTIN No" />
        <Input placeholder="Company Pan Card No" />
        <Input placeholder="PIN" />
        <Input placeholder="State" />
        <Input placeholder="Registered Address" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input placeholder="Job Position" />
        <Select placeholder="Education Qualification">
          <Option value="high-school">High School</Option>
          <Option value="bachelor">Bachelor's</Option>
          <Option value="master">Master's</Option>
        </Select>
        <Select placeholder="Job Place">
          <Option value="onsite">Onsite</Option>
          <Option value="remote">Remote</Option>
        </Select>
        <Select placeholder="Experience Required">
          <Option value="0-1">0-1 years</Option>
          <Option value="1-3">1-3 years</Option>
          <Option value="3-5">3-5 years</Option>
        </Select>
        <Input placeholder="Skill Required" />
        <Input placeholder="Number of Openings" />
        <Input placeholder="Payout" />
        <Input placeholder="Other Benefit" />
      </div>
      <div className="flex justify-end">
        <Button type="default" className="mr-2">Cancel</Button>
        <Button type="primary">Post</Button>
      </div>
    </div>
  </div>
  )
}

export default index