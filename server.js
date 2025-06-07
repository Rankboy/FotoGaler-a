const express = require('express');
const morgan = require('morgan');
const upload = require('express-fileupload'); // <-- aquí
const path = require('path');

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(upload()); // <-- aquí
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev'));

// Memoria temporal de imágenes
const imageArray = [];

// index page
app.get("/", (req, res) => {
  res.render("./views/index.ejs", { title: "Home" });
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

// 404 page
app.get('/404', function(req, res) {
    res.render('404');
});

app.listen(8080);
console.log('8080 is the magic port');