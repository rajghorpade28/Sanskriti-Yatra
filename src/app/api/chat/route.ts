import { NextResponse } from 'next/server'

const GEMINI_MODEL = 'gemini-3.6-flash'

export async function POST(request: Request) {
  try {
    const {
      message,
      objectName = 'Kailasa Temple',
      siteName = 'Ellora Caves',
      period = '8th Century CE',
      culturalSignificance = '',
      architecturalNote = '',
      historicalContext = '',
    } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY

    // --- Real Gemini AI response ---
    if (apiKey) {
      const systemPrompt = `You are "Sanskriti Guide", an expert cultural heritage interpreter for Sanskriti Yatra — an Indian heritage discovery app.

You are helping a tourist who is currently at or looking at:
- Object: ${objectName}
- Site: ${siteName}
- Period: ${period}
- Cultural Significance: ${culturalSignificance}
- Architectural Details: ${architecturalNote}
- Historical Context: ${historicalContext}

Rules:
1. Keep answers SHORT — 2 to 4 sentences max.
2. Be specific to this exact object/site. Do not give generic India history.
3. Use bold markdown for key heritage terms.
4. Where relevant, mention nearby living heritage traditions (especially Paithan/Paithani if discussing Ellora or Ajanta).
5. Never fabricate facts, artisan identities, or statistics.
6. If the question is unrelated to Indian heritage, politely redirect.

Tourist question: "${message}"`

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.4,
              },
            }),
          }
        )

        if (res.ok) {
          const data = await res.json()
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
          if (reply) {
            return NextResponse.json({
              reply,
              contextUsed: { objectName, siteName, period },
              source: 'gemini',
            })
          }
        }
      } catch (err) {
        console.error('Gemini chat error, falling back to keyword:', err)
      }
    }

    // --- Fallback keyword-based response ---
    const query = (message || '').toLowerCase()
    let reply = ''

    if (query.includes('how old') || query.includes('age') || query.includes('when') || query.includes('built') || query.includes('period')) {
      reply = `**${objectName}** dates back to **${period}**. At ${siteName}, master sculptors worked over many decades using only iron hammers and chisels — no modern tools.`
    } else if (query.includes('carved') || query.includes('made') || query.includes('technique') || query.includes('architect') || query.includes('how')) {
      reply = `**${objectName}** was carved using the remarkable **top-down excavation** technique — artisans started at the roof and worked down to the floor. No scaffolding was used, and no mistakes could be corrected once made.`
    } else if (query.includes('important') || query.includes('significance') || query.includes('why') || query.includes('special')) {
      reply = `**${objectName}** is globally significant because ${culturalSignificance || 'it represents the pinnacle of Indian rock-cut heritage'}. It is recognized as a **UNESCO World Heritage Site**.`
    } else if (query.includes('living') || query.includes('artisan') || query.includes('today') || query.includes('tradition')) {
      reply = `While this ancient craft is no longer practiced at the same scale, the **living heritage** continues in nearby **Paithan**, where master weavers create **Paithani silk sarees** using the same peacock and lotus motifs carved here in stone.`
    } else if (query.includes('unusual') || query.includes('secret') || query.includes('fact') || query.includes('mystery')) {
      reply = `**${objectName}** has one extraordinary mystery — despite enormous quantities of rock being excavated, archaeologists have found no disposal site for the removed stone anywhere nearby!`
    } else {
      reply = `**${objectName}** at **${siteName}** (${period}) is a remarkable testament to Maharashtra's ancient artistic excellence. ${culturalSignificance} Explore nearby **Paithan** to discover the living continuation of these ancient artistic traditions!`
    }

    return NextResponse.json({
      reply,
      contextUsed: { objectName, siteName, period },
      source: 'keyword',
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to process chat query' }, { status: 500 })
  }
}
