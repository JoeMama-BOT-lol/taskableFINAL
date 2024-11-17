import React from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { Mail, Sparkles, Shield, Zap } from 'lucide-react';

export default function SignInPrompt() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-900"></div>
      </div>

      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo Animation */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-[2rem] transform transition-all duration-300 hover:scale-110">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <Sparkles size={40} className="animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Taskable
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Your tasks, beautifully organized
            </p>
          </div>

          {/* Sign In Button */}
          <div className="space-y-6">
            <SignInButton mode="modal">
              <button className="w-full relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-gray-900 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Continue with Email
                  </span>
                </div>
              </button>
            </SignInButton>

            {/* Features Grid */}
            <div className="mt-16 grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border border-gray-100 dark:border-gray-700">
                <Zap className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instant sync across all your devices</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 border border-gray-100 dark:border-gray-700">
                <Shield className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Secure</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end encryption for your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Preview */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="relative w-full max-w-2xl">
          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

          {/* App Preview */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
            <div className="relative space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">Manage Tasks Effortlessly</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Organize, prioritize, and track your tasks</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">Real-time Sync</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Access your tasks from any device</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">Smart Organization</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Nested lists and priority management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}