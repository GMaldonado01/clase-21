const socketClient = io();

const message = document.getElementById("message");
const received_messages = document.getElementById("received_messages");

const users = [
  {
    id: 1,
    firstName: "Gaston",
    lastName: "Maldonado",
    correoDelUsuario: "gmaldonado@11",
  },
  {
    id: 2,
    firstName: "Diego",
    lastName: "Valsagna",
    correoDelUsuario: "dvalsagna@11",
  },
  {
    id: 3,
    firstName: "David",
    lastName: "Hochstrasser",
    correoDelUsuario: "dhochstrasser@43",
  },
];

let user = "";

socketClient.on("user_connected", (data) => {
  Swal.fire({
    text: `${data.user} se ha conectado!`,
    toast: true,
    position: "top-right",
  });
});

socketClient.on("messagesLogs", (data) => {
  let messages = "";
  data.forEach((message) => {
    messages += `[${message.userName}] ${message.message}<br />`;
  });
  received_messages.innerHTML = messages;
});

const sendMessage = () => {
  if (message.value.trim() !== "") {
    socketClient.emit("message", {
      userName: user.correoDelUsuario,
      message: message.value.trim(),
    });
    message.value = "";
  }
};

const authenticate = () => {
  Swal.fire({
    title: "Identificación",
    input: "text",
    text: "Ingresar correo del usuario:",
    inputValidator: (value) =>
      !value && "se debe especificar un nombre de usuario!",
    allowOutsideClick: false,
  }).then((res) => {
    user = users.find((user) => user.correoDelUsuario === res.value);
    if (user === undefined) {
      Swal.fire({
        text: "Usuario no válido",
        toast: true,
        position: "top-right",
      }).then((res) => {
        authenticate();
      });
    } else {
      socketClient.emit("user_connected", { user: user });
    }
  });
};

authenticate();
