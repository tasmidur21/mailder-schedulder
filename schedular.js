import Agenda from 'agenda';

const mongoConnectionString = "mongodb://localhost:27017/agenda";

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define('welcomeMessage', () => {
    console.log('Sending a welcome message every few seconds');
});

agenda.define('welcomeMessage2', () => {
    console.log('Sending a welcomeMessage2 message every few seconds');
});

await agenda.start();

await agenda.every('5 seconds', 'welcomeMessage');
// await agenda.schedule("in 1 minute", 'welcomeMessage2',{
//     id: 123
// });
