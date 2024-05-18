const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdmin.json');
const {getDownloadURL} = require('firebase-admin/storage');
const bucket = process.env.FIREBASE_BUCKET;

// Инициализация Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucket
});

const storageBucket = admin.storage().bucket();
const storage = admin.storage();

// Функция для загрузки файла в Firebase Storage
exports.uploadFile = async (fileData, fileName) => {
    try {
        const file = storageBucket.file(fileName);

        // Загрузка файла в Firebase Storage
        await file.save(fileData);

        console.log('File uploaded successfully');

        // Получение URL загруженного файла
        return await getDownloadURL(file);
    } catch (error) {
        console.error('Error uploading file to Firebase Storage:', error);
        throw error;
    }
};

// Функция для удаления файла из Firebase Storage
exports.deleteFile = async (fileName) => {
    try {
        const file = storageBucket.file(fileName);

        // Удаление файла из Firebase Storage
        await file.delete();

        console.log('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file from Firebase Storage:', error);
        throw error;
    }
};

exports.deleteFileByUrl = async (fileUrl) => {
    try {


        const parts = fileUrl.split("/");
        let fileName = parts[parts.length - 1];
        const questionMarkIndex = fileName.indexOf("?");
        if (questionMarkIndex !== -1) {
            fileName = fileName.substring(0, questionMarkIndex);
        }

        // Получаем ссылку на файл в Firebase Storage
        const file = storageBucket.file(fileName);

        // Удаление файла из Firebase Storage
        await file.delete();

        console.log('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file from Firebase Storage:', error);
        throw error;
    }
};