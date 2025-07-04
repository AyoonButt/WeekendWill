'use client';

import React, { useState } from 'react';
import { StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui';

const TestimonialSection: React.FC = () => {
  const [currentTestimonialSet, setCurrentTestimonialSet] = useState(0);
  
  const testimonials = [
    {
      rating: 5,
      text: "Weekend Will made creating my will so simple! I was able to complete everything in about 20 minutes during my lunch break. The process was intuitive and I felt confident that everything was legally sound.",
      name: "Emily R."
    },
    {
      rating: 5,
      text: "As someone who had been putting off estate planning for years, Weekend Will finally got me to take action. The step-by-step guidance made it feel less overwhelming, and I love that I can update it anytime.",
      name: "Jon I."
    },
    {
      rating: 5,
      text: "I was impressed by how thorough the questionnaire was while still being easy to follow. The final document looked just as professional as what I would have gotten from a lawyer, but at a fraction of the cost.",
      name: "Jessica T."
    },
    {
      rating: 5,
      text: "The peace of mind I have now is invaluable. Weekend Will helped me protect my family's future, and the whole process was surprisingly straightforward. I've already recommended it to several friends.",
      name: "Sarah K."
    },
    {
      rating: 5,
      text: "I appreciated the clear explanations throughout the process. Even complex legal concepts were broken down in a way that made sense. The customer support was also excellent when I had questions.",
      name: "David L."
    }
  ];

  const testimonialsPerSet = 3;
  const totalSets = Math.ceil(testimonials.length / testimonialsPerSet);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-charcoal-600">
            Join thousands of families who have secured their future with Weekend Will.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials
              .slice(currentTestimonialSet * testimonialsPerSet, (currentTestimonialSet + 1) * testimonialsPerSet)
              .map((testimonial, index) => (
              <Card key={`${currentTestimonialSet}-${index}`} className="p-8 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-charcoal-700 mb-6 text-lg leading-relaxed flex-grow">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>
                <div className="flex items-center mt-auto">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <UserGroupIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="font-semibold text-charcoal-900">
                    {testimonial.name}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows */}
          {currentTestimonialSet > 0 && (
            <div
              onClick={() => setCurrentTestimonialSet((prev) => prev - 1)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 bg-white shadow-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer"
              aria-label="Previous testimonials"
            >
              <svg className="w-4 h-4 text-charcoal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          )}
          
          {currentTestimonialSet < totalSets - 1 && (
            <div
              onClick={() => setCurrentTestimonialSet((prev) => prev + 1)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 bg-white shadow-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer"
              aria-label="Next testimonials"
            >
              <svg className="w-4 h-4 text-charcoal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}

          {/* Dots indicator */}
          {totalSets > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(totalSets)].map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentTestimonialSet(index)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ${
                    index === currentTestimonialSet 
                      ? 'bg-primary-600 w-4' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial set ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;