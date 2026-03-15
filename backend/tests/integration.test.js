const request = require('supertest');
const app = require('../app');
const { prisma } = require('../lib/prisma');

describe('Integration tests - auth, users, posts', () => {
  beforeEach(async () => {
    // Clear dependent tables first to avoid FK constraint errors
    await prisma.comment.deleteMany();
    await prisma.like.deleteMany();
    await prisma.followRequest.deleteMany();
    await prisma.userFollow.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('Signup -> Login -> create/get/delete post -> comment -> update user', async () => {
    // Signup
    const signupRes = await request(app).post('/auth/signup').send({
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      password: 'Abc123!',
      confirm_password: 'Abc123!'
    });

    expect(signupRes.body.success).toBe(true);

    const user = await prisma.user.findUnique({ where: { username: 'testuser' } });
    expect(user).toBeTruthy();

    // Login
    const loginRes = await request(app).post('/auth/login').send({
      username: 'testuser',
      password: 'Abc123!'
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data).toBeTruthy();
    expect(loginRes.body.data.token).toBeTruthy();
    const token = loginRes.body.data.token;

    // Create post
    const createPostRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello world' });
    expect(createPostRes.status).toBe(201);
    expect(createPostRes.body.data.content).toBe('Hello world');
    const postId = createPostRes.body.data.id;

    // Get posts
    const getPostsRes = await request(app).get('/posts').set('Authorization', `Bearer ${token}`);
    expect(getPostsRes.status).toBe(200);
    expect(Array.isArray(getPostsRes.body.data)).toBe(true);
    expect(getPostsRes.body.data.some(p => p.id === postId)).toBe(true);

    // Get single post
    const getPostRes = await request(app).get(`/posts/${postId}`).set('Authorization', `Bearer ${token}`);
    expect(getPostRes.status).toBe(200);
    expect(getPostRes.body.data.id).toBe(postId);

    // Create comment
    const createCommentRes = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Nice post' });
    expect(createCommentRes.status).toBe(201);
    expect(createCommentRes.body.data.content).toBe('Nice post');

    // Update user
    const updateRes = await request(app)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', status: 'Feeling good' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.name).toBe('Updated Name');
    expect(updateRes.body.data.status).toBe('Feeling good');

    // Delete post
    const deleteRes = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);

    // Verify deleted
    const getDeleted = await request(app).get(`/posts/${postId}`).set('Authorization', `Bearer ${token}`);
    expect(getDeleted.status).toBe(404);
  });

  test('Protected endpoints require token', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(401);
  });

  test('Likes lifecycle and counts', async () => {
    // Signup & login
    await request(app).post('/auth/signup').send({
      username: 'likeuser',
      email: 'like@example.com',
      name: 'Like User',
      password: 'Abc123!',
      confirm_password: 'Abc123!'
    });
    const loginRes = await request(app).post('/auth/login').send({ username: 'likeuser', password: 'Abc123!' });
    const token = loginRes.body.data.token;

    // Create a post
    const createPostRes = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({ content: 'Post for likes' });
    const postId = createPostRes.body.data.id;

    // Like
    const likeRes = await request(app).post(`/posts/${postId}/like`).set('Authorization', `Bearer ${token}`);
    expect(likeRes.status).toBe(201);
    expect(likeRes.body.data.userId).toBeDefined();

    // Verify count
    const getPostRes = await request(app).get(`/posts/${postId}`).set('Authorization', `Bearer ${token}`);
    expect(getPostRes.status).toBe(200);
    expect(getPostRes.body.data._count.likes).toBe(1);

    // Unlike
    const unlikeRes = await request(app).delete(`/posts/${postId}/like`).set('Authorization', `Bearer ${token}`);
    expect(unlikeRes.status).toBe(200);

    const getAfterUnlike = await request(app).get(`/posts/${postId}`).set('Authorization', `Bearer ${token}`);
    expect(getAfterUnlike.body.data._count.likes).toBe(0);
  });

  test('Follow request -> accept -> followers/following lists', async () => {
    // Create two users
    await request(app).post('/auth/signup').send({ username: 'alice', email: 'alice@example.com', name: 'Alice', password: 'Abc123!', confirm_password: 'Abc123!' });
    await request(app).post('/auth/signup').send({ username: 'bob', email: 'bob@example.com', name: 'Bob', password: 'Abc123!', confirm_password: 'Abc123!' });

    const aliceLogin = await request(app).post('/auth/login').send({ username: 'alice', password: 'Abc123!' });
    const bobLogin = await request(app).post('/auth/login').send({ username: 'bob', password: 'Abc123!' });
    const aliceToken = aliceLogin.body.data.token;
    const bobToken = bobLogin.body.data.token;

    // Get user ids
    const alice = await prisma.user.findUnique({ where: { username: 'alice' } });
    const bob = await prisma.user.findUnique({ where: { username: 'bob' } });

    // Alice sends follow request to Bob
    const reqRes = await request(app).post(`/follow/${bob.id}`).set('Authorization', `Bearer ${aliceToken}`);
    expect(reqRes.status).toBe(201);

    // Bob accepts
    const acceptRes = await request(app).post(`/follow/${alice.id}/accept`).set('Authorization', `Bearer ${bobToken}`);
    expect(acceptRes.status).toBe(201);

    // Verify followers/following
    const bobFollowers = await request(app).get(`/users/${bob.id}/followers`).set('Authorization', `Bearer ${bobToken}`);
    expect(bobFollowers.status).toBe(200);
    expect(bobFollowers.body.data.some(u => u.id === alice.id)).toBe(true);

    const aliceFollowing = await request(app).get(`/users/${alice.id}/following`).set('Authorization', `Bearer ${aliceToken}`);
    expect(aliceFollowing.status).toBe(200);
    expect(aliceFollowing.body.data.some(u => u.id === bob.id)).toBe(true);
  });

  test('Comment update/delete permission checks', async () => {
    // Create user1 and user2
    await request(app).post('/auth/signup').send({ username: 'c1', email: 'c1@example.com', name: 'C1', password: 'Abc123!', confirm_password: 'Abc123!' });
    await request(app).post('/auth/signup').send({ username: 'c2', email: 'c2@example.com', name: 'C2', password: 'Abc123!', confirm_password: 'Abc123!' });

    const login1 = await request(app).post('/auth/login').send({ username: 'c1', password: 'Abc123!' });
    const login2 = await request(app).post('/auth/login').send({ username: 'c2', password: 'Abc123!' });
    const t1 = login1.body.data.token;
    const t2 = login2.body.data.token;

    // user1 creates a post
    const p = await request(app).post('/posts').set('Authorization', `Bearer ${t1}`).send({ content: 'Comment test post' });
    const postId = p.body.data.id;

    // user1 creates a comment
    const cRes = await request(app).post(`/posts/${postId}/comments`).set('Authorization', `Bearer ${t1}`).send({ content: 'Original' });
    expect(cRes.status).toBe(201);
    const commentId = cRes.body.data.id;

    // user2 tries to update -> forbidden
    const tryUpdate = await request(app).put(`/comments/${commentId}`).set('Authorization', `Bearer ${t2}`).send({ content: 'Hacked' });
    expect(tryUpdate.status).toBe(403);
    

    // owner updates
    const ownerUpdate = await request(app).put(`/comments/${commentId}`).set('Authorization', `Bearer ${t1}`).send({ content: 'Edited' });
    expect(ownerUpdate.status).toBe(200);
    expect(ownerUpdate.body.data.content).toBe('Edited');

    // user2 tries delete -> forbidden
    const tryDelete = await request(app).delete(`/comments/${commentId}`).set('Authorization', `Bearer ${t2}`);
    expect(tryDelete.status).toBe(403);

    // owner deletes
    const ownerDelete = await request(app).delete(`/comments/${commentId}`).set('Authorization', `Bearer ${t1}`);
    expect(ownerDelete.status).toBe(200);
  });
});
