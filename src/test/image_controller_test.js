process.env.NODE_ENV = 'test';

const { Pool } = require('pg');
const request = require('supertest');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const app = require('../app');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

describe('Images', () => {
  // beforeEach(async () => {
  //   console.log(pool);
  //   await pool.query('DELETE FROM images'); 
  // });

  describe('GET images', () => {
    it('should get all images', async () => {
      // await pool.query("INSERT INTO images(user_id, image_tag, purchased, likes, flags, location) VALUES ('testID', 'testImageTag', false, 0, 0, '/images/uploads/one'), ('testID2', 'testImageTag2', false, 0, 0, '/images/uploads/two')");
      await request(app)
        .get('/')
        .set('Content-Type', 'application/json')
        .expect((res) => {
          console.log(res);
          res.status.should.equal(200);
        })
    });
  });
});
