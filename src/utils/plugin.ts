import { Truck } from "../typings/index.mjs";

type GeneratedInput = Truck.IMock;

type TruckPlugin<T extends GeneratedInput> = (data:T) => T | Promise<T>



async function parsePlugins<T extends GeneratedInput>(plugins:TruckPlugin<T>[],initialInput:T): Promise<T> {
    let result: T = initialInput;
    for (const fn of plugins) {
      const fnResult = fn(result);
      result = await (fnResult instanceof Promise ? fnResult : Promise.resolve(fnResult));
    }
    return result;
}
export {parsePlugins}