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
    .then(async (result) => {
      if (result.status !== 200) {
        console.log('usuario não encontrado')
        return 
      }
      return await result.json()
    })
    .catch(error => console.log('error', error))

    if (user) {
      const token = jwt.sign({
        githubUser: user.login
      }, 'daniielsantos', { expiresIn: '2m' });
            
      res.json({
        token: token
      })
    }


    return res.json({
      token: ''
    })
  }
  res.status(404).json({
    message: 'Não temos get'
  })

}