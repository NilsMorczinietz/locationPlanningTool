import { Button } from '@mantine/core';

import { FiDownload } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";

import fw_dus_logo from '/fw_dus_logo.png';

export default function Header() {

    function download() {
        //TODO: Implement download
    }

    function upload() {
        //TODO: Implement upload
    }

    return (
        <header style={{ display: "flex", alignItems: "center", padding: "5px", width: "100%", gap: "10px"}}>
            <img
                src={fw_dus_logo}
                alt="Logo"
                width="auto"
                height="90%"
            />

            <div style={{ display: "flex", flex: "1" }}></div>

            <Button
                color="rgb(255, 255, 255)"
                variant="outline"
                rightSection={<FiUpload size={16} />}
                onClick={download}
            >
                Upload
            </Button>

            <Button
                color="rgb(255, 255, 255)"
                variant="outline"
                rightSection={<FiDownload size={16} />}
                onClick={download}
            >
                Download
            </Button>
        </header>
    );
}