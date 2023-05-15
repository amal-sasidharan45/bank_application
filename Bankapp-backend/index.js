        //1 import express

    const express=require("express") ;
       //4 import cors
    const cors=require("cors");
//import logic.js
const logic=require('./services/logic')
//import jwttoken
const jwt=require('jsonwebtoken')

    //2 create a server using express
        const server=express()

        // 5 use cors in server app
        server.use(cors({
            origin:"http://localhost:4200"
        }))


     //    6 Parse json data to the js in server app
        server.use(express.json())

        // // to resolve client request -5000
        // server.get("/",(req,res)=>{
        //     res.send("GET METHOD")
        // })
        // server.post("/",(req,res)=>{
        //     res.send("POST METHOD")
        // })


      //3 setup port for the server 
      server.listen(5000,()=>{
        console.log("listening on port 5000");
      })
//application specefic middleware 

const appMiddleware=(req,res,next)=>{
  next()
  console.log('application specefic middleware');
}

//use appliction specefic middleware
server.use(appMiddleware)

//Router specefic middleware

//midlleware for verifying to check user is logined or not

const jwtMidddleware=(req,res,next)=>{
  const token=req.headers['verify-token'];
  console.log(token);//token-verify token
  try{
    const data=jwt.verify(token,'keykey')
    console.log(data);
    req.currentAcno=data.loginAcno
    next()

  }
  catch{
res.status(401).json({message:'please Login'})
  }
 
  console.log('router specefic middleware');
}


      //Bank  Requests
      //register
      //login
      //balance enquiry
      //fund transfer


      //register api call

      server.post('/register',(req,res)=>{
        console.log(req.body);
        logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{
          res.status(result.statusCode).json(result)

        })
        // res.send("register request recieved")
     //   res.status(200).json({message:"request recieved"})

      })



      //login api call
server.post('/login',(req,res)=>{
  console.log('inside the login api call');
  console.log(req.body);
  logic.login(req.body.acno,req.body.password).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})


//getbalance api call 
server.get('/getbalance/:acno',jwtMidddleware,(req,res)=>{
  console.log(req.params);
  logic.getBalance(req.params.acno).then((result)=>{
    res.status(result.statusCode).json(result)

  })

})

//api call for fund transfer
server.post('/fund-transfer',jwtMidddleware,(req,res)=>{
  console.log('inside the transfer');
  console.log(req.body);
  logic.fundtransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})


//api call for get transaction
server.get('/transactionHistory',jwtMidddleware,(req,res)=>{
  console.log('inside the transaction history');
  logic.getTransactionHistory(req.currentAcno).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})

server.delete('/delete-account',jwtMidddleware,(req,res)=>{
  console.log('inside delete account');
  logic.deleteUserAccount(req.currentAcno).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})