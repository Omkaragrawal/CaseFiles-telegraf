const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max:15,
    ssl:{
        rejectUnauthorized: false
    },
    min: 5
});



// pool.query("Select name from public.to;")
//     .then(({rows}) => {
//         rows = rows.map(({name, i}) => name);
//         console.log(rows);
//         pool.end();
//     })
//     .catch(err => console.log(err));

// pool.query("insert into public.documents (file_num, paper_subject, sent_to, extra_details) values ($1, $2, $3, $4) returning id;", [2, "ABCD", "DR", ""])
// .then(results => {
//     console.log(results.rows[0].id);
// })
// .catch(err => {
//     console.log(err);
// });


module.exports = pool;