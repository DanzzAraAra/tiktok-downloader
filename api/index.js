const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/fetch', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).json({ status: false, message: 'URL kosong' });

        const response = await axios.get(`https://api.danzy.web.id/api/download/tiktok?url=${encodeURIComponent(url)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': 'https://google.com/',
                'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
            },
            timeout: 10000
        });

        const dataResult = response.data;

        if (dataResult?.data?.type === 'photo' && Array.isArray(dataResult.data.slides)) {
            dataResult.data.slides = dataResult.data.slides.filter(slide => slide.url.includes('.jpeg'));
        }

        res.json(dataResult);
    } catch (error) {
        res.status(500).json({ status: false, message: 'Akses ditolak oleh server target (403)' });
    }
});

app.get('/api/download', async (req, res) => {
    const fileUrl = req.query.url;
    const type = req.query.type || 'file';
    if (!fileUrl) return res.status(400).send('URL konten tidak valid');

    try {
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': 'https://www.tiktok.com/'
            }
        });
        
        const filename = `tiktok_${Date.now()}`;
        let ext = type === 'mp3' ? '.mp3' : type === 'photo' ? '.jpeg' : '.mp4';
        
        res.setHeader('Content-Disposition', `attachment; filename="${filename}${ext}"`);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send('Gagal mengunduh file media');
    }
});

module.exports = app;
