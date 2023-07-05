import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: '/favicon.ico',
  title: "IERC 20 -- ETH INSC",
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/balance/:tick/:address', component: '@/pages/balance' },
    { path: '/deploy', component: '@/pages/deploy' },
  ],
  devServer: {
    port: 1001,
  },
  outputPath:'/docs',
  fastRefresh: {},
});
