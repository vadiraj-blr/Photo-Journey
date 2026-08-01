/**
 * Dynamic Expo app config — extends app.json with runtime env vars.
 *
 * Metro's CorsMiddleware reads `extra.router.origin` and `extra.router.headOrigin`
 * to build its list of allowed request origins. On Replit, two origins need to be
 * allowed:
 *   1. https://<DEV_DOMAIN>:3003  — Replit's browser preview pane (HMR / fast refresh)
 *   2. https://<EXPO_DEV_DOMAIN>  — Expo Go on iOS/Android fetches the JS bundle here
 *
 * The expo-router plugin `origin` is also updated so SSR / API routes resolve correctly
 * in the Replit environment instead of pointing at replit.com.
 */
export default ({ config }) => {
  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  const expoDevDomain = process.env.REPLIT_EXPO_DEV_DOMAIN;

  // Origins that Metro's CORS middleware must allow
  // extra.router.origin  → used for same-origin checks on API routes
  // extra.router.headOrigin → used for HEAD/preflight CORS checks
  // We set both to the Replit preview pane origin (pike.replit.dev:3003).
  // The Expo domain (expo.pike.replit.dev) is added via headOrigin.
  const previewOrigin = devDomain
    ? `https://${devDomain}:3003`
    : "https://replit.com/";
  const expoOrigin = expoDevDomain
    ? `https://${expoDevDomain}`
    : previewOrigin;

  // Update the expo-router plugin's origin to the live dev domain
  const updatedPlugins = (config.plugins ?? []).map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === "expo-router") {
      return [plugin[0], { ...plugin[1], origin: devDomain ? `https://${devDomain}/` : "https://replit.com/" }];
    }
    return plugin;
  });

  return {
    ...config,
    plugins: updatedPlugins,
    extra: {
      ...config.extra,
      router: {
        // Both keys are read by CorsMiddleware — allow preview pane + Expo Go
        origin: previewOrigin,
        headOrigin: expoOrigin,
      },
    },
  };
};
