const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/fetch', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({ status: false, message: 'URL tidak boleh kosong' });
        }
        const response = await axios.get(`https://api.danzy.web.id/api/download/tiktok?url=${encodeURIComponent(url)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 15000
        });
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        const systemMessage = error.response?.data?.message || error.message || 'Gagal tersambung ke server API';
        res.status(500).json({ status: false, message: systemMessage });
    }
});

app.get('/api/download', async (req, res) => {
    const fileUrl = req.query.url;
    const type = req.query.type || 'file';
    if (!fileUrl) {
        return res.status(400).send('URL konten tidak valid');
    }
    try {
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });
        const filename = `tiktok_${Date.now()}`;
        let ext = '.mp4';
        if (type === 'mp3') ext = '.mp3';
        if (type === 'photo') ext = '.jpeg';
        res.setHeader('Content-Disposition', `attachment; filename="${filename}${ext}"`);
        response.data.pipe(res);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Gagal mengunduh file media');
    }
});

module.exports = app;
