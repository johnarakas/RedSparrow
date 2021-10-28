import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3'
import './App.css';
import RedSparrow from '../abis/RedSparrow.json'

import ReactDOM from "react-dom";

class App extends Component {

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadBlockchainData() {
    const web3 = window.web3;
    const acc = await web3.eth.getAccounts();
    this.setState({ account: acc[0] });

    const networkId = await web3.eth.net.getId();

    const networkData = RedSparrow.networks[networkId]

    if(networkData){
      
      const abi  = RedSparrow.abi
      const address  = networkData.address
      const contract = new web3.eth.Contract(abi, address);
      
      // console.log(abi)
      // console.log(contract);
      let posts =  await contract.methods.GetPosts.call()
      console.log(posts)
    }else{
      alert("error")
    }

  }

  constructor(props){
    super(props)
    
    this.state ={
      
      account: '',
      contract: null,
      posts : [] ,
      comments: [],
    }
  }

  render() {
    return (
      <div>
       
      </div>
    );
  }
}

export default App;
