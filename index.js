let ready = false;

export default async function healthChecks(app) {
  await app.registerPlugin({
    label: "Health Checks",
    name: "health-checks",
    functionsByType: {
      preStartup: [
        (ctx) => {
          const app = ctx.app.expressApp;

          const alivePath =
            process.env.HEALTH_CHECKS_ALIVE_PATH || "/health/alive";

          app.get(alivePath, (_, res) => res.status(200).send("ALIVE"));
          console.log(`Alive Check ready at ${alivePath}`);

          const readyPath =
            process.env.HEALTH_CHECKS_READY_PATH || "/health/ready";

          app.get(readyPath, (_, res) =>
            res.status(ready ? 200 : 500).send(ready ? "READY" : "LOADING")
          );
          console.log(`Ready Check ready at ${readyPath}`);
        },
      ],
      startup: [
        (ctx) => {
          ready = true;
        },
      ],
    },
  });
}
