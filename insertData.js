const db = require('./connection')
const data = require('./fetchData')

async function main() {
  const { pubVals, authorVals, pubTypesVals } = await data.getCombinedData()
  var insertAuthors = `INSERT INTO authors (doi, first_author, second_author) VALUES ?`
  var insertPubs = `INSERT INTO publication (doi, publisher, url, title, language) VALUES ?`
  var insertTypes = `INSERT INTO types (doi, publication_types) VALUES ?`

  insertData(pubVals, insertPubs)
  insertData(authorVals, insertAuthors)
  insertData(pubTypesVals, insertTypes)


}

function insertData(values, sqlQuery) {
  db.query(sqlQuery, [values], function (err, result) {

    if (err) throw err;
    console.log(`Data inserted`);

  });

}
main()