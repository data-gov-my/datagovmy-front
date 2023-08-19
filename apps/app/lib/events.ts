import mitt from "mitt";

type Events = {
  "chat-create": string; // chat-id
  "chat-delete": string | string[]; // chat-id
};

export default mitt<Events>();
