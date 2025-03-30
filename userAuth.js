import AWS from "aws-sdk";
import bcrypt from "bcryptjs";

// configure the AWS SDK
AWS.config.update({
  // the other two fields will be filled out from the .aws/credentials file
  region: "us-east-1"
});

// Create DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();


// USER SIGNUP FUNCTION
async function signup(event) {
  event.preventDefault();
  const password = document.getElementById("password");
  
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt
  console.log("successful hash");

  // define parameters for the operation
  const parameters = {
    TableName: "users",
    Item: {
      username: document.getElementById("username").value,
      password: hashedPassword
    },
    ConditionExpression: "attribute_not_exists(username)" // ensures unique username
  };

  // insert the item into the dynamodb Table called users
  try {
    await docClient.put(parameters).promise();
    console.log("user signed up successfully");
  }
  catch (error) {
    if (error.code === "ConditionalCheckFailedException") {
      console.error("username already exists.");
    }
    else {
      console.error("error signing up user: ", error);
    }
  }
}

// USER LOGIN FUNCTION
async function login(event) {
  event.preventDefault();
  const password = document.getElementById("password");

  // define parameters for operation
  const parameters = {
    TableName: "users",
    Key: {
      username: document.getElementById("username").value
    }
  };

  // try to retrieve user object
  try {
    const data = await docClient.get(parameters).promise();
    if (data.Item) {
      // compare provided password with hashed password in database
      const isMatch = await bcrypt.compare(password, data.Item.password);
      if (isMatch) {
        console.log("successful login");
      }
      else {
        console.log("user not found");
      }
    }
  }
  catch (error) {
    console.error("error logging in user mysterious error", error);
  }
}