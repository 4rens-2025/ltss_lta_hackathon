import React, { useRef, useState, useEffect } from "react";
import "../styles/sidebar.css";
import CircularProgress from "@mui/material/CircularProgress";
import TypewriterMarkdown from "./TypewriterMarkdown";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
    const sidebarClass = isOpen ? "sidebar open" : "sidebar closed";

    const backendHost = import.meta.env.VITE_BACKEND_HOST || "localhost:8000";

    const [status, setStatus] = useState<
        "idle" | "pending" | "complete" | "error"
    >("idle");
    const [summaryText, setSummaryText] = useState<string>("");
    const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

    // Timer for counting seconds
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // We'll store an interval reference so we can clear it
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Cleanup intervals on unmount
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleGenerateSummary = async () => {
        try {
            setStatus("pending");
            setSummaryText("");
            setSecondsElapsed(0);

            // Start a timer that increments every second
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setSecondsElapsed((prev) => prev + 1);
            }, 1000);

            // POST to trigger the generation
            const res = await fetch(
                `http://${backendHost}/llm/trigger_summary_generation`,
                {
                    method: "POST",
                }
            );
            console.log(res);
            if (res.status != 200)
                throw new Error("Failed to trigger summary.");
            await res.json();
            startPolling();
        } catch (err) {
            console.error(err);
            setStatus("error");
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    // 2. Poll the latest summary every 3 seconds
    const startPolling = () => {
        // Clear any existing interval
        if (pollingRef.current) clearInterval(pollingRef.current);

        pollingRef.current = setInterval(async () => {
            try {
                const res = await fetch(
                    `http://${backendHost}/llm/latest_summary`
                );
                if (res.status != 200)
                    throw new Error("Error fetching latest summary.");
                const data = await res.json();

                // We assume data looks like { status: "pending" | "complete", summary: "..."}
                if (data.status === "COMPLETED") {
                    setSummaryText(data.summary);
                    setStatus("complete");
                    // Stop polling once complete
                    if (pollingRef.current) clearInterval(pollingRef.current);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                }
            } catch (error) {
                console.error(error);
                setStatus("error");
                if (pollingRef.current) clearInterval(pollingRef.current);
            }
        }, 3000);
    };

    return (
        <div className={sidebarClass}>
            <button onClick={onClose} style={{ margin: "0.5rem" }}>
                Close
            </button>
            <button
                onClick={handleGenerateSummary}
                style={{ margin: "0.5rem" }}
                disabled={status === "pending"}
            >
                Generate Summary
            </button>
            {/* Show status messages */}
            {status === "pending" && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        margin: "1rem",
                        padding: "1rem",
                    }}
                >
                    <CircularProgress size={24} />
                    <p>
                        RoadSeek is thinking, please wait... {secondsElapsed}s
                    </p>
                </div>
            )}
            {status === "error" && (
                <p>Error occurred while generating summary.</p>
            )}

            {/* Show final summary when complete */}
            {status === "complete" && (
                <div
                    style={{
                        height: "87%",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        padding: "1rem",
                    }}
                >
                    <p> RoodSeek think for {secondsElapsed}s</p>
                    <TypewriterMarkdown text={summaryText} speed={5} />
                </div>
            )}
            <div className="sidebar-content">{children}</div>
        </div>
    );
};

export default Sidebar;
