import Session from "./models/Session.js";
import Result from "./models/Result.js";
import mongoose from "mongoose";

export const createSession = async (req, res) => {
    try {

        const user = req.user;
        const token = req?.cookies?.token || req?.body?.token || req?.header("Authorization")?.replace("Bearer ", "");
        const { duration, question } = req.body;
        // console.log("Create Session Log: ");
        // console.log(token, user, duration, question);

        const existingSession = await Session.findOne({userid: user.userid});
        if(existingSession){
            return res.status(200).json({
            success: true,
            message: "Exam Session Created Successfully Successfully",
            data: {
                sessionid: existingSession._id,
                serverTime: existingSession.startTime,
                endTime: existingSession.endTime,
                maxTime: existingSession.maxTime
            }
        })
        }
        const newSession = await Session.create({userid: user.userid, token: token, duration: duration, question: question});

        return res.status(200).json({
            success: true,
            message: "Exam Session Created Successfully Successfully",
            data: {
                sessionid: newSession._id,
                serverTime: newSession.startTime,
                endTime: newSession.endTime,
                maxTime: newSession.maxTime
            }
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const syncTimeExam = async (req, res) => {
    try {

        const sessionId = new mongoose.Types.ObjectId(req.params.id);
        let {localTime, bufferTime} = req.body;
        // console.log(bufferTime);

        let sessionDetails;
        sessionDetails = await Session.findOne({_id: sessionId});

        
        if(bufferTime!=sessionDetails.bufferTime){
            sessionDetails = await Session.findOneAndUpdate({_id: sessionId}, {bufferTime: bufferTime});
        }
        else{
            const serverTime = new Date();
            localTime = new Date(serverTime.getTime() - sessionDetails.bufferTime);
        }

        return res.status(200).json({
            success: true,
            message: "Exam Session Created Successfully Successfully",
            data: {
                sessionDetails: sessionDetails,
                localTime: localTime
            }
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

// export const syncTimeExam = async (req, res) => {
//     try {
//         const sessionId = new mongoose.Types.ObjectId(req.params.id);
//         let { localTime, bufferTime } = req.body;

//         let sessionDetails = await Session.findOne({ _id: sessionId });
//         if (!sessionDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Session not found"
//             });
//         }

//         // If bufferTime changed, update it
//         if (bufferTime != sessionDetails.bufferTime) {
//             await Session.updateOne(
//                 { _id: sessionId },
//                 { bufferTime: bufferTime }
//             );
//             // Refresh session details after update
//             sessionDetails = await Session.findOne({ _id: sessionId });
//         }

//         // Recalculate localTime using serverTime - bufferTime
//         const serverTime = new Date(); // Correct syntax
//         localTime = new Date(serverTime.getTime() - sessionDetails.bufferTime);

//         return res.status(200).json({
//             success: true,
//             message: "Time synced successfully",
//             data: {
//                 sessionDetails,
//                 localTime,
//                 serverTime,
//             }
//         });

//     } catch (error) {
//         console.error("syncTimeExam error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// };


export const submitExam = async (req, res) => {
    try {

        const user = req.user;
        const testId = new mongoose.Types.ObjectId(req.params.id);
        const userId = user.userid;
        let {answers} = req.body;
        // console.log(bufferTime);

        const existingResultDetails = await Result.findOne({testid: testId, userid: userId});
        if(existingResultDetails){
            return res.status(401).json({
                success: false,
                message: "Exam Already Submitted"
            })
        }

        const resultDetails = await Result.create({testid: testId, userid: userId, answers: answers});
        await Session.findOneAndDelete({userid: userId});
        return res.status(200).json({
            success: true,
            message: "Exam Submitted Successfully",
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const viewStudentResult = async (req, res) => {
    try {

        const user = req.user;
        const testId = new mongoose.Types.ObjectId(req.params.id);
        const userId = user.userid;
        
        const resultDetails = await Result.findOne({testid: testId, userid: userId});
        
        return res.status(200).json({
            success: true,
            message: "Student Result Fetched Successfully",
            data: resultDetails
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}