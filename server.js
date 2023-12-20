import { createServer } from 'http'
import { createConnection } from 'mysql'

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    dabatase: 'nodedb'
}

function getPeople(mysql) {
    return new Promise((resolve, reject) => {
      mysql.query('SELECT * FROM nodedb.people', (err, results, fields) => {
        if (err) {
          console.error('Erro ao executar a consulta: ', err);
          reject(err);
          return;
        }
        resolve(results);
      });
    });
}

async function handler(req, res) {
    const mysql = createConnection(config)
    const title = '<h1>Full Cycle Rocks!</h1>'
    const [url, query] = req.url.split('?')
    const [prop, value] = query ? query.split('=') : [null, null]
    
    if (url === '/people' && prop === 'name' && value) {
        const sql = `INSERT INTO nodedb.people(name) values("${value}")`
        
        mysql.connect()
        mysql.query(sql)
        const getPeopleResult = await getPeople(mysql)
        mysql.end()

        const result = [title]
        getPeopleResult.forEach(item => {
            result.push(`<p>ID: ${item.id} - Nome: ${item.name}</p>`)
        });

        res.end(result.join(''))     
    } 
    else if (url === '/people') {
        mysql.connect()
        const getPeopleResult = await getPeople(mysql)
        mysql.end()
        const result = [title]
        getPeopleResult.forEach(item => {
            result.push(`<p>ID: ${item.id} - Nome: ${item.name}</p>`)
        });
        res.end(result.join(''))  
    } 
    else {
        res.statusCode = 404
        res.end(`${title} <p>404 page not found</p> <p>Use /people</p>`)
    }
}

const PORT = 3000
createServer(handler)
    .listen(PORT, () => console.log(`Running is port ${PORT}`))