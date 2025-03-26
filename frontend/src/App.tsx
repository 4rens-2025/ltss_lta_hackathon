import { useState } from "react";
import "./App.css";
import MapComponent from "./components/MapComponent";
import Sidebar from "./components/Sidebar";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Collapsible side bar in normal flow */}
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <h2>Summary</h2>
                    <p>This is where you can put your summary text.</p>

                    <h3>Suggestions</h3>
                    <ul>
                        <li>Suggestion 1</li>
                        <li>Suggestion 2</li>
                        <li>Suggestion 3</li>
                    </ul>
                </div>
            </Sidebar>
            <div style={{ flex: 1, position: "relative" }}>
                {/* A button that obviously toggles the sidebar */}
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
