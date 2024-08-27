import {SEND_MAIL_EVENT, SEND_SMS_EVENT} from "../const.js";

export default function (agenda) {
    agenda.define(SEND_SMS_EVENT, async (job) => {
        const { phone } = job.attrs.data;
        console.log(`Sending sms to ${phone}`);
    });
}