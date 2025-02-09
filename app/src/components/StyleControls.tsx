import {
    ActionIcon,
    MantineProvider,
    defaultVariantColorsResolver,
    VariantColorsResolver,
} from '@mantine/core';

import { MdLayers } from "react-icons/md";

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

export default function StyleControls() {
    return (
        <div style={{ position: "absolute", top: "50px", right: "0", margin: "30px" }}>
            <MantineProvider theme={{ variantColorResolver }}>
                <ActionIcon
                    size="lg"
                    variant="control"
                    radius="xs"
                    aria-label="MapStyle"
                    style={{ border: "2px solid rgb(231, 231, 231)", borderRadius: "3px", boxShadow: "0px 0px 10px 1px rgb(134, 134, 134)" }}
                >
                    <MdLayers color='white' size={25} />
                </ActionIcon>
            </MantineProvider>
        </div>
    )
}
