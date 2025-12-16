import React from "react";
import "./TaskStatusTabs.css";

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="task-tabs-wrapper">
      <div className="task-tabs-container" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={isActive}
              className={`task-tab-button ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.label)}
            >
              <div className="task-tab-content">
                <span className="task-tab-label">{tab.label}</span>
                <span className={`task-tab-count ${isActive ? "active" : ""}`}>
                  {tab.count}
                </span>
              </div>
              {isActive && <div className="task-tab-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskStatusTabs;
