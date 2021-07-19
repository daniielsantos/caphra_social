/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router"

import { ProfileRelationsBoxWrapper } from "../../src/components/ProfileRelations"
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from "../../src/lib/AluraCommons"
import MainGrid from '../../src/components/MainGrid'
import Box from '../../src/components/Box'
import Link from "next/link"
import { useEffect, useState } from "react"

import {getCommunitie} from "../api/service"

interface User {
  githubUser: string
}

interface Comunidade {
  id?: string
  title: string
  imageUrl: string
  creatorSlug?: string
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
      const dados = getCommunitie(comunidadeName)
      dados.then(result => {
        setComunidades(result)
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