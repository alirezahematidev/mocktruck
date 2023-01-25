import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { fileURLToPath } from "url";
import { typeMapper } from "../constants/model.enums.mjs";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

type ValueType<T extends object> = string | T | T[];

type TypeParams = {
  [param: string]: ValueType<TypeParams>;
};

function typeGenerator(params: TypeParams) {
  let content = "";

  for (const key in params) {
    const type = params[key];

    if (Array.isArray(type)) {
      return "";
    }

    if (typeof type === "object") return "";

    if (type.includes("|")) {
      const separated = type.split("|");

      const mapped = separated.map((t) => typeMapper[t.trim()]);

      const joined = mapped.join("|");

      content += `${key}: ${joined};\n`;
    } else {
      content += `${key}: ${typeMapper[type]};\n`;
    }
  }

  const typeContent = `type Model = {\n${content}\n}`;

  const p = path.resolve(__dirname, ".");

  prettier.resolveConfig(p).then((options) => {
    const format = prettier.format(typeContent, {
      ...options,
      parser: "babel-ts",
    });

    fs.writeFileSync(p + "/model.type.ts", format);
  });
}

export { typeGenerator };
