
async function weatherSearch(city, state) {
    const uri = 'http://localhost:9000/weather?location='+city+','+state;
    const response = await fetch(uri);
    const json = await response.json();

    return json
}

module.exports = weatherSearch;