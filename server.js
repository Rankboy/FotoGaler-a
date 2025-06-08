const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const upload = require('express-fileupload'); // <-- aquí
const path = require('path');

var app = express();
app.use(express.static(__dirname));

// Punto de entrada al layout general
app.use(expressLayouts);
app.set('layout','./layouts/layout.ejs')

// set the public folder for css
app.use(express.static('public'))
app.use('/public',express.static(__dirname + 'public'))

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(upload()); // <-- aquí
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev'));

// Memoria temporal de imágenes
const imageArray = [];

// index page
app.get("/", (req, res) => {
  res.render("index", { title: "PixelWood" });
});

// Add Image page
app.get('/addImage', function(req, res) {
    res.render('addImage');
});

// Subida de imagen
app.post('/addImage', (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No se subió ninguna imagen.');
  }

  const image = req.files.image;
  const uploadPath = path.join(__dirname, 'uploads', image.name);

  image.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    // Guardar path relativo en el array
    imageArray.push('/uploads/' + image.name);

    res.redirect('/'); // o renderizar el EJS con la galería
  });
});

// Las imagenes almacenadas en el array se pasan al html

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    imagenes: imageArray // Pasás el array al template
  });
});

// 404 page
app.get('/404', function(req, res) {
    res.render('404');
});

app.listen(8080);
console.log('8080 es el puerto mágico a Pixelwood');