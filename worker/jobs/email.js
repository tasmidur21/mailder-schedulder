import {SEND_MAIL_EVENT} from "../const.js";

export default function (agenda) {
  agenda.define(SEND_MAIL_EVENT, async (job) => {
    const { email } = job.attrs.data;
    console.log(`Sending email to ${email}`);
  });
}