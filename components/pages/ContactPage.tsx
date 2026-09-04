'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { 
  Mail, Phone, MapPin, MessageCircle, CheckCircle, 
  Send, AlertCircle, HelpCircle, ChevronUp, ChevronDown 
} from 'lucide-react';
import { FAQS } from '@/data/mockData';
import { submitContact } from '@/lib/api';

interface ContactFormData {
  fullName: string;
  emailAddress: string;
  subjectTitle: string;
  messageBody: string;
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>();

  const onSubmitForm = async (data: ContactFormData) => {
    const res = await submitContact({
      fullName: data.fullName,
      emailAddress: data.emailAddress,
      subjectTitle: data.subjectTitle,
      messageBody: data.messageBody,
    });
    if (res.success) {
      setIsSubmitted(true);
      reset();
    } else {
      alert(res.error || 'Failed to send message. Please try again.');
    }
  };

  const contactDetails = [
    {
      icon: MapPin,
      title: 'Office',
      lines: ['ArtClick', 'Nr Infinity Park,', 'Vasna Bhayli Road,', 'Vadodara, Gujarat']
    },
    {
      icon: Phone,
      title: 'Phone',
      lines: ['+91 635 575 7852']
    },
    {
      icon: Mail,
      title: 'Email',
      lines: ['mailme@artclick.co.in', 'nivaan.artclick@gmail.com']
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      lines: ['+91 635 575 7852']
    }
  ];

  return (
    <div className="pt-20">
      {/* Contact Header */}
      <section className="bg-white dark:bg-gray-950 py-20 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="font-mono text-xs font-semibold tracking-widest text-brand-blue uppercase">
            COMMUNICATE DIRECTLY
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-gray-900 dark:text-white">
            Connect With ArtClick
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Need embroidery digitizing quotes, vector art conversion, or staffing support? Tell us what you are working on and we will recommend the right mix of services for your business.
          </p>
        </div>
      </section>

      {/* Main Grid Contact Card */}
      <section className="bg-white dark:bg-gray-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact Details Column */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8">
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                  Direct Inbound Desks
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Have urgent vector requirements or specific stitch format needs? Speak to us directly by phone, WhatsApp, or email and we will route your request to the right team.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
                {contactDetails.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-left space-y-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-brand-blue flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        {item.lines.map((line, lIdx) => (
                          <p key={lIdx}>{line}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Monochrome schematic office placeholder */}
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 h-52 relative group">
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-950 flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full opacity-60 dark:opacity-35 text-gray-400" viewBox="0 0 400 200" fill="none" stroke="currentColor" strokeWidth="1">
                    <line x1="0" y1="50" x2="400" y2="50" strokeWidth="2" />
                    <line x1="0" y1="120" x2="400" y2="120" strokeWidth="2" />
                    <line x1="0" y1="170" x2="400" y2="170" />
                    
                    <line x1="80" y1="0" x2="80" y2="200" strokeWidth="3" />
                    <line x1="220" y1="0" x2="220" y2="200" strokeWidth="2" />
                    <line x1="330" y1="0" x2="330" y2="200" />
                    
                    <path d="M0,0 Q120,80 300,200" strokeWidth="1" strokeDasharray="3 3" />
                    <rect x="250" y="20" width="60" height="40" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.2)" />
                  </svg>

                  <div className="absolute top-[120px] left-[220px] -translate-x-1/2 -translate-y-full flex flex-col items-center">
                    <div className="bg-black text-white dark:bg-white dark:text-black font-mono text-[9px] px-2 py-0.5 rounded shadow-lg mb-1 leading-none">
                      ARTCLICK OFFICE
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-brand-blue border-2 border-white dark:border-gray-950 shadow-md animate-bounce" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-950/90 border border-gray-100 dark:border-gray-800 rounded px-2 py-1 text-[9px] font-mono text-gray-500">
                  Vadodara, Gujarat
                </div>
              </div>
            </div>

            {/* Inbound Email Form Column */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-left h-full flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                      Inquire Online
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fill out the form below. For real project files and downloads, please use our primary Submit Project portal.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-8 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 text-center space-y-4"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto shadow-md">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">
                          Inquiry Dispatched Successfully!
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                          Thank you for connecting. Our lead designer will review your details and send our corporate pricing structures to your email shortly.
                        </p>
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="px-5 py-2 rounded bg-black hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Send Another Message
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5" id="contact-form">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              placeholder="e.g. Sarah Jenkins"
                              {...register('fullName', { required: 'Please enter your name.' })}
                              className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 bg-white dark:bg-gray-950 ${
                                errors.fullName 
                                  ? 'border-red-500 focus:ring-red-500' 
                                  : 'border-gray-200 dark:border-gray-800 focus:border-brand-blue focus:ring-brand-blue'
                              }`}
                            />
                            {errors.fullName && (
                              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.fullName.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="emailAddress"
                              placeholder="e.g. sarah@scribe.com"
                              {...register('emailAddress', { 
                                required: 'Please enter your email.',
                                pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email.' }
                              })}
                              className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 bg-white dark:bg-gray-950 ${
                                errors.emailAddress 
                                  ? 'border-red-500 focus:ring-red-500' 
                                  : 'border-gray-200 dark:border-gray-800 focus:border-brand-blue focus:ring-brand-blue'
                              }`}
                            />
                            {errors.emailAddress && (
                              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.emailAddress.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                            Subject Title
                          </label>
                          <input
                            type="text"
                            id="subjectTitle"
                            placeholder="e.g. High Volume Vector Quote"
                            {...register('subjectTitle', { required: 'Please specify a subject.' })}
                            className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 bg-white dark:bg-gray-950 ${
                              errors.subjectTitle 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 dark:border-gray-800 focus:border-brand-blue focus:ring-brand-blue'
                            }`}
                          />
                          {errors.subjectTitle && (
                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {errors.subjectTitle.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                            Message Body
                          </label>
                          <textarea
                            rows={5}
                            id="messageBody"
                            placeholder="Provide details about your query..."
                            {...register('messageBody', { required: 'Please input your message.' })}
                            className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 bg-white dark:bg-gray-950 ${
                              errors.messageBody 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 dark:border-gray-800 focus:border-brand-blue focus:ring-brand-blue'
                            }`}
                          />
                          {errors.messageBody && (
                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {errors.messageBody.message}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          id="submit-contact-btn"
                          className="w-full py-4.5 rounded-lg bg-black hover:bg-brand-blue text-white font-semibold text-sm transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <span>Delivering Message...</span>
                          ) : (
                            <>
                              <span>Dispatch Message</span>
                              <Send className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Area */}
      <section className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
              Contact Desk FAQ
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Immediate answers to standard communication procedures.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.slice(0, 3).map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-lg border border-gray-100 dark:border-gray-805 bg-white dark:bg-gray-950 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-display font-semibold text-gray-900 dark:text-white hover:text-brand-blue cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-50 dark:border-gray-900 pt-4 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
