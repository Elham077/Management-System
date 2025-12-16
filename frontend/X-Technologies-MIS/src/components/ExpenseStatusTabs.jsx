import React from "react";
import "./ExpenseStatusTabs.css";

const ExpenseStatusTabs = ({ tabs = [], activeTab, setActiveTab }) => {
  if (!tabs.length) return null;

  return (
    <div className="tabs-wrapper">
      <div className="tabs-container" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={isActive}
              className={`tab-button ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.label)}
            >
              <div className="tab-content">
                <span className="tab-label">{tab.label}</span>
                <span className={`tab-count ${isActive ? "active" : ""}`}>
                  {tab.count}
                </span>
              </div>
              {isActive && <div className="tab-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseStatusTabs;
