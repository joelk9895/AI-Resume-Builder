import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, currentHtml, fontPairs, question } = body

    if (!question) {
      return NextResponse.json({ 
        error: 'Missing question data',
        success: false 
      }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const systemPrompt = `
    You are a resume builder assistant. Your task is to update a specific part of the resume HTML.

    CURRENT HTML: ${currentHtml || '<div></div>'}
    QUESTION: ${question.text}
    USER ANSWER: ${message}
    SECTION: ${question.section}
    PLACEHOLDER: ${question.placeholder}

    INSTRUCTIONS:
    1. Find and replace the placeholder text "${question.placeholder}" with the user's answer
    2. Format text with proper capitalization:
       - Names should be Title Case (e.g., "John Smith")
       - Job titles should be Title Case (e.g., "Software Engineer")
       - Company names should be Title Case (e.g., "Google")
       - Email addresses should be lowercase
       - Regular text should use sentence case
    3. Do not modify any other parts of the HTML
    4. Keep all existing CSS classes
    5. Return only valid JSON in this format:
    {
      "html": "(the complete updated HTML)",
      "fonts": {
        "heading": "Raleway",
        "body": "Inter"
      }
    }

    DO NOT include any explanation or markdown formatting in your response.

    Important: Always use proper text casing in your responses:
    - Use Title Case for names, job titles, and company names
    - Use sentence case for descriptions and summaries
    - Use lowercase for email addresses
    - Never use all uppercase text unless specifically required
    `

    const result = await model.generateContent(systemPrompt)
    const text = result.response.text()

    // Remove any markdown formatting
    const cleanJson = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^{/m, '{')  // Ensure JSON starts with {
      .trim()

    try {
      const parsedResponse = JSON.parse(cleanJson)

      if (!parsedResponse.html) {
        throw new Error('Missing HTML in response')
      }

      // Before returning the response, normalize the text case
      const normalizeText = (html: string) => {
        // Replace any placeholder text in brackets with proper case
        return html.replace(/\[(.*?)\]/g, (match) => {
          const text = match.slice(1, -1) // Remove brackets
          // Convert to Title Case for names and positions
          if (text.includes('NAME') || text.includes('TITLE') || text.includes('COMPANY')) {
            return `[${text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}]`
          }
          // Keep email lowercase
          if (text.includes('EMAIL')) {
            return `[${text.toLowerCase()}]`
          }
          // Default to sentence case
          return `[${text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}]`
        })
      }

      const normalizedHtml = normalizeText(parsedResponse.html)

      return NextResponse.json({
        html: normalizedHtml,
        fonts: {
          heading: 'Raleway',
          body: 'Inter'
        },
        success: true
      })

    } catch (parseError) {
      console.error('Parse error:', parseError)
      console.log('Raw response:', text)
      console.log('Cleaned response:', cleanJson)

      // Return current HTML if parsing fails
      return NextResponse.json({
        html: currentHtml || `
          <div class='max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg'>
            <h1 class='text-4xl font-bold text-gray-800 mb-2'>[YOUR NAME]</h1>
            <div class='text-gray-600'>
              <p class='text-lg'>[Your Title]</p>
              <div class='flex gap-4 mt-2 text-sm'>
                <span>[YOUR EMAIL]</span>
                <span>[Your Phone]</span>
                <span>[Your Location]</span>
              </div>
            </div>
          </div>
        `,
        fonts: {
          heading: 'Raleway',
          body: 'Inter'
        },
        success: true
      })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process request',
      success: false 
    }, { status: 500 })
  }
} 