// module.exports = {
//   webpack(config, options) {
//     config.module.rules.push({
//       test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
//       use: {
//         loader: "url-loader",
//         options: {
//           limit: 100000,
//         },
//       },
//     });

//     return config;
//   },
// };
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: "export",

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
};

module.exports = nextConfig;
