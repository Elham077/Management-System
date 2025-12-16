import React from "react";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

const ExpenseCard = ({
  title,
  amount,
  category,
  status,
  expenseDate,
  createdBy,
  attachmentCount = 0,
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "Pending":
        return "text-yellow-800 bg-yellow-100 border border-yellow-500/20";
      case "Approved":
        return "text-green-800 bg-green-100 border border-green-500/20";
      case "Rejected":
        return "text-red-800 bg-red-100 border border-red-500/20";
      default:
        return "text-gray-700 bg-gray-100 border border-gray-300/20";
    }
  };

  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {/* وضعیت */}
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {status}
        </div>
      </div>

      {/* محتوا */}
      <div className="px-4 border-l-[3px] border-blue-500 mt-3">
        <p className="text-sm font-medium text-gray-800 line-clamp-2">
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          Category: {category || "-"}
        </p>
        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
          Amount:{" "}
          <span className="font-semibold text-gray-700">
            ${Number(amount || 0).toLocaleString()}
          </span>
        </p>
        <p className="text-[13px] text-gray-700/80 font-medium mb-2 leading-[18px]">
          Created by:{" "}
          <span className="font-semibold text-gray-700">
            {createdBy?.name || createdBy || "-"}
          </span>
        </p>
        <p className="text-[13px] text-gray-500 font-medium leading-[18px]">
          Date:{" "}
          <span className="font-semibold text-gray-700">
            {moment(expenseDate).format("Do MMM YYYY")}
          </span>
        </p>
      </div>

      {/* پیوست‌ها */}
      <div className="flex items-center justify-end mt-3 px-4">
        {attachmentCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
            <LuPaperclip className="text-blue-500" />
            <span className="text-xs text-gray-900">{attachmentCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;
