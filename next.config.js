const isProd = process.env.NODE_ENV === 'production'

const withPWA = require('next-pwa')

// eslint-disable-next-line no-undef
module.exports = withPWA({
  pwa: {
    disable: !isProd,
    dest: 'public',
  },
})
