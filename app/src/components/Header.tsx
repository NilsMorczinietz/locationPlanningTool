import { useEffect, useState } from 'react';

import { Button, ComboboxItem, FileButton, Select, Text } from '@mantine/core';

import { FiDownload } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import { RiResetLeftFill } from "react-icons/ri";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { LocationsState } from "../redux/reducers/locationsReducer";
import { setLocations } from "../redux/actions/locationsActions";

import classes from './Header.module.css';

import fw_dus_logo from '/fw_dus_logo.png';

export default function Header() {
    const dispatch = useDispatch();
    const locations = useSelector((state: RootState) => state.planning as LocationsState).locations;

    const [file, setFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const [timeLimit, setTimeLimit] = useState<ComboboxItem | null>(null);

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

    function resetLocations() {
        dispatch(setLocations([]));
    }

    return (
        <header style={{ display: "flex", alignItems: "center", padding: "5px", width: "100%", gap: "10px" }}>
            <div style={{ display: "flex", height: "100%", alignItems: "center", width: "25%"}}>
                <img
                    src={fw_dus_logo}
                    alt="Logo"
                    width="auto"
                    height="90%"
                />
            </div>


            <Text
                c="white"
                size="md"
            >
                Einsatzzeit:
            </Text>
            <Select
                classNames={{ input: classes.input, section: classes.section, option: classes.option }}
                variant="unstyled"
                placeholder=""
                data={[
                    { value: '5', label: '5 Minuten' },
                    { value: '6', label: '6 Minuten' },
                    { value: '7', label: '7 Minuten' },
                    { value: '8', label: '8 Minuten' },
                    { value: '10', label: '10 Minuten' }
                ]}
                value={timeLimit ? timeLimit.value : '8'}
                onChange={(_value, option) => setTimeLimit(option)}
                color='white'
                comboboxProps={{ shadow: 'md' }}
            />

            <div style={{ display: "flex", flex: "1" }}></div>

            <Button
                variant="light"
                color="rgb(255, 255, 255)"
                rightSection={<RiResetLeftFill size={16} />}
                style={{ marginRight: "0px" }}
                onClick={resetLocations}
            >
                Reset
            </Button>

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
    );
}