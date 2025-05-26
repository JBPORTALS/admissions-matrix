import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: "blue",
      _dark: {
        colorPalette: "blue",
      },
    },
  },
});
