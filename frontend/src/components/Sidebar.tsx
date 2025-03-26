import React from "react";
import "../styles/sidebar.css";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
    const sidebarClass = isOpen ? "sidebar open" : "sidebar closed";

    return (
        <div className={sidebarClass}>
            <button onClick={onClose} style={{ margin: "0.5rem" }}>
                Close
            </button>
            <div className="sidebar-content">{children}</div>
        </div>
    );
};

export default Sidebar;
