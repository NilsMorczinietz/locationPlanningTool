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

export default function ViewControls({onCenter, onZoomIn, onZoomOut}: any) {
    return (
        <div style={{ position: "absolute", bottom: "10px", right: "0", margin: "30px" }}>
            <MantineProvider theme={{ variantColorResolver }}>
                <ActionIcon.Group orientation="vertical" style={{ border: "2px solid rgb(231, 231, 231)", borderRadius: "5px", boxShadow: "0px 0px 10px 1px rgb(134, 134, 134)"}}>
                    <ActionIcon
                        variant="control"
                        radius="xs"
                        size="lg"
                        aria-label="zoomIn"
                        style={{ boxShadow: "0 0 0 0.5px rgb(231, 231, 231)" }}
                        onClick={onZoomIn}
                    >
                        <GoPlus size={28} color="white" />
                    </ActionIcon>

                    <ActionIcon
                        variant="control"
                        radius="xs"
                        size="lg"
                        aria-label="zoomOut"
                        style={{ boxShadow: "0 0 0 0.5px rgb(231, 231, 231)" }}
                        onClick={onZoomOut}
                    >
                        <HiMinusSmall size={30} color="white" />
                    </ActionIcon>

                    <ActionIcon
                        variant="control"
                        radius="xs"
                        size="lg"
                        aria-label="compass"
                        style={{ boxShadow: "0 0 0 0.5px rgb(231, 231, 231)" }}
                        onClick={onCenter}
                    >
                        <IoMdCompass size={25} color="white" />
                    </ActionIcon>
                </ActionIcon.Group>
            </MantineProvider>
        </div>
    );
}
