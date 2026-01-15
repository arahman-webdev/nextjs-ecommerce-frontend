// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Shield,
  HelpCircle,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully!', {
        description: 'We will get back to you within 24 hours.',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: MailIcon,
      title: 'Email Address',
      details: ['mdarahman5645@gmail.com', 'support@yourecommerce.com'],
      color: 'text-blue-500 bg-blue-50',
      action: 'mailto:mdarahman5645@gmail.com'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Number',
      details: ['+88 01719617907', '+88 016XXXXXXXX'],
      color: 'text-green-500 bg-green-50',
      action: 'tel:+8801719617907'
    },
    {
      icon: MapPinIcon,
      title: 'Office Address',
      details: ['Dhaka, Bangladesh', 'Chittagong, Bangladesh'],
      color: 'text-red-500 bg-red-50',
      action: 'https://maps.google.com'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'],
      color: 'text-purple-500 bg-purple-50',
      action: null
    }
  ];

  const departments = [
    {
      title: 'Customer Support',
      description: 'For order issues, returns, and general inquiries',
      email: 'support@yourecommerce.com',
      response: 'Within 12 hours'
    },
    {
      title: 'Sales Department',
      description: 'For bulk orders and business inquiries',
      email: 'sales@yourecommerce.com',
      response: 'Within 24 hours'
    },
    {
      title: 'Technical Support',
      description: 'For website issues and technical problems',
      email: 'tech@yourecommerce.com',
      response: 'Within 6 hours'
    }
  ];

  const faqs = [
    {
      question: 'What are your shipping options?',
      answer: 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Free shipping on orders over $50.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order from your account dashboard.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns for most items. Items must be in original condition with tags attached. Contact our support team to initiate a return.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 mb-6">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We're Here to <span className="text-[#83B734]">Help</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Have questions or need assistance? Our team is ready to provide you with the support you need.
            </p>
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#83B734]" />
                <span>24/7 Support</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#83B734]" />
                <span>Secure Communication</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#83B734]" />
                <span>Quick Response</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Send Us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83B734] focus:border-transparent transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83B734] focus:border-transparent transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83B734] focus:border-transparent transition-colors"
                      placeholder="+880 1719 617907"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83B734] focus:border-transparent transition-colors bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="return">Return & Refund</option>
                      <option value="product">Product Question</option>
                      <option value="technical">Technical Support</option>
                      <option value="business">Business Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83B734] focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-[#83B734]" />
                    <span>Your information is secure and private</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2",
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#83B734] text-white hover:bg-[#6F9D2D] transform hover:-translate-y-0.5"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="h-6 w-6 text-[#83B734]" />
                <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                    <Link
                      href="/faq"
                      className="inline-flex items-center gap-1 text-[#83B734] text-sm font-medium mt-4 hover:gap-2 transition-all"
                    >
                      Learn more
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
              
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.action || '#'}
                  target={info.action ? '_blank' : '_self'}
                  rel={info.action ? 'noopener noreferrer' : ''}
                  className={cn(
                    "block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all",
                    info.action && "hover:border-[#83B734]"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${info.color.split(' ')[1]}`}>
                      <info.icon className={`h-6 w-6 ${info.color.split(' ')[0]}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{info.title}</h4>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Departments */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact by Department</h3>
              
              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{dept.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                    <div className="flex items-center justify-between">
                      <a
                        href={`mailto:${dept.email}`}
                        className="text-[#83B734] text-sm font-medium hover:underline"
                      >
                        {dept.email}
                      </a>
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                        {dept.response}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Us</h3>
              
              <div className="flex gap-4 mb-6">
                <a
                  href="#"
                  className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center hover:bg-blue-200 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
              
              <p className="text-sm text-gray-600">
                Follow us on social media for updates, promotions, and more!
              </p>
            </div>

          </div>
        </div>
      </div>

      

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Need Immediate Assistance?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Our dedicated support team is just a call or click away
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:+8801719617907"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#83B734] text-white rounded-lg hover:bg-[#6F9D2D] transition-all transform hover:-translate-y-0.5 font-semibold"
              >
                <Phone className="h-5 w-5" />
                Call Now: +88 01719617907
              </a>
              <a
                href="mailto:mdarahman5645@gmail.com"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold border border-gray-700"
              >
                <Mail className="h-5 w-5" />
                Email Us Now
              </a>
            </div>
            
            <p className="mt-8 text-gray-400 text-sm">
              Average response time: Less than 2 hours during business hours
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}