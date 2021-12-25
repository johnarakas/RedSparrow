import React, { Component } from 'react';
import logo from '../logo.png';
import profile_image from '../person.png'
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
      // alert(address)
      // alert(abi)
      const contract = new web3.eth.Contract(abi, address);
      
      // console.log(abi)
      // console.log(contract);
      this.setState({contract:contract})
      
      let posts =  await contract.methods.GetPosts.call()
      this.setState({posts: posts})
      
      let comments = await this.state.contract.methods.GetAllComments().call({from: this.state.account})  
      this.setState({comments : comments});

      let users = await this.state.contract.methods.GetUsers().call({from: this.state.account})  
      this.setState({users : users});
      
      for(var i = 0; i<users.length ; i++){
        if(users[i].Address === this.state.account){
            this.setState({Username:users[i].Username , Info:users[i].Info , ImageUrl:users[i].ImageUrl })
        }
      }

      
     
    }else{
      alert("error")
    }

  }

  constructor(props){
    super(props)
    
    this.ClosePopup = this.ClosePopup.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.onChangeTextComment = this.onChangeTextComment.bind(this)
    this.onSubmit= this.onSubmit.bind(this)
    this.AddComment = this.AddComment.bind(this)

    this.state ={
      
      account: '',
      contract: null,
      users:[],
      posts : [] ,
      ClosePopup:false,
      text:"",
      text_comment:"",
      comments:[],

      Username:"Anonymous",
      ImageUrl:"../person.png",
      Info:"no information available"
    }
  }

  async EditUser(username , info , image_url){
      
    //https://scontent.fath2-1.fna.fbcdn.net/v/t1.6435-1/p240x240/116719666_1553777208125259_2586934997729702440_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHkcRTwMFdw6CwRlkRSviKTfdUF4wY4ppR91QXjBjimlNBpp4J8pvUFKWUO6emblESP25bFYWQvw3PNSlavkbbp&_nc_ohc=lmIn2hiVZ88AX8tP5tS&_nc_ht=scontent.fath2-1.fna&oh=00_AT-De0WAe6kKysKnbFXj93mEWzSDLie123YcrPZlDLqZTQ&oe=61EAE019
    
    let contract = this.state.contract;

    if(this.state.Username === "Anonymous"){

      await contract.methods.AddUser(username , info , image_url).send({from:this.state.account});

    }else{

      await contract.methods.EditUser(username , info , image_url).send({from:this.state.account});

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
    
    let comments = this.GetPostComments(0);
    
    return this.state.comments.map((comment) => {
      let i  = parseInt(comment.PostId , 16)

      if(i == id){
        return(
            <div style={{marginLeft:'30px', marginRight:'30px'}}>
                <Container>
                    <Row>
                      <img src={profile_image}  style={{width:"50px", borderRadius:"100%", marginTop:"-15px" }}alt="user post picture"/><h6>{comment.Username} </h6>
                        {/* <h6 style={{color:'grey'}}>{comment.User} </h6> */}
                  
                    </Row>

                    <Row>

                      {comment.Text}
                    
                    </Row>
                </Container>
                <hr />
            </div>

          
        );
      }
    
    });
  }

  
  LoadPosts(){

    return this.state.posts.map((post) => {
      
      return(

          <div style={{}}>

              <Card style={{width:"80%", marginLeft:'25%'}}>
                <Card.Body style={{marginLeft:'20px'}}>
                    <Card.Title style={{}}>
                        <img src={ profile_image }  style={{width:"50px", borderRadius:"100%" }}alt="user post picture"/> {post.Username}
                    </Card.Title>
                    {/* <Card.Subtitle className="mb-2 text-muted">{post.User}</Card.Subtitle> */}
                    <br/>
                    <Card.Text>
                      {post.Text}
                    </Card.Text>
                    <br/>
                    <hr/>
                    <Form onSubmit={()=>this.AddComment(post.PostId)}>
                      <Container>
                        <Row>
                          <Col sm={10} >
                            <Form.Control 
                                type="text" 
                                required="required" 
                                placeholder="Add a comment..."
                                
                                value={this.state.text_comment}
                                onChange={this.onChangeTextComment} 
                            />
                          </Col>
                          <Col sm={2}><Button type="submit">Post</Button></Col>
                        </Row>
                      </Container>
                    </Form>

                </Card.Body>
                <div>
                 
                  <hr />
                  <div>

                       {this.LoadComments(post.PostId)}
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
  onChangeTextComment(e){
    this.setState({
      text_comment: e.target.value
    });
  }
  ClosePopup(e){
    e.preventDefault();
    this.setState({popup:false})
    this.setState({
      
      text:"",
    })
}


  async AddComment(post_id){
    
    // e.preventDefault();
    // alert(post_id);
    // alert(this.state.text_comment)
    
    let contract = this.state.contract;
        
    // uint256  id,
    // string memory username,
    // string memory text
    await contract.methods.AddComment( post_id ,"johnny", this.state.text_comment).send({from:this.state.account});
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

  GetUser(Address){
    for( var user of this.state.users ){
      if(user.Address === Address){
        return user;
      }
    }
  }

  LoadProfilePicture(){
      if(this.state.ImageUrl !== ""){
        return this.state.ImageUrl
      }else{
        return profile_image
      }
    };
  LoadUser(){
    return(
      <div style={{backgroundColor:"white", textAlign:"center"}}>
          <Container >
            <Row style={{ marginLeft:"15px" }} >
                <img src={this.LoadProfilePicture()} alt="profile picture" style={{width:"100px",height:"auto", textAlign:"center" ,borderRadius:"100%",  marginTop:"20px"}} />
            </Row>
            <Row className="justify-content-md-center">
              <h6>{this.state.Username }</h6>
              
            </Row>
            <Row className="justify-content-md-center">
              {this.state.Info}
            </Row>
            <br/>
            <Row className="justify-content-md-center">
              <Button onClick={()=>{ this.EditUser("John Arakas" , "cs student ", "https://scontent.fath2-1.fna.fbcdn.net/v/t1.6435-1/p240x240/116719666_1553777208125259_2586934997729702440_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHkcRTwMFdw6CwRlkRSviKTfdUF4wY4ppR91QXjBjimlNBpp4J8pvUFKWUO6emblESP25bFYWQvw3PNSlavkbbp&_nc_ohc=lmIn2hiVZ88AX8tP5tS&_nc_ht=scontent.fath2-1.fna&oh=00_AT-De0WAe6kKysKnbFXj93mEWzSDLie123YcrPZlDLqZTQ&oe=61EAE019") }} >Edit</Button>
            </Row>
            <br/>
          </Container>
      </div>
    );
  }

  render() {
    return (
      <div style={{backgroundColor:'#EEE'}}>
        {this.NavBar()}
        <br/>
        {this.AddPost()}
        <Container>
          <Row>
            <Col sm={2}>
              <div>
                  {this.LoadUser()}
              </div>
            </Col>
            <Col sm={10} style={{marginLeft:"-10%" }} >
              {this.LoadPosts()}

            </Col>
          </Row>
        
        </Container>
      </div>
    );
  }
}

export default App;
