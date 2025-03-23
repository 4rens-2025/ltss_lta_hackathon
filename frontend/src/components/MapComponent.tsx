import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import singaporeBoundary from "../data/singapore_boundary.json";
import { BackendData } from "../types/backend";
import {
    highlightRoadWorks,
    removeRoadWorkLayer,
    setRoadworkVisibility,
} from "../services/map/roadLayerService";
import {
    addTrafficCameras,
    setCameraVisibility,
} from "../services/map/addCamera";
import {
    addIncidentMarkers,
    setIncidentTypeVisibility,
    INCIDENT_TYPES,
} from "../services/map/addIncidents";
import {
    connectWebSocket,
    disconnectWebSocket,
} from "../services/websocket/socketClient";

const MapComponent = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const prevSelectedRef = useRef(null);
    const [roadworkVisible, setRoadworkVisible] = useState(false);

    useEffect(() => {
        // Set your Mapbox access token
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        const bounds = [
            [103.5, 1.18], // Southwest coordinates (lower-left)
            [104.091, 1.485], // Northeast coordinates (upper-right)
        ];

        // Initialize the map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [103.8198, 1.3521], // Center over Singapore
            zoom: 11,
            style: "mapbox://styles/mapbox/navigation-night-v1",
            maxBounds: bounds,
        });
        mapRef.current = map;

        map.on("load", () => {
            // Add the Singapore boundary as a GeoJSON source
            map.addSource("singapore", {
                type: "geojson",
                data: singaporeBoundary,
                generateId: true,
            });

            // Add an invisible fill layer (to capture click events)
            map.addLayer({
                id: "singapore-fill",
                type: "fill",
                source: "singapore",
                paint: {
                    "fill-color": "#000000",
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "selected"], false],
                        0.4,
                        ["boolean", ["feature-state", "highlight"], false],
                        0.2,
                        0.1,
                    ],
                },
            });

            // Add a visible line layer to outline the boundary
            map.addLayer({
                id: "singapore-line",
                type: "line",
                source: "singapore",
                paint: {
                    "line-color": "#000000",
                    "line-width": 1,
                },
            });

            // When clicking on the fill layer, update feature state for the clicked feature
            map.on("click", "singapore-fill", (e) => {
                if (!e.features || e.features.length === 0) return;
                const feature = e.features[0];
                // Clear previous selection if different
                if (prevSelectedRef.current) {
                    map.setFeatureState(prevSelectedRef.current, {
                        selected: false,
                    });
                }
                map.setFeatureState(feature, { selected: true });
                prevSelectedRef.current = feature;
                setSelectedFeature(feature);
            });

            // Clicking outside deselects the feature
            map.on("click", (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["singapore-fill"],
                });
                if (!features.length && prevSelectedRef.current) {
                    map.setFeatureState(prevSelectedRef.current, {
                        selected: false,
                    });
                    prevSelectedRef.current = null;
                    setSelectedFeature(null);
                }
            });

            // Hovering over a feature will highlight it
            map.addInteraction("mouseenter", {
                type: "mouseenter",
                target: { layerId: "singapore-fill" },
                handler: ({ feature }) => {
                    map.setFeatureState(feature, { highlight: true });
                    map.getCanvas().style.cursor = "pointer";
                },
            });

            // Moving the mouse away from a feature will remove the highlight
            map.addInteraction("mouseleave", {
                type: "mouseleave",
                target: { layerId: "singapore-fill" },
                handler: ({ feature }) => {
                    map.setFeatureState(feature, { highlight: false });
                    map.getCanvas().style.cursor = "";
                    return false;
                },
            });
        });

        // Connect to the WebSocket server
        const websocketUrl = "ws://localhost:8000/ws/dashboard";

        connectWebSocket(websocketUrl, (rawData) => {
            if (!mapRef.current) return;
            const map = mapRef.current;

            try {
                const data: BackendData =
                    typeof rawData === "string" ? JSON.parse(rawData) : rawData;

                // ✅ Highlight roads with road work
                if (data.approved_road_works) {
                    highlightRoadWorks(map, data.approved_road_works.value);
                }

                // ✅ Display camera markers
                if (data.traffic_images) {
                    addTrafficCameras(map, data.traffic_images.value);
                }

                // ✅ Display incident markers
                if (data.traffic_incidents) {
                    addIncidentMarkers(map, data.traffic_incidents.value);
                }
            } catch (error) {
                console.error("Invalid WebSocket data:", error);
            }
        });

        // Cleanup on unmount
        return () => {
            disconnectWebSocket();
            map.remove();
        };
    }, []);

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            <div
                ref={mapContainerRef}
                style={{ width: "100%", height: "100%" }}
            />

            {/* ✅ Top-left control panel with multiple toggles */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "white",
                    padding: "10px",
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                {/* ✅ Camera toggle */}
                <label
                    style={{
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center", // Align checkbox and text vertically
                        gap: "6px", // Add spacing between checkbox and text
                    }}
                >
                    <input
                        type="checkbox"
                        defaultChecked={false}
                        onChange={(e) => setCameraVisibility(e.target.checked)}
                    />
                    Show Cameras
                </label>

                {/* ✅ Per-incident-type toggles */}
                {INCIDENT_TYPES.map((type) => (
                    <label
                        key={type}
                        style={{
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center", // Align checkbox and text vertically
                            gap: "6px", // Add spacing between checkbox and text
                        }}
                    >
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            onChange={(e) => {
                                setIncidentTypeVisibility(
                                    type,
                                    e.target.checked
                                );
                            }}
                        />
                        {type}
                    </label>
                ))}
                <label
                    style={{
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center", // Align checkbox and text vertically
                        gap: "6px", // Add spacing between checkbox and text
                    }}
                >
                    <input
                        type="checkbox"
                        checked={roadworkVisible}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setRoadworkVisible(checked); // your React state
                            setRoadworkVisibility(mapRef.current, checked);
                        }}
                    />
                    Show Approved Roadworks
                </label>
            </div>

            {/* Existing feature detail popup */}
            {selectedFeature && (
                <div
                    style={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        width: "230px",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "3px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        fontFamily: "sans-serif",
                        fontSize: "12px",
                        lineHeight: "20px",
                        zIndex: 9,
                    }}
                >
                    <h3>{selectedFeature.properties.Name}</h3>
                    <hr />
                    <ul style={{ padding: 0, listStyle: "none" }}>
                        {Object.entries(selectedFeature.properties).map(
                            ([key, value]) => (
                                <li key={key}>
                                    <strong>{key}</strong>: {value.toString()}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MapComponent;
