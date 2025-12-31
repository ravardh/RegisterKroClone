import express from 'express';

const app = express();



app.get('/', (req, res) => {
  res.send('Server is running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  
});