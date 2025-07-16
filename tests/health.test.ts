import { server } from '../src/index';
import request from 'supertest';
import { redisClient } from '../src/configs/redis';

afterAll(() => {
  server.close();
  redisClient.disconnect();
});

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const response = await request(server).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      code: 200,
      message: 'OK!',
    });
  });
});
