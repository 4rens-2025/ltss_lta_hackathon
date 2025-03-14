import "./App.css";
import MapComponent from "./components/MapComponent";

function App() {
    return (
        <div
            style={{
                width: "100%",
                height: "800px",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <MapComponent />
        </div>
    );
}

export default App;
