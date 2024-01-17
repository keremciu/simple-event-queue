import { rmdirSync } from "fs";

rmdirSync("dist", { force: true, recursive: true });
