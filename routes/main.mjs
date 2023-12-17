import express from 'express';
import { client } from '../mongodb.mjs'
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import "dotenv/config"
import moment from 'moment';
import { upload } from "../multer.mjs"
import { uploadOnCloudinary } from '../cloudinary.mjs'

const db = client.db("hackathon")
const studentCol = db.collection("addstudent")

let router = express.Router()

// add student
router.post('/add-student', upload.any(), async (req, res, next) => {

    if (
        !req.body.firstName || !req.body.lastName
        || !req.body.email || !req.body.password
        || !req.body.course || !req.body.phoneNumber
        || !req.files
    ) {
        res.status(400).send({
            message: `required parameters missing eample requies body: 
            {
                "firstName" : "firstName",
                "lastName" : "lastName",
                "email" : "email",
                "password" : "password",
                "course" : "course",
                "phoneNumber" : "phoneNumber",
                "image" : "image"
            }
            `
        })
        return;
    }

    const localFilePath = req.files[0].path;
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

    try {

        const response = await studentCol.insertOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            course: req.body.course,
            phoneNumber: req.body.phoneNumber,
            profileImage: cloudinaryResponse.url,
            isAdmin: false
        })

        res.send({
            message: "student added"
        })


    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "server error"
        })
    }

})

// get all students
router.get('/students', async (req, res) => {
    try {
        const response = await studentCol.find({}).sort({ _id: -1 }).toArray();
        res.send({
            message: "students founded",
            data: response
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "server error"
        });
    }
});

// authentication
router.get('/ping', async (req, res, next) => {

    try {
        let result = await studentCol.findOne({ email: req.body.currentUser.email });
        console.log("hhh",result);
        res.send({
            message: 'profile fetched',
            data: {
                isAdmin: result.isAdmin,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                userId: result._id,
                course: result.course,
                phoneNumber: result.phoneNumber,
                profileImage: result.profileImage,
                
            }
        });

    } catch (error) {
        console.error(error);
        res.status(401).send({
            message: 'UnAuthorized'
        });
    }
})

// get a student
router.get('/student/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const response = await studentCol.findOne({ _id: new ObjectId(studentId) });
        console.log("response: ", response);

        if (!response) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.json({
            message: "Student found",
            data: response,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

// edit a student
// router.put('/student/:studentId', upload.any(), async (req, res) => {

//     const studentId = req.params.studentId;
//     const firstName = req.body.firstName
//     const lastName = req.body.lastName
//     const email = req.body.email
//     const phoneNumber = req.body.phoneNumber
//     const password = req.body.password
//     const course = req.body.course

//     if (!studentId) {
//         res.status(400).send({
//             message: "invalid student id"
//         })
//         return;
//     }

//     if (!firstName || !lastName || !email || !password
//         || !phoneNumber || !course) {
//         res.status(400).send({
//             message: `required parameters missing eample request body: 
//                 {
//                     "firstName" : "firstName",
//                     "lastName" : "lastName",
//                     "email" : "email",
//                     "password" : "password",
//                     "course" : "course",
//                     "phoneNumber" : "phoneNumber",
//                     "image" : "image"
//                 }
//                 `
//         })
//         return;
//     }

//     if (req.files) {
//         const localFilePath = req.files[0].path;
//         const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

//         try {
//             const response = await studentCol.updateOne(
//                 { _id: new ObjectId(studentId) },
//                 {
//                     $set: {
//                         firstName, lastName, email, password, course, phoneNumber,
//                         profileImage: cloudinaryResponse.url
//                     }
//                 }
//             );

//             if (!response) {
//                 return res.status(404).json({
//                     message: "student not found",
//                 });
//             }

//         } catch (error) {
//             console.error(error);
//             res.status(500).json({
//                 message: "internal server error",
//             });
//         }

//     } else {
//         try {
//             const response = await studentCol.updateOne(
//                 { _id: new ObjectId(studentId) },
//                 {
//                     $set: {
//                         firstName, lastName, email, password, course, phoneNumber,
//                     }
//                 }
//             );

//             if (!response) {
//                 return res.status(404).json({
//                     message: "student not found",
//                 });
//             }

//         } catch (error) {
//             console.error(error);
//             res.status(500).json({
//                 message: "internal erver error",
//             });
//         }
//     }
// });
router.put('/student/:studentId', upload.any(), async (req, res) => {
    const studentId = req.params.studentId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const course = req.body.course;

    if (!studentId) {
        res.status(400).send({
            message: "invalid student id"
        });
        return;
    }

    if (!firstName || !lastName || !email || !password || !phoneNumber || !course) {
        res.status(400).send({
            message: `required parameters missing example request body: 
                {
                    "firstName" : "firstName",
                    "lastName" : "lastName",
                    "email" : "email",
                    "password" : "password",
                    "course" : "course",
                    "phoneNumber" : "phoneNumber",
                    "image" : "image"
                }
            `
        });
        return;
    }

    try {
        let updateFields = {
            firstName, lastName, email, password, course, phoneNumber
        };

        if (req.files && req.files.length > 0) {
            const localFilePath = req.files[0].path;
            const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
            updateFields.profileImage = cloudinaryResponse.url;
        }

        const response = await studentCol.updateOne(
            { _id: new ObjectId(studentId) },
            {
                $set: updateFields
            }
        );

        if (!response) {
            return res.status(404).json({
                message: "student not found",
            });
        }

        res.status(200).json({
            message: "student updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "internal server error",
        });
    }
});

// check in
router.put('/check-in/:studentId', upload.any(), async (req, res) => {
    const studentId = req.params.studentId;

    if (!studentId) {
        res.status(400).send({
            message: "invalid student id"
        });
        return;
    }

    if (!req.files || req.files.length === 0) {
        res.status(400).send({
            message: `required parameters missing example request body: 
                {
                    "image" : "image"
                }
                `
        });
        return;
    }

    try {
        const user = await studentCol.findOne({ _id: new ObjectId(studentId) });

        const checkInTime = moment(user.checkInTime);
        const checkOutTime = moment(user.checkOutTime);

        if (checkInTime > checkOutTime) {
            res.status(400).send({
                message: "already checked in"
            });
            return;
        }

        await studentCol.updateOne(
            { _id: new ObjectId(studentId) },
            { $set: { checkInTime: new Date().toISOString() } }
        );

        res.send({
            message: "check in successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "internal server error",
        });
    }
});

// checkout
// router.put('/check-out/:userId', async (req, res) => {
//     const studentId = req.params.studentId;

//     if (!studentId) {
//         res.status(400).send({
//             message: 'invalid student id',
//         });
//         return;
//     }

//     try {
//         const user = await studentCol.findOne({ _id: new ObjectId(studentId) });

//         if (!user) {
//             res.status(404).send({
//                 message: 'user not found',
//             });
//             return;
//         }

//         const checkInTime = moment(user.checkInTime);
//         const checkOutTime = moment(user.checkOutTime);

//         if (checkInTime < checkOutTime) {
//             res.status(400).send({
//                 message: 'user has not checked in yet',
//             });
//             return;
//         }

//         await studentCol.updateOne(
//             { _id: new ObjectId(studentId) },
//             { $set: { checkOutTime: new Date().toISOString() } }
//         );

//         res.send({
//             message: 'check out successful',
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'internal server error',
//         });
//     }
// });
router.put('/check-out/:userId', async (req, res) => {
    const userId = req.params.userId; // Change the parameter name to userId

    if (!userId) {
        res.status(400).send({
            message: 'invalid user id',
        });
        return;
    }

    try {
        const user = await studentCol.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            res.status(404).send({
                message: 'user not found',
            });
            return;
        }

        const checkInTime = moment(user.checkInTime);
        const checkOutTime = moment(user.checkOutTime);

        if (checkInTime < checkOutTime) {
            res.status(400).send({
                message: 'user has not checked in yet',
            });
            return;
        }

        await studentCol.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { checkOutTime: new Date().toISOString() } }
        );

        res.send({
            message: 'check out successful',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'internal server error',
        });
    }
});


export default router