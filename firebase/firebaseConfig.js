import firebase from "firebase";
import "firebase/firestore";
import sendImage from "../config/s3Send";
import RNFS from "react-native-fs";
import { CameraRoll, AsyncStorage, Platform } from "react-native";

//var db = firebase.firestore();

// Retorna um array com a quantidade de users
function orderArray(arr, userID) {
  let arrFiltered = arr.filter(item => {
    return item.receiver_id === userID || item.sender_id === userID;
  });
  return arrFiltered;
}

// Pega a lista de conversas (salas de bate papo) de um determinado user id
export async function getConversations(userID, callback) {
  console.log(userID);

  let db = firebase.firestore();
  let arrFiltered = [];
  //db.settings({ timestampsInSnapshots: true });

  db.collection("chats").onSnapshot(docs => {
    let arrDocs = [];
    docs.forEach(async doc => {
      await arrDocs.push(doc.data());
    });
    arrFiltered = orderArray(arrDocs, userID);
    callback(arrFiltered);
  });

  return await arrFiltered;
}

// Inicio uma nova sala de chat
export function newConversation(userID, to, subject, callback) {
  let db = firebase.firestore();
  //db.settings({ timestampsInSnapshots: true });

  let date = Date.now();

  db.collection("chats")
    .doc(JSON.stringify(date))
    .set({
      subject: subject ? subject : "Sem assunto",
      date_ini: date,
      receiver_id: to,
      unRead: true,
      sender_id: userID,
      last_message_date: date
    })
    .then(() => {
      console.log("Nova sala de chat criada com sucesso");
      callback(date);
    })
    .catch(error => {
      console.log(error);
    });
}

// Verifica se a imagem é jpg, png, etc
function verifyImageType(image) {
  console.log(image);
  console.log(image.slice(image.length - 3, image.length));
  return image.slice(image.length - 3, image.length);
  // if(Platform.OS === 'ios') {
  //     return image.slice(image.length - 3, image.length);
  // } else {
  //     return
  // }
}

// Vai checkar se essa key existe no asyncStorage
export function checkImg(image) {
  //console.log(image);
  return AsyncStorage.getItem(image.time.toString()).then(response => {
    let imagePath = `${RNFS.DocumentDirectoryPath}/${
      image.time
    }.${verifyImageType(image.image)}`;
    if (response === null) {
      let imageExist = fileSystemCheck(imagePath);
      if (!imageExist) {
        console.warn(image.image, imagePath);
        saveImage(image.image, imagePath);
      } else {
        return imagePath;
      }
    } else {
      // Se esse storage já existir no async, verificar se ela existe no celular
      let imageExist = fileSystemCheck(imagePath);
      if (!imageExist) {
        console.warn(image.image, imagePath);
        saveImage(image.image, imagePath);
      } else {
        return response;
      }
    }
  });
}

// VAI CHECKAR SE ESTA IMAGEM EXISTE NO CELULAR USANDO O FILESYSTEM
export function fileSystemCheck(imagePath) {
  let retorno = RNFS.exists(imagePath)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
  return retorno;
}

// Vai salvar as imagens localmente no dispositivo
async function saveImage(image, path, callback) {
  await RNFS.downloadFile({ fromUrl: image, toFile: path })
    .promise.then(response => {
      callback();
      console.log("IMAGEM SALVA NO DISPOSITIVO COM SUCESSO!", response);
    })
    .catch(error => {
      console.log(error);
    });
}

export function getMessages(chatId, callback) {
  let db = firebase.firestore();
  //db.settings({ timestampsInSnapshots: true })
  let arrGeneral = [];
  // let arrMessages = [];
  db.collection(`chats/${chatId}/messages`)
    .orderBy("time", "asc")
    .onSnapshot(docs => {
      docs.docChanges().forEach(async doc => {
        if (doc.type === "added") {
          if (doc.doc.data().type === "image") {
            //saveImage(doc.doc.data())

            //console.log("Current data: ", doc.doc.data() );

            let imgChecked = await checkImg(doc.doc.data());
            //console.log(imgChecked);
          }

          arrGeneral.push(doc.doc.data());
          callback(arrGeneral);
        }
      });
    });
}

export async function insertMessage(
  text,
  chatId,
  userID,
  username,
  callback,
  type,
  image
) {
  let db = firebase.firestore();

  //getting the data from web
  //try {
  let response = await fetch("http://worldtimeapi.org/api/ip");
  let responseJson = await response.json();
  //console.warn(responseJson);
  //return false;
  let date = await Date.now(responseJson.datetime);
  //console.warn(responseJson.unixtime, "time from web");
  // } catch (error) {
  //   let date = Date.now();
  //   console.error(error);
  // }

  //let date = Date.now();
  //db.settings({ timestampsInSnapshots: true });
  // db.collection()

  //console.warn(date);

  await db
    .collection(`chats/${chatId}/messages`)
    .doc(JSON.stringify(date))
    .set({
      author: username,
      text,
      time: date,
      userId: userID,
      type,
      image: decodeURIComponent(image),
      unRead: true
    })
    .then(async data => {
      //console.log(data);
      // // console.log(RNFS.DocumentDirectoryPath);
      // console.log(`${RNFS.DocumentDirectoryPath}/${date}.${verifyImageType(image)}`);
      // // Chama o callback que vai limpar o state do input no sucesso do envio
      // if(image) {
      //     let imagePath = `${RNFS.DocumentDirectoryPath}/${date}.${verifyImageType(image)}`;
      //     // No sucesso do download da imagem, chamar um callback do saveImage para o callback do insertMessage exibir ou não a imagem
      //     await saveImage(image, imagePath, () =>  callback(imagePath));
      //     await AsyncStorage.setItem(`${date}`, imagePath);
      // }
    })
    .catch(error => {
      console.log(error);
    });
}

export function uploadFile(
  chatId,
  name,
  path,
  type,
  userId,
  username,
  callback
) {
  sendImage(path, `${name}.${type}`)
    .then(response => {
      insertMessage(
        null,
        chatId,
        userId,
        username,
        () => console.log("upload imagem com sucesso"),
        "image",
        response.body.postResponse.location
      );
      callback(response.body.postResponse.location);
    })
    .catch(error => {
      console.log(error);
    });
}

//atualizando as mensagens como 'lidas', quando o usuário abrir a janela
export function updateMessagesUnreads(chatId, callback) {
  console.log("Atualizando as msgs do chat: " + chatId);

  let db = firebase.firestore();
  //db.settings({ timestampsInSnapshots: true });
  db.collection(`chats/${chatId}/messages`)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        //console.log(doc.id, " => ", doc.data());
        // Build doc ref from doc.id
        db.collection(`chats/${chatId}/messages`)
          .doc(doc.id)
          .update({ unRead: false });
      });
      callback("ok");
    })
    .catch(error => {
      console.log("Error");
    });

  // .update({
  //     unRead : true
  // })
}
