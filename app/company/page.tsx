'use client';

import { useChat } from 'ai/react';
import GlobalHeader from '../components/GlobalHeader'
import GlobalFooter from '../components/GlobalFooter'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="h-screen flex flex-col">
      <GlobalHeader/>
      <main className="mb-auto p-8 border border-red-500 overflow-auto">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
      </main>
      <GlobalFooter/>
    </div>
  );
}
