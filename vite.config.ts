import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import { loadEnv } from 'vite';
import EnvironmentPlugin from "vite-plugin-environment"

export default defineConfig({
  plugins: [ EnvironmentPlugin("all"), dts({ insertTypesEntry: true }), react()],
})
