// const messageModel = require('../models/messageModel');

const {makeInsertQuery} = require("../utils/common");
const db = require('../db/connection');
let io;

const handleStoreMessage = async (data) => {
    const {query, values} = makeInsertQuery(data);
    const createQuery = `insert into messages
                             ${query}`;
    let [result] = await db.query(createQuery, values);
    if (result.affectedRows && result.insertId) {
        const getMessageQuery = `Select *
                                 from messages
                                 WHERE id = ?`;
        [result] = await db.query(getMessageQuery, result.insertId);
        if (result.length) {
            return result[0];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

const getUserList = async (userId) => {
    const query = `
        SELECT messages.*,
               u.name AS receiver_name,
               r.name AS sender_name
        FROM messages
                 LEFT JOIN users AS u ON messages.receiver_id = u.id
                 LEFT JOIN users AS r ON messages.sender_id = r.id
        WHERE messages.id IN (SELECT MAX(id)
                              FROM messages
                              WHERE sender_id = ?
                                 OR receiver_id = ?
                              GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id));
    `;

    const [result] = await db.query(query, [userId, userId]);

    console.log(result);

    return (result ?? []).map((item) => {
        const isMe = item.sender_id === userId;

        return {
            message_id: item.id,
            ...item,
            name: isMe ? item.receiver_name : item.sender_name,
            id: isMe ? item.receiver_id : item.sender_id,
            isMe,
            user_id: userId,
        };
    }).filter((i) => i.id != userId); // Exclude messages sent to self
};


const getMessages = async (userId, receiverId) => {
    const loadMessagesQuery = `
        SELECT *
        FROM messages
        WHERE (sender_id = ? AND receiver_id = ?)
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
    `;
    const [result] = await db.query(loadMessagesQuery, [userId, receiverId, receiverId,userId]);
    return result.map((item) => {
        return {
            ...item,
            isMe: item.sender_id === userId
        }
    });
}

const getUsers = async (userID, keyword) => {
    if (!keyword) {
        return [];
    }
    const userQuery = `
        SELECT *
        FROM users
        WHERE name LIKE ?
          AND id != ?
    `;

    const [result] = await db.query(userQuery, [`%${keyword}%`, userID]);
    return result;
}

const initSocket = (socketServer) => {
    io = socketServer;
    io.on('connection', (socket) => {

        console.log('New client connected');

        socket.on('searchUser', async (keyword) => {
            try {
                const searchUsers = await getUsers(socket.auth.id, keyword);
                socket.emit('searchList', searchUsers); // Send messages to the client
            } catch (err) {
                console.error(err.message);
            }
        });
        //load messages list
        socket.on('loadMessages', async (receiverId) => {
            try {
                const messages = await getMessages(socket.auth.id, receiverId);
                socket.emit('messageList', messages); // Send messages to the client
            } catch (err) {
                console.error(err.message);
            }
        });

        //load user list
        socket.on('loadUserList', async () => {
            try {
                const users = await getUserList(socket.auth.id);
                socket.emit('usersList', users); // Send messages to the client
            } catch (err) {
                console.error(err.message);
            }
        });

        // Handle events when the client emits data to the server
        socket.on('sendMessage', async (data) => {
            try {
                console.log('Received data from client:', data);
                const result = await handleStoreMessage({
                    message: data.message,
                    sender_id: socket.auth.id,
                    receiver_id: data?.receiver_id,
                });
                if (result?.id) {
                    socket.emit(`messageSend${socket.auth.id}`, {
                        ...result,
                        isMe: true,
                    });
                    socket.broadcast.emit(`messageReceived${data?.receiver_id}`, {
                        ...result,
                        isMe: false,
                    });
                }
            } catch (e) {
                console.log(e.message);
            }

        });


        // Handle disconnection of clients
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = {initSocket};
