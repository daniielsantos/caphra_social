import { SiteClient } from 'datocms-client'


export default async function mensagem(req, res) {
  if (req.method === 'POST'){
    const TOKEN = 'a1c66949fd69f273b334340ccc1805'
    const client = new SiteClient(TOKEN)

    const registro = await client.items.create({
      itemType: '971818',
      ...req.body
    })

    res.json({
      data: registro
    })
    return 
  }

  res.status(404).json({
    message: 'Não temos get'
  })
}