import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

async function generateAdminObject() {
    const password = 'Mamamia123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = {
        _id: new mongoose.Types.ObjectId(),
        name: "Анна",
        surname: "Вишневська",
        email: "anna.vishnevska@gmail.com",
        password: hashedPassword,
        phone: "+380123456789",
        address: "Київ, Україна",
        role: "admin",
        birthDate: new Date("1995-01-01"),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    console.log(JSON.stringify(adminUser, null, 2));
}

generateAdminObject();