import React from "react";

export default function Input(props: any) {
  return (
    <input
      {...props}
      className="border p-2 rounded w-full mb-3"
    />
  );
}
