const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});