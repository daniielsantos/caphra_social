/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

const TOKEN = '20bdc200470d537286ea4281b283d1'

interface User {
  githubUser: string
}

interface Comunidade {
  title: string
  imageUrl: string
}

function ProfileSidebar(user: User) {  
  return (
    <Box as="aside">          
      <img src={`https://github.com/${user.githubUser}.png`}
        alt="profile"
        style={{borderRadius: '8px'}}
      />
      <p>
        <a className="boxLink" href={`https://github.com/${user.githubUser}`}>
          @{user.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />

    </Box>
  )
}

function ProfileRealationBox(props: any) {
  return (
    <ProfileRelationsBoxWrapper>
    <h2 className="smallTitle">
        {props.title} ({props.items.length})
    </h2>
    <ul>            
          {props.items.map((item: any, index: number) => {
            return (                                      
              index <= 5 && <li key={item.id}>
                <a href={`https://github.com/${item.login}.png`}>
                  <img 
                    src={item.avatar_url}
                    alt="oi"                          
                  />
                  <span>{item.login}</span>
                </a>
              </li>
            )
          })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}



const Home: React.FC = () => {
  
  const githubUser = 'daniielsantos'
  const [seguidores, setSeguidores] = useState([])
  const [comunidades, setComunidades] = useState<Comunidade[]>([])
  
  
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    'felipefialho'
  ]

  var urls = [];  
  for(var i = 0; i <= 10; i++) {
      urls.push(i);
  }

  
  useEffect(() => {
    
    fetch('https://api.github.com/users/peas/followers')
    .then((chunk) => {
        return chunk.json()
    })
    .then((result) => {
      setSeguidores(result)
    })
    // API GaphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        query: `{ allCommunities { 
          title
          id
          imageUrl
          creatorSlug
        }}`
      })
    })
    .then((res) => res.json())
    .then((response) => {
      const comunidadesDato = response.data.allCommunities
      setComunidades(comunidadesDato)
    })
  },[])

  return (
    <>
      <AlurakutMenu githubUser={githubUser}/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}> 
          <ProfileSidebar githubUser={githubUser}/>
        </div>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              Bem vindo(a) {githubUser}
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer ?</h2>
            <form onSubmit={function handlerCriarComunidade(e) {
              e.preventDefault()
              const dadosDoForm = new FormData(e.currentTarget)
              const comunidade = {                
                title: dadosDoForm.get('title') as string,
                imageUrl: dadosDoForm.get('image') as string,
                creatorSlug: githubUser
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (res) => {
                const dados = await res.json()
                const comunidade = dados.registroCriado
                setComunidades([...comunidades,comunidade])              
              })


            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da usa comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da usa comunidade?"
                  type="text"
                />
              </div>
              
              <div>                
                <input key={new Date().toISOString()} type="hidden" name="image" value={`https://picsum.photos/300/300?${new Date().toISOString()}`}/>
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>          
        <ProfileRealationBox title={"Seguidores"} items={seguidores}/>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
              Comunidades ({comunidades.length})
          </h2>
          <ul>            
                {comunidades.map((item: Comunidade, index: number) => {
                  return (                                      
                    index <= 5 && <li key={item.imageUrl}>
                      <a href={`/communities/${item.title}`}>
                        <img 
                          src={item.imageUrl}
                          alt="oi"                          
                        />
                        <span>{item.title}</span>
                      </a>
                    </li>
                  )
                })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((item, index) => {
                return (         
                  index <= 5 && <li key={item}>                           
                    <a href={`https://github.com/${item}`}>
                      <img 
                        src={`https://github.com/${item}.png`}
                        alt="oi"
                        style={{borderRadius: '8px'}}
                      />
                      <span>{item}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export default Home