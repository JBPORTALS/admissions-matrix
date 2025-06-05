import {
  createSystem,
  defaultConfig,
  defineAnimationStyles,
  defineConfig,
} from "@chakra-ui/react";

const animationStyles = defineAnimationStyles({
  bounceFadeIn: {
    value: {
      animationName: "bounce, fade-in",
      animationDuration: "1s",
      animationTimingFunction: "ease-in-out",
      animationIterationCount: "infinite",
    },
  },
});

export const system = createSystem(defaultConfig, {
  theme: {
    animationStyles,
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

export default system;
