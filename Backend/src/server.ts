import { app } from "./app";
import { env } from "./config/env";
import { adminService } from "./services/admin.service";

app.listen(env.port, () => {
  process.stdout.write(`Servify backend listening on http://localhost:${env.port}\n`);
  adminService.ensureDefaultAdmin();
});

