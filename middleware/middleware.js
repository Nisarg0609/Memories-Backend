import jwt from 'jsonwebtoken'

const auth = (req,res,next)=>{
    let token;
    if(req.headers.authorization){}

    let t = '' 
    t =  req?.headers?.authorization
    token =  t?.split(' ')[1]

    try {
        const decodedData = jwt.verify(token,'test')
        req.userId = decodedData?.id
        next();
    } catch (error) {
        console.log(error);
    }
    if(!token){
        res.status(401).json({message:'Unauthorized -> middleware'})
    }
}

export default auth