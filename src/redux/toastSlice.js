import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    messages: [
      {
        id: Date.now(),
        text: "hello",
        status: "success",
      },
    ],
  };

const toastSlice = createSlice({
    name:'toast',
    initialState,
    reducers:{
        pushMessage(state,action){
            const {text,status} = action.payload;
            const id = Date.now();
            state.messages.push({
                id,
                text,
                status
            })
        },
        removeMessage(state,action){
            const messageID = action.payload;
            const index = state.messages.findIndex((message)=>message.id === messageID);
            if(index !== -1){
                state.messages.splice(index,1);
            }
        }
    }
})

export const { pushMessage, removeMessage } = toastSlice.actions;

export default toastSlice.reducer