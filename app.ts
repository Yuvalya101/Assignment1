import { initApp } from "./server";

initApp().then((app) => {
  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    console.log("Server started");
  });
});
