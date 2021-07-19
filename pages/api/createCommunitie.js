import { Client } from '@notionhq/client'

const TOKEN = 'secret_RaxDV9kOSVDHrPbAMrh5qh7grEHkvG2fQ4Y3x9CRpL1'
const databaseId  = '318d798fdeaa4082ae84f03d244d972b'

export default async function recebedorDeRequest(req, res) {  
  
  if (req.method === 'POST'){
    const notion = new Client({auth: TOKEN})
    const response = await notion.pages.create({
        parent: {
          database_id: databaseId,
        },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: req.body.title,
                },
              },
            ],
          },    
          image_url: {
            rich_text: [
              {
                text: {
                  content: req.body.imageUrl,
                },
              },
            ],
          } ,   
          creator_slug: {
            rich_text: [
              {
                text: {
                  content: req.body.creatorSlug,
                },
              },
            ],
          }    
        }  
    }
  )
  console.log('response ', response.data)
  res.json({
    data: response
  })
}
  
  res.status(404).json({
    message: 'Ainda não temos dados no get'
  })
}
