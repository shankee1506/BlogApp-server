const jwt = require('jsonwebtoken');

// const verifyToken = (req,res,next) => {
    
//     const token = req.headers.token;
//     if (!token) {
//         return res.status(401).json("Access denied")
//     }

//     const verifyUser =  jwt.verify(token, process.env.JWT_TOKEN);

//     if (!verifyUser) {
//         return res.status(404).json('credential error')
//     } else {
//         req.user = verifyUser;
//         next()
//     }


// }

const JWT_TOKEN = "sdnwnvsln*ykwdsnofnw"

const verifyToken = (req , res , next)=>{
    const authHeader = req.headers.token;


    if(authHeader){
              const token = authHeader;
              jwt.verify(token , JWT_TOKEN, (err , user)=>{
                        if(err) return res.status(400).json("Some error occured");
                        req.user = user;
                        next();
              } )
    }else{
              return res.status(400).json("Access token is not valid")
    }
}

module.exports = { verifyToken }