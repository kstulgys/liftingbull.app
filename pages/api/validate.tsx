export default async (req, res) => {
  res.status(200)
}

// // import admin from 'firebase-admin'
// import * as admin from 'firebase-admin'

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://liftingbull-app.firebaseio.com',
// })

// export default async (req, res) => {
//   // try {
//   const { token } = JSON.parse(req.headers.authorization)
//   const decodedToken = await admin.auth().verifyIdToken(token, true)
//   console.log({ decodedToken })
//   const uid = decodedToken.uid
//   console.log({ uid })

//   res.status(200)
//   res.end()
//   // } catch (err) {
//   //   res.status(401)
//   //   res.end()

//   // return res.status(err.code).send({
//   //   errorCode: err.code,
//   //   message: err.message,
//   // })
//   // }
// }

// import { NextApiRequest, NextApiResponse } from 'next'

// interface UserData {
//   // arbitrary user data you are storing in your DB
// }

// interface ValidateResponse {
//   user: {
//     uid: string
//     email: string
//   }
//   userData: UserData
// }

// const admin = admin.initializeApp({
//   // your admin app creds
// })
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://liftingbull-app.firebaseio.com',
// })

// const validate = async (token: string) => {
//   const decodedToken = await admin.auth().verifyIdToken(token, true)
//   console.log('Valid token.')

//   // get user data from your DB store
// //   const data = await admin.firestore().doc(`/users/${decodedToken.uid}`).get().data()
// //   const user = await admin.auth().getUser(decodedToken.uid)

// //   const result = {
// //     user: {
// //       uid: user.uid,
// //       email: user.email,
// //     },
// //     userData: data,
// //   }
// //   return result
// }
