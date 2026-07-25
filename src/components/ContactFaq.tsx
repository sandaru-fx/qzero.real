'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { lifestyleImages } from '@/data/lifestyle';

const faqs = [
  {
    question: 'How quickly will you respond to my inquiry?',
    answer:
      'We typically reply within a few business hours during operating times. For urgent vehicle or import questions, WhatsApp or a direct call reaches our concierge team fastest.',
  },
  {
    question: 'Can I visit the showroom with my family?',
    answer:
      'Absolutely. Our Habarakada showroom is set up for a calm, personal viewing experience — bring your family, take your time, and we’ll walk you through options without pressure.',
  },
  {
    question: 'Do you help with vehicle imports as well as showroom stock?',
    answer:
      'Yes. We handle both ready showroom vehicles and personal / commercial import requests — sourcing, documentation guidance, and handover support from inquiry to delivery.',
  },
  {
    question: 'What should I prepare before contacting you?',
    answer:
      'A preferred budget, body type or model, and whether you want showroom stock or an import is enough to start. If you already have a vehicle in mind, share the link or details and we’ll advise next steps.',
  },
  {
    question: 'Are appointments required?',
    answer:
      'Walk-ins are welcome during operating hours. For a dedicated consultation or after-hours visit, message us and we’ll arrange a time that suits you.',
  },
];

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden border-t border-white/5">
      {/* Footer-style lifestyle wash */}
      <div className="footer-bg-mask pointer-events-none absolute inset-y-0 left-0 z-0 w-full max-w-3xl sm:w-[55%] lg:w-[48%]">
        <Image
          src={lifestyleImages.contactFaq}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 48vw"
          className="object-cover object-[center_45%] opacity-80 sm:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,rgba(212,175,55,0.12),transparent_55%)]" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_85%_30%,rgba(212,175,55,0.05),transparent_40%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-9 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:items-start">
          <div className="max-w-md">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">FAQ</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Answers before you reach out
            </h2>
            <p className="type-muted mt-4">
              Quick clarity on visits, response times, and how we support showroom and import
              clients — so you can contact us with confidence.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
                    isOpen
                      ? 'border-brand-gold/35 bg-black/55'
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  } backdrop-blur-sm`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-bold text-white sm:text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-brand-gold transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="type-muted px-5 pb-5 sm:px-6 sm:pb-6">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
