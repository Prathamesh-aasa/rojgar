import { Button, Input } from "antd";
import React from "react";

const index = () => {
  return (
    <div className="p-5">
      <div>
        <h1 className="text-2xl font-semibold text-[#013D9D]">Setting</h1>
      </div>
      <div className="flex items-center justify-center gap-5 mt-16">
        <div className="flex flex-col items-end">
          <div className="  w-60 h-24 border p-2 rounded-lg">
            <p>
              Email Id
              <Input value="candidate@gmail.com" className=" border-none" />
            </p>
          </div>
          <Button type="link">change</Button>
        </div>
        <div className="flex flex-col items-end">
          <div className="  w-60 h-24 border p-2 rounded-lg">
            <p>
              Email Id
              <Input value="candidate@gmail.com" className=" border-none" />
            </p>
          </div>
          <Button type="link">change</Button>
        </div>
      </div>
    </div>
  );
};

export default index;
