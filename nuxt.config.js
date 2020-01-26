export default {
  mode: 'spa',
  head: {
    title: 'Écorats, stats & dataviz',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Ecorats dataviz' }
    ],
    script: [
      { src: 'https://cdn.jsdelivr.net/npm/v-charts@1.18.0/lib/index.min.js' },
      { src: 'https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { type: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway:400,400i,700i&display=swap' }
    ]
  },
  loading: { color: '#fff' },
  css: ['~assets/css/main.scss'],
  plugins: [],
  modules: [
    'nuxt-buefy',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    ['nuxt-i18n',
      {
        locales: ['fr'],
        defaultLocale: 'fr'
      }
    ]
  ],
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.txt$/i,
        use: 'raw-loader'
      });
    }
  }
};
