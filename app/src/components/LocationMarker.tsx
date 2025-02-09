import MarkerIcon from "/locationMarker.svg"; // Stelle sicher, dass der Import korrekt ist

export default function LocationMarker({ text = "" }: { text: string }) {
    return (
        <div
            style={{
                position: "relative",
                width: "35px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <img src={MarkerIcon} alt="Location Marker" width="35" height="35" />

            <span
                style={{
                    position: "absolute",
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "black",
                }}
            >
                {text}
            </span>
        </div>
    );
}