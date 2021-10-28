// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

contract RedSparrow {

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

    Post[] posts;
    Comment[] comments;

    

    constructor(){
        
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