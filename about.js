const fearAndGreedIndex = async () => {
    let response = await fetch("https://fear-and-greed-index.p.rapidapi.com/v1/fgi", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "ffc790f6a4msh93188c56760fa2ap13f1b5jsnff136f4936b4",
            "x-rapidapi-host": "fear-and-greed-index.p.rapidapi.com"
        }
    })
    result = await response.json();
    console.log(result)
}

fearAndGreedIndex();