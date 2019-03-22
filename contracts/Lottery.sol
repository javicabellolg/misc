pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";
//import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract lotteryInterface{
    function pickWinner() public;
    function addMember(address _address) public;
    function checkStatus() external returns (bool);
    function bye_bye() external;
}

contract userInterface{
    function consultUser (address _client) external returns(bool);
}

contract LotteryFact is Ownable{
    uint16 minimumNumberOfBets;
    uint lastLottery = 0;
    address userContractAddress;
    mapping (uint => address) public lottoHist;

    lotteryInterface public LottoInterf;

    event newLotteryEvent (string msg, uint hist);

    constructor(address _userContract){
        minimumNumberOfBets = 5;
	userContractAddress = _userContract;
        lottoHist[lastLottery] = new Lottery (minimumNumberOfBets, userContractAddress);
    }

    function newLottery() external onlyOwner{
        setInterfaceLottery(lottoHist[lastLottery]);
        require (LottoInterf.checkStatus() == false, "La lotería anterior aún está en juego, ejecútela antes de iniciar una nueva");
        //killPrev();
        lastLottery++;
        lottoHist[lastLottery] = new Lottery (minimumNumberOfBets, userContractAddress);
        setInterfaceLottery(lottoHist[lastLottery]);
	emit newLotteryEvent ("Se ha creado una nueva lotería con id:", lastLottery);
    }

    function changeMinimumNumberOfBets (uint16 _new) public onlyOwner{
        minimumNumberOfBets = _new;
    }

    function execute() public onlyOwner{
        setInterfaceLottery(lottoHist[lastLottery]);
        LottoInterf.pickWinner();
    }

    function killPrev() internal onlyOwner{
        LottoInterf.bye_bye();
    }

    function setInterfaceLottery (address _address) internal onlyOwner{
        LottoInterf = lotteryInterface(_address);
    }

}

contract Lottery is Ownable{
    uint16 minimumNumberOfBets;

    address public manager;
    address[] public players;

    bool isStopped;

    userInterface public userInterf;

    event lotteryExecute (string Msg, address winner);
    event Message (string Msg, uint value);

    mapping (address => bool) public accountAccept;

    constructor (uint16 _number, address _userContract){
        minimumNumberOfBets = _number;
	addMember(msg.sender);
	setUserLottery(_userContract);
	isStopped = false;
    }

    modifier onlyAccept(address _address){
        require(accountAccept[msg.sender] != false);
        _;
    }

    modifier onlyUsers(address _address){
	require(userInterf.consultUser(_address) == true, "El usuario no está registrado. Por favor, proceda a registrarse");
	_;
    }

    modifier stopped{
	require(!isStopped, "La lotería no acepta mas apuestas");
        _;
    }

    function addMember(address _address) internal{
        accountAccept[_address] = true;
    }

    function enter() public payable onlyUsers(msg.sender) stopped{ //Hacerla onlyUsersRegistered, que compruebe en el contrato Users
        require(msg.value == .5 ether, "El valor de la participación es de 0.5 ethers");
        players.push(msg.sender); 
        emit Message ("Usted ha adquirido una participación en la loteria por valor de:", msg.value);
	if (players.length > minimumNumberOfBets)
        {
            isStopped = true;
	    addMember(msg.sender); //Cualquier usuario que haya efectuado una apuesta puede desencadenar el sorteo, pero para evitar muchos permisos innecesarios se hace solo con el número detonante
            pickWinner(); //Verificar llamada interna
        }
    }

    function random() private view returns (uint){
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() internal onlyAccept(msg.sender){
        require(players.length > minimumNumberOfBets);
        address winner = players[random() % players.length];
        winner.transfer(this.balance);
        emit lotteryExecute ("Hay nuevo Ganador!!", winner);
        players = new address[](0);
    }

    function getPlayers() public view returns(address[]) {
        return players;
    }

    function checkStatus() external returns (bool){
        if (players.length > 0)
        { return true; } else {return false;} 
    }

    function setUserLottery (address _address) internal onlyOwner{
        userInterf = userInterface(_address);
    }

    function bye_bye() external onlyAccept(msg.sender) {
        selfdestruct(owner);
    }
}

