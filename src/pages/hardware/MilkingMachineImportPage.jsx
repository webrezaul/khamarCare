// KhamarCare — Milking Machine Import Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { todayStr } from '../../utils/dateUtils.js';

export default function MilkingMachineImportPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const { animals, addMilkRecord } = useFarmStore();
  const showToast = useToastStore(s => s.show);

  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
    }
  };

  const parseCSV = () => {
    if (!file) return;
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\\n');
      
      const parsedRecords = [];
      const errors = [];

      // Assume CSV format: EarTag, MorningYield, EveningYield, Date
      // Skip header (i=1)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(',');
        if (cols.length >= 3) {
          const earTag = cols[0].trim();
          const morning = parseFloat(cols[1]) || 0;
          const evening = parseFloat(cols[2]) || 0;
          const rDate = cols[3] ? cols[3].trim() : todayStr();

          const animal = animals.find(a => a.earTag.toLowerCase() === earTag.toLowerCase());
          
          if (animal) {
            parsedRecords.push({
              animalId: animal.id,
              earTag: animal.earTag,
              morningYield: morning,
              eveningYield: evening,
              totalMilk: morning + evening,
              date: rDate
            });
          } else {
            errors.push(`Tag ${earTag} not found in database.`);
          }
        }
      }

      setResults({ success: parsedRecords, errors });
      setParsing(false);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!results || results.success.length === 0) return;
    
    setParsing(true); // Re-use for loading state
    let count = 0;
    try {
      for (const record of results.success) {
        await addMilkRecord({
          farmId: farm.id,
          animalId: record.animalId,
          date: record.date,
          morningYield: record.morningYield,
          eveningYield: record.eveningYield,
          totalMilk: record.totalMilk
        });
        count++;
      }
      showToast(lang === 'bn' ? `${count} টি রেকর্ড ইম্পোর্ট করা হয়েছে` : `Imported ${count} records`, 'success');
      navigate('/milk');
    } catch (err) {
      showToast(t('common.error'), 'error');
      setParsing(false);
    }
  };

  return (
    <div className="page">
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <span className="app-header-title">{lang === 'bn' ? 'মেশিন ডেটা ইম্পোর্ট' : 'Import Machine Data'}</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="page-content stagger-children">
        <div className="card mb-4">
          <h3 className="font-bold mb-2">{lang === 'bn' ? 'CSV ফাইল আপলোড করুন' : 'Upload CSV File'}</h3>
          <p className="text-secondary text-sm mb-4">
            {lang === 'bn' 
              ? 'আপনার মিল্কিং মেশিন বা সফটওয়্যার থেকে এক্সপোর্ট করা CSV ফাইল নির্বাচন করুন। ফরম্যাট: EarTag, Morning, Evening, Date' 
              : 'Select the CSV file exported from your digital milking parlor. Format: EarTag, Morning, Evening, Date'}
          </p>

          <div style={{ border: '2px dashed var(--border-color)', borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 16 }}>
            <FileText size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 16px' }} />
            <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} id="csv-upload" />
            <label htmlFor="csv-upload" className="btn btn-outline">
              {file ? file.name : (lang === 'bn' ? 'ফাইল নির্বাচন করুন' : 'Select File')}
            </label>
          </div>

          <button className="btn btn-primary btn-full" onClick={parseCSV} disabled={!file || parsing}>
            {parsing ? t('common.loading') : (lang === 'bn' ? 'ফাইল যাচাই করুন' : 'Verify File')}
          </button>
        </div>

        {results && (
          <div className="card animate-fade-in-up">
            <h3 className="font-bold mb-4">{lang === 'bn' ? 'যাচাইয়ের ফলাফল' : 'Verification Results'}</h3>
            
            <div className="flex justify-between items-center mb-2 p-3 bg-green-50 rounded" style={{ color: 'var(--color-success)' }}>
              <div className="flex items-center gap-2"><CheckCircle size={18} /> {lang === 'bn' ? 'সঠিক রেকর্ড' : 'Valid Records'}</div>
              <div className="font-bold text-lg">{results.success.length}</div>
            </div>

            {results.errors.length > 0 && (
              <div className="flex justify-between items-center mb-4 p-3 bg-red-50 rounded" style={{ color: 'var(--color-danger)' }}>
                <div className="flex items-center gap-2"><AlertCircle size={18} /> {lang === 'bn' ? 'ত্রুটিপূর্ণ রেকর্ড' : 'Invalid Records'}</div>
                <div className="font-bold text-lg">{results.errors.length}</div>
              </div>
            )}

            <button className="btn btn-primary btn-full btn-lg" onClick={handleImport} disabled={results.success.length === 0 || parsing}>
              {lang === 'bn' ? 'ইম্পোর্ট করুন' : 'Import Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
