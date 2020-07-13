const mysql = require('mysql');

const options = {
    host: 'localhost',
    user: 'root',
    passwword: '',
    port: '3306',
    database: 'mydata',
    connectTimeout: 5000,
    mutipleStatements: true,//是否允许一个query包含多条sql
}

let pool;
repool();

function repool() {//断线重连
    pool = mysql.createPool({
        ...options,
        waitForConnections: true,
        connectionLimit: 100,
        queueLimit: 0,
    });
    pool.on('error', err => err.code === 'PROTOCOL_CONNECTION_LOST' && setTimeout(repool, 2000));
}
function query(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
            } else {
                conn.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
                conn.release();
            };
        });
    })
}

module.exports = query;