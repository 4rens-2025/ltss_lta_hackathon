// TypewriterMarkdown.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TypewriterMarkdownProps {
    text: string; // the final text to display
    speed?: number; // ms between each character
}

const TypewriterMarkdown: React.FC<TypewriterMarkdownProps> = ({
    text,
    speed = 50,
}) => {
    const [typed, setTyped] = useState("");

    useEffect(() => {
        setTyped("");
        let index = 0;

        const interval = setInterval(() => {
            setTyped((prev) => prev + text[index]);
            index++;
            if (index >= text.length) {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {typed}
            {/* typed is a string, so ReactMarkdown is happy */}
        </ReactMarkdown>
    );
};

export default TypewriterMarkdown;
