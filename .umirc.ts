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
    { path: '/balance/:address', component: '@/pages/balance' },
    { path: '/deploy', component: '@/pages/deploy' },
    { path: '/detail/:tick', component: '@/pages/detail' },
    { path: '/send_list/:address', component: '@/pages/sendList' },
  ],
  devServer: {
    port: 1001,
  },
  outputPath:'/docs',
  fastRefresh: {},
});
