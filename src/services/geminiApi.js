export async function sendToGemini(prompt) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    console.log('Gemini API response:', data)
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '[Нет ответа]'
  } catch (e) {
    return '[Ошибка подключения к Gemini]'
  }
}
