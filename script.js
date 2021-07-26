const cryptoTable = document.querySelector("#cryptoListApi");
const currencyChosen = document.querySelector("#coinsCurrency");
const listSize = document.querySelector("#pageCoinNumber");
const SpinnerIcon = document.querySelector("#spinnerIcon");
const paginationBtnStart = document.querySelector("#pgnbtn-start");
const paginationBtnPrevious = document.querySelector("#pgnbtn-previous");
const paginationBtnNext = document.querySelector("#pgnbtn-next");
const paginationBtnEnd = document.querySelector("#pgnbtn-end");
const pageNumberText = document.querySelector("#pageNumberText");
const coinCardSearch = document.querySelector("#coinCardSearch");
const pgnButtonTable = [paginationBtnStart, paginationBtnPrevious, paginationBtnNext, paginationBtnEnd];
let pageOrder = 1;

function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function disableButtonTemp(){
    pgnButtonTable.forEach(btn =>{
        setTimeout(()=>{
            btn.classList.toggle("disabled")
        },550)
        btn.classList.toggle("disabled")
    })
}

const getCoinList = async (currency = "usd", size = 100, pageNumber = 1) =>{
    try{
        cryptoTable.innerHTML = "";
        SpinnerIcon.classList.add("spinner-border");
        let result = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${size}&page=${pageNumber}&sparkline=false`)
        let data = await result.json();
        switch (currency) {
            case "usd":
                sign = "$";
                break;
            case "eur":
                sign = "€";
                break;
            case "jpy":
                sign = "¥";
                break;
        }
        data.forEach(coin =>{
            cryptoTable.insertAdjacentHTML("beforeend", `
            <tr>
                <th scope="row">${coin.market_cap_rank}</th>
                <td>${coin.name}</td>
                <td>${coin.symbol}</td>
                <td>${sign + "" + numberWithSpaces(coin.current_price)}</td>
                <td>${sign + "" + numberWithSpaces(coin.total_volume)}</td>
                <td>${sign + "" + numberWithSpaces(coin.market_cap)}</td>
            </tr>
            `)
        })
        SpinnerIcon.classList.remove("spinner-border");
    
    }catch(err){
        SpinnerIcon.classList.remove("spinner-border");
        alert("Error: Cannot Fetch The Market Data")
        console.err(err)
    }
}

const getCoinCard = async (tokenSearched = "bitcoin") =>{
    try{
        const resultCoinList = await fetch(`https://api.coingecko.com/api/v3/coins/list`)
        const dataCoinList = await resultCoinList.json()
        let tokenID = dataCoinList.find(token1 => {if (token1.symbol == tokenSearched){return token1}});



        const resultTokenSearch = await fetch(`https://api.coingecko.com/api/v3/coins/${tokenID.id}`)
        const data = await resultTokenSearch.json()
        let currencyUSD = data.tickers.find(coin => coin.target == "USDT");
        let currencyEUR = data.tickers.find(coin => coin.target == "EUR");
        let currencyJPY = data.tickers.find(coin => coin.target == "JPY");
        coinCardFetched.classList.add("card");
        document.querySelector("#coinCardFetched").innerHTML =
        `
            <div class="border-bottom">
                <img src="${data.image.large}" class="card-img-top w-75" alt="...">
            </div>
            <h4>Rank ${data.market_cap_rank} | ${data.name}</h4>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Prices</li>
                <li class="list-group-item">USD: ${currencyUSD?.last.toFixed(3)}</li>
                <li class="list-group-item">EUR: ${currencyEUR?.last.toFixed(3)}</li>
            </ul>
            <div class="card-body">
                <a href="${data?.links?.official_forum_url[0]}" class="card-link link-success">Official Forum URL</a>
                <a href="${data?.links?.repos_url.github[0]}" class="card-link link-success">Git URL</a>
            </div>
        `



    }catch(err){
        alert("There was an error trying to fetch the token: Please make sure the token ticker is correct");
    }
}

document.querySelector("#search-button").addEventListener("click", event =>{
    getCoinCard(coinCardSearch.value);
})


currencyChosen.addEventListener("change", event =>{
    getCoinList(event.currentTarget.value, listSize.value);
});

listSize.addEventListener("change", event =>{
    getCoinList(currencyChosen.value , event.currentTarget.value);
});

pgnButtonTable.forEach(btn =>{
    btn.addEventListener("click", event =>{
        disableButtonTemp();
        switch (btn.value) {
            case "start":
                pageOrder = 1;
                break;
            case "previous":
                if (pageOrder > 1){
                    pageOrder -= 1;
                }else{
                    alert("You Are Already On The First Page")
                }
                break;
            case "next":
                if (((pageOrder < 30) && (listSize.value == 100)) || ((pageOrder < 15) && (listSize.value == 200)) || ((pageOrder < 60) && (listSize.value == 50))) {
                    pageOrder += 1;
                }else{
                    alert("No More Tokens Can Be Pulled")
                }
                break;
            case "end":
                pageOrder = 30;
                switch (listSize.value) {
                    case "50":
                        pageOrder *= 2;
                        break;
                    case "200":
                        pageOrder /= 2
                        break;
                }
                break;
          }
          
        pageNumberText.innerHTML = `Page ${pageOrder}`
        getCoinList(currencyChosen.value, listSize.value, pageOrder)
        
        
    })
})







//First fetch of the list

getCoinList();
