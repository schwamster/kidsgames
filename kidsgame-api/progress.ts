import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient({ region: 'eu-west-1' });

export const getProgress: Handler = (event: any, context: Context, cb: Callback) => {

  console.log("event", event);
  var dynamodb = new DynamoDB();

  var params = {
    Key: {
      Id: event.pathParameters.userId
    },
    TableName: process.env.DYNAMODB_TABLE
  };

  var item = docClient.get(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      cb(err, getResponse(500, "An error occured"));
    }
    else {
      console.log("data:", data);
      cb(null, 
      { 
        statusCode: 200, 
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
        },
        body: JSON.stringify({
          data: data.Item
        })
      });
    }
  });
}


export const addProgress: Handler = (event: any, context: Context, cb: Callback) => {

  console.log("event", event);
  const eventData: any = JSON.parse(event.body);
  let dynamodb = new DynamoDB();

  var params = {
    Key: {
      Id: event.pathParameters.userId
    },
    TableName: process.env.DYNAMODB_TABLE
  };

  var item = docClient.get(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      cb(err, getResponse(500, "An error occured"));
    }
    else {
      console.log("data:", data);
      let currentScore = data.Item? data.Item.points : 0;
      let newScore = currentScore + eventData.points;
      PutProgress(event.pathParameters.userId, newScore, cb);
      cb(null, 
        { 
          statusCode: 200, 
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
          },
          body: JSON.stringify({
            points: newScore
          })
        });
    }
  });
}

function PutProgress(userId: string, points: number, callback: Callback) {
  var params = {
    Item: {
      Id: userId,
      points: points
    },
    TableName: process.env.DYNAMODB_TABLE
  };

  console.log("updating user progress", userId, points);
  docClient.put(params, function (error, data) {
    if (error) {
      callback(error, getResponse(500, "An error occured"));
    }
    console.log("user progress has been updated", data);
    return;
  })


}

function getResponse(statusCode: number, message: string) {

  var response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
    },
    body: JSON.stringify({
      message: 'Ok'
    }),
  };

  return response;
}
