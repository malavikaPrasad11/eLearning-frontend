// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: "/",
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': 'http://localhost:3000',  // or wherever your backend runs locally
//     },
//   },
// }
// );
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    'process.env': process.env
  }
})