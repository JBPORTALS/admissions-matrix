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
        heading: { value: `'Open Sans', sans-serif` },
        body: { value: `'Open Sans', sans-serif` },
      },
      fontSizes: {
        xs: { value: "0.8rem" },
        sm: { value: "0.9rem" },
        md: { value: "1rem" }, // Increased
        lg: { value: "1.125rem" }, // 18px
        xl: { value: "1.25rem" }, // 20px
        "2xl": { value: "1.5rem" }, // 24px
        "3xl": { value: "1.875rem" }, // 30px
      },
      spacing: {
        1: { value: "0.25rem" }, // 4px
        2: { value: "0.375rem" }, // 6px
        3: { value: "0.5rem" }, // 8px
        4: { value: "0.75rem" }, // 12px
        5: { value: "1rem" }, // 16px
        6: { value: "1.25rem" }, // 20px
        7: { value: "1.5rem" }, // 24px
        8: { value: "1.75rem" }, // 28px
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
      fontSize: "md", // now matches updated md = 1rem
    },
    input: {
      _invalid: { bg: "bg.error" },
    },
  },
});

export default system;
