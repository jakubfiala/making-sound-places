import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: {
    index: './index.js',
  },
  output: [
    {
      dir: 'dist',
    },
  ],
  plugins: [
    nodeResolve(),
  ],
};
