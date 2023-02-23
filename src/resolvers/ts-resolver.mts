import path from "path";

function resolveTsExtension(request: string, parentModulePath: string): string {
  if (path.extname(request) === ".ts" && request.includes("truck.config")) {
    const requestWithoutExtension = request.replace(/.ts$/g, "");
    const resolvePath = path.resolve(
      parentModulePath,
      `${requestWithoutExtension}.mts`,
    );
    return resolvePath;
  }
  return request;
}

export default resolveTsExtension;
