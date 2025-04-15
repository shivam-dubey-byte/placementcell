const app = require("./app");
const PORT = 5006;

app.listen(PORT, () => {
  console.log(`📊 Placement dashboard API running on http://localhost:${PORT}`);
});