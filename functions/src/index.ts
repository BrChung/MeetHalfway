import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.newReview = functions.firestore
  .document("reviews/{reviewId}")
  .onUpdate(async (snapshot, context) => {
    const dataBefore = snapshot.before.data();
    const dataAfter = snapshot.after.data();

    if (dataBefore && dataAfter) {
      const reviewLenB = dataBefore.reviews.length;
      const reviewLenA = dataAfter.reviews.length;

      const noOfReviews = reviewLenA - reviewLenB;

      let totalStars = 0;
      let reviewData = [];

      if (noOfReviews > 0) {
        for (let i = 0; i < noOfReviews; i++) {
          reviewData.push(dataAfter.reviews[reviewLenA - 1 - i]);
          totalStars += Number(dataAfter.reviews[reviewLenA - 1 - i]["stars"]);
        }

        const destID = dataAfter.destID;

        const destRef = db.doc(`destinations/${destID}`);

        const destDoc = await destRef.get();
        const destData = destDoc.data();

        let last5 = [];

        if (noOfReviews > 4) {
          last5 = reviewData.slice(0, 5);
        } else {
          last5 = reviewData
            .slice(0, noOfReviews)
            .concat(destData.lastFiveReviews.slice(0, 5 - noOfReviews));
        }

        const newStars =
          (totalStars + destData.stars * destData.reviewCount) /
          (destData.reviewCount + noOfReviews);

        const next = {
          reviewCount: destData.reviewCount + noOfReviews,
          stars: newStars,
          lastFiveReviews: last5,
        };

        return destRef.set(next, { merge: true });
      }

      return null;
    }
    return null;
  });
