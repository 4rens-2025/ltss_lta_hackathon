// src/types/backend.ts

// === Road Works ===
export interface RoadWorkEvent {
    event_id: string;
    road_name: string;
    start_date: string;
    end_date: string;
    svc_dept: string;
    other: string;
}

export interface ApprovedRoadWorks {
    odata_metadata: string;
    value: RoadWorkEvent[];
}

// === Traffic Images ===
export interface TrafficImage {
    camera_id: string;
    latitude: number;
    longitude: number;
    image_link: string;
}

export interface TrafficImages {
    odata_metadata: string;
    value: TrafficImage[];
}

// === Traffic Incidents ===
export interface TrafficIncident {
    type: string;
    latitude: number;
    longitude: number;
    message: string;
}

export interface TrafficIncidents {
    odata_metadata: string;
    value: TrafficIncident[];
}

// === Traffic Speed Bands ===
export interface TrafficSpeedBand {
    link_id: string;
    road_name: string;
    road_category: string;
    speed_band: number;
    min_speed: string; // you can convert to number if needed
    max_speed: string;
    start_longitude: number;
    start_latitude: number;
    end_longitude: number;
    end_latitude: number;
}

export interface TrafficSpeedBands {
    odata_metadata: string;
    last_updated_time: string;
    value: TrafficSpeedBand[];
}

// === Combined WebSocket Payload ===
export interface BackendData {
    approved_road_works?: ApprovedRoadWorks;
    traffic_images?: TrafficImages;
    traffic_incidents?: TrafficIncidents;
    traffic_speed_bands?: TrafficSpeedBands;
}
