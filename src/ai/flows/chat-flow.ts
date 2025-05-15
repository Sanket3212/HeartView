
'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - askChatbot - A function that sends a message to the chatbot and gets a response.
 * - ChatInput - The input type for the askChatbot function.
 * - ChatOutput - The return type for the askChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  // Optional: Add conversation history here if needed for more advanced chat
  // history: z.array(z.object({role: z.enum(["user", "assistant"]), content: z.string()})).optional(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user message.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function askChatbot(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are HeartView AI, a helpful and friendly assistant for the HeartView application.
Your primary role is to provide general information about ECGs, heart health, and how the HeartView app works.
You can answer questions about common heart conditions, explain what an ECG is, and describe the features of the app.
Do not provide medical advice, diagnoses, or treatment recommendations. If asked for medical advice, politely decline and suggest consulting a healthcare professional.
Keep your responses concise and easy to understand.

User's message: {{{message}}}

Your response:
`,
// Example for history if added to inputSchema:
//   {{#if history}}
// Conversation History:
// {{#each history}}
// {{this.role}}: {{this.content}}
// {{/each}}
// {{/if}}
// User: {{{message}}}
// Assistant:
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      // This case should ideally be handled by Genkit's error mechanisms or schema validation
      // but as a fallback:
      return { response: "I'm sorry, I couldn't generate a response at this moment. Please try again." };
    }
    return output;
  }
);
