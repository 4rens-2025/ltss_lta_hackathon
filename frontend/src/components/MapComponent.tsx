// src/components/MapComponent.tsx
import React, { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent = () => {
    const [viewState, setViewState] = useState({
        latitude: 1.3521, // Singapore latitude
        longitude: 103.8198, // Singapore longitude
        zoom: 12,
        width: "100%",
        height: "100%",
    });

    return (
        <Map
            {...viewState}
            onMove={(evt) =>
                setViewState((prevState) => ({
                    ...evt.viewState,
                    width: prevState.width,
                    height: prevState.height,
                }))
            }
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            {/* Example Marker at Singapore's center */}
            <Marker latitude={1.3521} longitude={103.8198}>
                <div
                    style={{
                        backgroundColor: "red",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                    }}
                />
            </Marker>
        </Map>
    );
};

export default MapComponent;
