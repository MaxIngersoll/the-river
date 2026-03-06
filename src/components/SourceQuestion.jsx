import { useState } from 'react';

export default function SourceQuestion({ onAnswer, onSkip }) {
  const [text, setText] = useState('');

  const handleKeep = () => {
    if (text.trim()) {
      onAnswer(text.trim());
    }
  };

  return (
    <div className="card p-6 mb-6 text-center animate-fade-in">
      <p className="text-text-3 text-[10px] uppercase tracking-widest mb-2">
        Session 5
      </p>
      <h2 className="text-text font-serif text-lg italic mb-4">
        What are you reaching for?
      </h2>
      <p className="text-text-3 text-xs mb-4">
        A quiet question for the journey
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={200}
        rows={3}
        placeholder="There's no wrong answer..."
        aria-label="What are you reaching for?"
        className="glass-input w-full px-4 py-3 text-sm text-text placeholder-text-3 resize-none mb-4"
      />
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleKeep}
          disabled={!text.trim()}
          className="px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
          }}
        >
          Keep this
        </button>
        <button
          onClick={onSkip}
          className="px-4 py-2 text-sm text-text-3 hover:text-text transition-colors"
        >
          Not yet
        </button>
      </div>
    </div>
  );
}
