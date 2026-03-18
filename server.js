const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

// Rutas de certificados
//console.log(__dirname)
//const keyPath = path.join(__dirname, '../../keys-ssl-nitrofert/nitrofert.key');
//const certPath = path.join(__dirname,'../../keys-ssl-nitrofert/nitrofert.pem');

// Leer certificados
//const options = {
//    key: fs.readFileSync(keyPath),
//    cert: fs.readFileSync(certPath)
//};

// Servir Angular desde "dist"
app.use(express.static(path.join(__dirname, 'dist/sakai-ng')));

// Manejo de rutas SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/sakai-ng/index.html'));
});

// Puerto HTTPS
const PORT = 8095;

//https.createServer(options, app).listen(PORT, () => {
//    console.log(`🚀 Front Angular en HTTPS escuchando en puerto ${PORT}`);
//});

app.listen(PORT, () => {
  console.log(`🚀 Front Angular corriendo en http://localhost:${PORT}`);
});
