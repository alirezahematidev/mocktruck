import Truck from "../interfaces/index.js";

function parsePlugins(
  plugins: Truck.Plugin[],
  initial: Truck.PluginEnteries,
): Truck.PluginEnteries {
  if (!plugins || !plugins.length) return initial;

  return plugins.reduce((data, plugin) => plugin(data), initial);
}

export default parsePlugins;
