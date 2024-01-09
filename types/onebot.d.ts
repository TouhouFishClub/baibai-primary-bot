interface ActionRequestBase {
  post_type: string,
  time: number,
  self_id: number
}

interface Lifecycle extends ActionRequestBase {
  post_type: 'meta_event'
  _post_method: number,
  meta_event_type: string,
  sub_type: string
}

interface Heartbeat extends ActionRequestBase {
  post_type: 'meta_event'
  meta_event_type: string,
  status: any,
  interval: number
}

/* 所有message类型 */
interface MessageSegmentObject {
  type: string;
  data: any;
}
// text 纯文本
interface Text extends MessageSegmentObject {
  type: 'text',
  data: {
    text: string
  }
}
// at 提及（即 @）
interface At extends MessageSegmentObject {
  type: 'at',
  data: {
    qq: number | string
  }
}
// image 图片
interface Image extends MessageSegmentObject {
  type: 'image',
  data: {
    file: string,
    subType: string,
    url: string
  }
}

type MessageSegment =
  Text |
  At |
  Image |
  MessageSegmentObject

/* 发送者 */
interface SenderObject {
  nickname: string,
  user_id: number,
  [key: string]: any
}
interface GroupSender extends SenderObject {
  card: string
}

interface Message extends ActionRequestBase {
  post_type: 'message'
  message_type: string,
  message_id: number,
  user_id: number,
  message: MessageSegment[] | string
  raw_message: string,
  [key: string]: any
}

interface GroupMessage extends Message {
  message_type: 'group',
  group_id: number,
  sender: GroupSender
}
interface PrivateMessage extends Message {
  message_type: 'private',
}

type ActionRequest = Lifecycle | Heartbeat | GroupMessage | PrivateMessage