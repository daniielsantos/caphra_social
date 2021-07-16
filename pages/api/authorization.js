import jwt from 'jsonwebtoken'


export default async function loginAuth(req, res) {
  if (req.method === 'POST') {  
    
    const { githubUser } = req.body
    // const githubUser = 'asdasdasdasdalskdj'

    const user = await fetch(`https://api.github.com/users/${githubUser}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((result) => result.json())
    .catch(error => console.log('error', error))

    if (user.login) {
      const token = jwt.sign({
        githubUser: user.login
      }, 'daniielsantos', { expiresIn: '1m' });
            
      res.json({
        token: token
      })

    } else {
      return res.status(404).json({ message: 'usuário não encontrado'})
    }
  }
}