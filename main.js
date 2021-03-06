Moralis.initialize("wxgAWAbsP1Fx2s9O3RcVVp55YDbcWBNEgwLZi77p"); // Application id from moralis.io
Moralis.serverURL = "https://r0wdcovlzfig.usemoralis.com:2053/server"; //Server url from moralis.io

const loginBtn = document.querySelector("#login_button");
const chainSelectContainer = document.querySelector("#chainSelectedContainer");
const disconnectBtn = document.querySelector("#disconnect_button");
const chainSelectedList = document.querySelector("#chainSelected");
const userTokensContainer = document.querySelector("#userTokensContainer");
const userNFTsContainer = document.querySelector("#userNFTsContainer");
const userTokensTable = document.querySelector("#userTokens");
const userNFTGrid = document.querySelector("#nftGrid");
const SpinnerIcon2 = document.querySelector("#spinnerIcon2");
const SpinnerIcon3 = document.querySelector("#spinnerIcon3");
const messageLeftNFT = document.querySelector("#messageLeftNFT");







async function login() {
    try {
        let currentUser = Moralis.User.current();
        if (!currentUser){
            currentUser = await Moralis.Web3.authenticate();
        }
        loginBtn.classList.toggle("d-none");
        chainSelectContainer.classList.toggle("d-none");
        disconnectBtn.classList.toggle("d-none");
        alert("Wallet Connected");
        return currentUser;
    } catch (error) {
        SpinnerIcon2.classList.remove("spinner-border");
        SpinnerIcon3.classList.remove("spinner-border");
        alert("Error: Cannot Fetch User Balance")
        console.log(error);
    }
}

async function logout() {
    try {
        let currentUser = null;
        loginBtn.classList.toggle("d-none");
        disconnectBtn.classList.toggle("d-none");
        userTokensContainer.classList.add("d-none");
        userNFTsContainer.classList.add("d-none");
        chainSelectContainer.classList.add("d-none");
        alert("Wallet Disconnected");
    } catch (error) {
        console.log(error);
    }
}

async function fetchUserPortfolio(){
    chainSelectedList.addEventListener("change", async event =>{
        SpinnerIcon2.classList.add("spinner-border");
        SpinnerIcon3.classList.add("spinner-border");
        userTokensContainer.classList?.remove("d-none");
        userNFTsContainer.classList?.remove("d-none");
        if (!messageLeftNFT.classList.contains("d-none")){
            messageLeftNFT.classList.add("d-none");
        }
        userTokensTable.innerHTML = "";
        userNFTGrid.innerHTML = "";
        let Balances = await fetchToken();
        let userNFTs = await fetchNFT();
        
        Balances.forEach(token =>{
            userTokensTable.insertAdjacentHTML("afterbegin", `

            <tr>
                <td>${token.name}</td>
                <td>${token.symbol}</td>
                <td>${Number.parseFloat(token.balance)/10**token.decimals}</td>
            </tr>

        `)
        })
        if (userNFTs.length > 0){

            userNFTs.forEach(async nft =>{
                
                try{
                    let response = await fetch(`${nft.token_uri}`);
                    let nftObject = await response.json();
                    console.log(nftObject)

                    userNFTGrid.insertAdjacentHTML("afterbegin", `
    
                <div class="col">
                    <div class="card my-5 mx-auto" style="width: 18rem; height:500px;">
                        <img src="${nftObject.image}" class="card-img-top" style="height:250px" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${nftObject.name}</h5>
                            <p class="card-text">Token Address: ${nft.token_address}</p>
                        </div>
                        <div class="card-body">
                            <a href="${nftObject.external_url}" class="card-link link-info">NFT URL</a>
                        </div>
                    </div>
                </div>

            `)

                }catch(err){
                    alert(err)
                }
                
                
            })
        }

        if(userNFTs.length == 0){
            messageLeftNFT.classList.remove("d-none")
        }
        


        SpinnerIcon2.classList.remove("spinner-border");
        SpinnerIcon3.classList.remove("spinner-border");
        
    })
}

async function fetchToken(){
    let Balances = await Moralis.Web3API.account.getTokenBalances({chain:chainSelectedList.value});
    console.log(Balances)
    return Balances
}

async function fetchNFT(){
    let userNFTs = await Moralis.Web3API.account.getNFTs({chain:chainSelectedList.value});
    console.log(userNFTs)
    return userNFTs.result
}

loginBtn.addEventListener("click", async event =>{
    currentUserConnected = await login();
    fetchUserPortfolio();
})

disconnectBtn.addEventListener("click", event =>{
    logout();
})

