import React from "react";
import "../../components/sidebars/Sidebar.css";

const RightSidebar = ({ children }: { children: React.ReactNode }) => (
  <aside id="right-sidebar" className="sidebar">
    {children}
  </aside>
);

export default RightSidebar;
