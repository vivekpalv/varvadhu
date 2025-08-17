import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

// Path to your Firebase service account key JSON file
const serviceAccountPath = path.resolve(__dirname, '../../fcm-adminsdk.json');

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

// Function to send push notification to a specific device
export const sendPushNotification = async (fcmToken: string, title: string, body: string): Promise<void> => {
    const message: admin.messaging.Message = {
        notification: {
            title: title,
            body: body,
        },
        token: fcmToken,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Notification sent successfully:', response);
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

export const sendGlobalNotification = async (title: string, body: string, topic: NotificationTopic = NotificationTopic.GLOBAL): Promise<void> => {
    const message: admin.messaging.Message = {
        notification: {
            title: title,
            body: body,
        },
        topic: topic,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log(`Notification sent to topic '${topic}':`, response);
    } catch (error) {
        console.error('Error sending global notification:', error);
    }
};

export enum NotificationTopic {
    GLOBAL = 'global',
    PROMOSION = 'promosion',
    LAUNCH = 'launch',
    EXCLUSIVE = 'exclusive'
}
