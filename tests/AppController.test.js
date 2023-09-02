/**
 * Unit tests for AppController
 */
import dbClient from '../utils/db';

describe('+ AppController', () => {
    before(function (done) {
        this.timeout(10000);
        Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
            .then(([usersCollection, filesCollection]) => {
                Promise.all([usersCollection.deleteMany({}), filesCollection.deleteMany({})])
                    .then(() => done())
                    .catch((deleteErr) => done(deleteErr));
            }).catch((connectErr) => done(connectErr));
    });

    describe('+ GET: /status', () => {
        it('+ Services are online', function (done) {
            request.get('/status')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    expect(res.body).to.deep.eql({ redis: true, db: 0 });
                    done();
                });
        });
    });

    describe('+ GET: /stats', () => {
        it('+ Correct stats about db collections', function (done) {
            request.get('/stats')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    expect(res.body).to.deep.eql({ users: 0, files: 0 });
                    done();
                });
        });

        it('+ Correct stats about db collections [alt]', function (done) {
            this.timeout(10000);
            Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
                .then(([usersCollection, filesCollection]) => {
                    Promise.all([
                        usersCollection.insertMany([{ email: 'pretty@mail.com' }]),
                        filesCollection.insertMany([
                            { name: 'foo.text', type: 'file' },
                            { name: 'pic.png', type: 'image' },
                        ])
                    ])
                    .then(() => {
                        request.get('/stats')
                            .expect(200)
                            .end((err, res) => {
                                if (err) {
                                    return done(err);
                                }
                                expect(res.body).to.deep.eql({ users: 1, files: 2});
                                done();
                            });
                    })
                    .catch((deleteErr) => done(deleteErr));
                })
                .catch((connectErr) => done(connectErr));
        });
    });
});