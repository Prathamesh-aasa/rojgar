import React from "react";
import { Button, Card, Typography, Image } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import img from "../../assets/image 31.png";

const { Title, Text } = Typography;

const index = () => {
  return (
    <div>
      <div className="flex items-center justify-center p-5">
        <div className="w-full ">
          <div>
            <p className="text-base mb-5">
              Dashboard <span className="text-[#F7B652]">&gt;</span>  Payment Report <span className="text-[#F7B652]">&gt;</span> View Details
            </p>
            <h2 className="text-2xl font-semibold mb-5 text-[#013D9D]"> <span className="text-[#013D9D]">&lt;</span> View Details</h2>
          </div>
          <div className="border-t border-gray-300 pt-5">
            <div className="flex justify-evenly gap-5">
              <div className="col-span-1 flex flex-col items-center">
                <img
                  src={img}
                  alt="Payment Success"
                  className="w-[250px] h-[450px]"
                />
                <button className="mt-3 bg-blue-500 text-white py-2 px-16 rounded">
                  Download Image
                </button>
              </div>
              <div>
                <h1 className="text-2xl text-[#013D9D] font-medium mb-5">
                  Personal Details
                </h1>
                <div className="grid grid-cols-5  mb-16">
                  <div className="flex flex-col gap-3 ">
                    <p className="font-semibold">Registration ID</p>
                    <span>ABCD1234</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Phone No.</p>
                    <span>9876543210</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Full Name.</p>
                    <span>User Name</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">DOB</p>
                    <span>07/06/2001</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Email Id</p>
                    <span>Vicky@gmail.com</span>
                  </div>
                </div>
                <h1 className="text-2xl text-[#013D9D] font-medium mb-5">
                  Payment Details
                </h1>

                <div className="grid grid-cols-5 gap-14">
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Payment Amount</p>
                    <span>500</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Registration Fee paid</p>
                    <span>500</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Payment Type</p>
                    <span>REGISTRATION FEE</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Transaction Id</p>
                    <span>93DJ2231ADD35672D</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button className="bg-red-500 text-white py-2 px-4 rounded mr-2">
                Reject
              </button>
              <button className="bg-blue-500 text-white py-2 px-4 rounded">
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
