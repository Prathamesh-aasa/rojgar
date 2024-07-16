import React, { useEffect, useState } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button, Typography, notification } from "antd";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

const { Title, Text } = Typography;

const PaymentInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const paymentDocRef = doc(db, "Payments", id);
        const paymentSnapshot = await getDoc(paymentDocRef);

        if (paymentSnapshot.exists()) {
          setPaymentDetails(paymentSnapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    if (id) {
      fetchPaymentDetails();
    }
  }, [id]);

  const handleApprove = async () => {
    try {
      const paymentDocRef = doc(db, "Payments", id);
      await updateDoc(paymentDocRef, {
        status: "Approved",
      });

      setPaymentDetails((prevState) => ({
        ...prevState,
        status: "Approved",
      }));

      notification.success({
        message: "Payment Approved",
        description: `Payment ID ${id} has been approved successfully.`,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to approve payment. Please try again later.",
      });
    }
  };

  const handleReject = async () => {
    try {
      const paymentDocRef = doc(db, "Payments", id);
      await updateDoc(paymentDocRef, {
        status: "Rejected",
      });

      setPaymentDetails((prevState) => ({
        ...prevState,
        status: "Rejected",
      }));

      notification.success({
        message: "Payment Rejected",
        description: `Payment ID ${id} has been rejected successfully.`,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      notification.error({
        message: "Error",
        description: "Failed to reject payment. Please try again later.",
      });
    }
  };

  if (!paymentDetails) {
    return <div>Loading...</div>;
  }

  const handleImageDownload = () => {
    const link = document.createElement("a");
    link.href = paymentDetails?.screenshot_link;
    link.download = "payment_screenshot.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div>
      <div className="flex items-center justify-center p-5">
        <div className="w-full">
          <div>
            <p className="text-base mb-5">
              Dashboard <span className="text-[#F7B652]">&gt;</span> Payment
              Report <span className="text-[#F7B652]">&gt;</span> View Details
            </p>

            <h2 className="text-2xl font-semibold mb-5 text-[#013D9D]">
              <span className="text-[#013D9D]">
                {" "}
                <Button
                  size="small"
                  type="dashed"
                  icon={<ArrowLeftIcon />}
                  onClick={() => navigate("/dashboard-payment-report")}
                />
              </span>{" "}
              View Details
            </h2>
          </div>
          <div className="border-t border-gray-300 pt-5">
            <h1 className="bg-[#4A59AE] text-white font-semibold p-3 mb-5 rounded-md">{paymentDetails?.is_payment_gateway ? "Online":"Manual"} Payment Details</h1>
            <div className="flex justify-evenly gap-5">
              <div className="col-span-1 flex flex-col items-center">
                <img
                  src={paymentDetails?.screenshot_link}
                  alt="Payment Screenshots"
                  className="w-[250px] h-[450px]"
                />
                <a
                  href={paymentDetails?.screenshot_link}
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
                    <span>{paymentDetails?.phone_number}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Full Name.</p>
                    <span>{paymentDetails?.full_name}</span>
                  </div>
                  {/* <div className="flex flex-col gap-3">
                    <p className="font-semibold">DOB</p>
                    <span>07/06/2001</span>
                  </div> */}
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Email Id</p>
                    <span>{paymentDetails?.email_id}</span>
                  </div>
                  <div className="flex flex-col gap-3 ">
                    <p className="font-semibold">Registration ID</p>
                    <span>{paymentDetails?.user_id}</span>
                  </div>
                </div>
                <h1 className="text-2xl text-[#013D9D] font-medium mb-5">
                  Payment Details
                </h1>

                <div className="grid grid-cols-3 gap-14">
                  {/* <div className="flex flex-col gap-3">
                    <p className="font-semibold">Payment Amount</p>
                    <span>{paymentDetails?.amount}</span>
                  </div> */}
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Booking Fee paid</p>
                    <span>{paymentDetails?.amount}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Transaction Id</p>
                    <span>{paymentDetails?.transaction_id|| "NOT GIVEN"}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Payment Mode</p>
                    <span>{paymentDetails?.is_payment_gateway ? "Online":"Manual"}</span>
                  </div>
                </div>
              </div>
            </div>
            {paymentDetails?.status == "Pending" && (
              <div className="flex justify-end mt-5">
                <button
                  onClick={handleReject}
                  className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
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
  );
};

export default PaymentInfo;
