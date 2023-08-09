import {useState, useEffect} from 'react';
import './admin.css';

import {
  addDoc, //addicinar documento
  collection, //selecionar banco
  onSnapshot, //atualizar em tempo real
  query, //buscar no banco
  orderBy, //ordenar as informaçoes do banco
  where, //filtrar
  doc, //documento
  deleteDoc, //deletar do banco
  updateDoc //atualiza o documento
} from 'firebase/firestore'

import {auth,db} from '../../firebaseConnection';
import {signOut} from 'firebase/auth';

export default function Admin(){
  const [tarefaInput,setTarefaInput] = useState('');
  const [user,setUser] = useState({});
  const [edit, setEdit] = useState({});

  const[tarefas,setTarefas] = useState([]);

  useEffect(()=>{
    async function loadTarefas(){
      const userDetail = localStorage.getItem("@detailUser")
      setUser(JSON.parse(userDetail))

      if(userDetail){
        const data = JSON.parse(userDetail);

        const tarefaRef = collection(db,"tarefas")
        const q = query(tarefaRef, orderBy("created","desc"), where("userUid","==",data?.uid))
        const unsub = onSnapshot(q,(snapshot) => {
          let lista = [];

          snapshot.forEach((doc)=>{
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid
            })
          })

          
          setTarefas(lista);

        })
      }
    }
    loadTarefas();
  },[])

  async function handleRegister(e){
    e.preventDefault();

    if(tarefaInput === ""){
      alert("Digite Sua Tarefa")
      return;
    }

    if(edit?.id){
      handleUpdateTarefa();
      return;
    }

    await addDoc(collection(db,"tarefas"),{
      tarefa: tarefaInput,
      created: new Date(),
      userUid: user?.uid
    })
    .then(()=>{
      console.log("Tarefa Registrada");
      setTarefaInput('');
    })
    .catch((error)=>{
      console.log("Erro ao registrar" + error)
    })
  }

  async function handleLogout(){
    await signOut(auth);
  }

  function editTarefa(item){
    setTarefaInput(item.tarefa)
    setEdit(item)
  }

  async function handleUpdateTarefa(){
    const docRef = doc(db,'tarefas',edit?.id)
    await updateDoc(docRef,{
      tarefa:tarefaInput
    })
    .then(()=>{
      setTarefaInput("");
      setEdit("");
    })
    .catch((error)=>{
      alert("Deu esse errro ai" + error);
      setTarefaInput("");
      setEdit("");
    })
  }

  async function deleteTarefa(id){
    const docRef = doc(db, 'tarefas', id)
    await deleteDoc(docRef)
  }

  return(
    <div className = 'admin-container'>
      <h1>Minhas Tarefas</h1>

      <form className='form' onSubmit={handleRegister}>

      <textarea placeholder='Digite sua tarefa...' value={tarefaInput} onChange={(e) => setTarefaInput(e.target.value)}/>

      {Object.keys(edit).length > 0 ? (
        <button className='btn-register' type='submit'>Atualizar Tarefa</button>
      ) : (
        <button className='btn-register' type='submit'>Registrar</button>
      )}

      </form>

      {tarefas.map((item)=>(
        <article key={item.id} className='list'>
        <p>{item.tarefa}</p>

        <div>
          <button onClick={()=> editTarefa(item)}>Editar</button>
          <button onClick={()=> deleteTarefa(item.id)} className='btn-delete'>Concluir</button>
        </div>
      </article>
      ))}

      <button onClick={handleLogout} className='btn-logout'>Sair</button>
      
    </div>
  );
} 