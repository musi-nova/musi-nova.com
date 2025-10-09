import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';

const PaymentCreditsPage: React.FC = () => {
  const [creditsAmount, setCreditsAmount] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const calculateBreakdown = (amount: number) => {
    const musiNovaFee = amount <= 100 ? parseFloat((amount * 0.45).toFixed(2)) : parseFloat((amount * 0.35).toFixed(2));
    const adSpend = amount <= 100 ? parseFloat((amount * 0.55).toFixed(2)) : parseFloat((amount * 0.65).toFixed(2));
    return {
      musiNovaFee,
      adSpend,
      totalCharge: amount,
    };
  };

  const handleBack = () => navigate('/submissions');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        paymentType: 'credits',
        creditsAmount,
      };

      const response = await apiFetch('stripe/create-checkout-session/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');
      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert('An error occurred while processing your payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breakdown = calculateBreakdown(creditsAmount);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Buy Credits</h2>

            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Credits</label>
                  <span className="text-lg font-bold text-musinova-green">{creditsAmount} credits</span>
                </div>

                <Slider
                  defaultValue={[creditsAmount]}
                  max={100}
                  min={5}
                  step={1}
                  onValueChange={(values) => setCreditsAmount(values[0])}
                  className="my-4"
                />

                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 credits</span>
                  <span>100 credits</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="flex justify-between font-bold">
                <span>Total Charge:</span>
                <span>${breakdown.totalCharge.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft size={16} className="mr-2" /> Back
                </Button>

                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Buy Credits <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCreditsPage;
