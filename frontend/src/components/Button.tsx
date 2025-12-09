import React from "react";

export default function Button({ children, ...props }: any) {
  return (
    <button
      {...props}
      className="bg-blue-600 text-white p-2 rounded w-full mt-2"
    >
      {children}
    </button>
  );
}
