import jwt from 'jsonwebtoken';

//Middlewares in general are used to process some kind of common functionality that every API request has to do. Example - Extracting the userId from the existing jwt token that we get.

//Goal of this method - To decode the userId of the user from the jwt token it carries. When the jwt token is existing, we can extract the token from there.
const protect = async(req, res, next) => {
    try{
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(' ')[1];
        //Once the user is authenticated, we will save the jwt token in the authorization header of the request object.
        // console.log("inside protect middleware");
        // console.log(token);
        // console.log(req.headers);
        const decodedToken = jwt.decode(token, process.env.JWT_SECRET);

        // The verify method will actually verify the signature first and then let us access the payload which exactly what the intended behaviour should be.
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);  // The secret key used to sign the JWT

        if(!decodedToken){
            return res.status(409).json({message: "Token invalid"});
        }
        req.userId = decodedToken.userId;
        next();
    } 
    catch(error){
        return res.status(501).json({message: error.message});
    }
}

export {protect};