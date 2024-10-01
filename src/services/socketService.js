const users = {};

const connection = (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.emit('message', 'Hello ' + socket.id);

    socket.on('login', function (data) {
        console.log('a user ' + data.userId + ' connected');
        // saving userId to object with socket ID
        users[socket.id] = data.userId;
    });

    socket.on('disconnect', () => {
        console.log(`User disconnect id is ${socket.id}`);
        delete users[socket.id];
    });
};

module.exports = { connection };
