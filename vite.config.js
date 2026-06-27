import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If deploying to https://<username>.github.io/<repo-name>/, set base to '/<repo-name>/'.
// If deploying to a custom domain or https://<username>.github.io/ (user/org page), use '/'.
export default defineConfig({
  plugins: [react()],
  base: '/evidence-based-skin-aging/',
});
