import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
      <div className="relative p-4 w-full max-w-2xl max-h-ful">
        {/* Modal Header */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center 
             text-gray-400 hover:text-gray-600 
             hover:bg-gray-100 rounded-full 
             transition-colors cursor-pointer"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
