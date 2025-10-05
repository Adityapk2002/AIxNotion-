import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChatMessage from '../components/ChatMessage';
import { SendHorizonal, Settings, Zap } from 'lucide-react';
import SettingsModal from './SettingModal';
import StatusToast from './StatusToast';

const Hero = () => {
  const [notionConfig, setNotionConfig] = useState({ botToken: '', databaseId: '', settingsOpen: false });
  const isNotionConnected = !!(notionConfig.botToken && notionConfig.databaseId);

  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [userId] = useState('demo-user');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleGenerate = useCallback(async (userQuery: string) => {
    if (!userQuery.trim() || isLoading) return;

    setIsLoading(true);
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userQuery, id: Date.now() }]);

    try {
      const response = await fetch("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      if (!response.ok) throw new Error(`Backend returned status ${response.status}`);

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'model', text: data.answer, id: Date.now() + 1 }]);
    } catch (error) {
      console.error("Frontend API Error:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: "Error: Could not reach backend AI service.", id: Date.now() + 1 }]);
    }

    setIsLoading(false);
  }, [isLoading]);

  useEffect(() => {
  const fetchPreviousChats = async () => {
    if (!notionConfig.botToken || !notionConfig.databaseId) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/notion/history?databaseId=${notionConfig.databaseId}&botToken=${notionConfig.botToken}`
      );

      if (!res.ok) throw new Error("Failed to fetch previous chats");

      const data = await res.json();
      setChatHistory(data.reverse()); // show oldest first
    } catch (err) {
      console.error("Error fetching previous chats:", err);
    }
  };

  fetchPreviousChats();
}, [notionConfig.botToken, notionConfig.databaseId]);

  // Clean text before sending to Notion
  function cleanTextForNotion(text: string): string {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/#+\s/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }

  const textToNotionRichText = (text: string) => {
    const cleanedText = cleanTextForNotion(text);
    const parts = cleanedText.split("\n");
    return parts.map(part => ({
      object: "block",
      type: "paragraph",
      paragraph: { rich_text: part ? [{ type: "text", text: { content: part } }] : [] }
    }));
  };

  const handleSaveToNotion = async (msg: any) => {
    if (!notionConfig.botToken || !notionConfig.databaseId) {
      setStatusMessage("Notion not connected or database ID missing!");
      setStatusType("error");
      setTimeout(() => setStatusMessage(null), 2000);
      return;
    }

    const pagePayload = {
      parent: { database_id: notionConfig.databaseId },
      properties: {
        Name: { title: [{ type: "text", text: { content: msg.query || "AI Generated Content" } }] },
        Source: { rich_text: [{ type: "text", text: { content: "AI Assistant Chat" } }] },
        "Date Saved": { date: { start: new Date().toISOString().split("T")[0] } }
      },
      children: textToNotionRichText(msg.text),
    };

    try {
      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${notionConfig.botToken}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pagePayload)
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Notion API Error:", err);
        setStatusMessage("Failed to save to Notion!");
        setStatusType("error");
        setTimeout(() => setStatusMessage(null), 2000);
        return;
      }

      setStatusMessage("Saved to Notion!");
      setStatusType("success");
      setTimeout(() => setStatusMessage(null), 2000);
    } catch (error) {
      console.error("Network error saving to Notion:", error);
      setStatusMessage("Network error while saving to Notion!");
      setStatusType("error");
      setTimeout(() => setStatusMessage(null), 2000);
    }
  };

  const Loader2 = (props: any) => <span {...props}>⏳</span>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased p-0 md:p-8">
      <header className="flex items-center w-full max-w-4xl mx-auto justify-between p-4 md:p-6 bg-white shadow-lg rounded-xl mb-4">
        <div className="flex items-center">
          <Zap className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">AI<span className="text-blue-600">xNotion</span> Assistant</h1>
        </div>
        <button
          onClick={() => setNotionConfig(p => ({ ...p, settingsOpen: true }))}
          className={`flex items-center text-sm font-medium px-4 py-2 rounded-lg transition
            ${isNotionConnected
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <Settings className="w-4 h-4 mr-1.5" />
          {isNotionConnected ? 'Notion Connected' : 'Notion Setup'}
        </button>
      </header>

      <div className="flex-1 flex flex-col bg-white shadow-2xl rounded-xl chat-container mx-auto w-full max-w-4xl">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {chatHistory.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSave={handleSaveToNotion}
              isLoading={isLoading}
              isNotionConnected={isNotionConnected}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="p-4 rounded-xl bg-gray-100 text-gray-600 rounded-tl-none flex items-center shadow-md">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <form onSubmit={(e) => { e.preventDefault(); handleGenerate(query); }} className="flex items-center space-x-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the AI a question or request..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-200"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:shadow-none"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <SendHorizonal className="w-6 h-6" />}
            </button>
          </form>
        </div>
      </div>

      {notionConfig.settingsOpen && (
        <SettingsModal
          notionConfig={notionConfig}
          setNotionConfig={setNotionConfig}
          handleOAuthConnect={() => setNotionConfig(p => ({ ...p, settingsOpen: false }))}
        />
      )}
      <StatusToast message={statusMessage} type={statusType} onClose={() => setStatusMessage(null)} />
    </div>
  );
};

export default Hero;
