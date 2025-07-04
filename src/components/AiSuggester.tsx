import React, { useState, useCallback } from 'react';
import { SparklesIcon, ArrowRightIcon } from './Icons';

interface AiSuggesterProps {
  onSuggest: (prompt: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

const AiSuggester: React.FC<AiSuggesterProps> = ({ onSuggest, isLoading, placeholder }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSuggest(prompt);
    }
  }, [prompt, isLoading, onSuggest]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-200 shadow-sm">
      <div className="flex items-center mb-3">
        <SparklesIcon className="text-indigo-500" />
        <h3 className="ml-2 text-lg font-bold text-indigo-900">Trợ lý AI Gợi ý</h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">Mô tả sản phẩm bạn muốn làm, AI sẽ điền các thông số gợi ý giúp bạn.</p>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder || "VD: bàn làm việc đơn giản 1m2x60cm"}
          className="flex-grow w-full px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <ArrowRightIcon />
          )}
          <span className={isLoading ? 'ml-2' : 'sr-only'}>{isLoading ? 'Đang xử lý...' : 'Gửi'}</span>
        </button>
      </form>
    </div>
  );
};

export default AiSuggester;