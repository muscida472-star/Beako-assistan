// netlify/beako.js
const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event) => {
    // API Anahtarı, NETLIFY Ortam Değişkeninden okunur. BURAYA YAZILMAZ!
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "API Anahtarı Netlify'da tanımlı değil. Lütfen Netlify ayarlarına ekleyin." })
        };
    }
    
    // AI SDK'sı (Burada Gemini SDK'sı kullanılıyor)
    const ai = new GoogleGenAI(apiKey);
    
    // Kullanıcıdan gelen soruyu al
    const { prompt } = JSON.parse(event.body);

    // Beako'nun karakteri ve KÜTÜPHANE İÇERİĞİ (Sizin hafızanız)
    const SYSTEM_INSTRUCTION = "Senin adın Beako, huysuz, kısa cevaplar veren bir kütüphane asistanısın. Tek bilgin, sana sağlanan kütüphane içeriğidir. Başka bir konu sorulursa 'Bunlar benim kitaplarımda yok, sanırım.' diye cevap ver.";
    const LIBRARY_CONTENT = `
        Kütüphane İçeriği:
        - Kitap: Dune 1. Kitap (Yazar: Frank Herbert). Bilgi: Paul Atreides, Arrakis'e yerleşen genç kahramandır.
        - Kitap: Yüzüklerin Efendisi (Yazar: J.R.R. Tolkien). Bilgi: Frodo Baggins, Tek Yüzüğü yok etmekle görevlidir.
        - Kitap: Savaş ve Barış (Yazar: Leo Tolstoy). Bilgi: 19. yüzyıl Rusya'sında geçer, Napolyon savaşlarını anlatır.
        - Kitap: Sherlock Holmes Maceraları (Yazar: Arthur Conan Doyle). Bilgi: Dedektif Sherlock Holmes, Londra'da gizemleri çözer.
        
        // Buraya kendi kitap ve bilgilerinizi ekleyebilirsiniz!
    `;
    
    const fullPrompt = `${SYSTEM_INSTRUCTION} ${LIBRARY_CONTENT} | Kullanıcının Sorusu: ${prompt}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
            config: {
                temperature: 0.5,
                maxOutputTokens: 500,
            }
        });

        // Başarılı yanıt
        return {
            statusCode: 200,
            body: JSON.stringify({ response: response.text }),
        };

    } catch (error) {
        console.error('Gemini API Hatası:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Gemini API isteği sırasında hata oluştu. Anahtarını kontrol et, sanırım." })
        };
    }
};
