import { renameSync } from "fs";
import path from "path";

["sandbox", path.join("src", "EventQueue")].forEach(file => {
  try {
    renameSync(`${file}.js`, `${file}.ts`);
  } catch (expected) { }
});
