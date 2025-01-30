import { ResumeTemplate } from './types';

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'A clean and straightforward design perfect for traditional industries',
    preview: '/templates/minimal-clean.png',
    category: 'Professional',
    template: `
      <div class="max-w-4xl mx-auto p-8">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <header class="mb-8 text-center">
            <h1 class="font-heading text-4xl font-bold text-gray-800 mb-2">[Your Name]</h1>
            <p class="font-body text-lg text-gray-600 mb-4">[Professional Title]</p>
            <div class="flex justify-center gap-6 text-sm text-gray-600">
              <span>[email@example.com]</span>
              <span>[Phone]</span>
              <span>[Location]</span>
            </div>
          </header>
          <main class="space-y-6">
            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-800 mb-3 pb-2 border-b">Summary</h2>
              <p class="font-body text-gray-600">[Your professional summary]</p>
            </section>
            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-800 mb-3 pb-2 border-b">Experience</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="font-heading font-semibold text-gray-800">[Company Name]</h3>
                  <p class="text-gray-600 text-sm">[Position] • [Dates]</p>
                  <ul class="mt-2 list-disc list-inside text-gray-600">
                    <li>[Achievement]</li>
                    <li>[Achievement]</li>
                  </ul>
                </div>
              </div>
            </section>
            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-800 mb-3 pb-2 border-b">Education</h2>
              <div>
                <h3 class="font-heading font-semibold text-gray-800">[Degree]</h3>
                <p class="text-gray-600">[Institution] • [Year]</p>
              </div>
            </section>
            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-800 mb-3 pb-2 border-b">Skills</h2>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">[Skill 1]</span>
                <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">[Skill 2]</span>
                <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">[Skill 3]</span>
              </div>
            </section>
          </main>
        </div>
      </div>
    `
  },
  {
    id: 'creative-burst',
    name: 'Creative Burst',
    description: 'A vibrant and modern design for creative professionals',
    preview: '/templates/creative-burst.png',
    category: 'Creative',
    template: `
      <div class="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 to-purple-100">
        <div class="bg-white rounded-2xl shadow-2xl p-10 border-4 border-blue-500">
          <header class="mb-8 text-center relative">
            <div class="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-500 rounded-full"></div>
            <h1 class="font-heading text-4xl font-bold text-blue-900 mb-2 pt-16">[Your Name]</h1>
            <p class="font-body text-lg text-blue-700 mb-4">[Professional Title]</p>
            <div class="flex justify-center gap-6 text-sm text-blue-600">
              <span>[email@example.com]</span>
              <span>[Phone]</span>
              <span>[Location]</span>
            </div>
          </header>
          <main class="space-y-6">
            <section class="bg-blue-50 p-4 rounded-lg">
              <h2 class="font-heading text-2xl font-semibold text-blue-900 mb-3 pb-2 border-b border-blue-300">Summary</h2>
              <p class="font-body text-blue-800">[Your professional summary]</p>
            </section>
            <section class="bg-purple-50 p-4 rounded-lg">
              <h2 class="font-heading text-2xl font-semibold text-purple-900 mb-3 pb-2 border-b border-purple-300">Experience</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="font-heading font-semibold text-purple-800">[Company Name]</h3>
                  <p class="text-purple-600 text-sm">[Position] • [Dates]</p>
                  <ul class="mt-2 list-disc list-inside text-purple-700">
                    <li>[Achievement]</li>
                    <li>[Achievement]</li>
                  </ul>
                </div>
              </div>
            </section>
            <section class="bg-green-50 p-4 rounded-lg">
              <h2 class="font-heading text-2xl font-semibold text-green-900 mb-3 pb-2 border-b border-green-300">Education</h2>
              <div>
                <h3 class="font-heading font-semibold text-green-800">[Degree]</h3>
                <p class="text-green-600">[Institution] • [Year]</p>
              </div>
            </section>
            <section class="bg-indigo-50 p-4 rounded-lg">
              <h2 class="font-heading text-2xl font-semibold text-indigo-900 mb-3 pb-2 border-b border-indigo-300">Skills</h2>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm">[Skill 1]</span>
                <span class="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm">[Skill 2]</span>
                <span class="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm">[Skill 3]</span>
              </div>
            </section>
          </main>
        </div>
      </div>
    `
  },
  {
    id: 'corporate-elegance',
    name: 'Corporate Elegance',
    description: 'A sleek and professional design for corporate executives',
    preview: '/templates/corporate-elegance.png',
    category: 'Professional',
    template: `
      <div class="max-w-4xl mx-auto p-8 bg-gray-100">
        <div class="bg-white rounded-lg shadow-xl p-10 border-l-8 border-gray-800">
          <header class="mb-8 border-b-2 border-gray-300 pb-4">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="font-heading text-4xl font-bold text-gray-900 mb-2">[Your Name]</h1>
                <p class="font-body text-lg text-gray-700 mb-2">[Professional Title]</p>
              </div>
              <div class="text-right text-sm text-gray-600">
                <p>[email@example.com]</p>
                <p>[Phone]</p>
                <p>[Location]</p>
              </div>
            </div>
          </header>
          <main class="space-y-6">
            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">Summary</h2>
              <p class="font-body text-gray-700 italic">[Your professional summary]</p>
            </section>
            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">Experience</h2>
              <div class="space-y-4">
                <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gray-300">
                  <h3 class="font-heading font-semibold text-gray-800">[Company Name]</h3>
                  <p class="text-gray-600 text-sm">[Position] • [Dates]</p>
                  <ul class="mt-2 list-disc list-inside text-gray-700">
                    <li>[Achievement]</li>
                    <li>[Achievement]</li>
                  </ul>
                </div>
              </div>
            </section>
            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">Education</h2>
              <div>
                <h3 class="font-heading font-semibold text-gray-800">[Degree]</h3>
                <p class="text-gray-600">[Institution] • [Year]</p>
              </div>
            </section>
            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">Skills</h2>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">[Skill 1]</span>
                <span class="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">[Skill 2]</span>
                <span class="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">[Skill 3]</span>
              </div>
            </section>
          </main>
        </div>
      </div>
    `
  }
];