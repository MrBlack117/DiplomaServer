const app = require('./app');
const PORT = process.env.PORT || 3000; // Можливість встановити порт через консоль або за замовчуванням 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});