import React from "react";
import "./ProjectStatusTabs.css";

const ProjectStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="project-tabs-wrapper">
      <div className="project-tabs-container" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={isActive}
              className={`project-tab-button ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.label)}
            >
              <div className="project-tab-content">
                <span className="project-tab-label">{tab.label}</span>
                <span
                  className={`project-tab-count ${isActive ? "active" : ""}`}
                >
                  {tab.count}
                </span>
              </div>
              {isActive && <div className="project-tab-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectStatusTabs;