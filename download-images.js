import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
    {
        url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        filename: 'modern-gallery.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1574271143515-5cddf8da19be',
        filename: 'natural-museum.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2',
        filename: 'classical-museum.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd',
        filename: 'photo-gallery.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1626050954744-92bf034ce476',
        filename: 'science-museum.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04',
        filename: 'sculpture-garden.jpg'
    }
];

const downloadImage = (url, filename) => {
    const imagePath = path.join(__dirname, 'public', 'images', filename);
    
    if (!fs.existsSync(path.join(__dirname, 'public', 'images'))) {
        fs.mkdirSync(path.join(__dirname, 'public', 'images'), { recursive: true });
    }

    https.get(`${url}?w=1200&q=80`, (response) => {
        const file = fs.createWriteStream(imagePath);
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${filename}`);
        });
    }).on('error', (err) => {
        console.error(`Error downloading ${filename}:`, err.message);
    });
};

images.forEach(img => {
    downloadImage(img.url, img.filename);
});
