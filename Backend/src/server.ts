import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  process.stdout.write(`Servify backend listening on http://localhost:${env.port}\n`);
});
