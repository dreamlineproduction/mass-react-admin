import admin from 'firebase-admin';
// //import serviceAccount from '../service-account-key.json';

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });


const Test = () => {
    // Send notification function
    const sendNotification = async (deviceToken) => {

        const message = {
        notification: {
            title: 'Hello!',
            body: 'This is a test notification from Firebase.',
        },
        token: deviceToken,
        };
    
        try {
            const response = await admin.messaging().send(message);
            console.log('Notification sent successfully:', response);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    return (
        <div>
            <button className='btn btn-primary' onClick={() => sendNotification('')}>Send </button>
        </div>
    );
};

export default Test;