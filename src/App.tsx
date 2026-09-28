import React, { useState, useEffect } from 'react';
import { PreSalesField, PreSalesSubmissionResult, PreSalesSubmissionPayload } from './types/presales';
import {
  fetchPreSalesSchema,
  fetchAssistancePhone,
  submitPreSalesProject,
  DEFAULT_ASSISTANCE_PHONE,
} from './services/presalesApi';
import { Header } from './components/Header';
import { PreSalesForm } from './components/PreSalesForm';
import { SuccessView } from './components/SuccessView';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [fields, setFields] = useState<PreSalesField[]>([]);
  const [assistancePhone, setAssistancePhone] = useState<string>(DEFAULT_ASSISTANCE_PHONE);
  const [loading, setLoading] = useState<boolean>(true);
  const [submittedResult, setSubmittedResult] = useState<PreSalesSubmissionResult | null>(null);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [pFields, phone] = await Promise.all([
        fetchPreSalesSchema(),
        fetchAssistancePhone(),
      ]);
      setFields(pFields);
      if (phone) setAssistancePhone(phone);
    } catch (e) {
      console.error('Failed to load initial data in Pre-sales app:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Listen for assistance phone updates from Panel
    const channel = new BroadcastChannel('propkart_listing_channel');
    channel.onmessage = (event) => {
      if (event.data?.type === 'ASSISTANCE_PHONE_UPDATED' && event.data.phone) {
        setAssistancePhone(event.data.phone);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const handleFormSubmit = async (payload: PreSalesSubmissionPayload): Promise<PreSalesSubmissionResult> => {
    const result = await submitPreSalesProject(payload);
    setSubmittedResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return result;
  };

  const handleReset = () => {
    setSubmittedResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* 100% Light Theme Navbar */}
      <Header assistancePhone={assistancePhone} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="text-xs font-semibold">Loading Pre-sales Configuration...</span>
          </div>
        ) : submittedResult ? (
          <SuccessView
            result={submittedResult}
            onReset={handleReset}
            assistancePhone={assistancePhone}
          />
        ) : (
          <PreSalesForm
            fields={fields}
            onSubmit={handleFormSubmit}
          />
        )}
      </main>

      {/* Footer */}
      <Footer assistancePhone={assistancePhone} />
    </div>
  );
};

export default App;
