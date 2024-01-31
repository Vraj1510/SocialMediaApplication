const multer = require('multer');
const pool = require('./db');
const express = require('express');
const { Server } = require('socket.io');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
let redisClient = createClient();
redisClient.connect().catch(console.error);
let redisStore = new RedisStore({
  client: redisClient,
});
require('dotenv').config();
const server = require('http').createServer(app);
// Server-side code
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods:["GET","POST"],
//   },
// });

// let onlineUsers = [];

// const addNewUser = (username, socketId) => {
//   console.log(onlineUsers);
//   !onlineUsers.some((user) => user.username === username) &&
//     onlineUsers.push({ username, socketId });
//   console.log(onlineUsers);
// };
// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };
// const getUser = (username) => {
//   return onlineUsers.find((user) => user.username === username);
// };

// io.on('connection', (socket) => {
//   io.emit('currentonlineusers', onlineUsers);
//   socket.on('newUser', (username) => {
//     addNewUser(username, socket.id);
//     console.log(onlineUsers);
//     io.emit('user_online', username);
//     io.emit('currentonlineusers', onlineUsers);
//   });
//   socket.on('sendText', ({ senderName, receiverName, text }) => {
//     const receiver = getUser(receiverName);
//     io.to(receiver.socketId).emit('getText', {
//       senderName,
//       text,
//     });
//     io.emit('currentonlineusers', onlineUsers);
//   });

//   socket.on('disconnect', () => {
//     const user = onlineUsers.find((user) => user.socketId === socket.id);
//     if (user) {
//       removeUser(socket.id);
//       io.emit('user_offline', user.username);
//     }
//     io.emit('currentonlineusers', onlineUsers);
//   });
// });
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  console.log(onlineUsers);
  // Check if the user is already in the onlineUsers array
  if (!onlineUsers.some((user) => user.username === username)) {
    onlineUsers.push({ username, socketId });
  }
  console.log(onlineUsers);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on('connection', (socket) => {
  io.emit('currentonlineusers', onlineUsers);

  socket.on('newUser', (username) => {
    addNewUser(username, socket.id);
    console.log(onlineUsers);
    io.emit('user_online', username);
    io.emit('currentonlineusers', onlineUsers);
  });

  socket.on('send_message', ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    if (receiver) {
      io.to(receiver.socketId).emit('receive_message', { senderName, message: text });
    }
  });

  socket.on('disconnect', () => {
    const user = onlineUsers.find((user) => user.socketId === socket.id);
    if (user) {
      removeUser(socket.id);
      io.emit('user_offline', user.username);
    }
    io.emit('currentonlineusers', onlineUsers);
  });
});

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: 'Vraj',
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === 'production' ? true : false,
      httpOnly: true,
      expires: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
    },
  }),
);


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/handlelogin', async (req, res) => {
  try {
    console.log(req.session);
    const allUsers = await pool.query('SELECT * FROM "user1"');
    const usersData = allUsers.rows;
    const { username, password } = req.body;
    const isValidLogin = usersData.some(
      (user) => user.user_name === username && user.password === password,
    );
    if (isValidLogin) {
      req.session.user = {
        username: req.body.username,
      };
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/checkuser', async (req, res) => {
  try {
    const { username } = req.body;
    const userQuery = 'SELECT user_name FROM "user1" WHERE user_name = $1';
    const { rowCount } = await pool.query(userQuery, [username]);

    if (rowCount > 0) {
      return res.status(401).json({ error: 'User Already Exists' });
    } else {
      return res.json({ message: 'SignUp successful' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/updateprofile', upload.single('file'), async (req, res) => {
  try {
    // console.log(req);
    const { username } = req.body;
    const file = req.file.buffer;
    // console.log(file);
    const userExistsQuery = 'SELECT * FROM user1 WHERE user_name = $1';
    const userExistsResult = await pool.query(userExistsQuery, [username]);
    if (userExistsResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const updateQuery = 'UPDATE user1 SET profile = $1 WHERE user_name = $2';
    const updateValues = [file, username];
    await pool.query(updateQuery, updateValues);
    res.json({ success: true, message: 'Image uploaded and stored successfully.' });
  } catch (err) {
    console.error('Error storing image data:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.post('/unfollow', async (req, res) => {
  try {
    const { person1, person2 } = req.body;
    const query = `DELETE FROM following WHERE person1=$1 AND person2=$2`;
    await pool.query(query, [person1, person2]);
    const query1 = `DELETE FROM notifications WHERE person1=$1 AND person2=$2 AND id=$3`;
    await pool.query(query1, [person1, person2, 'following']);
    res.json('yes');
  } catch (err) {
    console.log(err.message);
  }
});
app.put('/fetchImage', async (req, res) => {
  try {
    const { username1 } = req.body;
    const result = await pool.query('SELECT * FROM user1 WHERE user_name = $1', [username1]);
    if (result.rows.length === 0 || !result.rows[0].profile) {
      res.status(404).json({ success: false, message: 'Image not found for the given username.' });
      return;
    }
    res.end(result.rows[0].profile);
  } catch (err) {
    console.error('Error fetching image data:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/insert', async (req, res) => {
  try {
    const { username, password, phone } = req.body;
    const fs = require('fs');
    const filePath = '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/profile.png'; // Replace with the actual file path
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath);
      const newTodo = await pool.query(
        'INSERT INTO "user1" (user_name, password, phone, profile) VALUES($1, $2, $3, $4) RETURNING *',
        [username, password, phone, fileContent],
      );
      await newTodo.json();
      req.session.user = {
        username,
        // id:newTodo.rows[0].id
      };
      res.json('YES');
    } else {
      res.status(404).json('File not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Internal Server Error');
  }
});

app.post('/sentrequest', async (req, res) => {
  // console.log(req.body);
  try {
    const { person1, person2, id, pid } = req.body;
    await pool.query(`INSERT INTO "requestsent" (person1, person2) VALUES ($1, $2)`, [
      person1,
      person2,
    ]);
    await pool.query(
      `INSERT INTO "notifications" (person1, person2, id, pid) VALUES ($1, $2, $3, $4)`,
      [person1, person2, id, pid],
    );
    res.json('YES');
  } catch (err) {
    console.error(err.message);
  }
});
app.put('/fetchnotifications', async (req, res) => {
  try {
    const { username } = req.body;

    const query = `
      SELECT n.*, u1.profile AS person1_profile, u2.profile AS person2_profile
      FROM notifications n
      LEFT JOIN user1 u1 ON n.person1 = u1.user_name
      LEFT JOIN user1 u2 ON n.person2 = u2.user_name
      WHERE n.person2 = $1 OR n.person1 = $1
    `;
    const result = await pool.query(query, [username]);
    const allNotifications = result.rows;
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    const updatedNotifications = allNotifications.map((notification) => ({
      ...notification,
      person1_profile: notification.person1_profile
        ? notification.person1_profile.toString('base64')
        : null,
      person2_profile: notification.person2_profile
        ? notification.person2_profile.toString('base64')
        : null,
    }));
    res.end(JSON.stringify(updatedNotifications));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/deleterequest', async (req, res) => {
  // console.log(req.body);
  try {
    const { person1, person2 } = req.body;
    await pool.query('DELETE FROM requestsent WHERE person1=$1 AND person2=$2', [person1, person2]);
    await pool.query(
      'DELETE FROM notifications WHERE person1=$1 AND person2=$2 AND id=$3 AND pid=$4',
      [person1, person2, 'follow', '-1'],
    );
    res.json('YES');
  } catch (err) {
    console.error(err.message);
  }
});
app.put('/checkfollower', async (req, res) => {
  try {
    const { person2, person1 } = req.body;
    const response = await pool.query('SELECT * FROM following WHERE person1=$1 AND person2=$2', [
      person2,
      person1,
    ]);
    // const allTodos = response.rows;
    res.json({ success: true, data: response.rows });
  } catch (err) {
    console.error(err.message);
  }
});
app.post('/removeFollower', async (req, res) => {
  try {
    const { person1, person2 } = req.body;
    const response = await pool.query('DELETE FROM following WHERE person1=$1 AND person2=$2', [
      person2,
      person1,
    ]);
    const allTodos = response.rows;
    const query1 = `DELETE FROM notifications WHERE person1=$1 AND person2=$2 AND id=$3`;
    await pool.query(query1, [person2, person1, 'following']);
    res.json({ success: true, data: allTodos.rows });
  } catch (err) {
    console.error(err.message);
  }
});
app.put('/deleterequest1', async (req, res) => {
  // console.log(
  try {
    const { user1, user2 } = req.body;
    await pool.query('DELETE FROM requestsent WHERE person1=$1 AND person2=$2', [user1, user2]);
  } catch (err) {
    console.error(err.message);
  }
});
app.post('/addfollowing', async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    const newTodo = await pool.query('INSERT INTO following VALUES($1, $2) RETURNING *', [
      user1,
      user2,
    ]);
  } catch (err) {
    console.error(err.message);
  }
});
app.put('/updatenotification', async (req, res) => {
  // console.log(person1);
  try {
    const { user1, user2, id1, pid1 } = req.body;
    const deleteResult = await pool.query(
      'DELETE FROM notifications WHERE person1=$1 AND person2=$2 AND id=$3 AND pid=$4',
      [user1, user2, id1, pid1],
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    } else {
      await pool.query('INSERT INTO notifications VALUES($1, $2, $3, $4)', [
        user1,
        user2,
        'following',
        pid1,
      ]);
      return res.status(200).json({ message: 'Notification updated successfully' });
    }
  } catch (err) {
    console.error(err.message);
    // Respond with an error status code and message
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.put('/updatenote', async (req, res) => {
  try {
    const { username, inputValue } = req.body;
    const updateQuery = `
      UPDATE "user1"
      SET note = $2
      WHERE user_name = $1
      RETURNING *
    `;
    // console.log(inputValue);
    const updatedUser = await pool.query(updateQuery, [username, inputValue]);
    res.json({ success: true, message: 'Profile updated successfully', data: updatedUser.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/fetch1', async (req, res) => {
  try {
    const query = `
      SELECT user_name,profile FROM "user1";
    `;
    const result = await pool.query(query);
    const allTodos = result.rows;
    res.writeHead(200, {
      'Content-Type': 'application/json', // Assuming the response is JSON
    });

    const updatedTodos = allTodos.map((todo) => ({
      user_name: todo.user_name,
      profile: todo.profile ? todo.profile.toString('base64') : null, // Assuming profile is a Buffer
    }));
    res.end(JSON.stringify(updatedTodos));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put('/fetchnote', async (req, res) => {
  try {
    const { username1 } = req.body;
    const allTodos = await pool.query('SELECT note FROM user1 WHERE user_name ILIKE $1', [
      username1,
    ]);
    res.json({ success: true, data: allTodos.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.put('/fetchnumber', async (req, res) => {
  try {
    const { username1 } = req.body;
    const allTodos = await pool.query('SELECT phone  FROM user1 WHERE user_name ILIKE $1', [
      username1,
    ]);
    res.json({ success: true, data: allTodos.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.put('/follow', async (req, res) => {
  try {
    const { person1, person2 } = req.body;
    const allTodos = await pool.query('SELECT * FROM following WHERE person1=$1 AND person2=$2', [
      person1,
      person2,
    ]);
    res.json({ success: true, data: allTodos.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.put('/requestsent', async (req, res) => {
  try {
    const { person1, person2 } = req.body;
    const allTodos = await pool.query('SELECT * FROM requestsent WHERE person1=$1 AND person2=$2', [
      person1,
      person2,
    ]);
    res.json({ success: true, data: allTodos.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.put('/followers', async (req, res) => {
  try {
    const { person } = req.body;
    const allTodos = await pool.query('SELECT * FROM requestsent WHERE person2=$1', [person]);
    res.json({ success: true, data: allTodos.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.put('/following', async (req, res) => {
  try {
    const { person } = req.body;
    const allTodos = await pool.query('SELECT * FROM requestsent WHERE person1=$1', [person]);
    res.json({ success: true, data: allTodos.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.put('/followersofuser', async (req, res) => {
  const { username1 } = req.body;
  try {
    const query = `
      SELECT following.person2, user1.profile
      FROM following
      JOIN user1 ON following.person2 = user1.user_name
      WHERE following.person1 = $1;
    `;
    const result = await pool.query(query, [username1]);
    const allTodos = result.rows;
    res.writeHead(200, {
      'Content-Type': 'application/json', // Assuming the response is JSON
    });

    const updatedTodos = allTodos.map((todo) => ({
      person2: todo.person2,
      profile: todo.profile ? todo.profile.toString('base64') : null, // Assuming profile is a Buffer
    }));
    res.end(JSON.stringify(updatedTodos));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put('/userfollowing', async (req, res) => {
  const { username1 } = req.body;
  try {
    const query = `
      SELECT following.person1, user1.profile
      FROM following
      JOIN user1 ON following.person1 = user1.user_name
      WHERE following.person2 = $1;
    `;
    const result = await pool.query(query, [username1]);
    const allTodos = result.rows;
    res.writeHead(200, {
      'Content-Type': 'application/json', // Assuming the response is JSON
    });
    const updatedTodos = allTodos.map((todo) => ({
      person1: todo.person1,
      profile: todo.profile ? todo.profile.toString('base64') : null, // Assuming profile is a Buffer
    }));
    res.end(JSON.stringify(updatedTodos));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put('/mutual', async (req, res) => {
  const { user1, user2 } = req.body;
  try {
    const query = `SELECT t1.person2,u1.profile
                  FROM following t1 JOIN user1 u1 ON t1.person2=u1.user_name
                  WHERE t1.person1 =$1
                  INTERSECT
                  SELECT t2.person2,u2.profile
                  FROM following t2 JOIN user1 u2 ON t2.person2=u2.user_name
                  WHERE t2.person1 =$2;
                  `;
    const result = await pool.query(query, [user1, user2]);
    const allTodos = result.rows;
    res.writeHead(200, {
      'Content-Type': 'application/json', // Assuming the response is JSON
    });
    const updatedTodos = allTodos.map((todo) => ({
      person2: todo.person2,
      profile: todo.profile ? todo.profile.toString('base64') : null, // Assuming profile is a Buffer
    }));
    res.end(JSON.stringify(updatedTodos));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/addpost', upload.array('files', 10), async (req, res) => {
  try {
    // console.log('vraj');
    const { username, caption } = req.body;
    const files = req.files;
    // console.log(username);
    // console.log(caption);
    const userExistsQuery = 'SELECT * FROM user1 WHERE user_name = $1';
    const userExistsResult = await pool.query(userExistsQuery, [username]);
    if (userExistsResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const buffers = files.map((file) => file.buffer);
    const updateQuery = 'INSERT INTO post (user_name,caption, pictures) VALUES ($1, $2, $3)';
    const updateValues = [username, caption, buffers];
    await pool.query(updateQuery, updateValues);
    console.log('Array of buffers inserted into the database successfully.');
    res.status(200).json({ success: true, message: 'Post with images added successfully.' });
  } catch (error) {
    console.error('Error adding post:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});
app.put('/fetchpost', async (req, res) => {
  try {
    const { username1 } = req.body;
    // console.log(username1);

    const result = await pool.query('SELECT id,caption, pictures FROM post WHERE user_name = $1', [
      username1,
    ]);
    // console.log(result);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'No posts found for the given username.' });
      return;
    }

    const posts = result.rows.map((post) => {
      const { caption, pictures, id } = post;
      return {
        id,
        caption,
        pictures,
      };
    });
    // console.log(posts.length);
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
    console.error('Error fetching posts data:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/editpost', async (req, res) => {
  try {
    const { caption, selectedImages, id } = req.body;
    // console.log(req.body);
    const updateQuery = 'UPDATE post SET caption=$1, pictures=$2 WHERE id=$3';
    const updateValues = [caption, selectedImages, id];
    await pool.query(updateQuery, updateValues);
    console.log('Array of buffers inserted into the database successfully.');
    res.status(200).json({ success: true, message: 'Post with images added successfully.' });
  } catch (error) {
    console.error('Error adding post:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.put('/handlelikes', async (req, res) => {
  try {
    const { id, username } = req.body;
    // console.log(username);
    // console.log(id);
    const response = await pool.query('SELECT * FROM likes WHERE user_name=$1 AND post_id=$2', [
      username,
      id,
    ]);
    const allTodos = response.rows;
    if (allTodos.length > 0) {
      const response1 = await pool.query('DELETE FROM likes WHERE user_name=$1 AND post_id=$2', [
        username,
        id,
      ]);
      res.json({ success: false });
    } else {
      const response1 = await pool.query('INSERT INTO likes (user_name,post_id) VALUES ($1,$2)', [
        username,
        id,
      ]);
      res.json({ success: true });
    }
  } catch (err) {
    console.error(err.message);
  }
});
app.put('/checklike', async (req, res) => {
  try {
    const { id, username } = req.body;
    // console.log(username);
    // console.log(id);
    const response = await pool.query('SELECT * FROM likes WHERE user_name=$1 AND post_id=$2', [
      username,
      id,
    ]);
    const allTodos = response.rows;
    if (allTodos.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});
app.put('/deletepost', async (req, res) => {
  try {
    const { id } = req.body;
    // console.log(id);
    const response1 = await pool.query('DELETE FROM post WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
  }
});
app.put('/findfriend', async (req, res) => {
  try {
    const { username } = req.body;
    const response = await pool.query(
      'SELECT person1 as user FROM following WHERE person2=$1 UNION SELECT person2 as user FROM following WHERE person1=$1',
      [username],
    );
    const users = response.rows;

    const response1 = await pool.query(
      'SELECT user2 as user FROM chats WHERE user1=$1 UNION SELECT user1 as user FROM chats WHERE user2=$1',
      [username],
    );
    const users1 = response1.rows;
      // console.log(users);
      // console.log(users1);
    const userNames = users.map((user) => user.user);
    const userNames1 = users1.map((user) => user.user);

    // Subtract common elements
    const subtractedUsers = users.filter((user) => !userNames1.includes(user.user));
    const finalusers = subtractedUsers.map((user1) => ({ user: user1.user }));


    // console.log(finalusers);
    const usersWithProfileImages = await Promise.all(
     finalusers.map(async (user) => {
        const { user: friendUsername } = user;
        const profileImageResponse = await pool.query(
          'SELECT profile FROM user1 WHERE user_name = $1',
          [friendUsername],
        );

        const profileImageBuffer = profileImageResponse.rows[0]?.profile;
        const profileImage = profileImageBuffer
          ? `data:image/png;base64,${profileImageBuffer.toString('base64')}`
          : null;

        return {
          username: friendUsername,
          profileImage,
        };
      }),
    );

    res.status(200).json({
      success: true,
      data: usersWithProfileImages,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.put('/notfollowing', async (req, res) => {
  try {
    const { username } = req.body;
    const response = await pool.query('SELECT person2 as user FROM following WHERE person1=$1', [
      username,
    ]);
    const users = response.rows;
    const response1 = await pool.query('SELECT user_name as user FROM user1 WHERE user_name!=$1', [
      username,
    ]);
    const users1 = response1.rows;
    const usersSubtracted = users1.filter(
      (user1) => !users.some((user2) => user1.user === user2.user),
    );
    const usersWithProfileImages = await Promise.all(
      usersSubtracted.map(async (user) => {
        const { user: friendUsername } = user;
        const profileImageResponse = await pool.query(
          'SELECT profile FROM user1 WHERE user_name = $1',
          [friendUsername],
        );

        const profileImageBuffer = profileImageResponse.rows[0]?.profile;
        const profileImage = profileImageBuffer
          ? `data:image/png;base64,${profileImageBuffer.toString('base64')}`
          : null;
        // console.log(friendUsername);
        return {
          username: friendUsername,
          profileImage,
        };
      }),
    );

    res.status(200).json({
      success: true,
      data: usersWithProfileImages,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.post('/addchat', async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    const response = await pool.query('INSERT INTO chats (user1, user2) VALUES ($1, $2)', [
      user1,
      user2,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.put('/fetchchats',async(req,res)=>{
  try{
    const {username}=req.body;
    const response = await pool.query(
      'SELECT id,user2 as user FROM chats WHERE user1=$1 UNION SELECT id,user1 as user FROM chats WHERE user2=$1',
      [username],
    );
    const user1=response.rows;
    // console.log(response.rows);
    const usersWithProfileImages = await Promise.all(
      user1.map(async (row1) => {
        const friendUsername = row1.user;
        const profileImageResponse = await pool.query(
          'SELECT profile FROM user1 WHERE user_name = $1',
          [friendUsername],
        );
        const profileImageBuffer = profileImageResponse.rows[0]?.profile;
        const profileImage = profileImageBuffer
          ? `data:image/png;base64,${profileImageBuffer.toString('base64')}`
          : null;
        return {
          id:row1.id,
          username: friendUsername,
          profileImage,
        };
      }),
    );
      // console.log(usersWithProfileImages);
    res.status(200).json({
      success: true,
      data: usersWithProfileImages,
    });
  }
  catch(err)
  {
    console.error(err.message);
  }
})
app.post('/deletechat', async (req, res) => {
  try {
    const { user1,user2 } = req.body;
   const response1 = await pool.query(
     'DELETE FROM chats WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)',
     [user1, user2],
   );
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
  }
});
app.post('/insertmessage',async(req,res)=>{
  try{
    const {user1,user2,message,room,minutes,hours,day,date,month,year,ampm}=req.body;
    const response1 = await pool.query(
      'INSERT INTO messages(user1,user2,message,room,minutes,"hour",day,date,month,year,ampm) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
      [user1, user2, message, room, minutes, hours, day, date, month, year, ampm],
    );
    res.json({ success: true });
  }
  catch(err)
  {
    console.error(err.message);
  }
});
app.put('/getmessages', async (req, res) => {
  try {
    const { room } = req.body;
    // console.log(room);
    const response1 = await pool.query(
      `SELECT * FROM messages WHERE room=$1`,
      [room],
    );
    res.json({ success: true,data:response1.rows });
  } catch (err) {
    console.error(err.message);
  }
});
app.put('/getrequests', async (req, res) => {
  try {
    const {username} = req.body;
    console.log(username);
    const response1 = await pool.query(`SELECT * FROM requestsent WHERE person1=$1`, [username]);
    res.json({ success: true, data: response1.rows });
  } catch (err) {
    console.error(err.message);
  }
});
server.listen(3001, () => {
  console.log('Server has started');
});
