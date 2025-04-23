"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getAIResponse } from "@/lib/ai-service";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isAI: boolean;
}

export default function AIChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "AI Assistant",
        content: "Hello! I'm your AI coding assistant. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "/ai-avatar.png",
        isAI: true,
      },
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "/user-avatar.png",
      isAI: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Prepare conversation history
      const conversationHistory = messages
        .filter((msg) => msg.content)
        .map((msg) => ({
          role: msg.isAI ? "assistant" : "user",
          content: msg.content,
        }));

      // Get AI response
      const aiContent = await getAIResponse([
        ...conversationHistory,
        { role: "user", content: message },
      ]);

      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        sender: "AI Assistant",
        content: aiContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "/ai-avatar.png",
        isAI: true,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get AI response. Please try again."
      );
      console.error("Error getting AI response:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick prompts
  const quickPrompts = [
    "Create a React component",
    "Fix this JavaScript error",
    "Explain async/await",
    "How to center a div?",
  ];

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-700 bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group h-10 w-10 rounded-full border border-gray-700 bg-gray-800/50 p-0 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Icons.chevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
              <AvatarFallback className="bg-gradient-to-r from-gray-600 to-gray-500 text-white">
                AI
              </AvatarFallback>
            </Avatar>
            <h1 className="text-xl font-bold text-white">AI Coding Assistant</h1>
          </div>
        </div>
        <Badge
          variant="outline"
          className="border-emerald-800 bg-emerald-900/20 text-emerald-400"
        >
          Online
        </Badge>
      </header>

      {/* Main Chat Area */}
      <main className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-col">
          <ScrollArea className="flex-1 p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${
                    msg.isAI ? "justify-start" : "justify-end"
                  }`}
                >
                  {msg.isAI && (
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={msg.avatar} alt={msg.sender} />
                      <AvatarFallback className="bg-gradient-to-r from-gray-600 to-gray-500 text-white">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex max-w-[80%] flex-col ${
                      msg.isAI ? "items-start" : "items-end"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-400/70">
                        {msg.timestamp}
                      </span>
                    </div>
                    <div
                      className={`rounded-2xl p-4 ${
                        msg.isAI
                          ? "bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-white"
                          : "bg-gradient-to-r from-gray-800 to-gray-700 text-white"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            if (inline) {
                              return (
                                <code className="rounded bg-gray-700 px-1 py-0.5 text-sm">
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <div className="my-3 overflow-hidden rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-700/80">
                                <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2">
                                  <span className="font-mono text-xs text-gray-300">
                                    Code
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-gray-300 hover:bg-gray-700 hover:text-white"
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        String(children)
                                      )
                                    }
                                  >
                                    <Icons.copy className="h-3 w-3" />
                                  </Button>
                                </div>
                                <pre className="overflow-x-auto p-4 font-mono text-sm">
                                  <code>{children}</code>
                                </pre>
                              </div>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  {!msg.isAI && (
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={msg.avatar} alt={msg.sender} />
                      <AvatarFallback className="bg-gradient-to-r from-gray-600 to-gray-500 text-white">
                        You
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-1 rounded-2xl bg-gray-800/50 px-4 py-3">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-100"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-200"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-200">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-700 bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-4 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask me anything about coding..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-400/50 focus:border-gray-500 focus:ring-gray-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-500/10 hover:from-gray-700/90 hover:to-gray-600/90"
                >
                  {isLoading ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.send className="h-4 w-4" />
                  )}
                </Button>
              </form>

              <div className="mt-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-700 bg-gray-800/50 text-xs text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setMessage(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
