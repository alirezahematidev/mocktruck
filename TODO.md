# Create a CLI with builtIn commands

# Simulate server, build API methods within generated data

# Webpack configuration and packaging the entire code in npm

# Express ejs template engine to showing up data at specific endpoint

```
const checkPort = (port: number, host: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new Socket();

    socket.setTimeout(1000);

    socket.on("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
};

```
