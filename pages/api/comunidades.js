import { SiteClient } from 'datocms-client'


export default async function recebedorDeRequest(req, res) {  
  if (req.method === 'POST'){
    const TOKEN = 'a1c66949fd69f273b334340ccc1805'  
    const client = new SiteClient(TOKEN)


    const registro = await client.items.create({
      itemType: '967549', // ID do Model de Communitiies criado pelo Dato
      ...req.body,
      // title: 'Saints',
      // imageUrl: 'https://github.com/daniielsantos.png',
      // creatorSlug: 'daniielsantos'
    })
    console.log(TOKEN)
  
    res.json({
      dados: 'Algum dado qualquer',
      registroCriado: registro
    })
    return
  }
  res.status(404).json({
    message: 'Ainda não temos dados no get'
  })
}
