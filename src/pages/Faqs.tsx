import React from 'react';
import PageLayout from '@/components/PageLayout';
import OrganicVsBotPromotion from '@/components/faqs/OrganicVsBotPromotion';
import CostPerConversion from '@/components/faqs/CostPerConversion';
import MaximizingYourBudget from '@/components/faqs/MaximizingYourBudget';
import { useState } from 'react';

const faqs: { title: string; description: string }[] = [
  {
    title: "Organic vs Bot Promotion",
    description: "Why organic listener growth matters and how MusiNova avoids bot-driven services.",
  },
  {
    title: "Cost Per Conversion Explained",
    description: "What is cost per conversion, how it's calculated, and why it's the best way to measure music promotion ROI.",
  },
  {
    title: "Maximizing Your Budget with Musi-Nova",
    description: "How we maximize budgets of all sizes while keeping your artist profile safe and focused on organic growth.",
  },
  // Add more FAQs here as needed

];

const Faqs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-musinova-green mb-6">Frequently Asked Questions</h1>

        <p className="mb-6">Browse our FAQ articles to learn more about MusiNova's processes, safety, and best practices.</p>

        <div className="grid gap-4">
          {faqs.map((f, idx) => (
            <div key={f.title} className="border rounded-lg bg-white">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-4 flex items-start justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-musinova-darkgray">{f.title}</h2>
                  <p className="text-sm text-gray-500">{f.description}</p>
                </div>
                <span className="ml-4 text-musinova-green">{openIndex === idx ? '-' : '+'}</span>
              </button>

              {openIndex === idx && (
                <div className="p-4 border-t">
                  {f.title === 'Organic vs Bot Promotion' && <OrganicVsBotPromotion />}
                  {f.title === 'Cost Per Conversion Explained' && <CostPerConversion />}
                  {f.title === 'Maximizing Your Budget with Musi-Nova' && <MaximizingYourBudget />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </PageLayout>
  );
};

export default Faqs;
