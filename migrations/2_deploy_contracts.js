var Lottery = artifacts.require('./LotteryFact.sol')
var User = artifacts.require('./User.sol')

module.exports = function (deployer){
    deployer.deploy(User).then(async (_instance) => {
    	var user = _instance;
	    console.log ("la dirección es:"+user.address)
	    await deployer.deploy(Lottery, user.address).then(function(){
                console.log ("Finaliza con éxito la migración de los contratos");
        });
    });
}
