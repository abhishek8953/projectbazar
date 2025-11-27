

const User =require("../models/User.js")
async function adminCreate(name,email,password,role){

    try{
        const user=await User.create({
            name,
            email,
            password,
            role
        })

        if(user ){
            console.log("admin is created ",user.name);
        }
        else{
            console.log("not create admin");
            
        }
    }catch(err){
        console.log("error while creating admin user",err);
        
    }

}


module.exports = adminCreate