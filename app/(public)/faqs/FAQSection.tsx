'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { 
  ChevronDownIcon,
  ChevronUpIcon 
} from '@heroicons/react/24/outline';

interface Question {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  questions: Question[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ title, questions }) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal-900 mb-6">
        {title}
      </h2>
      
      <div className="space-y-4">
        {questions.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-charcoal-900 pr-4">
                  {item.question}
                </h3>
                {expandedItems.has(index) ? (
                  <ChevronUpIcon className="w-5 h-5 text-charcoal-600 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-charcoal-600 flex-shrink-0" />
                )}
              </div>
            </button>
            
            {expandedItems.has(index) && (
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-charcoal-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;