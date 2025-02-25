export default function LocationMarker({ text = "", strokeColor = "black"}: { text: string, strokeColor: string }) {
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
            <svg
                width="35"
                height="35"
                viewBox="0 0 65 71"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M62.5 32.5C62.5 36.2592 60.7809 40.3742 57.866 44.5874C54.9737 48.7678 51.0684 52.8086 47.0847 56.3663C43.1122 59.9142 39.1286 62.9228 36.1322 65.0472C34.6362 66.1078 33.3917 66.9443 32.5246 67.5134C32.5164 67.5188 32.5082 67.5242 32.5 67.5296C32.4918 67.5242 32.4836 67.5188 32.4754 67.5134C31.6084 66.9443 30.3638 66.1078 28.8678 65.0472C25.8714 62.9228 21.8878 59.9142 17.9153 56.3663C13.9316 52.8086 10.0263 48.7678 7.13403 44.5874C4.21908 40.3742 2.5 36.2592 2.5 32.5C2.5 15.9315 15.9315 2.5 32.5 2.5C49.0685 2.5 62.5 15.9315 62.5 32.5Z"
                    fill="white"
                    stroke={strokeColor}
                    strokeWidth="5"
                />
            </svg>

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