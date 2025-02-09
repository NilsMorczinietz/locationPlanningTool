import React from 'react'
import {
    ActionIcon,
    MantineProvider,
    defaultVariantColorsResolver,
    VariantColorsResolver,
} from '@mantine/core';

import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { IoMdCompass } from "react-icons/io";

const variantColorResolver: VariantColorsResolver = (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input);

    if (input.variant === 'control') {
        return {
            background: 'rgb(8, 8, 8)',
            hover: 'rgb(0, 0, 0)',
            color: 'none',
            border: 'none',
        };
    }

    return defaultResolvedColors;
};

export default function MapControls() {
    return (
        <div style={{ position: "absolute", bottom: "10px", right: "0", margin: "30px" }}>
            <MantineProvider theme={{ variantColorResolver }}>
                <ActionIcon.Group orientation="vertical">
                    <ActionIcon
                        variant="control"
                        radius="xs"
                        size="lg"
                        aria-label="zoomIn"
                        style={{ border: "1px solid white" }}
                    >
                        <FiPlus size={20} color="white" />
                    </ActionIcon>

                    <ActionIcon
                        variant="control"
                        radius="xs"
                        size="lg"
                        aria-label="zoomOut"
                        style={{ border: "1px solid white" }}
                    >
                        <FiMinus size={20} color="white" />
                    </ActionIcon>

                    <ActionIcon
                        variant="control"
                        radius="xs"
                        size="lg"
                        aria-label="compass"
                        style={{ border: "1px solid white" }}
                    >
                        <IoMdCompass size={20} color="white" />
                    </ActionIcon>
                </ActionIcon.Group>
            </MantineProvider>
        </div>
    );
}
