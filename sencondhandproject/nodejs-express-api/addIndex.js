import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UsersMap from './models/usersMap.js'; // 更新为你的模型路径

dotenv.config();

const removeDuplicateUsers = async () => {
    const usersMaps = await UsersMap.find();

    for (const usersMap of usersMaps) {
        const uniqueUsers = [];
        const userIds = new Set();

        for (const user of usersMap.users) {
            if (!userIds.has(user.id)) {
                uniqueUsers.push(user);
                userIds.add(user.id);
            }
        }

        if (uniqueUsers.length !== usersMap.users.length) {
            usersMap.users = uniqueUsers;
            await usersMap.save();
            console.log(`Duplicates removed for UsersMap with owner: ${usersMap.owner}`);
        }
    }

    console.log('Duplicate removal complete');
};

const createUniqueIndex = async () => {
    await UsersMap.collection.createIndex({ 'users.id': 1 }, { unique: true, sparse: true });
    console.log('Unique index created on users.id');
};

mongoose
    .connect(process.env.ATLAS_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("DB Connection Successful");

        await removeDuplicateUsers();

        await createUniqueIndex();

        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err.message);
    });
