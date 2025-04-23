import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface AIMessage {
  role: string;
  content: string;
}

export const getGeminiResponse = async (messages: AIMessage[]) => {
  try {
    // Initialize the correct generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",  // Correct model version
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    let processedMessages = [...messages];

    // Handle system message correctly
    if (processedMessages[0]?.role === "system") {
      const systemMessage = processedMessages[0];
      if (processedMessages[1]?.role === "user") {
        // Combine the system message with the user's first message
        processedMessages[1].content = `${systemMessage.content}\n\n${processedMessages[1].content}`;
        processedMessages = processedMessages.slice(1); // Remove system message from the history
      } else {
        // Move system message to the first user message
        processedMessages = [
          {
            role: "user",
            content: systemMessage.content,
          },
          ...processedMessages.slice(1),
        ];
      }
    }

    // Ensure the last message is from the user
    if (processedMessages[processedMessages.length - 1]?.role !== "user") {
      throw new Error("Last message must be from the user.");
    }

    // Generate chat with proper history mapping
    const chat = model.startChat({
      history: processedMessages
        .slice(0, -1) // Exclude the last user message
        .filter(msg => msg.role === "user" || msg.role === "assistant") // Only keep user and assistant messages
        .map(msg => ({
          role: msg.role === "user" ? "user" : "model",  // Change assistant to model
          parts: [{ text: msg.content }],
        })),
    });

    // Send the last user message and await the response
    const result = await chat.sendMessage(processedMessages[processedMessages.length - 1].content);
    const response = await result.response;

    // Return the response text from the Gemini API
    return response.text();

  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to get AI response. Please try again.");
  }
};

// Wrapper function to add system message and get AI response
export const getAIResponse = async (messages: AIMessage[]) => {
  return await getGeminiResponse([
    {
      role: "system",
      content: "You are an expert coding assistant. Provide clear, concise answers with code examples when appropriate. Format code blocks with markdown.",
    },
    ...messages,
  ]);
};
