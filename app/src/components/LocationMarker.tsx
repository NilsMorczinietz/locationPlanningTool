import MarkerIcon from "/locationMarker.svg"; // Stelle sicher, dass der Import korrekt ist

export default function LocationMarker({ text = "" }: { text: string }) {
    return (
        <div
            style={{
                position: "relative",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <img src={MarkerIcon} alt="Location Marker" width="40" height="40" />

            <span
                style={{
                    position: "absolute",
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "black",
                }}
            >
                {text}
            </span>
        </div>
    );
}