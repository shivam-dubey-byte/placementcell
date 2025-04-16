const app = require('./app');
const PORT = process.env.PORT || 5004;



app.listen(PORT, () => {
  console.log(`Auth Service running on http://localhost:${PORT}`);
});
