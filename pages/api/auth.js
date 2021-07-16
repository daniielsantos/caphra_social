import jwt from 'jsonwebtoken'



export default async function auth (req, res) {

  
  const token = req?.headers.authorization ?? ''
  console.log('token: ', token)

  jwt.verify(token, 'daniielsantos', function(err, decoded) {    
    res.json({
      isAuthenticated: decoded ? true : false
    })
  });
}


