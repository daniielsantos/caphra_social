import { Client } from '@notionhq/client'

const TOKEN = 'secret_RaxDV9kOSVDHrPbAMrh5qh7grEHkvG2fQ4Y3x9CRpL1'
const databaseId  = '318d798fdeaa4082ae84f03d244d972b'


export default async function recebedorDeRequest(req, res) {  
   
  if (req.method === 'POST'){
    const notion = new Client({auth: TOKEN})
    const myPage = await notion.databases.query({
      database_id: databaseId,      
      filter: {        
        property: "title",   
        text: {
          equals: req.body.communitieName
        },
      },
    })    
    res.json({
      comunidades: myPage.results
    })
  }
  res.status(404).json({
    message: 'Página não disponível'
  })
}
