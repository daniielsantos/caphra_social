/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'



interface User {
  githubUser: string
}

interface Comunidade {
  id: string
  titulo: string
  imagem: string
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
  const [comunidades, setComunidades] = useState<Comunidade[]>([
    {
      id: new Date().toISOString(),
      titulo:'Eu odeio acordar cedo',
      imagem: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
    }])
  
  
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
      console.log(result)
      setSeguidores(result)
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
                id: new Date().toISOString() as string,
                titulo: dadosDoForm.get('title') as string,
                imagem: dadosDoForm.get('image') as string
              }
              setComunidades([...comunidades,comunidade])              
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
              Amigos ({comunidades.length})
          </h2>
          <ul>            
                {comunidades.map((item: Comunidade, index: number) => {
                  return (                                      
                    index <= 5 && <li key={item.id}>
                      <a href={`/users/${item.titulo}`}>
                        <img 
                          src={item.imagem}
                          alt="oi"                          
                        />
                        <span>{item.titulo}</span>
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