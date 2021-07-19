interface Comunidade {
  id?: string
  title: string
  imageUrl: string
  creatorSlug?: string
}




export async function getCommunitie(name: string): Promise<Comunidade> {

  const com = name.replaceAll("-", " ")

  const result = await fetch('/api/comunidade', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ communitieName: com })
  })
    .then(async (res) => {
      const dados = await res.json()

      const com: Comunidade[] = dados.comunidades.map((item: any) => {
        const comunitie: Comunidade = {
          title: item.properties.title.title[0].plain_text ?? '',
          imageUrl: item.properties.image_url.rich_text[0].plain_text ?? '',
          creatorSlug: item.properties.creator_slug.rich_text[0].plain_text ?? ''
        }
        return comunitie
      })
      return com[0]
    })
    .catch(err => console.error('error api comunidade ', err))
  return result as Comunidade
}


export async function getCommunities(): Promise<Comunidade[]> {
  const result = await fetch('/api/comunidades', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(async (res) => {
      const dados = await res.json()
      const comunitie: Comunidade[] = []
      dados.comunidades.map((item: any) => {
        const obj: Comunidade = {
          title: item.properties.title.title[0].plain_text ?? '',
          imageUrl: item.properties.image_url.rich_text[0].plain_text ?? '',
          creatorSlug: item.properties.creator_slug.rich_text[0].plain_text ?? ''
        }
        comunitie.push(obj)
      })
      return comunitie
    })
  return result
}