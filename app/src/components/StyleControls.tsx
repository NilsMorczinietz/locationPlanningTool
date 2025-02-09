import { useState } from 'react';
import mapboxgl from "mapbox-gl";

import {
    ActionIcon,
    MantineProvider,
    defaultVariantColorsResolver,
    VariantColorsResolver,
} from '@mantine/core';

import { MdLayers } from "react-icons/md";
import { addBordersLayer } from '../utils/mapUtils';

export default function StyleControls({ map }: any) {

    const [open, setOpen] = useState(false);

    const variantColorResolver: VariantColorsResolver = (input) => {
        const defaultResolvedColors = defaultVariantColorsResolver(input);

        if (input.variant === 'control') {
            return {
                background: open ? 'rgb(209, 42, 42)' : 'rgb(8, 8, 8)',
                hover: open ? 'rgb(201, 34, 34)' : 'rgb(0, 0, 0)',
                color: 'none',
                border: 'none',
            };
        }

        return defaultResolvedColors;
    };

    function changeStyle(style: string) {
        if (!map.current) return;
        map.current.setStyle(style);
        setOpen(false);
        map.current.once("styledata", () => {
            addBordersLayer(map.current);
        });
    }

    return (
        <div style={{ display: "flex", position: "absolute", top: "50px", right: "0", margin: "30px", flexDirection: "row-reverse" }}>
            <MantineProvider theme={{ variantColorResolver }}>
                <ActionIcon
                    size="lg"
                    variant="control"
                    radius="xs"
                    aria-label="MapStyle"
                    style={{ border: "2px solid rgb(231, 231, 231)", borderRadius: "3px", boxShadow: "0px 0px 10px 1px rgb(134, 134, 134)" }}
                    onClick={() => setOpen(!open)}
                >
                    <MdLayers color='white' size={25} />
                </ActionIcon>
            </MantineProvider>

            <div style={{ display: open ? "block" : "none", width: "150px", height: "200px", marginRight: "10px", backgroundColor: "rgb(255, 255, 255)", borderRadius: "1px", boxShadow: "0px 0px 10px 1px rgb(227, 227, 227)" }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "10px" }}>
                    <button onClick={() => changeStyle("mapbox://styles/mapbox/light-v10")} style={{ backgroundColor: "rgb(255, 255, 255)", border: "none", padding: "5px", margin: "5px", borderRadius: "3px", cursor: "pointer" }}>Light</button>
                    <button onClick={() => changeStyle("mapbox://styles/mapbox/dark-v10")} style={{ backgroundColor: "rgb(255, 255, 255)", border: "none", padding: "5px", margin: "5px", borderRadius: "3px", cursor: "pointer" }}>Dark</button>
                    <button onClick={() => changeStyle("mapbox://styles/mapbox/satellite-v9")} style={{ backgroundColor: "rgb(255, 255, 255)", border: "none", padding: "5px", margin: "5px", borderRadius: "3px", cursor: "pointer" }}>Satellite</button>
                    <button onClick={() => changeStyle("mapbox://styles/mapbox/streets-v11")} style={{ backgroundColor: "rgb(255, 255, 255)", border: "none", padding: "5px", margin: "5px", borderRadius: "3px", cursor: "pointer" }}>Streets</button>
                </div>
            </div>
        </div>
    )
}
