module.exports = {
    session:{
        adapter : 'redis',
        password:'youknowthat',
        host: '10.0.3.24',
        port : 6379,
        db : 1,
        ttl : 20 * 60,
        prefix:'kk/test'
    },
    port:2333
}