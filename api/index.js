const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/fetch', async (req, res) => {
    try {
        const url = req.query.url;
        const response = await axios.get(`https://api.danzy.web.id/api/download/tiktok?url=${encodeURIComponent(url)}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error' });
    }
});

app.get('/api/download', async (req, res) => {
    const fileUrl = req.query.url;
    const type = req.query.type || 'file';
    try {
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream'
        });
        const filename = `tiktok_${Date.now()}`;
        let ext = '.mp4';
        if (type === 'mp3') ext = '.mp3';
        if (type === 'photo') ext = '.jpeg';
        res.setHeader('Content-Disposition', `attachment; filename="${filename}${ext}"`);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send('Error');
    }
});

module.exports = app;