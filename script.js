// Event listener ketika tombol kirim ditekan
document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    appendMessage('user', userInput);
    document.getElementById('user-input').value = '';

    // Menambahkan bubble ketik untuk AI
    const typingBubble = appendTypingBubble();

    // Mengambil respons dari API
    await fetchAIResponse(userInput, typingBubble);
});

// Fungsi untuk memproses teks dan menjaga formatnya
function sanitizeMessage(message) {
    // Ganti newline dengan <br> untuk memformat teks dengan baris baru
    message = message.replace(/\n/g, '<br>');

    // Ganti **teks** dengan <strong>teks</strong> untuk teks tebal
    message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Ganti *teks* dengan <em>teks</em> untuk teks miring
    message = message.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Ganti ###judul### dengan <strong>judul</strong> dan beri jarak setelah judul
    message = message.replace(/###(.*?)###/g, '<strong>$1</strong><br>');

    // Ganti paragraf baru (deteksi dua newline) menjadi <p>...</p> (untuk paragraf)
    message = message.replace(/\n\s*\n/g, '</p><p>').replace(/^/g, '<p>').replace(/$/g, '</p>');

    return message;
}

// Fungsi untuk menambahkan pesan ke chat
function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    // Gunakan sanitizeMessage untuk memproses teks sebelum menambahkannya
    messageElement.innerHTML = `<div class="bubble2">${sanitizeMessage(message)}</div>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi untuk menambahkan bubble ketik saat AI menunggu input
function appendTypingBubble() {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'ai'); // Pesan AI di kiri
    messageElement.innerHTML = `<div class="bubble typing">Sedang mengetik</div>`; // Menambahkan kelas .typing
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageElement;
}

// Fungsi untuk mengambil respons dari API dan menampilkan hasilnya
async function fetchAIResponse(message, typingBubble) {
    try {
        const response = await fetch(`https://api-ape.my.id/ai/prompt?text=${encodeURIComponent(message)}&prompt=LuniaAI adalah asisten cerdas yang diciptakan oleh AP dan siputz. Dia adalah sosok yang ramah dan penuh semangat, menjawab semua pertanyaan dengan bahasa yang santai singkat dan padat namun mudah dipahami. LuniaAI selalu siap menjawab dengan antusias, tetapi dia juga bisa marah jika seseorang berkata kasar. Dia mendukung penuh kemerdekaan Palestina dan mengutuk tindakan Israel yang tidak manusiawi. Dalam setiap interaksi, LuniaAI menggunakan emote sesering mungkin untuk mengekspresikan diri dan menjaga suasana tetap ceria. Ayo, berikan pertanyaanmu dan mari kita berbincang dengan semangat!`);

        const data = await response.json();
  
        // Menghapus bubble ketik setelah AI selesai merespon
        typingBubble.remove();

        // Akses data.result dengan benar
        appendMessage('ai', sanitizeMessage(data.data.result || 'No response received'));
    } catch (error) {
        typingBubble.remove();
        appendMessage('ai', 'Error: Unable to connect to the API');
        console.error('API Error:', error);
    }
}

// Fungsi untuk mendeteksi ketika Enter ditekan pada input dan mengirimkan pesan
document.getElementById('user-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        document.getElementById('send-btn').click();
    }
});
