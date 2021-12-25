// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

contract RedSparrow {

    struct User{
        string Username;
        address Address;
        string Info;
        string ImageUrl;
    }

    struct Comment{

        address User;
        uint256 PostId;
        string Username;
        string Text;
    }

    struct Post{

        uint256 PostId;

        address User;
        string Username;
        string Text;

    }

    uint256 PostCounter = 0;
    uint256 CommentCounter =0;
    uint256 UserCounter =0;

    Post[] posts;
    Comment[] comments;
    User[] users;
    
    mapping(address => uint256) UserId;
    mapping(address => bool) UserExist;

    constructor(){
        
    }
    
    
    function EditUser(
        string memory Username, 
        string memory Info , 
        string memory ImageUrl ) public{

        User memory new_user;

        new_user.Username = Username;
        new_user.Address = msg.sender;
        new_user.Info = Info;
        new_user.ImageUrl = ImageUrl;

        uint256 id = UserId[msg.sender];

        users[id] = new_user;

    }

    function GetUsers() public view returns(User[] memory){
        return users;
    }
    function AddUser(
        string memory Username, 
        string memory Info , 
        string memory ImageUrl ) public{

        User memory new_user;

        new_user.Username = Username;
        new_user.Address = msg.sender;
        new_user.Info = Info;
        new_user.ImageUrl = ImageUrl;

        users.push(new_user);
        UserExist[msg.sender] = true;
        UserId[msg.sender] = UserCounter;
        UserCounter++;
        

    }
    function AddPost(
        string memory username,
        string memory text

    ) public  {

        Post memory post;

        post.User = msg.sender;
        post.PostId = PostCounter;
        post.Username = username;
        post.Text = text;
        

        posts.push(post);
        PostCounter++;
        

    }

    function AddComment(
        uint256  id,
        string memory username,
        string memory text


    )public{

        Comment memory comment;

        comment.Username = username;
        comment.Text = text;
        comment.PostId = id;
        comment.User = msg.sender;

        comments.push(comment);
        CommentCounter++;

    }

    function GetPosts() public view returns(Post[] memory){
        return posts;
    }

    function GetComments(
        uint256 id
    ) public view returns(Comment[] memory){

        uint256 counter =0;
        Comment[] memory Array;
        for(uint256 i=0; i < CommentCounter; i++ ){
            if(comments[i].PostId == id){

                Array[counter] = comments[i];
                counter++;
            }
        }
        return Array;
    }
    function GetAllComments() public view returns(Comment[] memory){
        return comments;
    }


}