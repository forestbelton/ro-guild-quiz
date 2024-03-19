import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __RAW_QUESTIONS_CSV__: JSON.stringify(
      fs.readFileSync("./src/questions.csv", { encoding: "utf-8" })
    ),
  },
  plugins: [react()],
});
