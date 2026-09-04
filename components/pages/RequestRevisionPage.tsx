'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { FileUp, Link2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { submitRevision } from '@/lib/api';

interface RevisionFormInputs {
  ticketId: string;
  email: string;
  clientName: string;
  revisionComments: string;
  additionalDetails: string;
  googleDriveLink: string;
}

export default function RequestRevisionPage({ prefillTicket = '' }: { prefillTicket?: string }) {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newRevisionId, setNewRevisionId] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm<RevisionFormInputs>({
    defaultValues: { ticketId: prefillTicket },
  });

  React.useEffect(() => {
    if (prefillTicket) setValue('ticketId', prefillTicket);
  }, [prefillTicket, setValue]);

  const onSubmit = async (data: RevisionFormInputs) => {
    const payload: Record<string, string> = {
      ticketId: data.ticketId.trim().toUpperCase(),
      email: data.email.trim(),
      clientName: data.clientName.trim(),
      revisionComments: data.revisionComments.trim(),
      additionalDetails: data.additionalDetails.trim(),
      googleDriveLink: data.googleDriveLink.trim(),
    };

    const res = await submitRevision(payload, fileToUpload);
    if (res.success && res.data) {
      setNewRevisionId(res.data.id);
      setSubmitSuccess(true);
      reset();
      setFileToUpload(null);
    } else {
      alert(res.error || 'Failed to submit revision request.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File exceeds 10MB. Please upload to Google Drive and paste the link below.');
        return;
      }
      setFileToUpload(file);
    }
  };

  return (
    <div className="pt-20">
      <section className="gradient-hero py-20 relative overflow-hidden border-b border-brand-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs font-semibold tracking-widest text-brand-accent uppercase">
              Revision Request Portal
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-none text-ink">
              Request a Revision
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
              Have your order ticket ID? Enter it with your email to link this revision. No ticket? Share your email and we will match it manually.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {submitSuccess ? (
              <motion.div
                key="revision-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 rounded-2xl border border-brand-secondary/30 bg-white shadow-xl text-center space-y-6 max-w-xl mx-auto"
              >
                <div className="w-14 h-14 rounded-full bg-brand-secondary text-white flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-display font-bold text-2xl text-ink">Revision Submitted!</h2>
                  <p className="text-sm font-mono text-brand-primary font-bold">REFERENCE: {newRevisionId}</p>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                    Our team will review your feedback and updated files. You will be contacted at the email provided.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-3 bg-brand-primary hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Revision
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="revision-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-brand-primary/10 rounded-2xl shadow-xl p-8 sm:p-12 text-left"
              >
                <div className="mb-10 space-y-2">
                  <div className="flex items-center gap-2 text-brand-accent">
                    <RefreshCw className="w-5 h-5" />
                    <h2 className="font-display font-bold text-2xl text-ink">Revision Details</h2>
                  </div>
                  <p className="text-sm text-gray-500">
                    Attach markup photos or share a Drive link with your revision notes.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                        Order Ticket ID (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="HAS-8107"
                        {...register('ticketId')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary uppercase"
                      />
                      <p className="text-[10px] text-gray-400">From your original submission confirmation</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        {...register('email', { required: 'Email is required.' })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1 ${
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">Your Name (optional)</label>
                    <input
                      type="text"
                      placeholder="Sarah Jenkins"
                      {...register('clientName')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">Revision Comments *</label>
                    <textarea
                      rows={4}
                      placeholder="Describe what needs to be changed..."
                      {...register('revisionComments', { required: 'Please describe the changes needed.' })}
                      className={`w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-1 ${
                        errors.revisionComments ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary'
                      }`}
                    />
                    {errors.revisionComments && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.revisionComments.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">Additional Details</label>
                    <textarea
                      rows={2}
                      placeholder="Any extra context for the design team..."
                      {...register('additionalDetails')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <FileUp className="w-3.5 h-3.5" /> Upload File (max 10MB)
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf,.zip,.ai,.eps,.psd"
                        onChange={handleFileChange}
                        className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-primary file:text-white file:font-medium hover:file:bg-indigo-700 cursor-pointer"
                      />
                      {fileToUpload && <p className="text-[10px] text-brand-secondary font-mono">{fileToUpload.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5" /> Google Drive / Dropbox Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        {...register('googleDriveLink')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 text-white font-display font-semibold text-sm transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Revision Request'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
