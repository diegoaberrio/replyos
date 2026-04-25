import { openai } from "../../config/openai.js";
import { env } from "../../config/env.js";

async function main() {
  console.log("OPENAI_MODEL:", env.openAiModel);
  console.log("OPENAI_API_KEY loaded:", Boolean(env.openAiApiKey));

  const response = await openai.responses.create({
    model: env.openAiModel,
    input: "Responde solo: OK OpenAI ReplyOS"
  });

  console.log("OUTPUT:");
  console.log(response.output_text);
}

main().catch((error) => {
  console.error("OPENAI TEST ERROR:");
  console.error(error);
  process.exit(1);
});