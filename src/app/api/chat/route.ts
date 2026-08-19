import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, objectName = 'Kailasa Temple', siteName = 'Ellora Caves', period = '8th Century CE', culturalSignificance = '' } = await request.json()

    const query = (message || '').toLowerCase()
    let reply = ''

    if (query.includes('how old') || query.includes('age') || query.includes('when') || query.includes('built') || query.includes('period')) {
      reply = `**${objectName}** dates back to **${period}**. At ${siteName}, master sculptors excavated over 200,000 tons of solid basalt rock over a span of approximately 18 years using only hammers and chisels.`
    } else if (query.includes('carved') || query.includes('made') || query.includes('technique') || query.includes('architect') || query.includes('how')) {
      reply = `What makes **${objectName}** extraordinary is that it was carved **top-down** directly out of the mountain cliff face. Artisans started from the roof of Mount Kailash and worked down to the floor, meaning no scaffolding was used!`
    } else if (query.includes('important') || query.includes('significance') || query.includes('why') || query.includes('special')) {
      reply = `**${objectName}** is globally famous because ${culturalSignificance || 'it represents the pinnacle of Indian monolithic rock-cut architecture'}. It symbolizes Mount Kailash, the sacred abode of Lord Shiva.`
    } else if (query.includes('style') || query.includes('practice') || query.includes('today') || query.includes('artisan') || query.includes('living')) {
      reply = `While massive monolithic cave excavation is no longer practiced at this scale, the stone carving traditions live on in local Maharashtrian artisan guilds. Additionally, nearby **Paithan** preserves living heritage like Paithani handloom weaving from the same era!`
    } else if (query.includes('unusual') || query.includes('secret') || query.includes('fact') || query.includes('mystery')) {
      reply = `Did you know? Despite hundreds of thousands of tons of rock being excavated from **${objectName}**, archaeologists have never found any trace of the excavated rock in surrounding valleys! Local legend says the stone was pulverized and repurposed for regional construction.`
    } else {
      reply = `That's a fantastic question about **${objectName}** at **${siteName}**. ${culturalSignificance} If you visit nearby living heritage sites like **Paithan**, you can see how the ancient artistic principles continue to be practiced by local master artisans today!`
    }

    return NextResponse.json({
      reply,
      contextUsed: { objectName, siteName, period }
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to process chat query' }, { status: 500 })
  }
}
