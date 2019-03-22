pragma solidity ^0.4.24;

import "./Ownable.sol";

contract User is Ownable{

    struct User{
        string mail;
        string phone;
        bool create;
    }

    mapping (address => User) public usuario;

    function newUser (address _client, string mail, string phone) public {
        usuario[_client].mail = mail;
        usuario[_client].phone = phone;
        usuario[_client].create = true;
    }

    function consultUser (address _client) external returns(bool){
        return (usuario[_client].create);
    }

}
