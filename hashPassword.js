const bcrypt = require('bcrypt');

async function hashPassword(plainTextPassword) {
    const saltRounds = 10; // This is a good default
    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        console.log("Hashed Password:", hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

// Example usage with a sample password
hashPassword('admin1');
