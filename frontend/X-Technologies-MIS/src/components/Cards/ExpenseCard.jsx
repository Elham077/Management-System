import React from "react";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";
import "./ExpenseCard.css";

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
  const getStatusTagClass = () => {
    switch (status) {
      case "Pending":
        return "status-tag pending";
      case "Approved":
        return "status-tag approved";
      case "Rejected":
        return "status-tag rejected";
      default:
        return "status-tag default";
    }
  };

  return (
    <div className="expense-card" onClick={onClick}>
      {/* وضعیت */}
      <div className="flex items-end gap-3 px-4">
        <div className={getStatusTagClass()}>{status}</div>
      </div>

      {/* محتوا */}
      <div className="content-section">
        <p className="title">{title}</p>
        <p className="category">Category: {category || "-"}</p>
        <p className="amount">
          Amount: <strong>${Number(amount || 0).toLocaleString()}</strong>
        </p>
        <p className="created-by">
          Created by: <strong>{createdBy?.name || createdBy || "-"}</strong>
        </p>
        <p className="date">
          Date: <strong>{moment(expenseDate).format("Do MMM YYYY")}</strong>
        </p>
      </div>

      {/* پیوست‌ها */}
      <div className="attachments">
        {attachmentCount > 0 && (
          <div className="attachment-box">
            <LuPaperclip className="attachment-icon" />
            <span className="attachment-count">{attachmentCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;
