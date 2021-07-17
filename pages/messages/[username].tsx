/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Box from "../../src/components/Box";
import MainGrid from "../../src/components/MainGrid";
import { AlurakutMenu } from "../../src/lib/AluraCommons";
import User from "../user/[user]";

const TOKEN = '20bdc200470d537286ea4281b283d1'
const PROD_URL = 'https://alurakut-nine-murex.vercel.app'

interface Message {
  fromUsername: string
  toUsername: string
  message: StringConstructor
  sentDate: string
}

function Msg(msg: any) {
  
  return (
      <>
      <Box>
        <table>          
          <thead>
            <tr>
              <th>Nome</th>
              <th>Mensagem</th> 
              <th>Data</th>
            </tr>
          
            {msg.mensagem.map((item: any, index: number) => {
              return (
                <tr key={index+999}>
                  <td>{item.fromUsername}</td>
                  <td>{item.message}</td>
                  <td>{item.sentDate}</td>
                </tr>
              )
            })}          
          </thead> 
        </table>
      </Box>
    </>
  )
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

  const Message = () => {
  const router = useRouter()
  const { username } = router.query
  const [messages, setMessages] = useState<Message[]>([])
  
  const user = 'daniielsantos'

  useEffect(() => {
    if (username) {      
      fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          query: `{ allMensagems (filter: {toUsername: { eq: ${username} }}) { 
            fromUsername
            toUsername
            message
            sentDate
          }}`
        })        
      })
      .then((res) => res.json())
      .then(async (response) => {
        const mensagensDato: Message[] = await response.data.allMensagems
        setMessages(mensagensDato)
      })
      .catch(error => console.log('bosta ',error))
    }
    
  },[username])
  
  return (
    <>
      <AlurakutMenu githubUser={user}/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}> 
          <ProfileSidebar githubUser={user}/>
        </div>
        {messages.length > 0 && <Msg mensagem={messages} />}
      
      </MainGrid>    
    </>
  )
}


export default Message;