import Agenda  from "agenda";
const mongoConnectionString = "mongodb://localhost:27017/agenda";
const worker = new Agenda({ db: { address: mongoConnectionString } });
const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(",") : [];
jobTypes.forEach(type => {
    require(`./jobs/${type}`)(worker);
});
if (jobTypes.length) {
    worker.start();
}
export default worker;