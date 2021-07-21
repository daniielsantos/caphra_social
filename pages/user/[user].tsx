/* eslint-disable @next/next/no-img-element */
import { ProfileRelationsBoxWrapper } from "../../src/components/ProfileRelations"
import { useEffect, useState } from "react"
import nookies from 'nookies'
import jwt from 'jsonwebtoken'

import { useRouter } from "next/router"
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from "../../src/lib/AluraCommons"
import MainGrid from '../../src/components/MainGrid'
import Box from '../../src/components/Box'
import Link from "next/link"

import { getCommunities } from '../api/service'


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

      {/* <AlurakutProfileSidebarMenuDefault /> */}

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

const User = (props: any) => {
  
  const pessoasFavoritas = [
    'juunegreiros',
    'daniielsantos',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ]

  const mainUser = props.sessionUser

  const router = useRouter()
  const { user } = router.query

  const usuario = user as string 

  const [ userName, setUsername ] = useState('')
  const [seguidores, setSeguidores] = useState([])
  const [comunidades, setComunidades] = useState<Comunidade[]>([])

  useEffect(() => {
    // AMIGOS
    fetch(`https://api.github.com/users/${usuario}/following`)
    .then((chunk) => {
        return chunk.json()
    })
    .then((result) => {
      setSeguidores(result)
    })
    .catch(error => console.log('error ', error))

    // GET USERNAME
    fetch(`https://api.github.com/users/${usuario}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(async (result) => {
      const dados = await result.json()
      setUsername(dados.name)
    })

    // COMUNIDADES    
    const commu = getCommunities()
    commu.then(result => {
      setComunidades(result)
    })
  },[usuario])

    
  return (
    <>
      <AlurakutMenu githubUser={usuario}/>
      
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}> 
          <ProfileSidebar githubUser={usuario}/>
        </div>

        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              {userName}
            </h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h1 className="subTitle">Enviar recado para {userName}</h1>
            <form onSubmit={(e) => {
              e.preventDefault()
              const dadosForm = new FormData(e.currentTarget)
              console.log('dados form ', dadosForm.get('mensagem'))
              const mensagem = {
                from_username: mainUser,
                to_username: usuario,
                message: dadosForm.get('mensagem'),
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
              .catch(error => console.error('Erro ao enviar mensagem ', error))

            }}>
              <input 
                type="text" 
                name="mensagem" 
                placeholder="Digite uma mensagem" 
                required
              />
              <button type="submit">Enviar</button>

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
                        <Link href={`/communities/${item.title.replaceAll(" ","-").trim()}`}>
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

  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN

  const  user: any = jwt.decode(token)  
  const { githubUser } = user

  
  return {
    props: {
      sessionUser: githubUser
    }
  }
}

export default User