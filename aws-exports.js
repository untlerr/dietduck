// aws-exports.js
const awsConfig = {
    Auth: {
        region: 'us-east-1',
        userPoolId: 'us-east-1_XXXXXX', //  Cognito User Pool ID
        userPoolWebClientId: 'XXXXXX', //  Cognito App Client ID
    },
};

export default awsConfig;
