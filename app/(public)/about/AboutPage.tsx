import React from 'react';
import { PublicLayout } from '@/components/layout';
import { 
  HeartIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: HeartIcon,
      title: 'Family First',
      description: 'We believe every family deserves protection and peace of mind, regardless of their financial situation.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Legal Compliance',
      description: 'All our documents are attorney-reviewed and state-compliant to ensure your will is legally valid.'
    },
    {
      icon: LightBulbIcon,
      title: 'Simple Technology',
      description: 'We use AI and modern design to make complex legal processes simple and accessible to everyone.'
    },
    {
      icon: UsersIcon,
      title: 'Expert Support',
      description: 'Our team of legal experts and customer support specialists are here to help you every step of the way.'
    }
  ];

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal-900">
            About Weekend Will
          </h1>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            We&apos;re on a mission to make estate planning accessible, affordable, and easy for everyone. 
            Your family&apos;s future shouldn&apos;t wait for the perfect moment.
          </p>
        </div>

        {/* Philosophy Section */}
        <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-6">Our Philosophy</h2>
          <div className="prose prose-lg text-charcoal-700 max-w-none">
            <p className="text-xl font-medium text-charcoal-800 mb-6">
              We Believe The Decision To Write Your Last Will And Testament Is, At Its Core, An Act Of Love.
            </p>
            <p>
              Everyone should have the means to express that love, so we designed a step-by-step guide to 
              walk you through the process of completing your will in a convenient and affordable way.
            </p>
          </div>
        </div>

        {/* Why It's Important Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-charcoal-900 mb-6">Why It&apos;s Important</h2>
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-800 mb-3">
                  More Than 50% of Adults Are Left Without A Will
                </h3>
                <p className="text-red-700">
                  You have worked hard for your home and possessions and not having a last will and testament 
                  when you pass means you relinquish control of your estate to a stranger. A set of pre-determined 
                  laws dictate what happens to your property and your children.
                </p>
              </div>
              <p className="text-charcoal-700 text-lg">
                A will is a statement of your directives, such as who will care for your minor children or 
                manage your estate. A will speaks for you when you cannot and protects your family and those 
                you care about from potential stress, confusion and financial losses that arise from not having one.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="/about.png" 
              alt="Weekend Will - Estate Planning" 
              width={400}
              height={300}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Founder Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">Meet Our Founder</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Video */}
              <div className="order-2 lg:order-1">
                <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-100">
                  <video 
                    controls 
                    preload="none"
                    className="w-full h-auto"
                  >
                    <source src="/founder_edited-CNqD_KkE.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              
              {/* Content */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h3 className="text-2xl font-bold text-primary-600 mb-2">Brooke Hipps</h3>
                <p className="text-charcoal-600 mb-6">Fort Worth, Texas</p>
                <div className="prose prose-lg text-charcoal-700 max-w-none">
                  <p>
                    I&apos;m Brooke Hipps from Fort Worth, Texas and I thank you for reading my company story. 
                    I am the founder of Weekend Will, a software that creates, manages, and stores a person&apos;s 
                    last will and testament.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h2 className="text-3xl font-bold text-charcoal-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-charcoal-600">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-charcoal-900 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Making a Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">10,000+</div>
              <div className="text-white">Families Protected</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-400 mb-2">50</div>
              <div className="text-white">States Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">15 min</div>
              <div className="text-white">Average Completion Time</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-6">Legal Expertise You Can Trust</h2>
          <p className="text-lg text-charcoal-600 max-w-3xl mx-auto mb-8">
            Our legal team consists of experienced estate planning attorneys who review every template 
            and ensure compliance with state laws. Your documents are backed by real legal expertise.
          </p>
          <div className="bg-success-50 border border-success-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ShieldCheckIcon className="w-5 h-5 text-success-600" />
              <span className="font-semibold text-success-800">Attorney Reviewed</span>
            </div>
            <p className="text-success-700 text-sm">
              All templates reviewed by licensed estate planning attorneys and updated regularly 
              to reflect current state laws.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;