import React from "react";

const SessionExpiredModal = ({ isVisible, onOk }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center shadow-md rounded-md text-sky-800 z-[999]">
      <div className="relative bg-gray-200 pt-10 px-8 rounded shadow-lg w-[400px]">
        <h2 className="text-md mb-3 text-center">
          Sesión expirada. Por favor, inicia sesión nuevamente.
        </h2>
        <div className="flex justify-between">
          <button
            onClick={onOk}
            className="text-sm p-3 m-2 rounded-full hover:bg-slate-300"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
