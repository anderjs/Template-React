import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.development",
});

function convertToJsonToTs(json) {
  let tsCode = "export const alias = {\n";

  Object.keys(json)
    .map((key) => {
      if (key === "en") {
        Object.entries(json[key]).forEach(([k, v]) => {
          const KE = k as string;

          tsCode += `  ['${KE.toLowerCase()}']: "${KE.toLowerCase()}", \n`;
        });
      }
    })
    .filter((value) => value);

  tsCode += "};\n";

  return tsCode;
}

const createSrcLang = async () => {
  const cdn = process.env.LOCALIZE_CDN;

  const project = process.env.LOCALIZE_PROJECT;

  const languageKey = process.env.LOCALIZE_LANGUAGE_KEY;

  const environment = process.env.LOCALIZE_ENVIRONMENT;

  const lang = await axios.get(
    `${cdn}/${project}/${environment}/${languageKey}`,
    {
      headers: {
        ["X-SimpleLocalize-Token"]: process.env.LOCALIZE_API_KEY as string,
      },
    }
  );

  const src = path.join(__dirname, "src", "lang", "index.ts");

  fs.writeFile(src, convertToJsonToTs(lang.data), (err) => {
    console.log({ fileGenerated: true });
  });
};

createSrcLang();
