import React, { useState } from "react";

const PaymentHistory = () => {
  const [filter, setFilter] = useState("");
  const [payments] = useState([
    { course: "Course#123232", invoice: "#FA613145", date: "01/10/21", amount: "$39.99", status: "Pending" },
    { course: "Course#147382", invoice: "#LC014357", date: "12/12/21", amount: "$19.99", status: "Successful" },
    { course: "Course#965473", invoice: "#FC657916", date: "23/08/21", amount: "$35.99", status: "Failed" },
  ]);

  const filteredPayments = payments.filter((payment) =>
    payment.course.toLowerCase().includes(filter.toLowerCase()) ||
    payment.invoice.toLowerCase().includes(filter.toLowerCase())
  );

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Determine the status color based on the payment status
  const getStatusClass = (status) => {
    switch (status) {
      case "Failed":
        return "text-red-500";
      case "Pending":
        return "text-yellow-500";
      case "Successful":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-[90%] max-w-[1490px] mx-auto mb-6">
      <h2 className="text-lg font-semibold text-center">Payment History</h2>

      {/* Search Input */}
      <div className="flex justify-center my-3">
        <input
          type="text"
          placeholder="Search by course or invoice..."
          value={filter}
          onChange={handleFilterChange}
          className="border p-2 rounded w-full max-w-[400px]"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-center text-sm">
              <th className="p-3">Course</th>
              <th className="p-3">Invoice No.</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, index) => (
              <tr key={index} className="border-t text-center">
                <td className="p-3">{payment.course}</td>
                <td className="p-3">{payment.invoice}</td>
                <td className="p-3">{payment.date}</td>
                <td className="p-3">{payment.amount}</td>
                <td className={`p-3 font-semibold ${getStatusClass(payment.status)}`}>
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
