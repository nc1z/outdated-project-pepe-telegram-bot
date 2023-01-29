const axios = require("axios");

export const fetchResponse = async (userPrompt: string, userId: number) => {
  const api_url = "https://api.openai.com/v1/completions";
  const base_model = "text-babbage-001";
  const apiKey = process.env.GPT_SECRET;

  if (userPrompt.split(" ").length > 30) {
    return "Request exceeds word limit (30)";
  }

  const inputPrompt = userPrompt + "- Keep the response concise.";

  try {
    const response = await axios.post(
      api_url,
      {
        model: base_model,
        prompt: inputPrompt,
        max_tokens: 100,
        temperature: 0.3,
        top_p: 1,
        n: 1,
        stream: false,
        logprobs: null,
        stop: null,
        user: userId.toString(),
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (response.status === 200) {
      if (response.data.choices[0].finish_reason === "length") {
        return response.data.choices[0].text + "...";
      }
      console.log(response.data.usage);
      console.log(response.data.choices[0].text);
      return response.data.choices[0].text as string;
    }
  } catch (error) {
    console.log(error);
    return "Error: No reponse";
  }
};

module.exports = { fetchResponse };
