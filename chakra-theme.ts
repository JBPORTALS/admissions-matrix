import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
      radii: {
        "*": {
          value: "12px",
        },
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: "blue",
    },
    input: {
      _invalid: { bg: "bg.error" },
    },
  },
});
