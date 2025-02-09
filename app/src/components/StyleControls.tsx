import { useState } from 'react';

import light from '/light.png';
import streets from '/streets.png';
import satellite from '/satellite.png';

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
    const [style, setStyle] = useState("mapbox://styles/mapbox/light-v10");

    const variantColorResolver: VariantColorsResolver = (input) => {
        const defaultResolvedColors = defaultVariantColorsResolver(input);

        if (input.variant === 'control') {
            return {
                background: open ? 'rgb(255, 8, 8)' : 'rgb(8, 8, 8)',
                hover: open ? 'rgb(240, 0, 0)' : 'rgb(0, 0, 0)',
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
        setStyle(style);
    }

    return (
        <div style={{ display: "flex", position: "absolute", top: "50px", right: "0", margin: "30px", flexDirection: "row-reverse" }}>
            <MantineProvider theme={{ variantColorResolver }}>
                <ActionIcon
                    size="lg"
                    variant="control"
                    radius="xs"
                    aria-label="MapStyle"
                    style={{ border: "2px solid rgb(231, 231, 231)", borderRadius: "3px", boxShadow: "0px 0px 7px 0px rgb(134, 134, 134)" }}
                    onClick={() => setOpen(!open)}
                >
                    <MdLayers color='white' size={25} />
                </ActionIcon>
            </MantineProvider>

            {open && (
                <div style={{
                    display: "flex",
                    gap: "13px",
                    padding: "10px",
                    backgroundColor: "white",
                    borderRadius: "2px",
                    marginRight: "10px",
                    boxShadow: "0px 0px 10px 0px rgb(134, 134, 134)"
                }}>
                    <img 
                        src={light} 
                        alt="Light Style" 
                        onClick={() => changeStyle("mapbox://styles/mapbox/light-v10")}
                        style={{ 
                            width: "45px", 
                            height: "45px", 
                            cursor: "pointer", 
                            borderRadius: "5px", 
                            border: style == "mapbox://styles/mapbox/light-v10" ? "2px solid red" : "2px solid transparent",
                            objectFit: "cover" 
                        }}
                        onMouseOver={(e) => e.currentTarget.style.border = "2px solid red"}
                        onMouseOut={(e) => e.currentTarget.style.border = "2px solid transparent"}
                    />

                    <img 
                        src={streets} 
                        alt="Streets Style" 
                        onClick={() => changeStyle("mapbox://styles/mapbox/streets-v11")}
                        style={{ 
                            width: "45px", 
                            height: "45px", 
                            cursor: "pointer", 
                            borderRadius: "5px", 
                            border: style == "mapbox://styles/mapbox/streets-v11" ? "2px solid red" : "2px solid transparent",
                            objectFit: "cover" 
                        }}
                        onMouseOver={(e) => e.currentTarget.style.border = "2px solid red"}
                        onMouseOut={(e) => e.currentTarget.style.border = "2px solid transparent"}
                    />

                    <img 
                        src={satellite} 
                        alt="Satellite Style" 
                        onClick={() => changeStyle("mapbox://styles/mapbox/satellite-v9")}
                        style={{ 
                            width: "45px", 
                            height: "45px", 
                            cursor: "pointer", 
                            borderRadius: "5px", 
                            border: style == "mapbox://styles/mapbox/satellite-v9" ? "2px solid red" : "2px solid transparent",
                            objectFit: "cover"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.border = "2px solid red"}
                        onMouseOut={(e) => e.currentTarget.style.border = "2px solid transparent"}
                    />
                </div>
            )}
        </div>
    )
}
