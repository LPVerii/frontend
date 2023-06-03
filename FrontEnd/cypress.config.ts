import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'jdejcr',
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
	experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
