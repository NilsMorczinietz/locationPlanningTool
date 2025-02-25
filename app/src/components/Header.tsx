import { useEffect, useState } from 'react';

import { Button, FileButton, Text } from '@mantine/core';
import { TextInput } from '@mantine/core';

import { FiDownload } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { setLocations } from "../redux/slices/mapSlice";

import fw_dus_logo from '/fw_dus_logo.png';
import AlarmTimeSelect from './AlarmTimeSelect';
import DeleteModal from './modals/DeleteModal';
import { IsochroneState } from '../screens/Planning';

import classes from './header.module.css';

export default function Header({ setIsochroneRefresh, isochroneRefresh }: { setIsochroneRefresh: (value: IsochroneState) => void, isochroneRefresh: IsochroneState }) {
    const dispatch = useDispatch();
    const locations = useSelector((state: RootState) => state.map.locations);
    const isochronesValid = useSelector((state: RootState) => state.map.isochronesValid);

    const [file, setFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const [scenarioTitle, setScenarioTitle] = useState("Szenario 1");

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
                <div style={{ display: "flex", height: "100%", alignItems: "center", marginRight: "30px" }}>
                    <img
                        src={fw_dus_logo}
                        alt="Logo"
                        width="auto"
                        height="90%"
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height:"100%"}}>
                    <Text
                        c="white"
                        size="md"
                        fw={500}
                    >
                        Szenario:
                    </Text>
                    <TextInput
                        // error={error.title}
                        radius="xs"
                        placeholder='Szenario'
                        variant="unstyled"
                        value={scenarioTitle}
                        onChange={(e) => setScenarioTitle(e.target.value)}
                        style={{ width: (scenarioTitle.length * 8 + 10) + "px" }}
                        classNames={{ input: classes.input, root: classes.root }}
                    />
                    <div />
                </div>

                <div style={{ display: "flex", height: "70%", width: "1px", backgroundColor: "white", marginLeft: "5px", marginRight: "5px" }}></div>

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0px" }}>
                    <Text
                        c="white"
                        size="md"
                        fw={500}
                    >
                        Einsatzzeit:
                    </Text>
                    <AlarmTimeSelect />
                </div>

                <div style={{ display: "flex", flex: "1" }}></div>

                <Button
                    color="rgb(15, 15, 15)"
                    variant="filled"
                    rightSection={<FiRefreshCw size={16} />}
                    onClick={() => setIsochroneRefresh("loading")}
                    disabled={locations.length <= 0 || isochronesValid}
                    loading={isochroneRefresh == "loading"}
                >
                    {isochroneRefresh == "initial" ? <>Berechnen</> : <>Aktualisieren</>}
                </Button>

                <DeleteModal />

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