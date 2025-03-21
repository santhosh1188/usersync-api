const express = require('express');
const app = express();
const userRoutes = require('./routes/users');

app.use(express.json()); // Parse JSON bodies
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
