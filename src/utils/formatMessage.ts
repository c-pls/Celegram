interface fmtMSG {
  username: string;
  first_name: string;
  last_name: string;
  content: string;
  created_at: string;
  user_id: Number;
}

export function formatMessage(
  username: string,
  first_name: string,
  last_name: string,
  content: string,
  user_id: Number
): fmtMSG {
  // let time = new Date().toLocaleTimeString([], {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });
  let time = new Date().toString();
  const fmtmsg: fmtMSG = {
    username: username,
    first_name: first_name,
    last_name: last_name,
    content: content,
    created_at: time,
    user_id: user_id,
  };
  return fmtmsg;
}
