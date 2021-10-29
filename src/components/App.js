import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3'
import './App.css';
import RedSparrow from '../abis/RedSparrow.json'

import ReactDOM from "react-dom";

import { Navbar , Container, Row , Col, Button , Card , Modal , Form } from 'react-bootstrap';

import Logo from './favicon.ico'
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
      this.setState({contract:contract})
      
      let posts =  await contract.methods.GetPosts.call()
      this.setState({posts: posts})

      let comments = await this.state.contract.methods.GetAllComments().call({from: this.state.account})
        
      this.setState({comments : comments});
      // console.log(this.state.comments)

      
     
    }else{
      alert("error")
    }

  }

  constructor(props){
    super(props)
    
    this.ClosePopup = this.ClosePopup.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.onSubmit= this.onSubmit.bind(this)
    this.AddComment = this.AddComment.bind(this)

    this.state ={
      
      account: '',
      contract: null,
      posts : [] ,
      ClosePopup:false,
      text:"",
      comments:[]
    }
  }

  async onSubmit(){

    let contract = this.state.contract;
    this.setState({popup:false})

    await contract.methods.AddPost("john", this.state.text).send({from:this.state.account});

    // this.ClosePopup();
  }

  
  async getComments(id){
    let comments = await this.state.contract.methods.GetComments(id).call({from: this.state.account});
    return comments;

  }

  GetPostComments(id){
    let comments = this.state.comments;

    let array=[];
    for(let comment of comments){
      if(comment.PostId === id){
        array.push(comment);
      }
    }
    return array;
  }

  LoadComments(id){
    
    // console.log(id);
    // 
    // console.log(comments)
    
    let comments = this.GetPostComments(id);
    
    return this.state.comments.map((comment) => {
      return(
          <div style={{marginLeft:'30px', marginRight:'30px'}}>
              <h6>{comment.Username} </h6>
              <h6 style={{color:'grey'}}>{comment.User} </h6>
              {comment.Text}
              <hr />
          </div>

        
      );
    });
  }

  LoadPosts(){

    return this.state.posts.map((post) => {
      
      return(

          <div style={{}}>

              <Card style={{width:"50%", marginLeft:'25%'}}>
                <Card.Body style={{marginLeft:'20px'}}>
                    <Card.Title style={{}}>
                        {post.Username}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{post.User}</Card.Subtitle>
                    <br/>
                    <Card.Text>
                      {post.Text}
                    </Card.Text>
                </Card.Body>
                <div>
                  <button 
                    style={{
                      marginLeft:"80%" ,
                      background:'transparent', 
                      border:'transparent', 
                      color: 'grey'
                    }} 
                  >
                      comments
                  </button>
                  <hr />
                  <div>
                       {this.LoadComments()}
                  </div>
                </div>
              </Card>
              <br/>
          </div>

        
      );
    });
  }


  NavBar(){
    
      return(
        <Navbar bg="dark">
        <Container>
          <Navbar.Brand href="#home">
            <Row>
              <div>

                
              </div>
              <Col>
                <img
                  src={Logo}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
              </Col>
              <Col style={{color:'red'}}>
                Red Sparrow
              </Col>
              <Col>
                <button  style={{
                    textAlign:'right' , 
                    background:'transparent', 
                    border:'transparent', 
                    color: 'white'
                  }} 
                  
                  onClick={()=>{ this.setState({popup:true})} }
                >New Post</button>
              </Col>
            </Row>
            
          </Navbar.Brand>
        </Container>
        </Navbar>
      )
  }

  onChangeText(e){
    this.setState({
      text: e.target.value
    });
  }
  ClosePopup(e){
    e.preventDefault();
    this.setState({popup:false})
    this.setState({
      
      text:"",
    })
}
  AddComment(e){
    
    e.preventDefault();
  }

  AddPost(props){
    return(
        <Modal
        {...props}
        
        show={this.state.popup}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            New Post
          </Modal.Title>
        </Modal.Header>
            <Modal.Body>
                <Form  onSubmit={this.onSubmit}  style={{textAlign:"center", width:"95%"}} >
                    
                        <textarea
                            
                            id="model"
                            rows={3}
                            placeholder="share your thoughts"
                            required="required" 
                            className="form-control"
                            value={this.state.text}
                            onChange={this.onChangeText}
                        />
                      
                      <br/>
                        

                        <Row>
                          <Col>
                            <Button id="editsubmitbutton" onClick={this.ClosePopup}>
                                Close
                            </Button>
                          </Col>
                          <Col>
                              <Button variant="primary" id="editsubmitbutton" type="submit">
                                  Post
                              </Button>
                          </Col>
                        </Row>
                        
                    </Form>
        </Modal.Body>
      </Modal>
      );
}

  render() {
    return (
      <div style={{backgroundColor:'#EEE'}}>
        {this.NavBar()}
        <br/>
        {this.AddPost()}
        {this.LoadPosts()}
      </div>
    );
  }
}

export default App;
