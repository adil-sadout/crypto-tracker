Moralis.initialize("t6HAC51BVh8AVzOQbpeA1zn3F1FIjOmV11HX4HG4"); // Application id from moralis.io
Moralis.serverURL = "https://seyrrilcwynh.usemoralis.com:2053/server"; //Server url from moralis.io

const loginBtn = document.querySelector("#login_button");
const chainSelectContainer = document.querySelector("#chainSelectedContainer");
const disconnectBtn = document.querySelector("#disconnect_button");
const chainSelectedList = document.querySelector("#chainSelected");
const userTokensContainer = document.querySelector("#userTokensContainer");
const userTokensTable = document.querySelector("#userTokens");
const SpinnerIcon2 = document.querySelector("#spinnerIcon2");

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
        
        chainSelectedList.addEventListener("change", async event =>{
            SpinnerIcon2.classList.add("spinner-border");
            userTokensContainer.classList?.remove("d-none");
            userTokensTable.innerHTML = "";
            let Balances = await Moralis.Web3.getAllERC20({chain: event.currentTarget.value});
            
            
            Balances.forEach(token =>{
                userTokensTable.insertAdjacentHTML("afterbegin", `

                <tr>
                    <td>${token.name}</td>
                    <td>${token.symbol}</td>
                    <td>${Number.parseFloat(token.balance)/10**token.decimals}</td>
                </tr>

            `)
            })

            SpinnerIcon2.classList.remove("spinner-border");
            
        })
    } catch (error) {
        SpinnerIcon2.classList.remove("spinner-border");
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
        chainSelectContainer.classList.add("d-none");
        alert("Wallet Disconnected");
    } catch (error) {
        console.log(error);
    }
}

loginBtn.addEventListener("click", event =>{
    login();
})

disconnectBtn.addEventListener("click", event =>{
    logout();
})

