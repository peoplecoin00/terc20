import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: '/favicon.png',
  title: "IERC 20 -- ETH INSC",
  history: { type: 'hash' },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/balance/:tick/:address', component: '@/pages/balance' },
    { path: '/deploy', component: '@/pages/deploy' },
    { path: '/detail/:tick', component: '@/pages/detail' },
  ],
  devServer: {
    port: 1001,
  },
  outputPath:'/docs',
  fastRefresh: {},
});
