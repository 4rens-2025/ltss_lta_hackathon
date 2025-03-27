import { useState } from "react";
import "./App.css";
import MapComponent from "./components/MapComponent";
import Sidebar from "./components/Sidebar";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                // Make it full viewport height for example
                height: "100vh",
                // Let children (sidebar) stretch to full height
                alignItems: "stretch",
            }}
        >
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={toggleSidebar}
                children={undefined}
            />

            <div style={{ flex: 1, position: "relative" }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        zIndex: 1000,
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                    }}
                >
                    {isSidebarOpen ? "Hide Summary" : "Show Summary"}
                </button>

                <MapComponent />
            </div>
        </div>
    );
}

export default App;
