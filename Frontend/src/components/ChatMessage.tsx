import { Save } from 'lucide-react';

interface ChatMessageProps {
  message: { role: string; text: string; id: number; query?: string; timestamp?: string };
  onSave: (msg: any) => void;
  isLoading: boolean;
  isNotionConnected: boolean;
}

const ChatMessage = ({ message, onSave, isLoading, isNotionConnected }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            AI
          </div>
        </div>
      )}
      {isUser && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">
            U
          </div>
        </div>
      )}

      {/* Message Bubble */}
      <div className={`max-w-3/4 p-4 rounded-xl shadow-md flex flex-col 
        ${isUser 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}>
        <p className="whitespace-pre-wrap">{message.text}</p>

        {/* Timestamp */}
        {timestamp && (
          <span className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {timestamp}
          </span>
        )}

        {/* Save to Notion button for AI messages */}
        {!isUser && (
          <div className="mt-3 pt-3 border-t border-gray-300 flex justify-end">
            <button 
              onClick={() => onSave(message)}
              className={`flex items-center text-sm font-semibold transition px-3 py-1.5 rounded-full shadow-inner 
                ${isNotionConnected 
                  ? 'text-gray-700 bg-white hover:bg-gray-200'
                  : 'text-white bg-red-500 cursor-not-allowed'
                }
              `}
              aria-label="Save this response to Notion"
              disabled={isLoading || !isNotionConnected}
            >
              <Save className="w-4 h-4 mr-1.5" />
              {isNotionConnected ? 'Save to Notion' : 'Notion Disconnected'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
