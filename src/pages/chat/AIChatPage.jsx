// KhamarCare — AI Chat Page
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import useFarmStore from '../../stores/useFarmStore.js';
import { askGemini } from '../../services/aiService.js';

export default function AIChatPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  
  const { settings, animals, milkRecords, getTodayMilk, getAlerts } = useFarmStore();
  const apiKey = settings.geminiApiKey;

  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: lang === 'bn' 
        ? 'নমস্কার! আমি খামার কেয়ার এআই অ্যাসিস্ট্যান্ট। আপনার গবাদি পশুর স্বাস্থ্য, খাবার বা খামার পরিচালনা সম্পর্কে কোনো প্রশ্ন আছে?' 
        : 'Hello! I am the KhamarCare AI Assistant. Do you have any questions about cattle health, feed, or farm management?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!apiKey) {
      alert(lang === 'bn' ? 'সেটিংসে গিয়ে প্রথমে Gemini API Key যুক্ত করুন।' : 'Please add your Gemini API Key in Settings first.');
      navigate('/settings');
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const farmContext = {
        totalCattle: animals.length,
        lactating: animals.filter(a => a.status === 'lactating').length,
        pregnant: animals.filter(a => a.status === 'pregnant').length,
        todayMilk: getTodayMilk(),
        alerts: getAlerts()
      };

      // Add conversation history logic if needed, for MVP we just send the prompt with context
      const aiResponse = await askGemini(userMsg, apiKey, farmContext);
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: lang === 'bn' 
          ? `দুঃখিত, একটি সমস্যা হয়েছে: ${err.message}` 
          : `Sorry, there was an error: ${err.message}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">🤖 AI Assistant</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
        
        {/* Warning Banner */}
        <div style={{ background: '#FFF3E0', padding: '8px 16px', display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'var(--text-xs)' }}>
          <AlertTriangle size={16} color="#E65100" style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ color: '#E65100', lineHeight: 1.4 }}>
            {lang === 'bn' 
              ? 'এআই শুধুমাত্র পরামর্শের জন্য। কোনো গুরুতর স্বাস্থ্য সমস্যার জন্য সর্বদা একজন নিবন্ধিত পশুচিকিৎসকের পরামর্শ নিন।'
              : 'AI is for guidance only. Always consult a registered veterinarian for serious health issues.'}
          </span>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? 'var(--color-primary-500)' : 'var(--bg-surface)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              maxWidth: '85%',
              boxShadow: 'var(--shadow-sm)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap' // Simple markdown fallback
            }}>
              {/* If it's AI, format bold text basically */}
              {msg.role === 'assistant' 
                ? <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} /> 
                : msg.content}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: 4 }}>
              <div className="animate-bounce-in" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary-300)' }} />
              <div className="animate-bounce-in" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary-300)', animationDelay: '100ms' }} />
              <div className="animate-bounce-in" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary-300)', animationDelay: '200ms' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: 16, background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea 
            className="form-input" 
            placeholder={lang === 'bn' ? 'এখানে লিখুন...' : 'Type a message...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            style={{ flex: 1, resize: 'none', maxHeight: 120, padding: '12px 16px', borderRadius: 24 }}
          />
          <button 
            className="btn btn-primary btn-icon" 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{ borderRadius: '50%', width: 48, height: 48, flexShrink: 0 }}
          >
            <Send size={20} style={{ marginLeft: 2 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
