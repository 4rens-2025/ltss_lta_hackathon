let socket: WebSocket | null = null;

/**
 * Connect to the WebSocket server.
 * @param url - The WebSocket server URL.
 * @param onMessage - Callback to handle incoming messages.
 */
export const connectWebSocket = (
    url: string,
    onMessage: (data: any) => void
) => {
    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message received from server:", data);
        onMessage(data);
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
};

/**
 * Disconnect from the WebSocket server.
 */
export const disconnectWebSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};

/**
 * Send a message to the WebSocket server.
 * @param message - The message to send.
 */
export const sendWebSocketMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error("WebSocket is not connected");
    }
};
