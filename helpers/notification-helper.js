const {
    FCM_KEY
} = require('../configs/config');
const key = 'key=' + FCM_KEY;
const request = require('request');

module.exports = {

    sendNotification: async (notification) => {

        const audience = [];
        notification.audience.forEach(element => {
            audience.push("'" + element + "' in topics")
        });

        const n = {
            condition: audience.join(' || '),
            priority: 2,
            data: {
                title: notification.title,
                body: notification.body,
                description: notification.description,
                imageUrl: notification.imageUrl,
                notify: '1',
                link: notification.link
            }
        }

        const options = {
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                'Content-Type': ' application/json',
                'Authorization': key
            },
            method: 'POST',
            body: JSON.stringify(n)
        };

        // return 

        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const message_id = JSON.parse(body).message_id;
                    resolve({
                        message: "Notification sent.",
                        message_id: message_id
                    });
                } else reject({
                    message: "Notification send failed!",
                    error: error
                });
            });
        })
    },

}