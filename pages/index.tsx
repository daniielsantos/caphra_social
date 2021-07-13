/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
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



const Home: React.FC = () => {
  
  const githubUser = 'daniielsantos'
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
              Bem vindo(a)
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
                <label htmlFor="url" className="subTitle">Seleciona um imagem </label>
                <select name="image" id="imagens">
                  {urls.map((item, index) => {                    
                    return <option 
                      key={index} 
                      value={`https://picsum.photos/300/300?${index}`}
                      >Imagem {index}
                    </option>
                  })}
                </select>
                {/* <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa"                  
                /> */}
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
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