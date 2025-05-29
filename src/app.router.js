import userRouter from "./modules/user/user.router.js";
import authRouter from "./modules/auth/auth.router.js";
import connectDB from "./DB/connection.js";
import teamRouter from "./modules/team/team.router.js";
import taskRouter from "./modules/task/task.router.js";
import attendanceRouter from "./modules/attendance/attendance.router.js";
import projectRouter from "./modules/project/project.router.js";
import { globalErrorHandler } from "./utils/errorHandling.js";


const initApp = (app, express) => {
    // because Buffer
    app.use(express.json())


    app.use("/api/v1/user", userRouter)
    app.use("/api/v1/auth", authRouter)
    app.use("/api/v1/team", teamRouter)
    app.use("/api/v1/task", taskRouter)
    app.use("/api/v1/project", projectRouter)
    app.use("/api/v1/attendance", attendanceRouter)


    app.get('/', (req, res, next) => {
        res.send('Hello World!')
    })
    app.use('*', (req, res, next) => {
        res.send('Error 404 Not Found!')
    })



    // error handling
    app.use(globalErrorHandler)



    // connectDB
    connectDB()
}


export default initApp