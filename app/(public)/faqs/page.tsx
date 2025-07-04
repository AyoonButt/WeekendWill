import { Metadata } from 'next';
import Card from '@/components/ui/Card';
import { PublicPageContainer } from '@/components/layout';
import { 
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import FAQSection from './FAQSection';
import FAQSearch from './FAQSearch';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about creating your will, estate planning, and using Weekend Will.',
  openGraph: {
    title: 'FAQ - Weekend Will',
    description: 'Find answers to common questions about creating your will, estate planning, and using Weekend Will.',
  },
};

// Enable static generation for better performance
export const dynamic = 'force-static';
export const revalidate = 7200; // Revalidate every 2 hours

const faqData = {
  'Estate Planning Basics': [
    {
      question: 'What is estate planning?',
      answer: 'Estate planning means making a plan for how you want to divide your property after you pass away. Part of estate planning is pro-actively deciding who will be in charge of carrying out your affairs. Estate plan documents state how you want your property to be distributed after you die.\n\n— The Weekend Will Team',
    },
    {
      question: 'Why a Will?',
      answer: 'A will captures your intentions as to how your property should be distributed after you die, who should be the guardian of minor children and other important choices. A will can reduce stress and family conflict and streamline probate, which refers to the court process of distributing property to heirs upon death. A valid will avoids many of the problems that may arise from passing away without a will and allows a person to leave their property to the persons he or she desires.\n\n— The Weekend Will Team',
    },
    {
      question: 'What is passing away intestate?',
      answer: 'Passing away intestate means dying without a valid will in place. When this happens, your state\'s laws determine how your assets are distributed, which may not align with your wishes. This can lead to family disputes and complications in the probate process.\n\n— The Weekend Will Team',
    },
    {
      question: 'What is probate?',
      answer: 'It is the orderly process of winding up the business of person after they pass away. To probate a will it must be valid and established in court that it meets the requirements of execution.\n\n— The Weekend Will Team',
    },
  ],
  'Getting Started': [
    {
      question: 'What is Weekend Will and how does it work?',
      answer: 'Weekend Will is an online platform that guides you through creating a legally valid last will and testament. Our attorney-reviewed templates and step-by-step interview process make it easy to document your wishes and protect your family\'s future.',
    },
    {
      question: 'Do I need a lawyer to use Weekend Will?',
      answer: 'Nope — you don\'t need a lawyer to make a legally valid will with Weekend Will.\n\nWe\'ve designed the process to be simple and guided, so you can create a clear, valid will without needing legal expertise. That said, if you have a complex estate, business assets, or unique family circumstances, it\'s totally fine to bring in a lawyer to review your final will.\n\nFor most people, though, Weekend Will is all you need.\n\nHope that helps — feel free to ask us anything!\n\n— The Weekend Will Team',
    },
    {
      question: 'How long does it take to create a will?',
      answer: 'Most people complete their will in 15-30 minutes. You can save your progress and return anytime to finish or make updates.',
    },
    {
      question: 'Is my will legally valid?',
      answer: 'Great question — and super important.\n\nWills made with Weekend Will are legally valid as long as they\'re signed and witnessed according to the laws in your state. We guide you through the process step-by-step, including how to properly sign and store your will.\n\nIt\'s a good idea to follow those steps carefully, since a will isn\'t considered legally binding until it\'s finalized correctly. Let us know if you want help reviewing the signing steps — we\'re here for you!\n\n— The Weekend Will Team',
    },
  ],
  'Managing Your Will': [
    {
      question: 'Who carries out my will?',
      answer: 'An executor is a trusted person named to carry out your wishes and directives set forth in your will. The executor is approved by the court and has legal obligations and duties to the court and to those who receive property from the estate. If an executor acts improperly, he or she may be liable for any resulting damages and may be terminated by the court.\n\n— The Weekend Will Team',
    },
    {
      question: 'What if I need to change my will?',
      answer: 'Your will is only as good as your latest update. Have you purchased property, had a baby? These life changes mean that it is time to update your will. This is accomplished by an amendment (codicil) to modify your existing will.\n\n— The Weekend Will Team',
    },
    {
      question: 'What happens if I make a mistake?',
      answer: 'Mistakes happen — and the good news is, you can always update or redo your will with Weekend Will.\n\nWe let you make unlimited edits while you\'re working on it, and you can update your will anytime life changes (like getting married, having kids, or buying a house). Just remember: if you change your will, you\'ll need to sign and witness the new version for it to be valid.\n\nIf you\'re not sure whether something needs fixing, feel free to reach out. We\'re happy to help.\n\n— The Weekend Will Team',
    },
    {
      question: 'Why do I need to store my will?',
      answer: 'After execution it is important to safeguard the original copy so it is not lost, destroyed or manipulated. These events can result in complications in the probate court process.\n\n— The Weekend Will Team',
    },
  ],
  'Legal Requirements': [
    {
      question: 'What are the requirements for a valid will?',
      answer: 'Requirements vary by state, but generally include: being 18+ years old, being of sound mind, having the will in writing, signing the will, and having it witnessed by two people who are not beneficiaries.',
    },
    {
      question: 'Do I need witnesses or notarization?',
      answer: 'Most states require two witnesses who are not beneficiaries. Some states also require notarization. Our platform will guide you through your state\'s specific requirements.',
    },
    {
      question: 'Can I make changes to my will after it\'s completed?',
      answer: 'Yes, you can update your will anytime through our platform. We recommend reviewing and updating your will every 3-5 years or after major life events like marriage, divorce, or having children.',
    },
    {
      question: 'What happens if I don\'t have a will?',
      answer: 'If you die without a will (intestate), your state\'s laws determine how your assets are distributed, which may not align with your wishes. Having a will ensures your specific desires are followed.',
    },
  ],
  'Using the Platform': [
    {
      question: 'Can I save my progress and continue later?',
      answer: 'Yes, your progress is automatically saved as you complete each section. You can log in anytime to continue where you left off.',
    },
    {
      question: 'What information do I need to get started?',
      answer: 'You\'ll need: personal information, details about your assets and debts, names and contact information for beneficiaries, and information about potential executors and guardians.',
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Absolutely. We use bank-level encryption to protect your data, and we never share your personal information with third parties. Your privacy and security are our top priorities.',
    },
    {
      question: 'Can I download or print my will?',
      answer: 'Yes, once completed, you can download your will as a PDF and print it for execution. We also provide signing instructions specific to your state.',
    },
  ],
  'Pricing & Plans': [
    {
      question: 'How much does it cost to create a will?',
      answer: 'Our Essential Will package costs $39 for a one-time payment. This includes your will, signing instructions, and basic updates. We also offer an Unlimited package for $89/year with additional features.',
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No hidden fees. The price you see is the price you pay. There are no additional charges for downloading, printing, or basic updates to your will.',
    },
    {
      question: 'What\'s included in each plan?',
      answer: 'Essential ($39): Basic will, signing instructions, and email support. Unlimited ($89/year): Everything in Essential plus unlimited updates, advanced estate planning tools, and priority support.',
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes, we offer a 60-day money-back guarantee. If you\'re not completely satisfied with your will, contact us for a full refund.',
    },
  ],
  'Technical Support': [
    {
      question: 'What browsers are supported?',
      answer: 'Weekend Will works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.',
    },
    {
      question: 'Can I use Weekend Will on my mobile device?',
      answer: 'Yes, our platform is fully responsive and works on smartphones and tablets. However, for the best experience when creating your will, we recommend using a desktop or laptop computer.',
    },
    {
      question: 'What if I encounter technical issues?',
      answer: 'Our support team is available to help with any technical issues. You can contact us via email, phone, or live chat during business hours.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click the "Forgot Password" link on the login page and enter your email address. We\'ll send you instructions to reset your password.',
    },
  ],
};

export default function FAQPage() {
  return (
    <PublicPageContainer>
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <QuestionMarkCircleIcon className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-charcoal-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto mb-8">
              Find answers to common questions about creating your will, estate planning, 
              and using our platform. Can&apos;t find what you&apos;re looking for? Contact our support team.
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <FAQSearch />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {Object.entries(faqData).map(([category, questions]) => (
            <FAQSection
              key={category}
              title={category}
              questions={questions}
            />
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-12">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-charcoal-600 mb-6 max-w-2xl mx-auto">
              Our estate planning experts are here to help. Get personalized answers 
              to your specific questions about will creation and estate planning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="tel:1-800-WEEKEND"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-charcoal-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Call Us
              </a>
            </div>
          </div>
        </Card>
      </div>
    </PublicPageContainer>
  );
}