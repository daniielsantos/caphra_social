/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import Link from 'next/link'

const TOKEN = '20bdc200470d537286ea4281b283d1'
const PROD_URL = 'https://alurakut-nine-murex.vercel.app'

interface User {
  githubUser: string
}

interface Comunidade {
  id?: string
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

      <AlurakutProfileSidebarMenuDefault username={user.githubUser}/>

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
                <Link href={`/user/${item.login}`}>
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



const Home = (props: any) => {
  
  const githubUser = props.githubUser
  const name = props.name
  const [seguidores, setSeguidores] = useState([])
  const [comunidades, setComunidades] = useState<Comunidade[]>([])
  
  
  const pessoasFavoritas = [
    'juunegreiros',
    'daniielsantos',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ]

  var urls = [];  
  for(var i = 0; i <= 10; i++) {
      urls.push(i);
  }

  
  useEffect(() => {
    
    fetch(`https://api.github.com/users/${githubUser}/following`)
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
              Bem vindo(a) {name}
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
          <Box>
            <h1 className="subTitle">Mandar mensagem para amigo</h1>
            <form onSubmit={(e) => {
              e.preventDefault()
              const dadosForm = new FormData(e.currentTarget)
              const mensagem = {
                from_username: githubUser,
                message: dadosForm.get('mensagem'),
                to_username: dadosForm.get('users'),
                sent_date: new Date().toLocaleTimeString('pt-BR')
              }
              fetch('/api/mensagens', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensagem)
              })
              .then(async (res) => {
                const dados = await res.json()
                if (res.status === 200){
                  alert(`Mensagem enviada com sucesso para: ${dados.data.toUsername}`)
                }
              })
              .catch(error => console.log('deu ruim ', error))
            }}>
              {/* <input type="text" name="nome" placeholder="Digite seu nome" required/> */}
              <input type="text" name="mensagem" placeholder="Digite uma mensagem" required/>
              Para: <select name="users" key='9128'>
              {pessoasFavoritas.map((item, index) => {
                return (
                  <option value={item} key={new Date().toISOString()+index}>{item}</option>
                  )
                })}
                </select>
                
                <br/>
                <br/>
              <button>Enviar</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>          
        <ProfileRealationBox title={"Amigos"} items={seguidores}/>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
              Comunidades ({comunidades.length})
          </h2>
          <ul>            
                {comunidades.map((item: Comunidade, index: number) => {
                  return (                                      
                    index <= 5 && <li key={item.imageUrl}>                      
                      <Link href={`/communities/${item.id}`}>
                        <a>
                          <img 
                            src={item.imageUrl}
                            alt="oi"                          
                            />
                          <span>{item.title}</span>
                        </a>
                      </Link>
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


export async function getServerSideProps(context: any) {
  // console.log('contexto ',context)
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN
    
  const { isAuthenticated }  = await fetch(`${PROD_URL}/api/auth`, {
    headers: {
      Authorization: token
    }
  })
  .then((response)=> response.json())

  if (!isAuthenticated) {
    
    // nookies.destroy(context,'USER_TOKEN')
    
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
    
  // https://alurakut-nine-murex.vercel.app/

  const  user: any = jwt.decode(token)  
  const { githubUser, name } = user

  return {
    props: {
      githubUser,
      name 
    }
  }
}
export default Home