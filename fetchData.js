const superagent = require('superagent');
let articlesRecords = {
  publications: [],
  authors: [],
  pubTypes: []
}

async function fetchRecordsFromCrossRef() {

  const response = await superagent.get('https://api.crossref.org/works?rows=1000')
  const { message: { items } } = response.body
  const itemsWithTitle = items.filter(({ title }) => title !== undefined)

  for (const item of itemsWithTitle) {
    const { author } = item

    if (!author) continue

    const [firstAuthor, secondAuthor] = author

    const publication = {
      doi: item.DOI,
      publisher: item.publisher,
      url: item.URL,
      title: item.title.toString(),
      language: item.language ||  'Not Found'
    }
    const authors = {
      doi: item.DOI,
      firstAuthor: firstAuthor.family,
      secondAuthor: secondAuthor?.family || 'Not Found'
    }
    const types = {
      doi: item.DOI,
      publicationType: item.type
    }

    articlesRecords.publications.push(publication)
    articlesRecords.authors.push(authors)
    articlesRecords.pubTypes.push(types)



  }
};

async function fetchRecordsFromDataCite() {
  const response = await superagent.get('https://api.test.datacite.org/dois?random=true&page[size]=1000')
  const { data } = response.body
  for (let item of data) {
    const { attributes } = item

    if (!attributes || !attributes.creators.length) continue

    if (!attributes.titles) continue

    const { title } = [attributes.titles]
    const [firstCreator, secondCreator] = attributes.creators

    const publication = {
      doi: attributes.doi,
      publisher: attributes.publisher,
      url: attributes.url,
      title: title,
      language: attributes.language
      
    }
    const authors = {
      doi: attributes.doi,
      firstAuthor: firstCreator.name,
      secondAuthor: secondCreator?.name ||  'Not Found',

    }
    const types = {
      doi: attributes.doi,
      publicationType: attributes.types.citeproc
    }

    articlesRecords.publications.push(publication)
    articlesRecords.authors.push(authors)
    articlesRecords.pubTypes.push(types)
  }

};

async function getCombinedData() {
  await fetchRecordsFromCrossRef()
  await fetchRecordsFromDataCite()
  const { publications, authors, pubTypes } = articlesRecords
  const pubVals = publications.map(pub => Object.values(pub))
  const authorVals = authors.map(author => Object.values(author))
  const pubTypesVals = pubTypes.map(type => Object.values(type))

  return { pubVals, authorVals, pubTypesVals }
}

module.exports.getCombinedData = getCombinedData