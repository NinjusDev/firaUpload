const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Configuración de Multer para la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads");
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating upload directory:", err);
      }
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Ruta para la carga de imágenes
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Aquí puedes realizar cualquier procesamiento adicional,
  // como guardar la referencia de la imagen en una base de datos

  res.sendFile(path.join(__dirname, "../public/succesfullyUpload.html"));
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "..", "public")));

// Servir archivos estáticos desde la carpeta de carga 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Función para obtener la lista de archivos en la carpeta de carga
const getUploadFiles = () => {
  const uploadPath = path.join(__dirname, "uploads");
  return fs.readdirSync(uploadPath);
};

// Ruta para la API que devuelve la lista de archivos en formato JSON
app.get("/api/files", (req, res) => {
  const files = getUploadFiles();
  res.json(files);
});

// Ruta para acceder a los archivos individualmente
app.get("/api/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, "uploads", imageName));
});

// Inicia el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Image uploader server is running on port ${port}`);
});
