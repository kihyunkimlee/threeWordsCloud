const request = require('supertest');
const should = require('should');
const fs = require('fs');
const path = require('path');
const app = require('../../');
const { sequelize, models } = require('../../models/');

describe('POST /file은', () => {
    const words = [
        {word: '알고리즘'},
        {word: '자료구조'},
        {word: '운영체제'},
        {word: '네트워크'},
        {word: '컴퓨터구조'}
    ];

    before(() => sequelize.sync({force: true}));
    before(() => models.Word.bulkCreate(words));

    describe('성공시', () => {
        it('파일 객체를 반환한다', (done) => {
            request(app)
                .post('/file')
                .set('Content-Type', 'multipart/form-data')
                .attach('file', path.join(__dirname, '/test.jpg'))
                .expect(201)
                .end((err, res) => {
                    res.body.should.have.properties([
                        'word1',
                        'word2',
                        'word3',
                        'originalFileName',
                        'fileSize',
                        'fileMimeType',
                        'fileUploadedPath',
                        'createdAt'
                    ]);
                    done();
                });
        });
    });

    describe('실패시', () => {
        it('파일을 업로드하지 않으면 400을 응답한다', (done) => {
            request(app)
                .post('/file')
                .set('Content-Type', 'multipart/form-data boundary=---&')
                .attach('file', '')
                .expect(400)
                .end(done);
        });

        it('업로드가 금지된 형식의 파일을 업로드하면 415을 응답한다', (done) => {
            request(app)
                .post('/file')
                .set('Content-Type', 'multipart/form-data')
                .attach('file', path.join(__dirname, '/test.php'))
                .expect(415)
                .end(done);
        });

        it('업로드한 파일의 사이즈가 3MB를 초과하면 400을 응답한다', (done) => {
            request(app)
                .post('/file')
                .set('Content-Type', 'multipart/form-data')
                .attach('file', path.join(__dirname, '/bigPicture.jpg'))
                .expect(400, {
                    type: 'MulterError',
                    message: 'File too large'
                }, done);
        });
    });
});