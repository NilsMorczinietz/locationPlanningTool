import {
    ActionIcon,
    MantineProvider,
    defaultVariantColorsResolver,
    VariantColorsResolver,
} from '@mantine/core';


import { IoMdCompass } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { HiMinusSmall } from "react-icons/hi2";

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
                <ActionIcon.Group orientation="vertical" style={{ border: "2px solid rgb(231, 231, 231)", borderRadius: "5px" }}>
                    <ActionIcon
                        variant="control"
                        radius="xs"
                        size="lg"
                        aria-label="zoomIn"
                        style={{ boxShadow: "0 0 0 0.5px rgb(231, 231, 231)" }}
                    >
                        <GoPlus size={28} color="white" />
                    </ActionIcon>

                    <ActionIcon
                        variant="control"
                        radius="xs"
                        size="lg"
                        aria-label="zoomOut"
                        style={{ boxShadow: "0 0 0 0.5px rgb(231, 231, 231)" }}
                    >
                        <HiMinusSmall size={30} color="white" />
                    </ActionIcon>

                    <ActionIcon
                        variant="control"
                        radius="xs"
                        size="lg"
                        aria-label="compass"
                        style={{ boxShadow: "0 0 0 0.5px rgb(231, 231, 231)" }}
                    >
                        <IoMdCompass size={25} color="white" />
                    </ActionIcon>
                </ActionIcon.Group>
            </MantineProvider>
        </div>
    );
}
