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
    expect(loginRes.body.token).toBeTruthy();
    const token = loginRes.body.token;

    // Create post
    const createPostRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello world' });
    expect(createPostRes.status).toBe(201);
    expect(createPostRes.body.content).toBe('Hello world');
    const postId = createPostRes.body.id;

    // Get posts
    const getPostsRes = await request(app).get('/posts').set('Authorization', `Bearer ${token}`);
    expect(getPostsRes.status).toBe(200);
    expect(Array.isArray(getPostsRes.body)).toBe(true);
    expect(getPostsRes.body.some(p => p.id === postId)).toBe(true);

    // Get single post
    const getPostRes = await request(app).get(`/posts/${postId}`).set('Authorization', `Bearer ${token}`);
    expect(getPostRes.status).toBe(200);
    expect(getPostRes.body.id).toBe(postId);

    // Create comment
    const createCommentRes = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Nice post' });
    expect(createCommentRes.status).toBe(201);
    expect(createCommentRes.body.content).toBe('Nice post');

    // Update user
    const updateRes = await request(app)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', status: 'Feeling good' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('Updated Name');
    expect(updateRes.body.status).toBe('Feeling good');

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
});
