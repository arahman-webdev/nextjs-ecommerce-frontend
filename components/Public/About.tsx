// app/about/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CheckCircle, 
  Truck, 
  Shield, 
  Heart, 
  Award, 
  Users, 
  Globe, 
  ShoppingBag,
  Package,
  Clock,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronRight,
  Sparkles,
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function About() {
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: Users },
    { number: '50+', label: 'Brands', icon: ShoppingBag },
    { number: '24/7', label: 'Support', icon: Clock },
    { number: '4.8/5', label: 'Average Rating', icon: Star },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority. We listen, adapt, and exceed expectations.',
      color: 'text-red-500 bg-red-50'
    },
    {
      icon: Shield,
      title: 'Trust & Quality',
      description: 'Every product is verified for quality and authenticity before it reaches you.',
      color: 'text-blue-500 bg-blue-50'
    },
    {
      icon: Globe,
      title: 'Sustainable Shopping',
      description: 'Committed to eco-friendly practices and sustainable packaging.',
      color: 'text-green-500 bg-green-50'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Striving for excellence in every transaction and customer interaction.',
      color: 'text-purple-500 bg-purple-50'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/team/ceo.jpg',
      bio: '15+ years in ecommerce and retail management',
      social: ['linkedin', 'twitter']
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: '/team/operations.jpg',
      bio: 'Supply chain expert with global experience',
      social: ['linkedin']
    },
    {
      name: 'Emma Rodriguez',
      role: 'Customer Experience',
      image: '/team/customer.jpg',
      bio: 'Passionate about creating seamless shopping journeys',
      social: ['linkedin', 'instagram']
    },
    {
      name: 'David Park',
      role: 'Tech Lead',
      image: '/team/tech.jpg',
      bio: 'Building the future of online shopping',
      social: ['linkedin', 'github']
    }
  ];

  const milestones = [
    { year: '2020', title: 'Founded', description: 'Started with a small team and big dreams' },
    { year: '2021', title: '10k Customers', description: 'Reached our first major milestone' },
    { year: '2022', title: 'Mobile App Launch', description: 'Expanded to mobile platforms' },
    { year: '2023', title: 'Sustainability Initiative', description: 'Launched eco-friendly packaging' },
    { year: '2024', title: 'Global Expansion', description: 'Started international shipping' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Since 2020</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              More Than Just a Store
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              We're building the future of online shopping — one happy customer at a time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 font-semibold"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white rounded-full hover:bg-white/10 transition-all"
              >
                Our Story
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Banner */}
        <div className="relative z-20 -mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to becoming a trusted name in ecommerce
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
            
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={cn(
                  "mb-16 flex items-center",
                  index % 2 === 0 ? "flex-row-reverse" : ""
                )}
              >
                <div className="w-1/2 px-8">
                  <div className={cn(
                    "bg-white p-6 rounded-2xl shadow-lg border border-gray-200",
                    index % 2 === 0 ? "text-right" : ""
                  )}>
                    <div className="text-sm font-semibold text-blue-600 mb-1">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 mb-6">
                <Leaf className="h-4 w-4" />
                <span className="text-sm font-medium">Our Mission</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Making Online Shopping <span className="text-blue-600">Better</span> for Everyone
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We believe shopping should be effortless, enjoyable, and trustworthy. Our mission 
                is to create a seamless online shopping experience that connects people with quality 
                products while supporting sustainable practices.
              </p>
              
              <div className="space-y-4">
                {[
                  "Curated selection of quality products",
                  "Fast and reliable delivery worldwide",
                  "Exceptional customer support 24/7",
                  "Sustainable packaging and practices"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                {/* Replace with your image */}
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <ShoppingBag className="h-32 w-32 text-white/80" />
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold text-gray-900">99.8%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200"
                >
                  <div className={`w-16 h-16 rounded-xl ${value.color.split(' ')[1]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${value.color.split(' ')[0]}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


    </div>
  );
}