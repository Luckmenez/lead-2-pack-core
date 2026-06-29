import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Catalog (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/catalog/categorias/fornecedor (GET)', () => {
    return request(app.getHttpServer())
      .get('/catalog/categorias/fornecedor')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('categorias');
        expect(Array.isArray(res.body.categorias)).toBe(true);
      });
  });
});
