import args from "../args.mjs";

type Argument = "server" | "port" | "input";

type TruckArgs = Pick<typeof args, Argument>;

export type { TruckArgs };
