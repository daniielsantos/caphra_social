/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router"

import { ProfileRelationsBoxWrapper } from "../../src/components/ProfileRelations"
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from "../../src/lib/AluraCommons"
import MainGrid from '../../src/components/MainGrid'
import Box from '../../src/components/Box'
import Link from "next/link"
import { useEffect, useState } from "react"

const TOKEN = '20bdc200470d537286ea4281b283d1'
const PROD_URL = 'https://alurakut-nine-murex.vercel.app'

interface User {
  githubUser: string
}

interface Comunidade {
  id?: string
  title: string
  imageUrl: string
  creatorSlug?: string
}

async function communitie(communitieName: any): Promise<Comunidade[]> {
  const com = communitieName.replaceAll("-", " ")
  const result = await fetch('/api/comunidade', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ communitieName: com })
  })
    .then(async (res) => {
      const dados = await res.json()
      return dados.comunidades
    })

  return result.map((item: any) => {
    const comunitie: Comunidade = {
      title: item.properties.title.title[0].plain_text ?? '',
      imageUrl: item.properties.image_url.rich_text[0].plain_text ?? '',
      creatorSlug: item.properties.creator_slug.rich_text[0].plain_text ?? ''
    }
    return comunitie
  })
}



function ProfileRealationBox(props: any) {
  return (
    <ProfileRelationsBoxWrapper>
    <h2 className="smallTitle">
        {props.title} ({props.items.length})
    </h2>
    <ul>            
          {props.items && props.items.map((item: any, index: number) => {
            return (                                      
              index <= 5 && <li key={item.id}>
                <Link href={`${item.login}`}>  
                  <a>
                    <img 
                      src={item.avatar_url}
                      alt={item.login}                          
                      />
                    <span>{item.login}</span>
                  </a>              
                </Link>                
              </li>
            )
          })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

function ProfileSidebar(community: any) { 
  return (
    <Box as="aside">          
      <img src={`${community.community.imageUrl}`}
        alt="profile"
        style={{borderRadius: '8px'}}
      />
      <hr />
      <h4 className="subTitle">{community.community.title}</h4>
      <hr />
      
      {/* <AlurakutProfileSidebarMenuDefault /> */}

    </Box>
  )
}

const Communitie = () => {
  const router = useRouter()
  const { name } = router.query
  const comunidadeName: string = name as string

  const [comunidades, setComunidades] = useState<Comunidade>()


  useEffect(() =>{
    if (name) {      
      const com =  communitie(comunidadeName)
      com.then(result => {
        setComunidades(result[0])
      })
    }
    
  },[name])

  return (
    <>
      <AlurakutMenu githubUser={comunidadeName}/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}> 
          { comunidades && <ProfileSidebar  community={comunidades}/>}
        </div>

        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              {comunidades?.title}
            </h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            {/* <h1 className="subTitle">Enviar recado para {comunidade}</h1> */}
            
          </Box>
        </div>

        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>          
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade (99)
            </h2>            
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export default Communitie