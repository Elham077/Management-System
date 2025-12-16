import React from "react";

const ProjectStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="my-2 overflow-x-auto">
      <div className="flex min-w-max" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={isActive}
              className={`relative px-3 md:px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.label)}
            >
              <div className="flex items-center">
                <span className="text-xs">{tab.label}</span>
                <span
                  className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200/70 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectStatusTabs;
