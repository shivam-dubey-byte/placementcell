const app = require("./app");
const PORT = 5007;

app.listen(PORT, () => {
  console.log(`📊 Placement dashboard API running on http://localhost:${PORT}`);
});