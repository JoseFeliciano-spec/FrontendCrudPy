import React from "react";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-dvh">
      {children}
      <div className="rounded-l-2xl hidden md:block bg-black"></div>
    </div>
  );
}
