const RedSparrow = artifacts.require('./RedSparrow.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract( 'RedSparrow', (accounts)=>{

    let contract

    before(async () => {
        contract = await RedSparrow.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
          const address = contract.address
          assert.notEqual(address, 0x0)
          assert.notEqual(address, '')
          assert.notEqual(address, null)
          assert.notEqual(address, undefined)
        })
    
        // it('has a name', async () => {
        //   const name = await contract.name
        //   assert.equal(name, 'RedSparrow')
        // })
    })

    describe('indexing', async () => {
        it('add post and comments', async () => {
          // Mint 3 more tokens
          await contract.AddPost("john", "lala")
          await contract.AddPost("john", "lol")
          await contract.AddComment(0, "john","this is a comment" );



          let post = await contract.GetPosts();
          let comments = await contract.GetAllComments();



          console.log(post)
          console.log(comments)
          
        })
      })
      describe('new, edit user', async () => {
        it('create new user', async () => {
          await contract.AddUser("john", "student","la");
          await contract.EditUser("johnny", "student in csd","lala");

          // let user = await contract.GetUser("0x718A94628b369e9C248cEDA2036a0e761cbCf27F");
          // console.log(user);
          let user1 = await contract.CheckIfuserExist("0x718A94628b369e9C248cEDA2036a0e761cbCf27F")
          console.log(user1)

          
        })
      })


} )