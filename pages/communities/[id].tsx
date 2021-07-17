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
  title: string
  imageUrl: string
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
  const { id } = router.query
  const comunidadeId: string = id as string

  const [comunidades, setComunidades] = useState<Comunidade>()


  useEffect(() =>{
    
    if (comunidadeId) {      
      fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
        //(filter: {title: { eq: "Heavy" }})
        body: JSON.stringify({
          query: `{ allCommunities (filter: {id: { eq: ${comunidadeId} }}) { 
            title
            id
            imageUrl
            creatorSlug
          }}`
        })
        
      })
      .then((res) => res.json())
      .then(async (response) => {
        const comunidadesDato = await response.data.allCommunities
        setComunidades(comunidadesDato[0])
      })
      .catch(error => console.log('bosta ',error))
    }
  },[comunidadeId])

  return (
    <>
      <AlurakutMenu githubUser={comunidadeId}/>
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