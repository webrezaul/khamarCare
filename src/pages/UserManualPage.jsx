// KhamarCare — User Manual Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function UserManualPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  return (
    <div className="page" style={{ background: '#f4f6f8', minHeight: '100vh', paddingBottom: '40px' }}>
      <header className="app-header" style={{ background: 'rgba(244, 246, 248, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingTop: 'calc(env(safe-area-inset-top) + 12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button style={{ padding: '8px', borderRadius: '50%', background: 'white', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} color="#374151" />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
          {lang === 'bn' ? 'ব্যবহার নির্দেশিকা' : 'User Manual'}
        </span>
        <div style={{ width: 38 }} />
      </header>

      <div className="page-content" style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-500)', marginBottom: '16px' }}>
              <BookOpen size={32} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1f2937', marginBottom: '8px' }}>
              {lang === 'bn' ? 'খামার কেয়ার (KhamarCare)' : 'KhamarCare'}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              {lang === 'bn' 
                ? 'খামার পরিচালনায় আপনার নিত্যসঙ্গী'
                : 'Your daily companion for farm management'}
            </p>
          </div>

          {lang === 'bn' ? (
            <div style={{ color: '#374151', lineHeight: '1.7', fontSize: '15px' }}>
              <p style={{ marginBottom: '16px' }}>স্বাগতম <strong>খামার কেয়ার</strong> অ্যাপে! এই অ্যাপটি তৈরি করা হয়েছে আপনার ডেইরি খামার খুব সহজে এবং আধুনিক উপায়ে পরিচালনা করার জন্য। আপনি যদি নতুন ব্যবহারকারী হন, তবে এই নির্দেশিকাটি আপনাকে সাহায্য করবে।</p>
              
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '24px', marginBottom: '12px' }}>১. ড্যাশবোর্ড (Dashboard)</h3>
              <p style={{ marginBottom: '8px' }}>ড্যাশবোর্ড হলো আপনার খামারের মূল পাতা।</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '6px' }}><strong>খামারের সারসংক্ষেপ:</strong> বর্তমান অবস্থা, মোট গবাদি পশু এবং আজকের আনুমানিক লাভ।</li>
                <li style={{ marginBottom: '6px' }}><strong>সতর্কতা:</strong> টিকা বা প্রসবের সময় কাছাকাছি হলে সতর্কবার্তা।</li>
                <li style={{ marginBottom: '6px' }}><strong>দ্রুত কাজ:</strong> (+) বাটন চেপে দুধ, খাদ্য বা খরচের হিসাব যোগ।</li>
              </ul>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '24px', marginBottom: '12px' }}>২. গবাদি পশু (Cattle)</h3>
              <p style={{ marginBottom: '8px' }}>আপনার খামারের সব গরুর তালিকা এবং তাদের বিস্তারিত তথ্য।</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '6px' }}>উপরের <strong>'যোগ করুন'</strong> বাটনে ক্লিক করে নতুন গরু যোগ করুন।</li>
                <li style={{ marginBottom: '6px' }}>যেকোনো গরুর ওপর ক্লিক করে তার দুধের ইতিহাস, গর্ভাবস্থা ও বংশ পরিচয় দেখুন।</li>
              </ul>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '24px', marginBottom: '12px' }}>৩. দুধ ব্যবস্থাপনা (Milk)</h3>
              <p style={{ marginBottom: '16px' }}>সকাল এবং বিকালের দুধের পরিমাণ আলাদাভাবে লিখে রাখার সুবিধা। মাস শেষে মোট উৎপাদনের রিপোর্ট দেখতে পারবেন।</p>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '24px', marginBottom: '12px' }}>৪. খাদ্য ও আর্থিক ব্যবস্থাপনা (Feed & Finance)</h3>
              <p style={{ marginBottom: '16px' }}>ঘাস, খড় বা দানাদার খাবারের খরচ এবং দুধ বা গরু বিক্রির আয় এখানে যোগ করুন। অ্যাপ আপনাকে স্বয়ংক্রিয়ভাবে লাভ-ক্ষতির হিসাব জানিয়ে দেবে।</p>
            </div>
          ) : (
            <div style={{ color: '#374151', lineHeight: '1.7', fontSize: '15px' }}>
              <p style={{ marginBottom: '16px' }}>Welcome to <strong>KhamarCare</strong>! This app is designed to help you manage your dairy farm easily and in a modern way. Here is a quick guide to get you started.</p>
              
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '24px', marginBottom: '12px' }}>1. Dashboard</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '6px' }}><strong>Overview:</strong> See total cattle, today's profit, and stats.</li>
                <li style={{ marginBottom: '6px' }}><strong>Alerts:</strong> Reminders for vaccination or calving.</li>
                <li style={{ marginBottom: '6px' }}><strong>Quick Actions:</strong> Add milk, feed, or expenses quickly.</li>
              </ul>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '24px', marginBottom: '12px' }}>2. Cattle Management</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '6px' }}>Click <strong>'Add'</strong> to register a new animal.</li>
                <li style={{ marginBottom: '6px' }}>Click on any cattle to view detailed history (milk, pregnancy, lineage).</li>
              </ul>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '24px', marginBottom: '12px' }}>3. Milk, Feed & Finance</h3>
              <p style={{ marginBottom: '16px' }}>Record daily milk production, feed costs, and other income/expenses. The app will automatically calculate your profit/loss.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
