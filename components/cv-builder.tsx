"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Layout, LayoutTemplate } from "lucide-react"
import dynamic from 'next/dynamic'
import { ResumeQuestion, RESUME_QUESTIONS } from './types'
import { TemplateMarketplace } from './template-marketplace'
import { RESUME_TEMPLATES } from './templates'

// Dynamically import html2pdf with no SSR
const html2pdf = dynamic(() => import('html2pdf.js'), {
  ssr: false,
})

interface FontPair {
  heading: string;
  body: string;
}

const FONT_PAIRS: { [key: string]: FontPair } = {
  modern: {
    heading: 'Raleway',
    body: 'Open Sans'
  },
  professional: {
    heading: 'Lato',
    body: 'Roboto'
  },
  elegant: {
    heading: 'Playfair Display',
    body: 'Source Sans Pro'
  },
  minimal: {
    heading: 'Montserrat',
    body: 'Inter'
  },
  creative: {
    heading: 'Poppins',
    body: 'Work Sans'
  }
}

export default function CVBuilder() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const [selectedTemplate, setSelectedTemplate] = useState(RESUME_TEMPLATES[0].id)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

  const getCurrentHtml = () => {
    if (iframeRef.current?.contentDocument?.body) {
      return iframeRef.current.contentDocument.body.innerHTML
    }
    return ''
  }

  const updatePreview = (html: string, fonts?: FontPair) => {
    if (!html) {
      console.error('No HTML provided to updatePreview')
      return
    }

    const currentFonts = fonts || FONT_PAIRS.modern // Default to modern fonts

    if (iframeRef.current?.contentDocument) {
      const doc = iframeRef.current.contentDocument
      
      const completeHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=${currentFonts.heading.replace(' ', '+')}&family=${currentFonts.body.replace(' ', '+')}&display=swap" rel="stylesheet">
            <script>
              tailwind.config = {
                corePlugins: {
                  textTransform: false
                },
                theme: {
                  extend: {
                    fontFamily: {
                      heading: ['${currentFonts.heading}', 'sans-serif'],
                      body: ['${currentFonts.body}', 'sans-serif'],
                    },
                  },
                },
              }
            </script>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body { 
                margin: 0;
                padding: 0;
                font-family: '${currentFonts.body}', sans-serif;
                background-color: #ffffff;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: flex-start;
              }
              h1, h2, h3, h4, h5, h6 {
                font-family: '${currentFonts.heading}', sans-serif;
              }
              .resume-container {
                width: 8.5in;
                height: 11in;
                margin: 0;
                padding: 0.5in;
                position: relative;
                background: white;
                overflow: visible;
              }
              .resume-content {
                width: 100%;
                position: relative;
                transform-origin: top center;
              }
              section {
                margin-bottom: 1rem;
              }
              .border-b {
                border-bottom-width: 1px;
              }
              .shadow-lg {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
              }
              /* Override any text transform */
              [class*="uppercase"],
              [class*="lowercase"],
              [class*="capitalize"] {
                text-transform: none !important;
              }
            </style>
          </head>
          <body>
            <div class="resume-container">
              <div class="resume-content">
                ${html}
              </div>
            </div>
            <script>
              function scaleContent() {
                const container = document.querySelector('.resume-container');
                const content = document.querySelector('.resume-content');
                if (container && content) {
                  const containerHeight = container.clientHeight - 96; // Account for padding
                  const contentHeight = content.scrollHeight;
                  const scale = Math.min(1, containerHeight / contentHeight);
                  content.style.transform = \`scale(\${scale})\`;
                }
              }
              
              // Run on load and after any dynamic content changes
              window.addEventListener('load', scaleContent);
              window.addEventListener('resize', scaleContent);
              
              // Create a MutationObserver to watch for content changes
              const observer = new MutationObserver(scaleContent);
              observer.observe(document.querySelector('.resume-content'), {
                childList: true,
                subtree: true,
                characterData: true
              });
            </script>
          </body>
        </html>
      `
      
      doc.open()
      doc.write(completeHtml)
      doc.close()
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const currentQuestion = RESUME_QUESTIONS[currentQuestionIndex]
    const currentHtml = getCurrentHtml()

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: inputMessage }])
    setInputMessage('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          currentHtml,
          fontPairs: FONT_PAIRS,
          question: currentQuestion // Send current question context
        }),
      })

      const data = await response.json()
      
      if (data.success && data.html) {
        updatePreview(data.html, data.fonts)
        
        // Move to next question if available
        if (currentQuestionIndex < RESUME_QUESTIONS.length - 1) {
          const nextQuestion = RESUME_QUESTIONS[currentQuestionIndex + 1]
          setCurrentQuestionIndex(prev => prev + 1)
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: nextQuestion.text
          }])
        } else {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "Great! Your resume is complete. You can now customize its appearance or download it as PDF."
          }])
        }
      }

      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    }
  }

  const handleDownloadPDF = async () => {
    if (iframeRef.current?.contentDocument?.body) {
      const element = iframeRef.current.contentDocument.body.firstElementChild
      
      // Dynamically load html2pdf when needed
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default
      
      const opt = {
        margin: 0.5,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait',
        }
      }
      
      // Add a temporary class for PDF generation
      if (element) {
        element.classList.add('pdf-mode')
        
        // Add PDF-specific styles to the iframe
        const styleSheet = iframeRef.current.contentDocument.createElement('style')
        styleSheet.textContent = `
          .pdf-mode {
            width: 8.5in !important;
            height: 11in !important;
            padding: 0.5in !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            position: relative !important;
            overflow: hidden !important;
            background: white !important;
          }
          .pdf-mode > * {
            transform-origin: top center !important;
            transform: scale(var(--scale-factor)) !important;
            width: 100% !important;
          }
          @page {
            size: letter;
            margin: 0;
          }
        `
        iframeRef.current.contentDocument.head.appendChild(styleSheet)

        // Calculate and apply scaling
        const contentHeight = element.scrollHeight
        const pageHeight = 11 * 96 - 96 // 11 inches in pixels minus margins
        const scale = Math.min(1, pageHeight / contentHeight)
        element.style.setProperty('--scale-factor', scale.toString())
        
        try {
          await html2pdf().set(opt).from(element).save()
        } finally {
          // Clean up
          element.classList.remove('pdf-mode')
          element.style.removeProperty('--scale-factor')
          styleSheet.remove()
        }
      }
    }
  }

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template.id)
    updatePreview(template.template, FONT_PAIRS.modern)
    setIsTemplateModalOpen(false)
  }

  // Update the initial template with proper Tailwind classes and better structure
  useEffect(() => {
    const initialTemplate = `
      <div class="max-w-4xl mx-auto p-8">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <header class="mb-8 text-center">
            <h1 class="font-heading text-4xl font-bold text-gray-800 mb-2">[Your Name]</h1>
            <p class="font-body text-lg text-gray-600 mb-4">[Professional Title]</p>
            <div class="flex justify-center gap-6 text-sm text-gray-600">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                [email@example.com]
              </span>
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                [(555) 123-4567]
              </span>
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                [Location]
              </span>
            </div>
          </header>
          
          <main class="space-y-6">
            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Professional Summary</h2>
              <p class="font-body text-gray-600 leading-relaxed">
                [A brief summary of your professional background and key strengths]
              </p>
            </section>

            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Experience</h2>
              <div class="space-y-4">
                <div class="pl-4 border-l-2 border-gray-200">
                  <h3 class="font-heading font-semibold text-gray-800">[Company Name]</h3>
                  <p class="text-gray-600 text-sm">[Position] • [Dates]</p>
                  <ul class="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                    <li>[Key achievement or responsibility]</li>
                    <li>[Key achievement or responsibility]</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Education</h2>
              <div class="space-y-4">
                <div class="pl-4 border-l-2 border-gray-200">
                  <h3 class="font-heading font-semibold text-gray-800">[Degree]</h3>
                  <p class="text-gray-600">[Institution] • [Graduation Year]</p>
                  <p class="text-gray-600 text-sm">[Additional details if any]</p>
                </div>
              </div>
            </section>

            <section>
              <h2 class="font-heading text-2xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Skills</h2>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">[Skill 1]</span>
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">[Skill 2]</span>
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">[Skill 3]</span>
              </div>
            </section>
          </main>
        </div>
      </div>
    `

    // Start with first question
    setMessages([{
      role: 'assistant',
      content: RESUME_QUESTIONS[0].text
    }])

    // Initialize with a slight delay to ensure iframe is ready
    setTimeout(() => {
      updatePreview(initialTemplate, FONT_PAIRS.modern)
    }, 100)
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                AI Resume Builder
              </h1>
              <p className="text-sm text-gray-500 mt-1">Create your professional resume in minutes</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setIsTemplateModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LayoutTemplate className="w-4 h-4" />
                Templates
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                className="bg-black hover:bg-gray-800 text-white rounded-full flex items-center gap-2 px-6 transition-all"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chat Interface */}
          <div className="w-full lg:w-[45%] flex flex-col h-[800px] bg-white rounded-3xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.05)] overflow-hidden border border-gray-100">
            <div className="p-6 border-b bg-white">
              <h2 className="text-xl font-bold text-gray-800">Resume Editor</h2>
              <p className="text-sm text-gray-500 mt-1">Let AI help you craft the perfect resume</p>
            </div>
            
            <div 
              ref={chatRef}
              className="flex-1 overflow-y-auto p-6 space-y-6"
              style={{
                backgroundImage: 'radial-gradient(circle at center, #f8fafc 0%, #ffffff 100%)'
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.role === 'assistant' 
                      ? 'bg-white rounded-2xl p-4 shadow-sm max-w-[85%] ml-2 border border-gray-100' 
                      : 'bg-black text-white rounded-2xl p-4 shadow-sm max-w-[85%] ml-auto mr-2'
                  } transition-all hover:shadow-md`}
                >
                  <p className={`${
                    message.role === 'assistant' ? 'text-gray-700' : 'text-white'
                  } text-sm leading-relaxed`}>
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-white border-t">
              <div className="flex gap-3 items-center">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all px-6"
                />
                <Button 
                  onClick={sendMessage}
                  className="bg-black hover:bg-gray-800 text-white px-6 rounded-full transition-all"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Live Preview</h2>
              <p className="text-sm text-gray-500 mt-1">See your changes in real-time</p>
            </div>
            <div className="flex-1 bg-white rounded-3xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.05)] overflow-hidden border border-gray-100">
              <iframe
                ref={iframeRef}
                className="w-full h-[800px]"
                title="Resume Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        </div>
      </main>

      <TemplateMarketplace
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
        templates={RESUME_TEMPLATES}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  )
}

