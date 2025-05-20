import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./env.config";

export const embeddingModel = "models/text-embedding-004";
export const taskTypeEmbedding = TaskType.SEMANTIC_SIMILARITY;
export const apiKeyEmbedding = GEMINI_API_KEY;

export const geminiModel = "gemini-2.0-flash";

export const promptSummarize = (query: string) => `Tóm tắt ngắn gọn mô tả sản phẩm sau, chỉ giữ lại những điểm nổi bật nhất, tối đa 250 từ: ${query}`;
export const systemInstructionSummarize = `Bạn là trợ lý AI chuyên viết tóm tắt cho sản phẩm thương mại điện tử bằng tiếng Việt.`;
