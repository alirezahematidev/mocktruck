import { Truck } from "../interfaces/index.mjs";

function parsePlugins(
  plugins: Truck.Plugin[],
  initial: Truck.PluginEnteries,
): Truck.PluginEnteries {
  if (!plugins || !plugins.length) return initial;

  return plugins.reduce((data, plugin) => plugin(data), initial);
}

export { parsePlugins };
