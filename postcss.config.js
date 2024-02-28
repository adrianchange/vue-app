const PostcssAutoprefixer = require('autoprefixer');
const Tailwindcss = require('tailwindcss');

module.exports = {
  // ... other configuration
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  module: {
    rules: [
      // ... other rules
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                Tailwindcss(),
                PostcssAutoprefixer(),
              ],
            },
          },
        ],
      },
    ],
  },

}
