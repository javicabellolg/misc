// Se importa la página de estilos
import '../styles/app.css'

// Librerías
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Artefactos usados en la abstraccion
import LotteryFactArtifact from '../../build/contracts/LotteryFact.json'
import UserArtifact from '../../build/contracts/User.json' 
import LotteryArtifact from '../../build/contracts/Lottery.json'

const LotteryFact = TruffleContract(LotteryFactArtifact)
const User = TruffleContract(UserArtifact)
const Lottery = TruffleContract(LotteryArtifact)

let LotteryFact_address = "0xf551280e4a00f53a5a43c5b76219fefa48a01e6f"
let User_address = "0xc851ccf5f8319777fa7bd66426ae4174f20edde6"

let accounts
let account
let receiverCoin
let CreateAdd
let idProp_aut
let eventBill

const App = {
  start: function () {
    const self = this

    // Bootstrap de todas las instancias para su uso. Se hace en todos los métodos.
    LotteryFact.setProvider(web3.currentProvider) 
    Lottery.setProvider(web3.currentProvider)
    User.setProvider(web3.currentProvider)
    // Balance inicial de cuenta
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]
      idProp_aut = 0
      var address = document.getElementById("account");

      address.innerHTML = account;
      self.refreshBalance()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  setStatusClient: function (message) {
    const statusClient = document.getElementById('status')
    statusClient.innerHTML = message
  },

  refreshBalance: function () {
   setInterval(function() {

    const self = this

    let meta
    let meta2

    var account = web3.eth.accounts[0]

    //Se fuerza refresco continuo para evitar errores en pantalla.
    var accountInterval = setInterval(function () {
	if (web3.eth.accounts[0] !== account) {
            account = web3.eth.accounts[0];
            var address = document.getElementById("account");
            address.innerHTML = account;
            self.start();
            self.setStatus();
        }
    }, 500)

   })
  },

  registerUser: function () {
    const self = this

    User.setProvider(web3.currentProvider)
    User.web3.eth.defaultAccount=web3.eth.accounts[0]

    const mail = document.getElementById('mail_user').value;
    const phone = document.getElementById('phone_user').value;

    this.setStatus('Initiating transaction... (please wait)')

    let meta
  
    User.deployed().then(function(instance){
    	meta = instance;
	console.log (meta.address)
	console.log (typeof(account))
	meta.newUser(account, phone, mail).then(function(err,res){
		if(!err)
		{
			console.log(res)
		}
	})
    })

  },

  apuesta: function () {
    const self = this

    LotteryFact.setProvider(web3.currentProvider)
    Lottery.setProvider(web3.currentProvider)

    const amountPago = web3.fromWei (500000000000000000, "ether")
    const idLotto = parseInt(document.getElementById('idLotto').value)

    this.setStatus('Initiating transaction... (please wait)')

    let lotto
    let factory 

    LotteryFact.at(LotteryFact_address).then(function (instance) {
    	factory = instance
      console.log(instance)
        console.log(factory.lottoHist(idLotto))
        factory.lottoHist(idLotto).then(function (address) {
		console.log(address)      
		Lottery.at(address).then(function(instanceLotto){
            instanceLotto.Message().watch(function(err, res) {
              if (!err){
                //console.log(res.args.client);
                alert(res.args.Msg+web3.fromWei(res.args.value,"ether")+" ether")
              }
            })
	    instanceLotto.userNotRegistered().watch(function(err, res) {
              if (!err){
                //console.log(res.args.client);
                alert(res.args.Msg)
              }
            })
            console.log (amountPago)
            var amountApuesta = web3.toWei(amountPago)
            instanceLotto.enter({from: account, value: amountApuesta}).then(function(){
              console.log ("Pago realizado correctamente")
            })
		      })
	      })
    })    
  },

  execute: function () {
    const self = this

    LotteryFact.setProvider(web3.currentProvider)

    this.setStatus('Initiating transaction... (please wait)')

    let factory
    console.log(LotteryFact_address)
    LotteryFact.at(LotteryFact_address).then(function (instance) {
      factory = instance
      console.log(instance.address)
      instance.execute({from: account}).then(function(){
        console.log("Lotería ejecutada")
      })
    })
  },

  newLottery: function () {
    const self = this

    LotteryFact.setProvider(web3.currentProvider)

    this.setStatus('Initiating transaction... (please wait)')

    let factory 
    console.log(LotteryFact_address)
    LotteryFact.at(LotteryFact_address).then(function (instance) {
      factory = instance
      console.log(instance.address)
      factory.newLotteryEvent().watch(function(err, res) {
        if (!err){
          //console.log(res.args.client);
          alert(res.args.msg+res.args.hist)
        }
      })
      instance.newLottery({from: account}).then(function(){
        console.log("Lotería creada")
      })    
    })
  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
