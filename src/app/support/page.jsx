'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to submit support ticket
    console.log('Support request:', formData);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600">
            We're here to help you get the most out of Nexora CRM
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="text-blue-600 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-gray-600 text-sm mb-4">
              Browse our comprehensive guides and tutorials
            </p>
            <a href="#" className="text-blue-600 hover:underline text-sm font-medium">
              View Docs →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="text-blue-600 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-gray-600 text-sm mb-4">Find answers to commonly asked questions</p>
            <a href="#faq" className="text-blue-600 hover:underline text-sm font-medium">
              View FAQ →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="text-blue-600 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-gray-600 text-sm mb-4">Reach out to our support team directly</p>
            <a href="#contact" className="text-blue-600 hover:underline text-sm font-medium">
              Get in Touch →
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12" id="contact">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Support Request</h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <svg
                className="w-16 h-16 text-green-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Request Submitted!</h3>
              <p className="text-green-700 mb-4">
                We've received your support request and will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-blue-600 hover:underline font-medium"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="account">Account Issue</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
            </form>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12" id="faq">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I get started with Nexora CRM?
              </h3>
              <p className="text-gray-700">
                Sign up for a free account at{' '}
                <a href="https://nexoraos.pro" className="text-blue-600 hover:underline">
                  nexoraos.pro
                </a>
                . Our onboarding wizard will guide you through setting up your workspace, importing
                contacts, and connecting your communication channels.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What channels can I connect to Nexora?
              </h3>
              <p className="text-gray-700">
                Nexora supports Email (Gmail, Outlook, SMTP), WhatsApp Business (via MSG91), SMS,
                Voice calls, and social media platforms (Facebook, Instagram, LinkedIn, Twitter,
                TikTok, YouTube).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I import my existing contacts?
              </h3>
              <p className="text-gray-700">
                Go to CRM → Contacts → Import. You can upload a CSV file with your contact data. We
                support standard formats and provide a template to help you format your data
                correctly.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my data secure in Nexora?
              </h3>
              <p className="text-gray-700">
                Yes! We use industry-standard encryption (HTTPS/TLS for transit, AES-256 for
                storage), role-based access controls, and regular backups. See our{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I connect multiple WhatsApp numbers?
              </h3>
              <p className="text-gray-700">
                Yes! You can connect multiple WhatsApp Business accounts. Each account is managed
                separately in Settings → Channels → WhatsApp.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does billing work?</h3>
              <p className="text-gray-700">
                Nexora offers subscription-based pricing with monthly or annual billing. You can
                upgrade, downgrade, or cancel anytime. Communication channels (WhatsApp, SMS, Voice)
                use a prepaid wallet system.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I cancel my account?
              </h3>
              <p className="text-gray-700">
                You can export all your data before cancellation. After cancellation, your data is
                retained for 90 days (in case you change your mind), then permanently deleted.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer a free trial?
              </h3>
              <p className="text-gray-700">
                Yes! We offer a 14-day free trial with full access to all features. No credit card
                required to start.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Support</h3>
              <p className="text-gray-700 mb-2">
                <strong>General Support:</strong>{' '}
                <a href="mailto:support@nexoraos.pro" className="text-blue-600 hover:underline">
                  support@nexoraos.pro
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Technical Issues:</strong>{' '}
                <a href="mailto:tech@nexoraos.pro" className="text-blue-600 hover:underline">
                  tech@nexoraos.pro
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Billing:</strong>{' '}
                <a href="mailto:billing@nexoraos.pro" className="text-blue-600 hover:underline">
                  billing@nexoraos.pro
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Privacy:</strong>{' '}
                <a href="mailto:privacy@nexoraos.pro" className="text-blue-600 hover:underline">
                  privacy@nexoraos.pro
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Times</h3>
              <p className="text-gray-700 mb-2">
                <strong>General Inquiries:</strong> Within 24 hours
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Technical Issues:</strong> Within 12 hours
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Critical Bugs:</strong> Within 4 hours
              </p>
              <p className="text-gray-700">
                <strong>Privacy Requests:</strong> Within 30 days (GDPR requirement)
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
            <p className="text-gray-700 mb-2">
              <strong>Company:</strong> 72orionx Pvt Ltd
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Product Website:</strong>{' '}
              <a href="https://72orionx.com" className="text-blue-600 hover:underline">
                https://72orionx.com
              </a>
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> India
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-4">
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            {' | '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
            {' | '}
            <a href="/data-deletion" className="text-blue-600 hover:underline">
              Data Deletion
            </a>
          </p>
          <p>© 2026 72orionx Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
