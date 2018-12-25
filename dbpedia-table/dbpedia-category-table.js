var query = `
PREFIX : <http://iolanta.tech/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbc: <http://dbpedia.org/resource/Category:>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX prov: <http://www.w3.org/ns/prov#>


select ?resource ?label ?link ?thumbnail where {
    ?resource dct:subject dbc:Battles_of_World_War_I_involving_Germany .
    ?resource rdfs:label ?label .
    ?resource foaf:isPrimaryTopicOf ?link .
    ?resource dbo:thumbnail ?thumbnail .
    
    FILTER (lang(?label) = 'en') .
} ORDER BY ?label limit 5
`

var url = new URL('https://dbpedia.org/sparql'),
    params = {
        'query': query,
        'default-graph-uri': 'http://dbpedia.org',
        'format': 'application/sparql-results+json'
    };

Object.keys(params).forEach(
    key => url.searchParams.append(key, params[key])
)

fetch(url).then(function(response) {
    response.json().then(function(data) {
        var items = data.results.bindings.map(function(item) { return {
            label: item.label.value,
            href: item.link.value,
        }});
        console.log(items);

        var table = new Tabulator("#table", {
            height: 300,
            data: items, //assign data to table
            layout: "fitColumns", //fit columns to width of table (optional)
            columns: [ //Define Table Columns
                {title: "Page", field: "label"},
            ],
            rowClick: function(e, row) {
                window.open(row._row.data.href)
            }
        });
    })
});