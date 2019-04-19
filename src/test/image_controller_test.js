process.env.NODE_ENV = 'test';

const { Pool } = require('pg');
const request = require('supertest');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const app = require('../app');

const pool = new Pool();

describe('Images', () => {

  beforeEach(async () => {
    await pool.query('DELETE FROM images'); 
  });

  after(async () => {
    await pool.query('DELETE FROM images'); 
  });

  describe('GET images', () => {
    it('should get all images', async () => {
      await pool.query("INSERT INTO images(user_id, image_tag, purchased, likes, flags, location) VALUES ('testID', 'testImageTag', false, 0, 0, '/images/uploads/one'), ('testID2', 'testImageTag2', false, 0, 0, '/images/uploads/two')");
      await request(app)
        .get('/images/')
        .set('Content-Type', 'application/json')
        .expect((res) => {
          res.status.should.equal(200);
          res.body.should.have.lengthOf(2);
        })
    });
  });

  describe('PUT image', () => {
    it('should increment image likes', async () => {
      await pool.query("INSERT INTO images(user_id, image_tag, purchased, likes, flags, location) VALUES ('testID', 'testImageTag', false, 0, 0, '/images/uploads/one')");
      await request(app)
        .put('/images/testImageTag')
        .set('Content-Type', 'application/json')
        .send({likes:true})
        .expect((res) => {
          res.status.should.equal(204);
        })
        const image = await pool.query("SELECT * FROM images where image_tag='testImageTag'");
        image.rows[0].likes.should.equal(1);
        image.rows[0].flags.should.equal(0);
    });

    it('should increment image flags', async () => {
      await pool.query("INSERT INTO images(user_id, image_tag, purchased, likes, flags, location) VALUES ('testID', 'testImageTag', false, 0, 0, '/images/uploads/one')");
      await request(app)
        .put('/images/testImageTag')
        .set('Content-Type', 'application/json')
        .send({flags:true})
        .expect((res) => {
          res.status.should.equal(204);
        })
        const image = await pool.query("SELECT * FROM images where image_tag='testImageTag'");
        image.rows[0].likes.should.equal(0);
        image.rows[0].flags.should.equal(1);
    });
  });

  describe('POST image', async () => {
    it('should insert image', async () => {
      await request(app)
        .post('/images')
        .attach('walleryImage', './src/test/balloons.jpg')
        .expect((res) => {
          res.status.should.equal(201);
        })
    });

    it('should not accept an invalid file extension', async () => {
      await request(app)
        .post('/images')
        .attach('walleryImage', './src/test/invalid.txt')
        .expect((res) => {
          res.status.should.equal(400);
          res.body.msg.should.equal('Invalid file type');
        })
    });
  });
});
