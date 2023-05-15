//import db.js
const { response } = require('express');
const db=require('./db')
// import jwt token
const jwt=require('jsonwebtoken')


//logic for register  -asynchrounous function -promise -- (.then) 

const register=(acno,username,password)=>{
console.log('Register works');
//acno in db?
//yes
return db.User.findOne({
    acno
}).then((response)=>{
    // console.log(response);
    if(response){
        return{
            statusCode:401,
            message:'acno already exist'
        }
    }
    else{
        //new object creation for registration
        const newUser=new db.User({
            acno,
            username,
            password,
            balance:2000,
            transaction:[]
        })
        //to save database
        newUser.save()
        //To send response back to the client
        return{
            statusCode:200,
            message:"successfully registered"
        }
    }
})

}
//logic for logic  -asynchrounous function -promise -- (.then) 
const login=(acno,password)=>{
    console.log('inside the login function');
    return db.User.findOne({acno,password}).then((result)=>{
        //if works when acno present in database
        if(result){
            //token generating
            const token=jwt.sign({loginAcno:acno},'keykey')
            return{
                statusCode:200,
                message:'successfully logged in',
                currentUser:result.username,
                token, //send to the client 
                currentAcno:acno//send to client
            }
        }
          //else works when acno not present in database
        else{
            return{
                statusCode:401,
                message:'invalid data'
            }
        }
    })

}

//logic for balance enquiry
const getBalance=(acno)=>{
    //check acno in db
    return db.User.findOne({acno}).then((result)=>{
        if (result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{
                statusCode:401,
                message:'invalid data'
            }
        }
    })

}

 const fundtransfer=(fromAcno,fromAcnopswd,toAcno,amt)=>{
    

    //convert amt into a number 
    let amount=parseInt(amt)

    //check fromacno in mongodb 
    return db.User.findOne({
        acno:fromAcno,
        password:fromAcnopswd
    }).then((debitdetails)=>{
        if(debitdetails){

            //to check toacno 
            return db.User.findOne({
                acno:toAcno
            }).then((creditDetails)=>{
                if(creditDetails){
                    //check the balance
                    if(debitdetails.balance>amount){
                        debitdetails.balance-=amount;
                        debitdetails.transaction.push({
                            type:"debit",
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save changes to the mongodb
                        debitdetails.save()
                        //update to the Toacc
                        creditDetails.balance+=amount
                        creditDetails.transaction.push({
                            type:"credit",
                            amount,
                            fromAcno,
                            toAcno

                        })
                        //save to  mongodb
                        creditDetails.save()
                        // send response to the client side 
                        return{
                            statusCode:200,
                            message:'fundtransfer successful'
                        }

                    }
                    else{
                        return{
                            statusCode:401,
                            message:'insufficient balance'
                        }
                    }

                }
                else{
                    return{
                        statusCode:401,
                        message:'invalid data'
                    }

                }
            })

        }
        else{
            return{
                statusCode:401,
                message:'invalid data'
            }

        }
    })

 }
 const getTransactionHistory=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if (result){
            return {
                statusCode:200,
                transaction:result.transaction
            }
        }
        else{
            return{
                statusCode:401,
                message:'Account does not exist'
            }
        }
    })

 }

const deleteUserAccount=(acno)=>{

    //delete accont from mongodb
    return db.User.deleteOne({acno}).then((result)=>{
        return {
            statusCode:200,
      message:'Account deleted successfully'
        }
    })
}

//export function
module.exports={register,
login,getBalance, fundtransfer, getTransactionHistory,deleteUserAccount}