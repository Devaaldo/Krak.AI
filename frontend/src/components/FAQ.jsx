import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "How does Krak.AI detect structural cracks?",
    answer: "Krak.AI uses advanced computer vision and extremely deep neural networks (MobileNetV2 combined with Wavelet Transforms) to analyze surface textures and highlight micro-fractures in real-time."
  },
  {
    question: "Is my structural data secure and private?",
    answer: "Yes. All video feeds and images are processed completely on the edge or within your private network. We do not store any sensitive infrastructural data on public clouds."
  },
  {
    question: "How accurate are the predictive maintenance assessments?",
    answer: "Our models have achieved over 99% accuracy in controlled trials, effectively identifying millimeter-scale degradation before it becomes visible to the naked eye."
  },
  {
    question: "Can Krak.AI replace human structural engineers?",
    answer: "No. Krak.AI is an assistive tool designed to augment human inspectors, severely cutting down inspection time and providing highly precise data to inform expert engineering decisions."
  },
  {
    question: "Can I use existing drone or CCTV footage?",
    answer: "Absolutely. Our batch import feature allows you to upload gigabytes of pre-recorded drone surveys or static photographs for rapid, comprehensive batch analysis."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Frequently Asked Questions</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
          Everything you need to know about Krak.AI's structural analysis and predictive risk assessment.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {faqData.map((faq, index) => {
          const isActive = activeIndex === index;
          return (
            <div key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', padding: '1.5rem 0', cursor: 'pointer', textAlign: 'left',
                  fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-main)', fontFamily: 'inherit'
                }}
              >
                {faq.question}
                <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={20} color="var(--text-muted)" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ paddingBottom: '1.5rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>Still have questions? Our support team is here to help.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn-outline" style={{ background: 'transparent', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600 }}>Contact Support</button>
          <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600 }}>View Resources</button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
