import { useState } from 'react';
import './App.css';
const uuid = require('uuid')

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Faça upload de uma imagem para validação');
  const [imgName, setImgName] = useState('placeholder.jpeg')
  const [isAuth, setAuth] = useState(false);

  function sendImage(e) {
    e.preventDefault();
    setImgName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://fmbebopej2.execute-api.us-east-1.amazonaws.com/dev/visitantes-puc-storage/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: image
    }).then(async () => {
      const response = await authenticate(visitorImageName);
      if(response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Olá ${response['firstName']} ${response['lastName']}, seja bem vindo(a) ao Laboratório 5.`)
      } else {
        setAuth(false);
        setUploadResultMessage('Erro na validaçao: Essa pessoa não é um graduando de ciência da computação.')
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('Houve um erro durante a validação. Tente novamente.')
      console.error(error)
    })
  }

  async function authenticate(visitorImageName) {
    const requestUrl = 'https://fmbebopej2.execute-api.us-east-1.amazonaws.com/dev/alunos?' + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data) => {
      return data;
    }).catch(error => console.error(error));
  }

  return (
    <div className='all'>
      <div className='Text'>
      <h2 className='titulo'>Reconhecimento facial para autenticação</h2>
      <textbox className='exemplo'>
        A aplicação ao lado mostra a utilização do AWS Rekognition para realizar o reconhecimento facial de imagens para autenticação de pessoas.
        A taxa de acerto é de 100% até o momento da escrita deste texto. Foi testado mais de 500 Imagens, com vários ângulos diferentes,
        incluindo pessoas utilizando adereços como bonés, chapéus e óculos escuros.
      </textbox>
    </div>


    <div className="App">
      <h2 className="titulo">Autenticação</h2>
      <img src={require(`./visitors/${imgName}`)} alt="Visitor" height={500} width={500}/>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])}/>
        <button type='submit'>Autenticar</button>
      </form>
      <a href="./">RESETAR</a>
      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
    </div>,
    </div>
  );
}

export default App;
