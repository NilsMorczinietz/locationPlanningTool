import { useEffect, useState } from 'react';

import { Button, FileButton, Text } from '@mantine/core';

import { FiDownload } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { setLocations } from "../redux/slices/mapSlice";

import fw_dus_logo from '/fw_dus_logo.png';
import AlarmTimeSelect from './AlarmTimeSelect';
import DeleteModal from './modals/DeleteModal';

export default function Header() {
    const dispatch = useDispatch();
    const locations = useSelector((state: RootState) => state.map.locations);

    const [file, setFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    function download() {
        setDownloadLoading(true);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(locations));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "locations.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        setDownloadLoading(false);
    }

    function upload() {
        if (!file) return;
        setUploadLoading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                dispatch(setLocations(json));
            } catch (error) {
                console.error("Error parsing JSON file", error);
            }
            setUploadLoading(false);
        };
        reader.readAsText(file);
        setFile(null);
    }

    useEffect(() => {
        if (file) {
            upload();
        }
    }, [file]);


    return (
        <>
            <header style={{ display: "flex", alignItems: "center", padding: "5px", width: "100%", gap: "10px" }}>
                <div style={{ display: "flex", height: "100%", alignItems: "center", width: "25%" }}>
                    <img
                        src={fw_dus_logo}
                        alt="Logo"
                        width="auto"
                        height="90%"
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0px" }}>
                    <Text
                        c="white"
                        size="md"
                    >
                        Einsatzzeit:
                    </Text>
                    <AlarmTimeSelect />
                </div>

                <div style={{ display: "flex", flex: "1" }}></div>

                <DeleteModal/>

                <FileButton
                    key={file ? file.name : "file-upload"}
                    onChange={setFile}
                    accept=".json"
                >
                    {(props) =>
                        <Button
                            {...props}
                            color="rgb(255, 255, 255)"
                            variant="outline"
                            rightSection={<FiUpload size={16} />}
                            loading={uploadLoading}
                        >
                            Upload
                        </Button>
                    }
                </FileButton>

                <Button
                    color="rgb(255, 255, 255)"
                    variant="outline"
                    rightSection={<FiDownload size={16} />}
                    onClick={download}
                    loading={downloadLoading}
                >
                    Download
                </Button>
            </header>
        </>
    );
}