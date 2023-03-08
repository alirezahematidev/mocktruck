type LogMessage = Record<number, string>;

const messages: LogMessage = {
  200: "Contents is generating...",
  201: "The {model} is generated successfully",
  202: "Server is running at port {port}",
  203: "Generating process has been failed: {error}",
  204: "The configuration file could not read",
  205: "The configuration file must be exported as `default` or exported name as `configs`",
  206: "The configuration file could not found",
  207: "The models must have a name and schema. Be careful to define them in each model",
  208: "An error occurred while reading models",
  209: "The {model} endpoint cannot be accessed",
  210: "Error shutting down server: {error}",
  211: "Server shutdown successfully",
  212: "An error occurred while processing: {error}",
};

export default messages;
