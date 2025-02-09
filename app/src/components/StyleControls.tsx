import {
    ActionIcon,
    MantineProvider,
    defaultVariantColorsResolver,
    VariantColorsResolver,
} from '@mantine/core';
import { useState } from 'react';

import { MdLayers } from "react-icons/md";

export default function StyleControls() {

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

    return (
        <div style={{ position: "absolute", top: "50px", right: "0", margin: "30px" }}>
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
        </div>
    )
}
