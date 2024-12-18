import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Share2, Workflow } from 'lucide-react';
import Navbar from './Navbar';
import HeroSlider from './hero/HeroSlider';
import VideoLoop from './VideoLoop';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSlider />
        <VideoLoop />

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Transform Your Business with AI
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover how our intelligent assistants can streamline your workflow and enhance team collaboration.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Custom AI Assistants
                </h3>
                <p className="text-slate-600">
                  Create and customize AI assistants tailored to your specific business needs and workflows.
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Collaborative Conversations
                </h3>
                <p className="text-slate-600">
                  Share and track conversations across teams, ensuring knowledge retention and seamless collaboration.
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <Workflow className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Workato Integration
                </h3>
                <p className="text-slate-600">
                  Seamlessly integrate AI assistants into your automation pipelines with Workato support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join leading companies that have already enhanced their productivity with Solomon Assistants.
            </p>
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center group"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}