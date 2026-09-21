import { generateRegistry } from "../src/lib/content/registry-generator";
generateRegistry()
  .then((keys) => console.log(`Registered ${keys.length} post(s).`))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
